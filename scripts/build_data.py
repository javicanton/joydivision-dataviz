#!/usr/bin/env python3
"""Une los datos de ReccoBeats (data-raw/reccobeats.json) y los perfiles del audio
(data-raw/profiles.json) en data/unknown-pleasures.json, que es lo que carga la web.
También exporta data/reccobeats-features.csv.
Uso (desde la carpeta web): python3 scripts/build_data.py"""
import csv, json, os

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rf = json.load(open(os.path.join(WEB, "data-raw", "reccobeats.json"), encoding="utf-8"))
prof = json.load(open(os.path.join(WEB, "data-raw", "profiles.json"), encoding="utf-8"))
PITCH = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"]
FEATS = ["energy", "valence", "danceability", "instrumentalness", "acousticness", "speechiness", "liveness"]
PROFILES = ["wave", "loudness", "brightness", "bass", "onset"]
# n, id, título, cara (1 Outside, 2 Inside), duración en el LP (Wikipedia)
T = [(1, "disorder", "Disorder", 1, "3:36"), (2, "day-of-the-lords", "Day of the Lords", 1, "4:48"),
     (3, "candidate", "Candidate", 1, "3:05"), (4, "insight", "Insight", 1, "4:30"),
     (5, "new-dawn-fades", "New Dawn Fades", 1, "4:48"), (6, "shes-lost-control", "She's Lost Control", 2, "3:56"),
     (7, "shadowplay", "Shadowplay", 2, "3:54"), (8, "wilderness", "Wilderness", 2, "2:38"),
     (9, "interzone", "Interzone", 2, "2:16"), (10, "i-remember-nothing", "I Remember Nothing", 2, "5:53")]
EDITION = "2019"   # la edición que suena en el reproductor de Spotify

tracks = []
for n, tid, title, side, dur in T:
    f = rf[f"{EDITION}|{title} - 2019 Digital Master"]
    p = prof["tracks"][str(n)]
    tracks.append({
        "n": n, "id": tid, "title": title, "side": side, "duration": dur,
        "spotify_id": f["spotify"], "spotify_ms": f["ms"], "mp3": p["mp3"], "mp3_seconds": p["mp3_seconds"],
        "features": {k: round(f[k], 3) for k in FEATS},
        "loudness_db": round(f["loudness"], 1),
        "key": {"es": PITCH[f["key"]] + (" mayor" if f["mode"] else " menor"), "en": PITCH[f["key"]] + (" major" if f["mode"] else " minor")},
        "profiles": {k: p[k] for k in PROFILES},
    })
data = {
    "album": {"title": "Unknown Pleasures", "artist": "Joy Division", "release": "1979-06-15", "label": "Factory Records",
              "catalogue": "FACT 10", "duration": "39:24", "spotify_album": "5Dgqy4bBg09Rdw7CQM545s",
              "spotify_edition": "Unknown Pleasures (2019 Digital Master)", "audio_edition": "CD 1993 (POCD-1879)"},
    "vu": prof["vu"], "tracks": tracks,
}
json.dump(data, open(os.path.join(WEB, "data", "unknown-pleasures.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
with open(os.path.join(WEB, "data", "reccobeats-features.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["n", "title", "spotify_id"] + FEATS + ["loudness_db", "tempo", "key", "mode"])
    for n, tid, title, side, dur in T:
        f = rf[f"{EDITION}|{title} - 2019 Digital Master"]
        w.writerow([n, title, f["spotify"]] + [f[k] for k in FEATS] + [f["loudness"], f["tempo"], f["key"], f["mode"]])
print("OK", len(tracks), "canciones")
