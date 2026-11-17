## Unknown Pleasures (Joy Division) · atributos sonoros de las canciones
## Adaptación del script de spotifyr de 2022.
##
## Qué ha cambiado:
## 1. Spotify cerró /audio-features (y /audio-analysis) para las aplicaciones de desarrolladores en
##    noviembre de 2024, así que get_artist_audio_features() de spotifyr ya no funciona. Además, desde
##    2026 una app en modo desarrollo necesita que su propietario tenga Spotify Premium para cualquier
##    llamada (la búsqueda devuelve 403 sin él).
## 2. Los atributos salen de ReccoBeats (https://reccobeats.com): mismos nombres y misma escala que
##    Spotify (energy, valence, danceability...), calculados con su propio análisis. Localiza las
##    canciones por su identificador de Spotify y no necesita clave.
## 3. Las credenciales de Spotify ya no van en el código: si las necesitas, ponlas en ~/.Renviron
##    (SPOTIFY_CLIENT_ID=... y SPOTIFY_CLIENT_SECRET=...). Las del script antiguo conviene regenerarlas
##    en developer.spotify.com, porque han estado escritas en un archivo.
## 4. ggjoy está retirado: su autor lo sustituyó por ggridges (y desaconseja el nombre "joyplot").
##
## Salida: data/reccobeats-features.csv (versión R de scripts/fetch_reccobeats.py)

library(httr2)
library(jsonlite)
library(dplyr)
library(purrr)
library(ggplot2)
library(ggridges)

api <- function(path) {
  request("https://api.reccobeats.com/v1") |>
    req_url_path_append(path) |>
    req_perform() |>
    resp_body_json(simplifyVector = TRUE)
}

artist <- api("artist/search?searchText=Joy%20Division&size=5")$content[1, ]
albums <- api(paste0("artist/", artist$id, "/album?size=50"))$content
# "Unknown Pleasures" con 10 pistas y fecha 1979-06-15 es la edición 2019 Digital Master,
# la que suena hoy por defecto en Spotify
up <- albums |> filter(name == "Unknown Pleasures", totalTracks == 10, releaseDate == "1979-06-15")
tracks <- api(paste0("album/", up$id, "/track?size=50"))$content |>
  mutate(spotify_id = sub(".*/", "", href))

feats <- api(paste0("audio-features?ids=", paste(tracks$spotify_id, collapse = ",")))$content |>
  mutate(spotify_id = sub(".*/", "", href)) |>
  select(spotify_id, energy, valence, danceability, instrumentalness, acousticness,
         speechiness, liveness, loudness, tempo, key, mode)

joy <- tracks |>
  select(spotify_id, track_name = trackTitle, duration_ms = durationMs) |>
  left_join(feats, by = "spotify_id") |>
  mutate(track_name = sub(" - 2019 Digital Master", "", track_name))

# Orden del disco
orden <- c("Disorder", "Day of the Lords", "Candidate", "Insight", "New Dawn Fades",
           "She's Lost Control", "Shadowplay", "Wilderness", "Interzone", "I Remember Nothing")
joy <- joy |> mutate(n = match(track_name, orden)) |> arrange(n)
write.csv(joy, "data/reccobeats-features.csv", row.names = FALSE)

## ¿Cuál es la canción más "alegre" (valence) de Unknown Pleasures?
joy |> arrange(-valence) |> select(track_name, valence) |> head(5)

## Gráfico de crestas (ridgeline) de los atributos del disco, con ggridges
joy |>
  tidyr::pivot_longer(c(energy, valence, danceability, instrumentalness), names_to = "atributo") |>
  ggplot(aes(x = value, y = atributo)) +
  geom_density_ridges(fill = "black", colour = "white", scale = 2) +
  theme_ridges() +
  theme(plot.background = element_rect(fill = "black"), text = element_text(colour = "white"),
        axis.text = element_text(colour = "grey70")) +
  labs(title = "Unknown Pleasures: distribución de cuatro atributos en sus diez canciones",
       subtitle = "Datos: ReccoBeats", x = NULL, y = NULL)
