#!/usr/bin/env python3
"""Descarga los atributos sonoros de las canciones de Unknown Pleasures desde ReccoBeats.

Spotify cerró el acceso a sus atributos (audio-features) para las aplicaciones de desarrolladores en
noviembre de 2024. ReccoBeats ofrece atributos con los mismos nombres y la misma escala, calculados
con su propio análisis, y localiza las canciones por su identificador de Spotify. No necesita clave.
También devuelve los identificadores de Spotify de cada pista, que usa el reproductor de la web.

Salida: data-raw/reccobeats.json (las dos ediciones digitales: 2019 Digital Master y 2007 Remaster).
Uso (desde la carpeta web): python3 scripts/fetch_reccobeats.py
Versión equivalente en R: scripts/reccobeats.R"""
import json, os, subprocess

API = "https://api.reccobeats.com/v1"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data-raw", "reccobeats.json")

def get(path):
    r = subprocess.run(["curl", "-sS", "-m", "30", API + path], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)

artist = get("/artist/search?searchText=Joy%20Division&size=5")["content"][0]
albums = get(f"/artist/{artist['id']}/album?size=50")["content"]
editions = {"2019": "Unknown Pleasures", "2007": "Unknown Pleasures (2007 Remaster)"}
out = {}
for ed, name in editions.items():
    alb = next(a for a in albums if a["name"] == name and a["totalTracks"] == 10)
    tracks = get(f"/album/{alb['id']}/track?size=50")["content"]
    ids = [t["href"].rsplit("/", 1)[-1] for t in tracks]
    feats = {f["href"].rsplit("/", 1)[-1]: f for f in get("/audio-features?ids=" + ",".join(ids))["content"]}
    for t, sid in zip(tracks, ids):
        out[f"{ed}|{t['trackTitle']}"] = {**feats.get(sid, {}), "spotify": sid, "ms": t["durationMs"]}
    print(ed, alb["href"], len(tracks), "pistas")
json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print("OK", OUT)
