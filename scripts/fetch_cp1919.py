#!/usr/bin/env python3
"""Descarga la serie de CP 1919 y escribe data/cp1919.json.

80 pulsos de 300 muestras: el gráfico de Harold D. Craft Jr. (tesis, 1970), el mismo
que reprodujo la Cambridge Encyclopaedia of Astronomy (1977) y que Peter Saville pasó
a la portada de Unknown Pleasures. Es el CSV de la documentación de joyPlot (MathWorks),
el gist de borgar, los mismos números que empaqueta pachadotdev/cp1919.

La primera fila es la línea de arriba. Uso (desde la carpeta web): python3 scripts/fetch_cp1919.py
"""
import csv, io, json, os, urllib.request

URL = ("https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/"
       "0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "cp1919.json")

raw = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8")
pulses = [[round(float(x), 2) for x in row if x.strip()] for row in csv.reader(io.StringIO(raw))]
if len(pulses) != 80 or any(len(p) != 300 for p in pulses):
    raise SystemExit(f"se esperaban 80×300 y hay {len(pulses)}×{len(pulses[0]) if pulses else 0}")
json.dump({
    "pulsar": "CP 1919",
    "period_s": 1.3373,
    "samples": 300,
    "source": URL,
    "pulses": pulses,
}, open(OUT, "w"), separators=(",", ":"))
print("OK", OUT, "80×300")
