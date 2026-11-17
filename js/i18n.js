/* Textos de la página en español e inglés.
   Cada paso del reportaje lleva el estado del gráfico que lo acompaña:
   metric (dato de las líneas), mode (equal | real), focus (canciones destacadas),
   feature (atributo de ReccoBeats que se muestra junto a cada línea). */
window.STEPS = [
  { id: "pulses",     metric: "wave",       mode: "equal", focus: [], view: "album" },
  { id: "read",       metric: "wave",       mode: "equal", focus: [] },
  { id: "compare",    metric: "loudness",   mode: "equal", focus: [] },
  { id: "salford",    metric: "wave",       mode: "equal", focus: [] },
  { id: "factory",    metric: "wave",       mode: "real",  focus: [] },
  { id: "strawberry", metric: "brightness", mode: "real",  focus: ["insight"] },
  { id: "band",       metric: "bass",       mode: "real",  focus: ["wilderness", "disorder"] },
  { id: "nothing",    metric: "brightness", mode: "real",  focus: ["i-remember-nothing"] },
  { id: "control",    metric: "onset",      mode: "real",  focus: ["shes-lost-control"], feature: "instrumentalness" },
  { id: "joyful",     metric: "loudness",   mode: "real",  focus: ["disorder", "interzone"], feature: "valence" },
  { id: "cover",      metric: "wave",       mode: "equal", focus: [] },
  { id: "release",    metric: "wave",       mode: "equal", focus: [] },
  { id: "legacy",     metric: "onset",      mode: "equal", focus: [] },
  { id: "ridgeline",  metric: "wave",       mode: "equal", focus: [] },
  { id: "listen",     metric: "wave",       mode: "equal", focus: [] }
];

window.I18N = {
  es: {
    lang: "es",
    pageTitle: "Unknown Pleasures (Joy Division) · reportaje con datos",
    vizTitle: "Unknown Pleasures, Joy Division: cada línea es una canción",
    metrics: {
      wave: ["Onda", "forma de onda: el pico de amplitud de cada instante"],
      loudness: ["Sonoridad", "volumen percibido a lo largo de la canción"],
      brightness: ["Brillo", "dónde se concentra el sonido: abajo (oscuro) o arriba (brillante)"],
      bass: ["Graves", "parte de la energía que queda por debajo de 250 Hz"],
      onset: ["Pulso", "fuerza de los ataques: golpes de batería, púas, consonantes"]
    },
    features: {
      energy: "Energía", valence: "Valencia", danceability: "Bailabilidad", instrumentalness: "Instrumentalidad",
      acousticness: "Acústica", speechiness: "Habla", liveness: "Directo"
    },
    modes: { equal: "Misma anchura", real: "Duración real" },
    sides: { 1: "Outside", 2: "Inside" },
    sideName: { 1: "Cara A", 2: "Cara B" },
    start: "inicio", end: "final", min: "min", featureNone: "Atributo (ReccoBeats)", oneMin: "1 min",
    play: "Reproducir", pause: "Pausa", listenAlbum: "▶ Escuchar el disco", pauseAlbum: "❚❚ Pausar el disco",
    playing: "Suena", vuHint: "La línea que suena muestra su espectro: graves a la izquierda, agudos a la derecha.",
    sourceLocal: "MP3 locales", sourceSpotify: "Spotify",
    spotifyNote: "Con la sesión de Spotify iniciada suenan las canciones completas; sin ella, fragmentos de 30 segundos.",
    playerError: "El navegador no deja cargar el reproductor de Spotify. Prueba sin bloqueador de contenidos.",
    at: "en", pick: "Pulsa de nuevo para soltarla",
    tipPlay: "Pulsa para escucharla desde aquí",
    reccobeats: "ReccoBeats",
    cover: {
      kicker: "Joy Division · <i>Unknown Pleasures</i> (1979)",
      title: "<i>Unknown Pleasures</i>, dibujado con su propio sonido",
      dek: "La portada del primer disco de Joy Division es un gráfico de datos: 80 pulsos de una estrella lejana. Medimos el audio de sus diez canciones y lo contamos con el mismo lenguaje, para leerlo, compararlo y escucharlo.",
      byline: "Javi Cantón-Correa · 17 de noviembre de 2026",
      caption: "El disco entero (39 minutos) en 80 líneas de unos 30 segundos: cada una es la forma de onda de un tramo.",
      scroll: "Desliza para empezar"
    },
    featureLabel: "Atributo",
    sourcesTitle: "Fuentes",
    methodTitle: "Cómo se hizo",
    steps: {
      pulses: `<h2>El disco entero en 80 líneas</h2>
        <p>La portada de <i>Unknown Pleasures</i> apila 80 pulsos sucesivos de una estrella. Aquí hemos hecho lo mismo con el propio disco: sus 39 minutos, cortados en 80 tramos de unos 30 segundos. Cada línea es la forma de onda de un tramo, y de arriba abajo se lee el disco de principio a fin.</p>
        <p>Los tramos planos son los silencios entre canciones; los picos, los momentos de más volumen. Ahora ordenamos esos tramos por canción.</p>`,
      read: `<h2>Cómo leer las líneas</h2>
        <p>Cada línea es una canción, en el orden del disco: arriba la cara <i>Outside</i> (1 a 5) y abajo la cara <i>Inside</i> (6 a 10). Como en la portada, cada línea es plana a los lados y en el centro se levanta la canción, de principio a fin: su <b>forma de onda</b>, el pico de amplitud de cada instante.</p>
        <p>Mientras una canción suena, su línea se convierte en un <b>vúmetro</b>: su espectro en cada instante, con los graves a la izquierda y los agudos a la derecha.</p>`,
      compare: `<h2>Diez canciones, cuatro medidas</h2>
        <p>La forma de onda dice cuándo suena fuerte cada canción. Para compararlas, las líneas pueden mostrar otras cuatro medidas calculadas sobre el audio, todas en la misma escala para el disco entero: <b>sonoridad</b>, <b>brillo</b> (si el sonido se concentra en los agudos), <b>graves</b> y <b>pulso</b> (la fuerza de los ataques).</p>
        <p>Junto a cada línea se puede mostrar además un atributo de ReccoBeats, como la energía o la valencia: un solo número por canción, dibujado como una barra sobre el tramo plano de la derecha.</p>`,
      salford: `<h2>Salford, 1976</h2>
        <p>Bernard Sumner y Peter Hook vieron a los Sex Pistols en el Lesser Free Trade Hall de Manchester el 4 de junio de 1976, y ese mismo año formaron un grupo en Salford. Ian Curtis se unió como cantante sin prueba y Stephen Morris llegó a la batería en agosto de 1977.</p>
        <p>Se llamaron Warsaw hasta finales de 1977, cuando cambiaron de nombre para no confundirse con otro grupo londinense. Tras un contrato con RCA del que pidieron salir, publicaron por su cuenta el EP <i>An Ideal for Living</i> en junio de 1978 y debutaron en televisión en <i>Granada Reports</i>, el programa de Tony Wilson.</p>`,
      factory: `<h2>Factory, FACT 10</h2>
        <p>Según Hook, una discográfica londinense les ofreció 70.000 libras. Su mánager, Rob Gretton, prefirió ir a Factory Records, el sello independiente de Wilson, que repartía los beneficios a medias con el grupo.</p>
        <p>Gretton calculó que el disco costaría 8.000 libras; Wilson contaría en 2006 que acabó costando 18.000. Salió con el número de catálogo FACT 10. Con la duración real, la parte central de cada línea mide lo que dura su canción: casi 40 minutos en total.</p>`,
      strawberry: `<h2>Strawberry Studios, abril de 1979</h2>
        <p>El disco se grabó en tres fines de semana, del 1 al 17 de abril de 1979, en Strawberry Studios (Stockport), con Martin Hannett como productor y Chris Nagle como ingeniero.</p>
        <p>Hannett trabajó con varios retardos digitales AMS, un Marshall Time Modulator y ecos de cinta, y buscó sonidos en el ascensor del estudio y en un baño del sótano. La voz de Curtis en «Insight» se grabó a través de una línea telefónica para que sonara lejana.</p>
        <p>Ahora las líneas muestran el <b>brillo</b>: cuanto más alta, más sonido en la zona aguda. «Insight» es de las más oscuras del disco.</p>`,
      band: `<h2>Lo que el grupo no quería oír</h2>
        <p>Al grupo no le convenció el resultado. Sumner sintió que Hannett había rebajado sus guitarras, y Hook se quejó de que sonaba a Pink Floyd, aunque con los años admitió que el productor había hecho un buen trabajo. Morris quedó contento, y Curtis, impresionado.</p>
        <p>Hook tocaba el bajo con púa. Con los <b>graves</b> se ve el reparto: «Wilderness» es la canción con más energía por debajo de 250 Hz y «Disorder», la que menos.</p>`,
      nothing: `<h2>«I Remember Nothing»</h2>
        <p>El disco termina con su canción más larga, casi seis minutos. Para ella, Sumner tocó un sintetizador que había montado él mismo con un kit (un Powertran Transcendent 2000), Gretton rompió botellas y Morris aportó una réplica de una pistola Walther.</p>
        <p>En los datos es la canción más oscura (la de menos brillo) y la de menos ataques: un final lento que se queda en los graves.</p>`,
      control: `<h2>«She's Lost Control»</h2>
        <p>Abre la cara <i>Inside</i> y es, según los atributos de ReccoBeats, la canción con más energía del disco; también es la de mayor sonoridad media en nuestro análisis.</p>
        <p>Hay otro dato curioso. La <b>instrumentalidad</b> estima si una pista no tiene voz: en nueve de las diez canciones el algoritmo da valores de 0,66 o más, como si fueran casi instrumentales. Solo en «She's Lost Control» (0,04) reconoce con claridad la voz de Curtis. La mezcla de Hannett integra la voz dentro de la banda, y el algoritmo no la oye.</p>`,
      joyful: `<h2>¿La canción más alegre de Joy Division?</h2>
        <p>La <b>valencia</b> mide lo positiva que suena una canción. Según ReccoBeats, las más «alegres» del disco son «Disorder» e «Interzone» (0,73), y las más tristes, «Day of the Lords» (0,12) y «Shadowplay» (0,11).</p>
        <p>El algoritmo escucha el ritmo, la tonalidad y la energía, no la letra. Por eso dos canciones rápidas y tensas puntúan como alegres. «Interzone», además, es la única que canta Hook.</p>`,
      cover: `<h2>Una portada hecha de datos</h2>
        <p>La portada no tiene ni el nombre del grupo ni el título del disco. Muestra 80 pulsos sucesivos de CP 1919, el primer púlsar conocido: lo descubrió Jocelyn Bell Burnell en Cambridge en noviembre de 1967 y emite un pulso de radio cada 1,34 segundos.</p>
        <p>El gráfico lo hizo Harold D. Craft Jr. en el radiotelescopio de Arecibo para su tesis doctoral de 1970, y llegó al grupo a través de la <i>Cambridge Encyclopaedia of Astronomy</i>. Peter Saville lo pasó a líneas blancas sobre fondo negro. Craft tardó años en enterarse, y el origen exacto del gráfico no se aclaró hasta 2015, gracias a Jen Christiansen, de <i>Scientific American</i>.</p>`,
      release: `<h2>Un disco que tardó en llegar</h2>
        <p>Salió el 15 de junio de 1979. Se prensaron 10.000 copias y se vendió despacio: en noviembre iban casi 15.000. Factory no publicó sencillos del disco.</p>
        <p>En enero de 1980 fue número 2 en la primera lista de discos independientes del Reino Unido, que más tarde encabezó, y estuvo en ella 136 semanas. A la lista general no llegó hasta agosto de 1980 (número 71), tras la muerte de Curtis en mayo y la publicación de <i>Closer</i>. La reedición del 40.º aniversario, en 2019, llegó al número 5, el puesto más alto de la banda.</p>`,
      legacy: `<h2>Del vinilo a la camiseta</h2>
        <p>Hoy figura en las grandes listas de la crítica: puesto 211 en los 500 mejores discos de <i>Rolling Stone</i> (2020) y 9 entre los mejores de los setenta para <i>Pitchfork</i>. Se considera uno de los discos más influyentes del <i>post-punk</i>.</p>
        <p>La portada ha ido más lejos que el disco: Raf Simons y Saville la llevaron a la moda en 2003, después vino Supreme, y en 2012 Disney la puso en una camiseta de Mickey Mouse.</p>`,
      ridgeline: `<h2>Joyplot: un nombre para un gráfico</h2>
        <p>En 2017, la comunidad de ciencia de datos empezó a llamar <i>joyplot</i> a los gráficos de líneas superpuestas, en homenaje a esta portada. Claus Wilke publicó el paquete de R ggjoy y el nombre se extendió muy rápido.</p>
        <p>En septiembre de ese año, Wilke lo retiró: el nombre del grupo procede de una novela sobre los campos de concentración nazis. El paquete pasó a llamarse ggridges y el gráfico, <i>ridgeline plot</i> o gráfico de crestas, como el que acompaña este texto.</p>`,
      listen: `<h2>Escucha el disco</h2>
        <p>El gráfico es ahora el reproductor. Pulsa cualquier línea para escuchar la canción desde ese punto, o reproduce el disco entero, en orden, como en el vinilo. Mientras suena, la línea es su vúmetro: el espectro de cada instante, con los graves a la izquierda y los agudos a la derecha, y una línea punteada que retiene los picos.</p>
        <p><button type="button" class="btn" data-action="album"></button></p>
        <p class="note" id="source-note"></p>
        <p class="note">Teclado: espacio para pausar, ← → para cambiar de canción.</p>`
    },
    method: `<p><b>Audio.</b> La forma de onda, los perfiles y los vúmetros se calcularon con Python (librosa) sobre los MP3 de la edición en CD de 1993. Cada línea tiene 400 puntos; todos los datos usan la misma escala en las diez canciones, así que se pueden comparar entre sí. El vúmetro es el espectro precalculado (128 bandas en escala mel entre 30 Hz y 16 kHz, 30 fotogramas por segundo), sincronizado con la posición de la reproducción, con una marca de pico que retiene los máximos.</p>
      <p><b>Atributos.</b> Spotify cerró el acceso a sus atributos sonoros para los desarrolladores en noviembre de 2024. Los de esta página (energía, valencia, instrumentalidad...) son de ReccoBeats, que usa los mismos nombres y la misma escala con su propio análisis, para la edición 2019 Digital Master.</p>
      <p><b>Reproducción.</b> Spotify (canciones completas con la sesión iniciada) o, en local, los MP3 del disco.</p>`,
    sources: [
      ["Unknown Pleasures, Wikipedia (inglés)", "https://en.wikipedia.org/wiki/Unknown_Pleasures"],
      ["Jen Christiansen: Pop Culture Pulsar, Scientific American (2015)", "https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/"],
      ["Known pleasures: from pulsar signal to post-punk icon, Big Think", "https://bigthink.com/strange-maps/known-pleasures-from-pulsar-signal-to-post-punk-icon/"],
      ["Jocelyn Bell Burnell y CP 1919, Universidad de Cambridge", "https://cam.ac.uk/node/220051"],
      ["Claus Wilke: Goodbye joyplots (2017)", "https://clauswilke.com/blog/2017/09/15/goodbye-joyplots/"],
      ["ReccoBeats API", "https://reccobeats.com/"]
    ],
    credits: `Joy Division: Ian Curtis, Bernard Sumner, Peter Hook, Stephen Morris. <i>Unknown Pleasures</i>, Factory Records (FACT 10), 1979. Producción: Martin Hannett. Visualización y textos: Javi Cantón-Correa · <a href="https://javiercanton.com" target="_blank" rel="noopener">javiercanton.com</a>`
  },
  en: {
    lang: "en",
    pageTitle: "Unknown Pleasures (Joy Division) · a data story",
    vizTitle: "Unknown Pleasures, Joy Division: each line is a song",
    metrics: {
      wave: ["Wave", "waveform: the amplitude peak at each moment"],
      loudness: ["Loudness", "perceived volume across the song"],
      brightness: ["Brightness", "where the sound sits: low (dark) or high (bright)"],
      bass: ["Bass", "share of the energy below 250 Hz"],
      onset: ["Pulse", "strength of the attacks: drum hits, picked notes, consonants"]
    },
    features: {
      energy: "Energy", valence: "Valence", danceability: "Danceability", instrumentalness: "Instrumentalness",
      acousticness: "Acousticness", speechiness: "Speechiness", liveness: "Liveness"
    },
    modes: { equal: "Same width", real: "Real duration" },
    sides: { 1: "Outside", 2: "Inside" },
    sideName: { 1: "Side A", 2: "Side B" },
    start: "start", end: "end", min: "min", featureNone: "Attribute (ReccoBeats)", oneMin: "1 min",
    play: "Play", pause: "Pause", listenAlbum: "▶ Listen to the album", pauseAlbum: "❚❚ Pause the album",
    playing: "Now playing", vuHint: "The playing line shows its spectrum: bass on the left, treble on the right.",
    sourceLocal: "Local MP3", sourceSpotify: "Spotify",
    spotifyNote: "Logged in to Spotify you hear the full songs; otherwise, 30-second clips.",
    playerError: "Your browser is blocking the Spotify player. Try without a content blocker.",
    at: "at", pick: "Click again to release",
    tipPlay: "Click to listen from here",
    reccobeats: "ReccoBeats",
    cover: {
      kicker: "Joy Division · <i>Unknown Pleasures</i> (1979)",
      title: "<i>Unknown Pleasures</i>, drawn with its own sound",
      dek: "The cover of Joy Division's debut album is a data chart: 80 pulses from a distant star. We measured the audio of its ten songs and tell their story in the same language, to read, compare and listen.",
      byline: "Javi Cantón-Correa · 17 November 2026",
      caption: "The whole album (39 minutes) in 80 lines of about 30 seconds: each one is the waveform of one stretch.",
      scroll: "Scroll to begin"
    },
    featureLabel: "Attribute",
    sourcesTitle: "Sources",
    methodTitle: "How it was made",
    steps: {
      pulses: `<h2>The whole album in 80 lines</h2>
        <p>The cover of <i>Unknown Pleasures</i> stacks 80 successive pulses from a star. Here we did the same with the album itself: its 39 minutes, cut into 80 stretches of about 30 seconds. Each line is the waveform of one stretch, and the album reads from top to bottom, start to end.</p>
        <p>The flat stretches are the silences between songs; the peaks, the loudest moments. Now we sort those stretches by song.</p>`,
      read: `<h2>How to read the lines</h2>
        <p>Each line is a song, in album order: the <i>Outside</i> side on top (1 to 5) and the <i>Inside</i> side below (6 to 10). As on the cover, each line is flat at the sides and the song rises in the middle, from start to end: its <b>waveform</b>, the amplitude peak at each moment.</p>
        <p>While a song plays, its line becomes a <b>VU meter</b>: its spectrum at each moment, bass on the left and treble on the right.</p>`,
      compare: `<h2>Ten songs, four measures</h2>
        <p>The waveform tells you when each song is loud. To compare them, the lines can show four other measures computed from the audio, all on the same scale across the album: <b>loudness</b>, <b>brightness</b> (whether the sound sits in the treble), <b>bass</b> and <b>pulse</b> (the strength of the attacks).</p>
        <p>Next to each line you can also show a ReccoBeats attribute, such as energy or valence: one number per song, drawn as a bar on the flat stretch to the right.</p>`,
      salford: `<h2>Salford, 1976</h2>
        <p>Bernard Sumner and Peter Hook saw the Sex Pistols at Manchester's Lesser Free Trade Hall on 4 June 1976, and that same year they formed a band in Salford. Ian Curtis joined as singer without an audition, and Stephen Morris took over the drums in August 1977.</p>
        <p>They were called Warsaw until late 1977, when they changed the name to avoid confusion with a London band. After an RCA deal they asked to leave, they self-released the <i>An Ideal for Living</i> EP in June 1978 and made their TV debut on Tony Wilson's <i>Granada Reports</i>.</p>`,
      factory: `<h2>Factory, FACT 10</h2>
        <p>According to Hook, a London label offered them £70,000. Their manager, Rob Gretton, went instead to Factory Records, Wilson's independent label, which split profits 50/50 with the band.</p>
        <p>Gretton estimated the album would cost £8,000; Wilson said in 2006 it ended up costing £18,000. It came out as catalogue number FACT 10. In real-duration mode the middle of each line is as long as its song: almost 40 minutes in all.</p>`,
      strawberry: `<h2>Strawberry Studios, April 1979</h2>
        <p>The album was recorded over three weekends, from 1 to 17 April 1979, at Strawberry Studios (Stockport), produced by Martin Hannett with Chris Nagle as engineer.</p>
        <p>Hannett used several AMS digital delays, a Marshall Time Modulator and tape echo, and looked for sounds in the studio lift and a basement toilet. Curtis's vocal on "Insight" was recorded down a telephone line to make it sound distant.</p>
        <p>The lines now show <b>brightness</b>: the higher, the more sound in the treble. "Insight" is one of the darkest songs on the record.</p>`,
      band: `<h2>What the band did not want to hear</h2>
        <p>The band were not convinced. Sumner felt Hannett had toned his guitars down, and Hook complained it sounded like Pink Floyd, although years later he admitted the producer had done a good job. Morris was happy, and Curtis impressed.</p>
        <p>Hook played bass with a pick. The <b>bass</b> view shows the balance: "Wilderness" has the most energy below 250 Hz and "Disorder" the least.</p>`,
      nothing: `<h2>"I Remember Nothing"</h2>
        <p>The album ends with its longest song, almost six minutes. On it, Sumner played a synthesiser he had built from a kit (a Powertran Transcendent 2000), Gretton smashed bottles and Morris brought a replica Walther pistol.</p>
        <p>In the data it is the darkest song (the least bright) and the one with the fewest attacks: a slow ending that stays in the low end.</p>`,
      control: `<h2>"She's Lost Control"</h2>
        <p>It opens the <i>Inside</i> side and, according to ReccoBeats, it is the most energetic song on the album; it is also the loudest on average in our own analysis.</p>
        <p>There is another curious figure. <b>Instrumentalness</b> estimates whether a track has no vocals: for nine of the ten songs the algorithm returns 0.66 or more, as if they were almost instrumental. Only on "She's Lost Control" (0.04) does it clearly detect Curtis's voice. Hannett's mix sets the voice inside the band, and the algorithm does not hear it.</p>`,
      joyful: `<h2>Joy Division's most joyful song?</h2>
        <p><b>Valence</b> measures how positive a song sounds. According to ReccoBeats, the most "joyful" songs on the album are "Disorder" and "Interzone" (0.73), and the saddest, "Day of the Lords" (0.12) and "Shadowplay" (0.11).</p>
        <p>The algorithm listens to rhythm, key and energy, not to the lyrics. That is why two fast, tense songs score as happy. "Interzone" is also the only one Hook sings.</p>`,
      cover: `<h2>A cover made of data</h2>
        <p>The cover carries neither the band's name nor the album title. It shows 80 successive pulses of CP 1919, the first known pulsar: Jocelyn Bell Burnell discovered it in Cambridge in November 1967, and it sends a radio pulse every 1.34 seconds.</p>
        <p>Harold D. Craft Jr. made the plot at the Arecibo radio telescope for his 1970 PhD thesis, and it reached the band through the <i>Cambridge Encyclopaedia of Astronomy</i>. Peter Saville turned it into white lines on black. Craft did not find out for years, and the exact origin of the plot was only traced in 2015, by Jen Christiansen of <i>Scientific American</i>.</p>`,
      release: `<h2>An album that took its time</h2>
        <p>It came out on 15 June 1979. 10,000 copies were pressed and it sold slowly: by November almost 15,000. Factory released no singles from it.</p>
        <p>In January 1980 it was number 2 on the first UK independent albums chart, which it later topped, spending 136 weeks on it. It only reached the main chart in August 1980 (number 71), after Curtis's death in May and the release of <i>Closer</i>. The 40th-anniversary reissue in 2019 reached number 5, the band's highest position.</p>`,
      legacy: `<h2>From vinyl to T-shirt</h2>
        <p>Today it sits in the critics' big lists: number 211 in <i>Rolling Stone</i>'s 500 greatest albums (2020) and number 9 among <i>Pitchfork</i>'s best albums of the 1970s. It is considered one of the most influential post-punk albums.</p>
        <p>The cover has travelled further than the album: Raf Simons and Saville took it into fashion in 2003, Supreme followed, and in 2012 Disney put it on a Mickey Mouse T-shirt.</p>`,
      ridgeline: `<h2>Joyplot: a name for a chart</h2>
        <p>In 2017 the data science community started calling stacked line charts <i>joyplots</i>, in tribute to this cover. Claus Wilke released the ggjoy R package and the name spread fast.</p>
        <p>In September that year, Wilke retired it: the band's name comes from a novel about the Nazi concentration camps. The package became ggridges and the chart a <i>ridgeline plot</i>, like the one beside this text.</p>`,
      listen: `<h2>Listen to the album</h2>
        <p>The chart is now the player. Click any line to hear the song from that point, or play the whole album, in order, as on the vinyl. While it plays, the line is its VU meter: the spectrum at each moment, bass on the left and treble on the right, with a dotted line that holds the peaks.</p>
        <p><button type="button" class="btn" data-action="album"></button></p>
        <p class="note" id="source-note"></p>
        <p class="note">Keyboard: space to pause, ← → to change song.</p>`
    },
    method: `<p><b>Audio.</b> The waveform, profiles and VU meters were computed in Python (librosa) from the MP3s of the 1993 CD edition. Each line has 400 points; every value uses the same scale across the ten songs, so they can be compared. The VU meter is the precomputed spectrum (128 mel bands from 30 Hz to 16 kHz, 30 frames per second), synced to the playback position, with a peak-hold trace.</p>
      <p><b>Attributes.</b> Spotify closed developer access to its audio features in November 2024. The ones on this page (energy, valence, instrumentalness...) come from ReccoBeats, which uses the same names and scale with its own analysis, for the 2019 Digital Master edition.</p>
      <p><b>Playback.</b> Spotify (full songs when logged in) or, locally, the album's MP3s.</p>`,
    sources: null,   // se usan las de español
    credits: `Joy Division: Ian Curtis, Bernard Sumner, Peter Hook, Stephen Morris. <i>Unknown Pleasures</i>, Factory Records (FACT 10), 1979. Produced by Martin Hannett. Visualisation and text: Javi Cantón-Correa · <a href="https://javiercanton.com" target="_blank" rel="noopener">javiercanton.com</a>`
  }
};
