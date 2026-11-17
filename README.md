# Unknown Pleasures · reportaje con datos

Reportaje interactivo sobre *Unknown Pleasures* (Factory Records, 1979), el primer disco de Joy Division, para escuchar mientras se lee.

- **Diez líneas, diez canciones.** Cada línea es una canción, en el orden del disco (cara *Outside* arriba, *Inside* abajo), y su relieve es un dato medido sobre el audio: sonoridad, brillo, graves o pulso. Se puede ver con la misma anchura para todas o con su duración real.
- **Las líneas son el reproductor.** Al pulsar una línea suena la canción desde ese punto. Mientras suena, su línea se convierte en su vúmetro: el espectro de cada instante, con los graves a la izquierda y los agudos a la derecha.
- **Scrollytelling.** El texto recorre la historia del disco (Salford, Factory, la grabación con Martin Hannett, la portada del púlsar CP 1919, su recepción y su legado, y el nombre *joyplot*) y cambia el gráfico, fijo a un lado, en cada paso. El disco puede sonar de fondo de principio a fin.

## Datos

| Archivo | Qué contiene | Cómo se genera |
|---|---|---|
| `data/unknown-pleasures.json` | Canciones, perfiles (200 puntos por dato), atributos de ReccoBeats, identificadores de Spotify | `scripts/build_data.py` |
| `data/vu/NN.bin` | Espectro para el vúmetro: 15 fotogramas por segundo, 32 bandas de 40 Hz a 11 kHz, un byte por banda | `scripts/analyze_audio.py` |
| `data/reccobeats-features.csv` | Atributos sonoros (energía, valencia, instrumentalidad...) de la edición 2019 Digital Master | `scripts/build_data.py` |
| `data-raw/` | Datos intermedios: perfiles del audio y respuesta de ReccoBeats | `analyze_audio.py`, `fetch_reccobeats.py` |

**Por qué ReccoBeats y no Spotify.** Spotify cerró `/audio-features` para los desarrolladores en noviembre de 2024, y desde 2026 una app en modo desarrollo necesita que su propietario tenga Premium. ReccoBeats ofrece atributos con los mismos nombres y escala (con su propio análisis), localiza las canciones por su identificador de Spotify y no necesita clave. `scripts/reccobeats.R` es la versión en R del script de `spotifyr` de 2022, con `ggridges` en lugar de `ggjoy`.

Para regenerar todo, desde esta carpeta (necesita Python con `numpy`, `scipy` y `librosa`, y `ffmpeg`):

```
python3 scripts/fetch_reccobeats.py
python3 scripts/analyze_audio.py "../1979. Unknown Pleasures [1993, POCD-1879]" .
python3 scripts/build_data.py
```

## Audio

- **En la web publicada** suena Spotify (edición 2019 Digital Master): canciones completas con la sesión iniciada; sin ella, fragmentos de 30 segundos.
- **En local** suenan los MP3 del disco si existe la carpeta `audio/` (un enlace a la carpeta de los MP3, que no se sube al repositorio). Con `?source=spotify` se fuerza Spotify.

Para verla en local: `python3 -m http.server` en esta carpeta y abrir `http://localhost:8000`. Con `?lang=en` se abre en inglés y con `?debug` se puede simular el vúmetro desde la consola: `__up.fake("shadowplay", 0.4)`.

## Fuentes

Wikipedia (*Unknown Pleasures*), Jen Christiansen en *Scientific American* (2015), Big Think, Universidad de Cambridge, Claus Wilke (*Goodbye joyplots*, 2017) y ReccoBeats. Enlaces completos al final de la página.

Hecho con [D3](https://d3js.org). Por Javi Cantón-Correa · [javiercanton.com](https://javiercanton.com)
