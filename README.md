# Unknown Pleasures · reportaje con datos

**Ver la página: <a href="https://javicanton.github.io/joydivision-dataviz/" target="_blank" rel="noopener noreferrer">https://javicanton.github.io/joydivision-dataviz/</a>**

Reportaje interactivo sobre *Unknown Pleasures* (Factory Records, 1979), el primer disco de Joy Division, en tres tiempos:

1. **Portada.** Titular, subtítulo y el gráfico de CP 1919 dibujado con los datos originales (`data/cp1919.json`): 80 pulsos de 300 muestras, grandes, con un leve movimiento. Al pasar el puntero o el dedo por la portada se destaca el pulso de cada fila y se muestran los datos originales.
2. **Scrollytelling.** El gráfico se queda en un solo pulso, que late cada 1,3373 s, para explicar el dibujo. Después vuelven las 80 líneas (la foto de la tesis con el disco ya no está en el gráfico) y se acompaña el texto de forma que, al llegar al último punto, el gráfico actúe como reproductor.
3. **Reproductor.** Al final, el gráfico funciona como reproductor del disco, con un vúmetro en la línea que suena.

- **Diez líneas, diez canciones.** Cada línea es una canción, en el orden del disco (cara *Outside* arriba, *Inside* abajo). Como en la portada, es plana a los lados y en el centro se levanta con la forma de onda. Cada línea corresponde a un perfil de nivel representado en 400 puntos.
- **Las líneas son el reproductor.** Al pulsar una línea suena la canción desde ese punto. Mientras suena, su línea se convierte en su vúmetro: el espectro de cada instante en 128 bandas (escala mel) reproduce visualmente cómo suena en ese momento.
- **Scrollytelling.** El texto recorre la historia del disco (Salford, Factory, la grabación con Martin Hannett, la portada del púlsar CP 1919, su recepción y su legado, y el nombre *joyplot*) y cada sección contiene enlaces a las fuentes originales.

## Datos

| Archivo | Qué contiene | Cómo se genera |
|---|---|---|
| `data/cp1919.json` | 80 pulsos de CP 1919, 300 muestras cada uno: la serie del gráfico de la portada | `scripts/fetch_cp1919.py` |
| `data/unknown-pleasures.json` | Canciones, forma de onda y perfiles (400 puntos por dato), atributos de ReccoBeats, identificadores de Spotify | `scripts/build_data.py` |
| `data/vu/NN.bin.gz` | Espectro para el vúmetro: 30 fotogramas por segundo, 128 bandas mel de 30 Hz a 16 kHz, un byte por banda, con gzip (el navegador lo descomprime) | `scripts/analyze_audio.py` |
| `data/reccobeats-features.csv` | Atributos sonoros (energía, valencia, instrumentalidad...) de la edición 2019 Digital Master | `scripts/build_data.py` |
| `data-raw/` | Datos intermedios: perfiles del audio y respuesta de ReccoBeats | `analyze_audio.py`, `fetch_reccobeats.py` |

**Por qué ReccoBeats y no Spotify.** Spotify cerró `/audio-features` para los desarrolladores en noviembre de 2024, y desde 2026 una app en modo desarrollo necesita que su propietario tenga Premium para publicar. ReccoBeats permite obtener atributos sonoros sin esas restricciones y mantiene los identificadores de Spotify para reproducir desde Spotify.

Para regenerar todo, desde esta carpeta (necesita Python con `numpy`, `scipy` y `librosa`, y `ffmpeg`):

```
python3 scripts/fetch_cp1919.py
python3 scripts/fetch_reccobeats.py
python3 scripts/analyze_audio.py "../1979. Unknown Pleasures [1993, POCD-1879]" .
python3 scripts/build_data.py
```

## Audio

- **En la web publicada** suena Spotify (edición 2019 Digital Master): canciones completas con la sesión iniciada; sin ella, fragmentos de 30 segundos.
- **En local** suenan los MP3 del disco si existe la carpeta `audio/` (un enlace a la carpeta de los MP3, que no se sube al repositorio). Con `?source=spotify` se fuerza Spotify.

Para verla en local: `python3 -m http.server` en esta carpeta y abrir `http://localhost:8000`. Con `?lang=en` se abre en inglés y con `?debug` se puede simular el vúmetro desde la consola: `__up.fakeVu([74, 92, 180, 32, 146, 27, 12, 230])`.

## Fuentes

Wikipedia (*Unknown Pleasures*), la serie de CP 1919 del gist de borgar (la que usa joyPlot), Alberto Areta (*Danza SR B1919+21*), Jen Christiansen en *Scientific American* (2015), Big Think, Universidad de Manchester (comentarios sobre el álbum), *Submarine* (c. 1981).

Hecho con [D3](https://d3js.org). Por Javi Cantón-Correa · [javiercanton.com](https://javiercanton.com)
