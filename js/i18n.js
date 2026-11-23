/* Textos de la página en español e inglés.
   Cada paso del reportaje lleva el estado del gráfico que lo acompaña:
   metric (dato de las líneas), mode (equal | real), focus (canciones destacadas),
   feature (atributo de ReccoBeats que se muestra junto a cada línea). */
window.STEPS = [
  { id: "pulsar",     metric: "wave",       mode: "equal", focus: [], view: "pulsar" },
  { id: "craft",      metric: "wave",       mode: "equal", focus: [], view: "chart" },
  { id: "original",   metric: "wave",       mode: "equal", focus: [], view: "chart" },
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
      dek: "La portada del primer disco de Joy Division es, en realidad, un gráfico de datos: 80 pulsos de una estrella lejana. Hemos medido el sonido de sus diez canciones para contarlas con ese mismo lenguaje. Para leer, comparar y, sobre todo, escuchar.",
      byline: "Javi Cantón-Correa · 17 de noviembre de 2026",
      caption: "80 pulsos de CP 1919, a partir de una versión digitalizada del gráfico de Harold D. Craft Jr. (Arecibo, 1970), el que acabó en la portada de Unknown Pleasures (Peter Saville, Factory, 1979). Pasa el puntero o el dedo por una línea para ver su intensidad.",
      scroll: "Desliza para empezar"
    },
    featureLabel: "Atributo", pulsarLabel: "CP 1919 · un pulso cada 1,3373 s",
    cpHint: "Pasa por una línea",
    cpPulse: "Pulso", cpValue: "intensidad",
    sourcesTitle: "Fuentes",
    methodTitle: "Cómo se hizo",
    steps: {
      pulsar: `<h2>Una estrella que late</h2>
        <p>Empecemos lejos de Manchester. En 1967, Jocelyn Bell Burnell era una doctoranda de Cambridge. Formaba parte del equipo, dirigido por Antony Hewish, que diseñó y construyó un radiotelescopio hecho de postes y cables, y se pasaba los días revisando metros y metros de papel de registro. Entre tanto ruido apareció algo raro: una señal que volvía con una puntualidad imposible, cada 1,3373 segundos. Medio en broma, Bell Burnell la etiquetó LGM-1, por <i>Little Green Men 1</i>.</p>
        <p>No eran marcianos. El 28 de noviembre de 1967, Bell Burnell consiguió registrar los pulsos con detalle, y el hallazgo se publicó en <i>Nature</i> en febrero de 1968: era el primer púlsar, CP 1919 (hoy PSR B1919+21), una estrella de neutrones que gira sobre sí misma y barre el espacio con su haz, como un faro. La línea que ves a la izquierda es uno de sus pulsos, y late a ese mismo ritmo.</p>
        <figure class="src-fig"><img src="assets/bell-radiotelescopio.jpg" width="780" height="780" alt="Jocelyn Bell Burnell sonriendo, con una antena de radiotelescopio al fondo" loading="lazy"><figcaption>Jocelyn Bell Burnell. Imagen: <a href="https://mujeresconciencia.com/2014/12/03/el-universo-de-jocelyn-bell-burnell/" target="_blank" rel="noopener">Mujeres con Ciencia</a>.</figcaption></figure>
        <p>El Nobel de Física de 1974 fue para su director de tesis, Antony Hewish, y para Martin Ryle. Ella se quedó fuera.</p>`,
      craft: `<h2>80 pulsos en una tesis</h2>
        <p>Al otro lado del Atlántico, el radiotelescopio de Arecibo (Puerto Rico) era entonces el más sensible del mundo, y un grupo de doctorandos de Cornell, alumnos de Frank Drake, se lanzó a estudiar los púlsares. Uno de ellos era Harold D. Craft Jr.</p>
        <p>Craft quería saber si dentro de cada pulso había detalles que se desplazaban de un pulso al siguiente, así que se le ocurrió dibujar muchos seguidos, uno encima de otro. Con un trazador Calcomp, controlado por ordenador, apiló 80 pulsos sucesivos de CP 1919. El primer intento era un lío de líneas, de modo que escribió un programa para que cada pico tapara lo que quedaba detrás. Después, una delineante de Cornell repasó el dibujo a tinta china para que se pudiera imprimir en su tesis, de septiembre de 1970.</p>
        <figure class="src-fig"><img src="assets/sa/craft-1970-tesis.jpg" width="600" height="296" alt="Tres gráficos de pulsos apilados de la tesis de Harold D. Craft Jr.; en el centro, CP 1919" loading="lazy" onerror="this.parentNode.remove()"><figcaption>Páginas de la tesis de Craft (septiembre de 1970), con CP 1919 en el centro. Imagen cedida por Jen Christiansen / <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener"><i>Scientific American</i></a>.</figcaption></figure>
        <p>El gráfico ya había salido antes de la tesis: <i>Scientific American</i> lo publicó a página completa en enero de 1971, en un artículo de Jeremiah P. Ostriker, con el crédito genérico del observatorio de Arecibo. Luego pasó por el libro <i>Graphis Diagrams</i> (1974) y por la <i>Cambridge Encyclopaedia of Astronomy</i> (1977), donde aparece sin el nombre de su autor.</p>
        <p>Por eso su origen fue un misterio durante décadas. Adam Capriola empezó a seguirle la pista, y en 2015 Jen Christiansen, de <i>Scientific American</i>, llegó hasta la tesis en la biblioteca de Cornell y entrevistó a Craft. ¿Cómo se enteró él de la portada? Su colega Jim Cordes lo paró por la calle y le preguntó si sabía que su imagen estaba en un disco de Joy Division. No tenía ni idea. Fue a una tienda, se compró el disco y, ya puestos, el póster.</p>
        <p class="note">La historia completa, en el <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener">reportaje de Jen Christiansen</a>, y una versión artística en <a href="https://www.albertoareta.com/proyectos/sr-b1919-21" target="_blank" rel="noopener">Danza SR B1919+21, de Alberto Areta</a>.</p>`,
      original: `<h2>De la tesis a la portada</h2>
        <p>En 1979, Joy Division encontró el gráfico en la <i>Cambridge Encyclopaedia of Astronomy</i>. Quién lo vio primero depende de a quién preguntes: unas versiones dicen Bernard Sumner y otras Stephen Morris. Se lo pasaron a Peter Saville, que lo cambió de negro sobre blanco a blanco sobre negro (en contra de lo que prefería el grupo) y no puso nada más: ni nombre del grupo ni título del disco.</p>
        <figure class="src-fig"><img src="assets/sa/cambridge-encyclopaedia.jpg" width="600" height="399" alt="El gráfico de CP 1919 en la Cambridge Encyclopaedia of Astronomy" loading="lazy" onerror="this.parentNode.remove()"><figcaption><i>The Cambridge Encyclopaedia of Astronomy</i> (1977). Imagen cedida por Jen Christiansen / <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener"><i>Scientific American</i></a>.</figcaption></figure>
        <p>Así, un gráfico científico pensado para buscar patrones en una estrella acabó siendo una de las imágenes más reconocibles de la música popular. El de la izquierda está dibujado con una versión digitalizada de esa serie: 80 pulsos, 300 muestras cada uno, y cada línea tapa a las de detrás, como en el programa de Craft.</p>
        <p>Y aquí viene la pregunta de este reportaje: ¿qué pasa si usamos ese mismo lenguaje para dibujar el sonido del disco? Cada línea, una canción.</p>`,
      read: `<h2>Cómo leer las líneas</h2>
        <p>Cada línea es una canción, en el orden del vinilo: arriba la cara <i>Outside</i> (1 a 5) y abajo la cara <i>Inside</i> (6 a 10). Como en la portada, la línea es plana a los lados, y en el centro se levanta la canción de principio a fin. Lo que ves es su <b>forma de onda</b>: el pico de amplitud de cada instante.</p>
        <p>Cuando le das al play, la línea de la canción que suena se convierte en un <b>vúmetro</b>: muestra su espectro en cada momento, con los graves a la izquierda y los agudos a la derecha.</p>`,
      compare: `<h2>Diez canciones, cuatro medidas</h2>
        <p>La forma de onda te dice cuándo aprieta cada canción. Para compararlas mejor, puedes cambiar lo que muestran las líneas: <b>sonoridad</b>, <b>brillo</b> (cuánto sonido hay en los agudos), <b>graves</b> y <b>pulso</b> (la fuerza de los ataques: golpes de batería, púas, consonantes). Todas están medidas sobre el audio y en la misma escala para todo el disco, así que puedes comparar unas canciones con otras.</p>
        <p>También puedes añadir junto a cada línea un atributo de ReccoBeats, como la energía o la valencia. Es un solo número por canción, y aparece como una barra sobre el tramo plano de la derecha.</p>`,
      salford: `<h2>Salford, 1976</h2>
        <p>El 4 de junio de 1976, Bernard Sumner y Peter Hook fueron a ver a los Sex Pistols al Lesser Free Trade Hall de Manchester. Salieron con ganas de montar un grupo, y lo montaron ese mismo año en Salford. Ian Curtis entró como cantante sin hacer prueba, y Stephen Morris se sentó a la batería en agosto de 1977.</p>
        <p>Al principio se llamaban Warsaw, pero a finales de 1977 se cambiaron el nombre para que no los confundieran con Warsaw Pakt, un grupo de Londres. Firmaron con RCA, pidieron salir del contrato y en junio de 1978 sacaron por su cuenta el EP <i>An Ideal for Living</i>. Ese año debutaron en televisión en <i>Granada Reports</i>, el programa de Tony Wilson.</p>`,
      factory: `<h2>Factory, FACT 10</h2>
        <p>Según cuenta Hook, Genetic Records, un sello de Londres, les ofreció 70.000 libras. Su mánager, Rob Gretton, prefirió llamar a la puerta de Factory Records, el sello independiente de Wilson, que repartía los beneficios a medias con el grupo.</p>
        <p>Gretton calculó que el disco costaría unas 8.000 libras; en 2006, Wilson contó que al final se fueron a 18.000. Salió con el número de catálogo FACT 10. Si pasas a la duración real, verás cuánto dura cada canción: casi 40 minutos en total.</p>`,
      strawberry: `<h2>Strawberry Studios, abril de 1979</h2>
        <p>El disco se grabó en tres fines de semana, entre el 1 y el 17 de abril de 1979, en Strawberry Studios (Stockport). A los mandos, el productor Martin Hannett, con Chris Nagle como ingeniero.</p>
        <p>Hannett trató el sonido como un espacio: varios retardos digitales AMS, un Marshall Time Modulator, ecos de cinta, el ascensor del estudio con un altavoz Leslie, un baño del sótano, botellas rotas, alguien comiendo patatas fritas, guitarras al revés. En «Insight», grabó la voz de Curtis a través de una línea telefónica para que sonara lejana.</p>
        <p>Ahora las líneas muestran el <b>brillo</b>: cuanto más alta la línea, más sonido en la zona aguda. «Insight» está entre las más oscuras del disco.</p>`,
      band: `<h2>Lo que el grupo no quería oír</h2>
        <p>Al grupo no le hizo gracia el resultado. Sumner sentía que Hannett había domado el sonido fuerte y pesado de sus conciertos, sobre todo las guitarras. Hook dijo al principio que sonaba a Pink Floyd, aunque en 2006 reconoció que Hannett había hecho un buen trabajo. Morris, en cambio, quedó contento: un disco y un concierto, decía, son experiencias distintas.</p>
        <p>Hook tocaba el bajo con púa, y se nota. Mira los <b>graves</b>: «Wilderness» es la canción con más energía por debajo de 250 Hz, y «Disorder», la que menos.</p>`,
      nothing: `<h2>«I Remember Nothing»</h2>
        <p>El disco se despide con su canción más larga, casi seis minutos. Según Hook, es donde más se oye el sintetizador que Sumner se había montado con un kit (un Powertran Transcendent 2000), peleándose con las botellas que rompía Rob Gretton y los disparos de una réplica de pistola de Stephen Morris.</p>
        <p>En los datos es la canción más oscura (la de menos brillo) y la que tiene menos ataques: un final lento que se queda en los graves.</p>`,
      control: `<h2>«She's Lost Control»</h2>
        <p>Abre la cara <i>Inside</i> y, según ReccoBeats, es la canción con más energía del disco. En nuestro análisis también es la de mayor sonoridad media.</p>
        <p>Pero lo curioso está en la <b>instrumentalidad</b>, un valor que estima si una pista no tiene voz. En nueve de las diez canciones, el algoritmo da 0,66 o más, como si fueran casi instrumentales. Solo en «She's Lost Control» (0,04) reconoce sin dudas la voz de Curtis. Hannett mete la voz dentro de la banda, y el algoritmo no la distingue.</p>`,
      joyful: `<h2>¿La canción más alegre de Joy Division?</h2>
        <p>La <b>valencia</b> mide lo positiva que suena una canción. Según ReccoBeats, las más «alegres» del disco son «Disorder» e «Interzone» (0,73), y las más tristes, «Day of the Lords» (0,12) y «Shadowplay» (0,11).</p>
        <p>Sí, suena a broma. El algoritmo escucha el ritmo, la tonalidad y la energía, no la letra, así que dos canciones rápidas y tensas salen como alegres. Un detalle para los fans: «Interzone» es la única en la que Hook lleva la voz principal.</p>`,
      cover: `<h2>Una portada hecha de datos</h2>
        <p>Vale la pena volver a mirarla. La portada no lleva ni el nombre del grupo ni el título del disco: solo 80 pulsos sucesivos de CP 1919, el primer púlsar descubierto, que emite un pulso de radio cada 1,3373 segundos.</p>
        <p>El gráfico salió de los datos de Arecibo y de la tesis de Harold D. Craft Jr. (1970), y llegó al grupo a través de la <i>Cambridge Encyclopaedia of Astronomy</i>, sin el nombre de su autor. Peter Saville lo dejó en blanco sobre negro. Hizo falta que Jen Christiansen tirara del hilo en 2015 para contar de dónde venía exactamente.</p>`,
      release: `<h2>Un disco que tardó en llegar</h2>
        <p>Salió el 15 de junio de 1979. Factory prensó 10.000 copias: se vendieron 5.000 en las dos primeras semanas y después la cosa se frenó, hasta que el sencillo «Transmission» (que no está en el disco) agotó la primera tirada. En noviembre de 1979 iban unas 15.000.</p>
        <p>En enero de 1980 fue número 2 en la primera lista británica de discos independientes. A la lista general no llegó hasta 1980 (número 71), tras la muerte de Curtis en mayo y la publicación de <i>Closer</i>. La reedición de 2019, por su 40.º aniversario, llegó al número 5.</p>`,
      legacy: `<h2>Del vinilo a la camiseta</h2>
        <p>Hoy aparece en las grandes listas de la crítica: puesto 211 en los 500 mejores discos de <i>Rolling Stone</i> (2020) y 9 entre los mejores de los setenta para <i>Pitchfork</i>. Es uno de los discos más influyentes del <i>post-punk</i>.</p>
        <p>La portada ha llegado todavía más lejos: Raf Simons y Saville la llevaron a la moda en 2003, luego vino Supreme, y en 2012 Disney la estampó en una camiseta de Mickey Mouse.</p>
        <p>Y ha vuelto al arte: el fotógrafo Alberto Areta convirtió el púlsar en <a href="https://www.albertoareta.com/proyectos/sr-b1919-21" target="_blank" rel="noopener"><i>Danza SR B1919+21</i></a>, una animación montada a mano con cianotipias.</p>`,
      ridgeline: `<h2>Joyplot: un nombre para un gráfico</h2>
        <p>En 2017, la comunidad de ciencia de datos empezó a llamar <i>joyplot</i> a los gráficos de líneas superpuestas, en homenaje a esta portada. Claus Wilke publicó el paquete de R ggjoy y el nombre corrió como la pólvora.</p>
        <p>Ese mismo septiembre, Wilke lo retiró: el nombre del grupo procede de una novela sobre los campos de concentración nazis, y no parecía buena idea celebrarlo. El paquete pasó a llamarse ggridges, y el gráfico, <i>ridgeline plot</i> o gráfico de crestas. Como el que acompaña este texto.</p>`,
      listen: `<h2>Escucha el disco</h2>
        <p>Ahora el gráfico es el reproductor. Pulsa cualquier línea para escuchar la canción desde ese punto, o pon el disco entero, en orden, como en el vinilo. Mientras suena, la línea es su vúmetro: el espectro de cada instante, con los graves a la izquierda y los agudos a la derecha, y una línea punteada que retiene los picos.</p>
        <p><button type="button" class="btn" data-action="album"></button></p>
        <p class="note" id="source-note"></p>
        <p class="note">Teclado: espacio para pausar, ← → para cambiar de canción.</p>`
    },
    method: `<p><b>Púlsar.</b> Las 80 líneas de CP 1919 (80 pulsos de 300 muestras) son una digitalización aproximada del gráfico de Harold D. Craft Jr. (tesis, 1970), hecha a partir de una imagen vectorial de Michael Zoellner y publicada por Borgar Þorsteinsson. No son las medidas de radio originales, sino una reconstrucción del dibujo. La primera línea es la de arriba. Cada curva se dibuja sobre la anterior y el relleno bajo ella la tapa, como hacía el programa de Craft. La escala vertical es la de una recreación habitual de ese gráfico (un quinto del salto entre líneas). Al pasar el puntero se lee la intensidad de ese punto. En el primer paso las demás líneas se retiran y queda un pulso, que late con el periodo real.</p>
      <p><b>Audio.</b> La forma de onda, los perfiles y los vúmetros se calcularon con Python (librosa) sobre los MP3 de la edición en CD de 1993. Cada línea tiene 400 puntos; todos los datos usan la misma escala en las diez canciones, así que se pueden comparar entre sí. El vúmetro es el espectro precalculado (128 bandas en escala mel entre 30 Hz y 16 kHz, 30 fotogramas por segundo), sincronizado con la posición de la reproducción, con una marca de pico que retiene los máximos.</p>
      <p><b>Atributos.</b> Spotify cerró el acceso a sus atributos sonoros para los desarrolladores en noviembre de 2024. Los de esta página (energía, valencia, instrumentalidad...) son de ReccoBeats, que usa los mismos nombres y la misma escala con su propio análisis, para la edición 2019 Digital Master.</p>
      <p><b>Reproducción.</b> Spotify (canciones completas con la sesión iniciada) o, en local, los MP3 del disco.</p>`,
    sources: [
      ["Unknown Pleasures, Wikipedia (inglés)", "https://en.wikipedia.org/wiki/Unknown_Pleasures"],
      ["Jen Christiansen: Pop Culture Pulsar, Scientific American (2015)", "https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/"],
      ["Datos aproximados de CP 1919 (80×300), digitalizados de una imagen vectorial de Michael Zoellner (gist de Borgar Þorsteinsson)", "https://gist.github.com/borgar/31c1e476b8e92a11d7e9"],
      ["Known pleasures: from pulsar signal to post-punk icon, Big Think", "https://bigthink.com/strange-maps/known-pleasures-from-pulsar-signal-to-post-punk-icon/"],
      ["Jocelyn Bell Burnell y CP 1919, Universidad de Cambridge", "https://cam.ac.uk/node/220051"],
      ["Alberto Areta: Danza SR B1919+21", "https://www.albertoareta.com/proyectos/sr-b1919-21"],
      ["Mujeres con Ciencia: El universo de Jocelyn Bell Burnell (2014)", "https://mujeresconciencia.com/2014/12/03/el-universo-de-jocelyn-bell-burnell/"],
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
      dek: "The cover of Joy Division's debut album is, in fact, a data chart: 80 pulses from a distant star. We measured the sound of its ten songs to tell their story in that same language. To read, to compare and, above all, to listen.",
      byline: "Javi Cantón-Correa · 17 November 2026",
      caption: "80 pulses of CP 1919, from a digitised version of Harold D. Craft Jr.'s chart (Arecibo, 1970), the one that ended up on the cover of Unknown Pleasures (Peter Saville, Factory, 1979). Move a pointer or a finger along a line to read its intensity.",
      scroll: "Scroll to begin"
    },
    featureLabel: "Attribute", pulsarLabel: "CP 1919 · one pulse every 1.3373 s",
    cpHint: "Move over a line",
    cpPulse: "Pulse", cpValue: "intensity",
    sourcesTitle: "Sources",
    methodTitle: "How it was made",
    steps: {
      pulsar: `<h2>A star that beats</h2>
        <p>Let's start far from Manchester. In 1967, Jocelyn Bell Burnell was a Cambridge PhD student. She was part of the team, led by Antony Hewish, that designed and built a radio telescope out of poles and wires, and she spent her days going through yards and yards of chart paper. Among all the noise, something odd turned up: a signal that came back with impossible punctuality, every 1.3373 seconds. Half joking, Bell Burnell labelled it LGM-1, for <i>Little Green Men 1</i>.</p>
        <p>It wasn't aliens. On 28 November 1967, Bell Burnell recorded the pulses in detail, and the discovery was published in <i>Nature</i> in February 1968: it was the first pulsar, CP 1919 (today PSR B1919+21), a spinning neutron star that sweeps space with its beam like a lighthouse. The line on the left is one of its pulses, and it beats at that same rhythm.</p>
        <figure class="src-fig"><img src="assets/bell-radiotelescopio.jpg" width="780" height="780" alt="Jocelyn Bell Burnell smiling, with a radio telescope dish behind her" loading="lazy"><figcaption>Jocelyn Bell Burnell. Image: <a href="https://mujeresconciencia.com/2014/12/03/el-universo-de-jocelyn-bell-burnell/" target="_blank" rel="noopener">Mujeres con Ciencia</a>.</figcaption></figure>
        <p>The 1974 Nobel Prize in Physics went to her thesis supervisor, Antony Hewish, and to Martin Ryle. She was left out.</p>`,
      craft: `<h2>80 pulses in a thesis</h2>
        <p>Across the Atlantic, the Arecibo radio telescope (Puerto Rico) was then the most sensitive in the world, and a group of Cornell PhD students, all working with Frank Drake, jumped on pulsars. One of them was Harold D. Craft Jr.</p>
        <p>Craft wanted to know whether details inside each pulse drifted from one pulse to the next, so he had the idea of drawing many in a row, one above the other. With a computer-driven Calcomp plotter he stacked 80 successive pulses of CP 1919. The first attempt was a tangle of lines, so he wrote a program that let each peak hide whatever was behind it. Then a draftsperson at Cornell traced the drawing in India ink so it could be printed in his thesis, dated September 1970.</p>
        <figure class="src-fig"><img src="assets/sa/craft-1970-tesis.jpg" width="600" height="296" alt="Three stacked pulse charts from Harold D. Craft Jr.'s thesis; CP 1919 in the middle" loading="lazy" onerror="this.parentNode.remove()"><figcaption>Pages of Craft's thesis (September 1970), with CP 1919 in the middle. Image courtesy of Jen Christiansen / <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener"><i>Scientific American</i></a>.</figcaption></figure>
        <p>The chart had already been out before the thesis: <i>Scientific American</i> ran it full page in January 1971, in an article by Jeremiah P. Ostriker, credited generically to the Arecibo observatory. It then appeared in the book <i>Graphis Diagrams</i> (1974) and in the <i>Cambridge Encyclopaedia of Astronomy</i> (1977), with no author's name.</p>
        <p>That is why its origin stayed a mystery for decades. Adam Capriola started tracking it down, and in 2015 Jen Christiansen of <i>Scientific American</i> found the thesis in Cornell's library and interviewed Craft. And how did he find out about the cover? His colleague Jim Cordes stopped him in the street and asked whether he knew his image was on a Joy Division record. He had no idea. He went to a record shop, bought the album and, while he was at it, the poster.</p>
        <p class="note">The full story is in <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener">Jen Christiansen's piece</a>, and there is an artistic take in <a href="https://www.albertoareta.com/proyectos/sr-b1919-21" target="_blank" rel="noopener">Danza SR B1919+21, by Alberto Areta</a>.</p>`,
      original: `<h2>From thesis to cover</h2>
        <p>In 1979, Joy Division came across the chart in the <i>Cambridge Encyclopaedia of Astronomy</i>. Who spotted it first depends on who you ask: some accounts say Bernard Sumner, others Stephen Morris. They passed it to Peter Saville, who flipped it from black on white to white on black (against the band's preference) and added nothing else: no band name, no album title.</p>
        <figure class="src-fig"><img src="assets/sa/cambridge-encyclopaedia.jpg" width="600" height="399" alt="The CP 1919 chart in the Cambridge Encyclopaedia of Astronomy" loading="lazy" onerror="this.parentNode.remove()"><figcaption><i>The Cambridge Encyclopaedia of Astronomy</i> (1977). Image courtesy of Jen Christiansen / <a href="https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/" target="_blank" rel="noopener"><i>Scientific American</i></a>.</figcaption></figure>
        <p>And so a scientific chart made to look for patterns in a star became one of the most recognisable images in popular music. The one on the left is drawn from a digitised version of that series: 80 pulses, 300 samples each, with every line hiding the ones behind it, as in Craft's program.</p>
        <p>Which brings us to the question behind this piece: what happens if we use that same language to draw the album's sound? One line per song.</p>`,
      read: `<h2>How to read the lines</h2>
        <p>Each line is a song, in vinyl order: the <i>Outside</i> side on top (1 to 5) and the <i>Inside</i> side below (6 to 10). As on the cover, the line is flat at the sides, and the song rises in the middle from start to end. What you see is its <b>waveform</b>: the amplitude peak at each moment.</p>
        <p>Hit play and the line of the song that's playing becomes a <b>VU meter</b>: it shows its spectrum at each moment, bass on the left and treble on the right.</p>`,
      compare: `<h2>Ten songs, four measures</h2>
        <p>The waveform tells you when each song pushes hardest. To compare them better, you can change what the lines show: <b>loudness</b>, <b>brightness</b> (how much sound sits in the treble), <b>bass</b> and <b>pulse</b> (the strength of the attacks: drum hits, picked notes, consonants). All are measured on the audio and on the same scale across the album, so you can set one song against another.</p>
        <p>You can also add a ReccoBeats attribute next to each line, such as energy or valence. It is one number per song, shown as a bar on the flat stretch to the right.</p>`,
      salford: `<h2>Salford, 1976</h2>
        <p>On 4 June 1976, Bernard Sumner and Peter Hook went to see the Sex Pistols at Manchester's Lesser Free Trade Hall. They walked out wanting to start a band, and they did, that same year, in Salford. Ian Curtis joined as singer without an audition, and Stephen Morris took the drum stool in August 1977.</p>
        <p>They started out as Warsaw, but in late 1977 they changed their name so as not to be confused with Warsaw Pakt, a London band. They signed with RCA, asked to be let out of the deal, and in June 1978 self-released the <i>An Ideal for Living</i> EP. That year they made their TV debut on <i>Granada Reports</i>, Tony Wilson's show.</p>`,
      factory: `<h2>Factory, FACT 10</h2>
        <p>As Hook tells it, Genetic Records, a London label, offered them £70,000. Their manager, Rob Gretton, chose to knock on the door of Factory Records instead, Wilson's independent label, which split profits 50/50 with the band.</p>
        <p>Gretton reckoned the album would cost around £8,000; in 2006, Wilson said it ended up at £18,000. It came out as catalogue number FACT 10. Switch to real duration and you'll see how long each song lasts: almost 40 minutes in all.</p>`,
      strawberry: `<h2>Strawberry Studios, April 1979</h2>
        <p>The album was recorded over three weekends between 1 and 17 April 1979 at Strawberry Studios (Stockport). At the desk, producer Martin Hannett, with Chris Nagle as engineer.</p>
        <p>Hannett treated sound as space: several AMS digital delays, a Marshall Time Modulator, tape echo, the studio lift with a Leslie speaker, a basement toilet, smashing bottles, someone eating crisps, backwards guitar. On "Insight" he recorded Curtis's voice down a telephone line to make it sound distant.</p>
        <p>The lines now show <b>brightness</b>: the higher the line, the more sound in the treble. "Insight" is among the darkest songs on the record.</p>`,
      band: `<h2>What the band did not want to hear</h2>
        <p>The band weren't happy with the result. Sumner felt Hannett had tamed the loud, heavy sound of their gigs, especially the guitars. Hook first said it sounded like Pink Floyd, though by 2006 he admitted Hannett had done a good job. Morris, on the other hand, was pleased: a record and a gig, he said, are different experiences.</p>
        <p>Hook played bass with a pick, and you can tell. Look at the <b>bass</b> view: "Wilderness" has the most energy below 250 Hz, and "Disorder" the least.</p>`,
      nothing: `<h2>"I Remember Nothing"</h2>
        <p>The album signs off with its longest song, almost six minutes. According to Hook, this is where you hear most of the synthesiser Sumner built from a kit (a Powertran Transcendent 2000), fighting with the bottles Rob Gretton smashed and the shots of Stephen Morris's replica pistol.</p>
        <p>In the data it is the darkest song (the least bright) and the one with the fewest attacks: a slow ending that stays in the low end.</p>`,
      control: `<h2>"She's Lost Control"</h2>
        <p>It opens the <i>Inside</i> side and, according to ReccoBeats, it is the most energetic song on the album. In our analysis it is also the loudest on average.</p>
        <p>But the curious bit is <b>instrumentalness</b>, a value that estimates whether a track has no vocals. For nine of the ten songs, the algorithm returns 0.66 or more, as if they were almost instrumental. Only on "She's Lost Control" (0.04) does it clearly pick up Curtis's voice. Hannett sets the voice inside the band, and the algorithm can't tell it apart.</p>`,
      joyful: `<h2>Joy Division's most joyful song?</h2>
        <p><b>Valence</b> measures how positive a song sounds. According to ReccoBeats, the most "joyful" songs on the album are "Disorder" and "Interzone" (0.73), and the saddest, "Day of the Lords" (0.12) and "Shadowplay" (0.11).</p>
        <p>Yes, it sounds like a joke. The algorithm listens to rhythm, key and energy, not to the lyrics, so two fast, tense songs come out as happy. A detail for fans: "Interzone" is the only one where Hook takes the lead vocal.</p>`,
      cover: `<h2>A cover made of data</h2>
        <p>It's worth another look. The cover carries neither the band's name nor the album title: just 80 successive pulses of CP 1919, the first pulsar discovered, which sends out a radio pulse every 1.3373 seconds.</p>
        <p>The chart came from the Arecibo data and Harold D. Craft Jr.'s thesis (1970), and reached the band through the <i>Cambridge Encyclopaedia of Astronomy</i>, without its author's name. Peter Saville left it white on black. It took Jen Christiansen pulling the thread in 2015 to tell exactly where it came from.</p>`,
      release: `<h2>An album that took its time</h2>
        <p>It came out on 15 June 1979. Factory pressed 10,000 copies: 5,000 sold in the first two weeks and then things slowed down, until the single "Transmission" (not on the album) sold out the first pressing. By November 1979 it had sold around 15,000.</p>
        <p>In January 1980 it was number 2 on the first UK independent albums chart. It only made the main chart in 1980 (number 71), after Curtis's death in May and the release of <i>Closer</i>. The 2019 reissue, for its 40th anniversary, reached number 5.</p>`,
      legacy: `<h2>From vinyl to T-shirt</h2>
        <p>Today it sits in the critics' big lists: number 211 in <i>Rolling Stone</i>'s 500 greatest albums (2020) and number 9 among <i>Pitchfork</i>'s best albums of the 1970s. It is one of the most influential post-punk records.</p>
        <p>The cover has gone even further: Raf Simons and Saville took it into fashion in 2003, Supreme followed, and in 2012 Disney printed it on a Mickey Mouse T-shirt.</p>
        <p>And it has gone back to art: photographer Alberto Areta turned the pulsar into <a href="https://www.albertoareta.com/proyectos/sr-b1919-21" target="_blank" rel="noopener"><i>Danza SR B1919+21</i></a>, an animation assembled by hand from cyanotypes.</p>`,
      ridgeline: `<h2>Joyplot: a name for a chart</h2>
        <p>In 2017 the data science community started calling stacked line charts <i>joyplots</i>, in tribute to this cover. Claus Wilke released the ggjoy R package and the name spread like wildfire.</p>
        <p>That same September, Wilke retired it: the band's name comes from a novel about the Nazi concentration camps, and celebrating it didn't seem a good idea. The package became ggridges, and the chart a <i>ridgeline plot</i>. Like the one next to this text.</p>`,
      listen: `<h2>Listen to the album</h2>
        <p>The chart is now the player. Click any line to hear the song from that point, or put the whole album on, in order, as on the vinyl. While it plays, the line is its VU meter: the spectrum at each moment, bass on the left and treble on the right, with a dotted line that holds the peaks.</p>
        <p><button type="button" class="btn" data-action="album"></button></p>
        <p class="note" id="source-note"></p>
        <p class="note">Keyboard: space to pause, ← → to change song.</p>`
    },
    method: `<p><b>Pulsar.</b> The 80 lines of CP 1919 (80 pulses of 300 samples) are an approximate digitisation of Harold D. Craft Jr.'s chart (thesis, 1970), made from a vector image by Michael Zoellner and published by Borgar Þorsteinsson. They are not the original radio measurements but a reconstruction of the drawing. The first line is the top one. Each curve is drawn over the previous one and the fill under it covers it, as Craft's program did. The vertical scale is the one used in a usual recreation of that chart (one fifth of the gap between lines). Moving over a line reads the intensity at that point. On the first step the other lines leave and one pulse remains, beating at the real period.</p>
      <p><b>Audio.</b> The waveform, profiles and VU meters were computed in Python (librosa) from the MP3s of the 1993 CD edition. Each line has 400 points; every value uses the same scale across the ten songs, so they can be compared. The VU meter is the precomputed spectrum (128 mel bands from 30 Hz to 16 kHz, 30 frames per second), synced to the playback position, with a peak-hold trace.</p>
      <p><b>Attributes.</b> Spotify closed developer access to its audio features in November 2024. The ones on this page (energy, valence, instrumentalness...) come from ReccoBeats, which uses the same names and scale with its own analysis, for the 2019 Digital Master edition.</p>
      <p><b>Playback.</b> Spotify (full songs when logged in) or, locally, the album's MP3s.</p>`,
    sources: null,   // se usan las de español
    credits: `Joy Division: Ian Curtis, Bernard Sumner, Peter Hook, Stephen Morris. <i>Unknown Pleasures</i>, Factory Records (FACT 10), 1979. Produced by Martin Hannett. Visualisation and text: Javi Cantón-Correa · <a href="https://javiercanton.com" target="_blank" rel="noopener">javiercanton.com</a>`
  }
};
