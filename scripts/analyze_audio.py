#!/usr/bin/env python3
"""Analiza los MP3 de Unknown Pleasures y genera los datos de la web.

Salidas (dentro de la carpeta web):
  - data-raw/profiles.json: para cada canción, cinco series de 200 puntos de principio a fin
      loudness   sonoridad (RMS en dB, normalizada entre -50 dB y el máximo del disco)
      brightness brillo (centroide espectral)
      bass       graves (proporción de energía por debajo de 250 Hz)
      onset      pulso (fuerza de los ataques: golpes de batería, púas, consonantes)
      flux       cambio (variación del espectro de un instante a otro)
    Todas comparten escala entre canciones, así que se pueden comparar.
  - data/vu/NN.bin: espectro para el vúmetro, FPS fotogramas por segundo y BANDS bandas
    logarítmicas (40 Hz a 11 kHz) por fotograma, un byte por banda (0-255).

Uso (desde la carpeta web): python3 scripts/analyze_audio.py "../1979. Unknown Pleasures [1993, POCD-1879]" .
Necesita numpy y librosa (y ffmpeg para leer MP3)."""
import glob, json, os, sys
import numpy as np
import librosa
from scipy.ndimage import gaussian_filter1d

SRC, WEB = sys.argv[1], sys.argv[2]
SR, HOP, NFFT = 22050, 512, 2048
N = 200          # puntos por serie
FPS = 15         # fotogramas del vúmetro por segundo
BANDS = 32

files = sorted(glob.glob(os.path.join(glob.escape(SRC), "[0-9][0-9] *.mp3")))
assert len(files) == 10, files
edges = np.geomspace(40, 11000, BANDS + 1)
freqs = librosa.fft_frequencies(sr=SR, n_fft=NFFT)
band_idx = [np.where((freqs >= lo) & (freqs < hi))[0] for lo, hi in zip(edges[:-1], edges[1:])]
band_idx = [b if len(b) else np.array([np.argmin(abs(freqs - lo))]) for b, lo in zip(band_idx, edges[:-1])]

def reduce(x, n, fn=np.mean):
    e = np.linspace(0, len(x), n + 1).astype(int)
    return np.array([fn(x[a:max(b, a + 1)]) for a, b in zip(e[:-1], e[1:])])

raw, vu, meta = {}, {}, {}
for f in files:
    n = int(os.path.basename(f)[:2])
    y, _ = librosa.load(f, sr=SR, mono=True)
    S = np.abs(librosa.stft(y, n_fft=NFFT, hop_length=HOP)) ** 2
    rms = librosa.feature.rms(S=np.sqrt(S), frame_length=NFFT)[0]
    cent = librosa.feature.spectral_centroid(S=np.sqrt(S), sr=SR)[0]
    low = S[freqs < 250].sum(0) / (S.sum(0) + 1e-12)
    onset = librosa.onset.onset_strength(S=librosa.power_to_db(S), sr=SR)
    Sn = np.sqrt(S) / (np.sqrt(S).sum(0, keepdims=True) + 1e-12)
    flux = np.r_[0, np.sqrt((np.diff(Sn, axis=1).clip(0) ** 2).sum(0))]
    loud = rms > rms.max() * 0.05                      # los silencios no cuentan para brillo y graves
    db = 20 * np.log10(rms + 1e-9)
    raw[n] = {
        "loudness": reduce(db, N),
        "brightness": reduce(np.where(loud, cent, np.nan), N, np.nanmean),
        "bass": reduce(np.where(loud, low, np.nan), N, np.nanmean),
        "onset": reduce(onset, N),
        "flux": reduce(flux, N),
    }
    tempo = float(np.atleast_1d(librosa.feature.tempo(onset_envelope=onset, sr=SR))[0])
    meta[n] = {"mp3": os.path.basename(f), "mp3_seconds": round(len(y) / SR, 2), "tempo_audio": round(tempo, 1)}
    # vúmetro: espectro por bandas, en dB
    t_frames = np.arange(S.shape[1]) * HOP / SR
    nf = int(len(y) / SR * FPS)
    Bd = np.stack([S[b].mean(0) for b in band_idx])                   # bandas x frames
    Bd = 10 * np.log10(Bd + 1e-12)
    # un valor por fotograma del vúmetro: máximo en su ventana (responde a los golpes)
    idx = np.clip((t_frames * FPS).astype(int), 0, nf - 1)
    V = np.full((nf, BANDS), -120.0)
    for i in range(S.shape[1]):
        V[idx[i]] = np.maximum(V[idx[i]], Bd[:, i])
    vu[n] = V
    print(n, os.path.basename(f), meta[n], flush=True)

# Escalas comunes a todo el disco
# Cada dato se escala entre su percentil 5 y su percentil 99,5 en todo el disco (así se ven las
# diferencias dentro de cada canción) y se suaviza un poco para que la línea se lea mejor.
SMOOTH = {"loudness": 0.8, "brightness": 1.6, "bass": 1.6, "onset": 1.2, "flux": 1.6}
def norm_all(key):
    allv = np.concatenate([raw[n][key] for n in raw])
    lo, hi = np.nanpercentile(allv, 5), np.nanpercentile(allv, 99.5)
    for n in raw:
        v = np.nan_to_num(raw[n][key], nan=lo)
        v = gaussian_filter1d(v, SMOOTH[key], mode="nearest")
        raw[n][key] = np.clip((v - lo) / (hi - lo), 0, 1)
    return float(lo), float(hi)
scales = {k: norm_all(k) for k in SMOOTH}
# Vúmetro: dB a 0-255 con una escala común (rango de 60 dB bajo el percentil 99,9)
allV = np.concatenate([vu[n] for n in vu])
top = float(np.percentile(allV, 99.9)); bottom = top - 60
os.makedirs(os.path.join(WEB, "data", "vu"), exist_ok=True)
for n in vu:
    q = np.clip((vu[n] - bottom) / (top - bottom), 0, 1)
    (q * 255).round().astype(np.uint8).tofile(os.path.join(WEB, "data", "vu", f"{n:02d}.bin"))

out = {
    "n_points": N, "vu": {"fps": FPS, "bands": BANDS, "hz": [round(float(e)) for e in edges]},
    "scales": scales,
    "tracks": {n: {**meta[n], **{k: [round(float(x), 3) for x in v] for k, v in raw[n].items()}} for n in raw},
}
os.makedirs(os.path.join(WEB, "data-raw"), exist_ok=True)
json.dump(out, open(os.path.join(WEB, "data-raw", "profiles.json"), "w"), separators=(",", ":"))
print("OK", scales)
