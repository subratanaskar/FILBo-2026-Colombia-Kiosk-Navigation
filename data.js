const SCREEN_W = 1920;
const SCREEN_H = 1080;

// Cache-busting for kiosk browsers that aggressively cache local assets.
const ASSET_VERSION = "2026-04-19-03";

const MAP_W = 846;
const MAP_H = 840;
const MAP_ORIGIN_X = 120;
const MAP_ORIGIN_Y = 168;

const HELP_SQUARES = [
  { x: 262, y: 203.5, fill: "#E52D35" },
  { x: 798, y: 206.5, fill: "#087FED" },
  { x: 717, y: 260.5, fill: "#087FED" },
  { x: 613, y: 297.5, fill: "#E52D35" },
  { x: 807, y: 297.5, fill: "#E52D35" },
  { x: 178, y: 320.5, fill: "#087FED" },
  { x: 351, y: 320.5, fill: "#087FED" },
  { x: 888, y: 326.5, fill: "#087FED" },
  { x: 571, y: 354.5, fill: "#F68824" },
  { x: 178, y: 357.5, fill: "#E52D35" },
  { x: 413, y: 415.5, fill: "#087FED" },
  { x: 888, y: 447.5, fill: "#E52D35" },
  { x: 555, y: 465.5, fill: "#00C147" },
  { x: 803, y: 527.5, fill: "#F68824" },
  { x: 271, y: 547.5, fill: "#087FED" },
  { x: 497, y: 556.5, fill: "#087FED" },
  { x: 846, y: 559.5, fill: "#087FED" },
  { x: 367, y: 576.5, fill: "#F68824" },
  { x: 717, y: 625.5, fill: "#087FED" },
  { x: 497, y: 675.5, fill: "#087FED" },
  { x: 586, y: 721.5, fill: "#00C147" },
  { x: 849, y: 730.5, fill: "#087FED" },
  { x: 546, y: 792.5, fill: "#087FED" },
  { x: 749, y: 821.5, fill: "#087FED" },
  { x: 889, y: 821.5, fill: "#087FED" },
  { x: 784, y: 909.5, fill: "#087FED" },
  { x: 665, y: 935.5, fill: "#F68824" },
  { x: 784, y: 951.5, fill: "#E52D35" },
  { x: 760, y: 978.5, fill: "#087FED" },
  { x: 919, y: 978.5, fill: "#00C147" }
];

const HELP_CATEGORIES = [
  { id: "fire", swatch: "#E52D35", labelKey: "helpFire" },
  { id: "logistic", swatch: "#087FED", labelKey: "helpLogistic" },
  { id: "emergency", swatch: "#F68824", labelKey: "helpEmergency" },
  { id: "coordinator", swatch: "#00C147", labelKey: "helpCoordinator" }
];

const ZONES = [
  {
    id: "entry_lobby",
    icon: "./assets/icons/entry-lobby.svg",
    image: "./assets/images/entry-lobby.png",
    color: "#B3202A",
    hasDetails: true,
    hotspots: [{ x: 653, y: 689, w: 153, h: 109 }]
  },
  {
    id: "exhibition",
    icon: "./assets/icons/exhibition.svg",
    image: "./assets/images/exhibition.png",
    color: "#84B4E1",
    hasDetails: true,
    hotspots: [{ x: 515, y: 532, w: 220, h: 266 }]
  },
  {
    id: "office",
    icon: "./assets/icons/office.svg",
    image: "./assets/images/office.png",
    color: "#204065",
    hasDetails: true,
    hotspots: [{ x: 751, y: 41, w: 55, h: 648 }]
  },
  {
    id: "collective_exhibit",
    icon: "./assets/icons/collective-exhibit.svg",
    image: "./assets/images/collective-exhibit.png",
    color: "#FAA819",
    hasDetails: true,
    hotspots: [{ x: 478, y: 318, w: 257, h: 198 }]
  },
  {
    id: "kids_zone",
    icon: "./assets/icons/kids-zone.svg",
    image: "./assets/images/kids-zone.png",
    color: "#008242",
    hasDetails: true,
    hotspots: [{ x: 256, y: 441, w: 206, h: 99 }]
  },
  {
    id: "publishers",
    icon: "./assets/icons/publishers.svg",
    image: "./assets/images/publishers.png",
    color: "#482B2B",
    hasDetails: true,
    hotspots: [{ x: 256, y: 297, w: 206, h: 180 }]
  },
  {
    id: "stage",
    icon: "./assets/icons/stage.svg",
    image: "./assets/images/stage.png",
    color: "#68BBA5",
    hasDetails: true,
    hotspots: [{ x: 478, y: 41, w: 257, h: 298 }]
  },
  {
    id: "books_store",
    icon: `./assets/icons/book-store.svg?v=${ASSET_VERSION}`,
    image: "./assets/images/book-store.png",
    color: "#8F372C",
    hasDetails: true,
    hotspots: [{ x: 94, y: 40, w: 368, h: 181 }]
  },
  {
    id: "restaurant",
    icon: "./assets/icons/restaurant.svg",
    image: "./assets/images/restaurant.png",
    color: "#87163F",
    hasDetails: true,
    hotspots: [{ x: 40, y: 237, w: 422, h: 44 }]
  },
  {
    id: "exit_lobby",
    icon: "./assets/icons/exit-lobby.svg",
    image: "./assets/images/exit-lobby.png",
    color: "#C79F44",
    hasDetails: true,
    hotspots: [{ x: 40, y: 40, w: 38, h: 181 }]
  },
  {
    id: "restroom",
    icon: `./assets/icons/restroom.svg?v=${ASSET_VERSION}`,
    image: null,
    color: "#ED1558",
    hasDetails: false,
    hotspots: [
      { x: 59, y: 297, w: 141, h: 50 },
      { x: 313, y: 556, w: 148, h: 59 }
    ]
  },
  {
    id: "help",
    icon: `./assets/icons/help.svg?v=${ASSET_VERSION}`,
    image: null,
    color: "#68BBA5",
    hasDetails: false,
    hotspots: []
  }
];

// Frame 5 (Exhibition) cover carousel
const EXHIBITION_COVER_FILES = [
  "01 Gandhi.jpg.jpeg",
  "02 Women Thinkers.jpeg",
  "03 Sahitya.jpeg",
  "04 Prakriti.jpg.jpeg",
  "05 Bhumi.jpeg",
  "06 India on the Rise.jpeg",
  "07 Pathana.jpg.jpeg"
];

// Frame 5 (Kids Zone) cover carousel
const KIDS_ZONE_COVER_FILES = [
  "Panel 1.png",
  "Panel 2.png",
  "Panel 3.png",
  "Panel 4.png",
  "Panel 5.png",
  "Panel 6.png",
  "Panel 7.png",
  "Panel 8.png",
  "Panel 9.png",
  "Panel 10.png",
  "Panel 11.png",
  "Panel 12.png",
  "Panel 13.png",
  "Panel 14.png",
  "Panel 15.png",
  "Panel 16.png"
];

const COPY = {
  en: {
    langEnglish: "English",
    langSpanish: "El español",
    welcome1: "Welcome",
    welcome2: "To",
    welcome3: "India Pavilion",
    tapToBegin: "Tap to Begin",
    exploreTitle: "Explore India",
    exploreBody:
      "As visitors traverse this space, they are introduced to the vast expanses of India: from south to north, east to west. They travel from the salt-sprayed shores of Dhanushkodi to the striking peaks of Spiti Valley. Here, stories rise, cross borders, and intersect, revealing India as many voices in conversation rather than a single narrative.\n\nThe India Pavilion presents a vibrant montage of literature, culture, stories, colours, children’s experiences, and Gandhian ideals, celebrating India as the Guest of Honour Country at FILBo 2026. Come and explore India!",
    navMap: "Navigation Map",
    tapMapToInteract: "Tap on the map to Interact",
    youAreHere: "YOU ARE\nHERE!",
    knowMore: "Know More",
    backToNavigate: "Back to Navigate",
    stageHighlightsAria: "Stage highlights",
    stageIconCultural: "Cultural Performances",
    stageIconTalks: "Talks and Launches",
    stageIconMovies: "Movies & Documentaries",
    helpFire: "Fire Extinguisher",
    helpLogistic: "Logistic Team Member",
    helpEmergency: "Emergency Team Member",
    helpCoordinator: "Coordinator Team Member",
    helpHint: "Tap on the buttons to know the details of the help facilities."
  },
  es: {
    langEnglish: "English",
    langSpanish: "El español",
    welcome1: "Bienvenido",
    welcome2: "A",
    welcome3: "Pabellón de la India",
    tapToBegin: "Toca para comenzar",
    exploreTitle: "Explora India",
    exploreBody:
      "A medida que los visitantes recorren este espacio, se les presenta la inmensidad de la India: de sur a norte, de este a oeste. Viajan desde las costas salpicadas por el salitre de Dhanushkodi hasta los impresionantes picos del valle de Spiti. Aquí, las historias surgen, cruzan fronteras y se entrecruzan, revelando a la India como un diálogo de múltiples voces en lugar de una única narrativa.\n\nEl Pabellón de la India presenta un vibrante montaje de literatura, cultura, historias, colores, experiencias infantiles e ideales gandhianos, celebrando a la India como País Invitado de Honor en la FILBo 2026. ¡Ven a explorar la India!",
    navMap: "Mapa de navegación",
    tapMapToInteract: "Toca el mapa para interactuar",
    youAreHere: "ESTÁS\nAQUÍ!",
    knowMore: "Saber más",
    backToNavigate: "Volver al mapa",
    stageHighlightsAria: "Destacados del escenario",
    stageIconCultural: "Presentaciones culturales",
    stageIconTalks: "Charlas y lanzamientos",
    stageIconMovies: "Películas y documentales",
    helpFire: "Extintor de incendios",
    helpLogistic: "Miembro del equipo de logística",
    helpEmergency: "Miembro del equipo de emergencia",
    helpCoordinator: "Miembro del equipo coordinador",
    helpHint: "Toca los botones para conocer los detalles de los servicios de ayuda."
  }
};

const ZONE_COPY = {
  en: {
    entry_lobby: {
      name: "Entry Lobby",
      short:
        "The India Pavilion presents a vibrant montage of literature, culture, stories, colours, children’s experiences, and Gandhian ideals, celebrating India as the Guest of Honor Country at FILBo 2026. Come and explore India!",
      long: `As visitors approach the pavilion, they are greeted by a striking façade of vibrant kite-like structures inspired by India’s traditional kite festivals. These forms symbolize stories in motion—the movement of ideas across regions, languages, and generations—and represent aspirational India. Reflecting the slogan Come, Read and Explore India!, the façade marks the threshold where literature becomes a shared cultural journey.

After entering the pavilion, visitors arrive at the entry lobby, the main reception and welcome space. Here, they are introduced to the India Pavilion through maps and brief descriptions of its zones and key features. The lobby creates a warm, inviting atmosphere, setting the tone for the journey through the pavilion’s literary and cultural experiences.`
    },
    exhibition: {
      name: "Exhibition",
      short:
        "Explore seven immersive exhibitions celebrating India’s literary heritage; women thinkers; Gandhian legacy; children’s illustrations; the Himalayan landscape through a Colombian lens; and India on the rise.",
      long: `The Exhibition Zone of India, Guest of Honour at FILBo 2026, invites visitors into a rich tapestry of ideas, stories, and artistic expressions. Through seven immersive exhibitions, it celebrates India’s literary heritage, cultural diversity, and creative spirit. From the enduring legacy of Gandhi and the powerful voices of modern literature to the inspiring journeys of women thinkers, it traces a continuum of knowledge across ages. Visual narratives—from children’s book illustrations to cross-cultural interpretations and contemporary photography—offer fresh perspectives on India. These exhibitions and Kids’ Zone present a nation rooted in wisdom, alive with imagination, and confidently shaping its future.`
    },
    office: {
      name: "Office",
      short:
        "Drawing from the sun-bleached beauty of Dhanushkodi, the southernmost tip of Rameswaram Island in the Indian state of Tamil Nadu, this workspace will facilitate business and trade meetings.",
      long: `Drawing from the sun-bleached beauty of Dhanushkodi, the southernmost tip of Rameswaram Island in the Indian state of Tamil Nadu, this workspace will facilitate business and trade meetings.`
    },
    collective_exhibit: {
      name: "Collective Exhibit of Books from India",
      short:
        "Reflecting India’s excellence in books, both in content and production values, this area will showcase Indian books in various languages, including Spanish translations of select titles.",
      long: `A vibrant reflection of India’s multilingual literary landscape, the Collective Exhibit of Books at the India Pavilion—part of India’s Guest of Honour Presentation at FILBo—brings together a carefully curated selection of around 350 titles across diverse genres and languages. Presented by National Book Trust, India, with active support from the entire publishing fraternity of India, the collective exhibit of books celebrates India’s rich publishing tradition, offering works in English and regional languages, along with select Spanish translations, fostering cross-cultural dialogue and opening pathways for global literary exchange and rights collaborations.`
    },
    kids_zone: {
      name: "Kids Zone",
      short:
        "From books to bookmarks, from text to texture, from art to artifacts, from story time to fun-time, this area will engage kids, parents and teachers.",
      long: `The Kids’ Zone at the India Pavilion, part of India’s Guest of Honour Presentation at FILBo, is a vibrant, interactive space inspired by India’s forest landscapes and the timeless Tree of Life. Designed to spark imagination, it invites young visitors to explore books through storytelling, creative play, and artistic expression. With engaging workshops, storytelling sessions, and activities like illustration, poster-making, and bookmark creation, the zone nurtures curiosity and fosters a joyful connection with reading, enriched by captivating artworks from India’s master illustrators.`
    },
    publishers: {
      name: "Publishers",
      short:
        "Designed after the ancient trade streets and market places of Hampi, a UNESCO World Heritage site in India, this area will facilitate book-related trade and discussions.",
      long: `Inspired by the historic marketplaces of Hampi, a UNESCO World Heritage site in India, the Publishers’ Zone at the India Pavilion, part of India’s Guest of Honour Presentation at FILBo, is a dynamic hub for global literary exchange. It brings together publishers, translators, and literary agents to foster dialogue and collaboration. Showcasing a rich selection of Indian books across languages and genres—including children’s literature, fiction, non-fiction, and more—the zone reflects India’s diverse intellectual and cultural traditions, with several titles available in Spanish and bilingual formats for wider engagement.`
    },
    stage: {
      name: "Stage",
      short:
        "Facilitating a meeting of minds, this India Stage will host literary exchanges, book launches, and cultural performances, testifying to the vibrant friendship between India and Colombia.",
      long: `Welcome to the India Stage at FILBo 2026—a living confluence of voices, visions, and vibrant imagination. Here, literature dances with culture, and ideas flow like ancient rivers into modern dreams. From Tagore’s timeless echoes to the pulse of new media, from yoga’s stillness to cinema’s shimmering spectacle, each session is a journey across India’s many worlds. Witness dialogues that bridge continents—India and Colombia in creative embrace—where heritage meets aspiration, and stories become shared horizons. This is not just a stage, but a celebration of thought, art, and spirit—an invitation to feel India, in all its luminous depth.`
    },
    books_store: {
      name: "Bookstore",
      short:
        "Inspired by the University of Nalanda, India’s ancient centre of wisdom, this area offers readers the opportunity to buy India-focused books in Spanish and English.",
      long: `Step into a sanctuary of stories where India breathes through every page. Inspired by the timeless spirit of Nalanda, this bookstore at FILBo 2026 unfolds a vibrant tapestry of thought, tradition, and discovery—now in Spanish. Here, yoga whispers, myths shimmer, and philosophy lingers like incense in the air. Wander through histories, textiles, Ayurveda, and sacred wisdom, each book a doorway into India’s many voices. It is a place where language dissolves and essence remains—where you don’t just read India, you feel it. Come, turn a page, and let a civilization speak gently, deeply, and endlessly to your soul.`
    },
    restaurant: {
      name: "Restaurant",
      short:
        "Celebrating India’s rich gastronomic heritage, this restaurant offers a taste of its diverse and delectable dishes while conveying India’s age-old tradition of warm hospitality.",
      long: `The India Café at the India Pavilion, part of India’s Guest of Honour Presentation at FILBo, offers a warm invitation to experience India’s rich culinary traditions. Inspired by the refined gastronomy of Lucknow, the space blends flavour, heritage, and hospitality. With a menu featuring beloved Indian dishes, snacks, and chai, it creates a welcoming setting for conversation and connection—resonating with Colombia’s own love for food, community, and shared cultural experiences.`
    },
    exit_lobby: {
      name: "Exit Lobby",
      short:
        "As the journey ends, the kite returns carrying stories, honoring India’s people as living narratives and thanking Colombia for its warmth and hospitality.",
      long: `As your journey through the storyland of India draws to a gentle close, we invite you to carry these stories in your heart. This Guest of Honour Presentation at FILBo is a heartfelt tribute to the rich literary and cultural heritage of Colombia. In the spirit of Indian hospitality, we express our deepest gratitude for your warmth and generosity. We look forward to welcoming you at the New Delhi World Book Fair-2027.\n\n¡Gracias, Colombia!`
    },
    restroom: {
      name: "Restroom",
      short:
        "The nearest restrooms are located just ahead outside the Exit Lobby. Please exit here and turn left, follow the marked path to reach them.",
      long: ""
    },
    help: {
      name: "Help",
      short:
        "Need assistance? Fire Extinguishers, Logistics Team Members, Emergency Team Members, and Coordinator Team Members are available throughout the venue. Please follow signage or approach the nearest staff member for immediate support.",
      long: ""
    }
  },
  es: {
    entry_lobby: {
      name: "Vestíbulo de entrada",
      short:
        "El Pabellón de la India ofrece un vibrante mosaico de literatura, cultura, historias, colores, experiencias infantiles e ideales gandhianos, con el fin de celebrar a la India como país invitado de honor en la FILBo 2026. ¡Ven a descubrir la India!",
      long: `A medida que los visitantes se acercan al pabellón, les da la bienvenida una llamativa fachada formada por vibrantes estructuras con forma de cometa, inspiradas en los festivales tradicionales de cometas de la India. Estas formas simbolizan historias en movimiento —el intercambio de ideas entre regiones, lenguas y generaciones— y representan la India de las aspiraciones. En consonancia con el lema «¡Ven, lee y explora la India!», la fachada marca el umbral donde la literatura se convierte en un viaje cultural compartido.

Tras entrar en el pabellón, los visitantes llegan al vestíbulo de entrada, el principal espacio de recepción y bienvenida. Aquí se les presenta el Pabellón de la India a través de mapas y breves descripciones de sus zonas y características principales. El vestíbulo crea un ambiente cálido y acogedor, marcando el tono del recorrido por las experiencias literarias y culturales del pabellón.`
    },
    exhibition: {
      name: "Exposición",
      short:
        "Explora siete exposiciones inmersivas que celebran el patrimonio literario de la India; las mujeres pensadoras; el legado gandhiano; las ilustraciones infantiles; el paisaje del Himalaya a través de una lente colombiana; y la India en auge.",
      long: `La Zona de Exposiciones de la India, país invitado de honor en la FILBo 2026, invita a los visitantes a adentrarse en un rico tapiz de ideas, historias y expresiones artísticas. A través de siete exposiciones inmersivas, celebra el patrimonio literario, la diversidad cultural y el espíritu creativo de la India. Desde el legado perdurable de Gandhi y las poderosas voces de la literatura moderna hasta los inspiradores recorridos de las mujeres pensadoras, traza un continuo de conocimiento a lo largo de las épocas. Las narrativas visuales —desde ilustraciones de libros infantiles hasta interpretaciones interculturales y fotografía contemporánea— ofrecen nuevas perspectivas sobre la India. Estas exposiciones y la Zona Infantil presentan una nación arraigada en la sabiduría, llena de imaginación y que forja su futuro con confianza.`
    },
    office: {
      name: "Oficina",
      short:
        "Inspirado en la belleza bañada por el sol de Dhanushkodi, el extremo más meridional de la isla de Rameswaram, en el estado indio de Tamil Nadu, este espacio de trabajo facilitará las reuniones de negocios y comercio.",
      long: `Inspirado en la belleza bañada por el sol de Dhanushkodi, el extremo más meridional de la isla de Rameswaram, en el estado indio de Tamil Nadu, este espacio de trabajo facilitará las reuniones de negocios y comercio.`
    },
    collective_exhibit: {
      name: "Exhibición colectiva de libros de India",
      short:
        "Reflejando la excelencia de la India en el ámbito editorial, tanto en contenido como en valores de producción, esta zona exhibirá libros indios en varios idiomas, incluidas traducciones al español de títulos seleccionados.",
      long: `La Exposición colectiva de libros del Pabellón de la India —que forma parte de la presentación de la India como país invitado de honor en la FILBo— constituye un vibrante reflejo del panorama literario multilingüe de la India y reúne una selección cuidadosamente seleccionada de unos 350 títulos de diversos géneros e idiomas. Presentada por el National Book Trust de la India, con el apoyo activo de toda la comunidad editorial del país, la exposición colectiva de libros celebra la rica tradición editorial de la India, ofreciendo obras en inglés y en lenguas regionales, junto con una selección de traducciones al español, fomentando el diálogo intercultural y abriendo vías para el intercambio literario global y la colaboración en materia de derechos.`
    },
    kids_zone: {
      name: "Zona infantil",
      short:
        "Desde libros hasta marcapáginas, desde el texto hasta la textura, desde el arte hasta los objetos, desde la hora del cuento hasta la diversión, esta zona atraerá a niños, padres y profesores.",
      long: `La Zona infantil del Pabellón de la India, que forma parte de la presentación de la India como país invitado de honor en la FILBo, es un espacio dinámico e interactivo inspirado en los paisajes forestales de la India y en el eterno Árbol de la Vida. Diseñada para despertar la imaginación, invita a los jóvenes visitantes a explorar los libros a través de la narración de cuentos, el juego creativo y la expresión artística. Con talleres atractivos, sesiones de cuentacuentos y actividades como la ilustración, la creación de carteles y la elaboración de marcapáginas, la zona fomenta la curiosidad y promueve una conexión alegre con la lectura, enriquecida por cautivadoras obras de arte de los maestros ilustradores de la India.`
    },
    publishers: {
      name: "Editoriales",
      short:
        "Diseñada inspirándose en las antiguas calles comerciales y mercados de Hampi, un lugar declarado Patrimonio de la Humanidad por la UNESCO en la India, esta zona facilitará el comercio y los debates relacionados con el libro.",
      long: `Inspirada en los históricos mercados de Hampi, sitio declarado Patrimonio de la Humanidad por la UNESCO en la India, la Zona de Editores del Pabellón de la India, que forma parte de la Presentación de la India como País Invitado de Honor en la FILBo, es un centro dinámico para el intercambio literario global. Reúne a editores, traductores y agentes literarios para fomentar el diálogo y la colaboración. Con una rica selección de libros indios de diversos idiomas y géneros —incluida literatura infantil, ficción, no ficción y más—, la zona refleja las diversas tradiciones intelectuales y culturales de la India, con varios títulos disponibles en español y en formatos bilingües para una mayor participación.`
    },
    stage: {
      name: "Escenario",
      short:
        "Fomentando el encuentro de mentes, este Escenario de la India acogerá intercambios literarios, presentaciones de libros y actuaciones culturales, dando testimonio de la vibrante amistad entre la India y Colombia.",
      long: `Bienvenidos al Escenario de la India en FILBo 2026: una confluencia viva de voces, visiones y una imaginación vibrante. Aquí, la literatura baila con la cultura, y las ideas fluyen como ríos ancestrales hacia los sueños modernos. Desde los ecos atemporales de Tagore hasta el pulso de los nuevos medios, desde la quietud del yoga hasta el espectáculo resplandeciente del cine, cada sesión es un viaje a través de los múltiples mundos de la India. Sea testigo de diálogos que tienden puentes entre continentes —la India y Colombia en un abrazo creativo— donde el patrimonio se une a la aspiración y las historias se convierten en horizontes compartidos. Esto no es solo un escenario, sino una celebración del pensamiento, el arte y el espíritu: una invitación a sentir la India en toda su luminosa profundidad.`
    },
    books_store: {
      name: "Librería",
      short:
        "Inspirada en la Universidad de Nalanda, antiguo centro de sabiduría de la India, esta zona ofrece a los lectores la oportunidad de adquirir libros sobre la India en español e inglés.",
      long: `Adéntrate en un santuario de historias donde la India respira en cada página. Inspirada en el espíritu atemporal de Nalanda, esta librería de FILBo 2026 despliega un vibrante tapiz de pensamiento, tradición y descubrimiento, ahora en español. Aquí, el yoga susurra, los mitos resplandecen y la filosofía perdura como el incienso en el aire. Pasea por la historia, los tejidos, el ayurveda y la sabiduría sagrada; cada libro es una puerta de entrada a las múltiples voces de la India. Es un lugar donde el lenguaje se disuelve y la esencia permanece, donde no solo lees sobre la India, sino que la sientes. Ven, pasa una página y deja que una civilización le hable a tu alma con suavidad, profundidad y sin fin.`
    },
    restaurant: {
      name: "Restaurante",
      short:
        "Celebrando el rico patrimonio gastronómico de la India, este restaurante ofrece una muestra de sus diversos y deliciosos platos, al tiempo que transmite la antigua tradición de cálida hospitalidad de la India.",
      long: `El India Café, situado en el Pabellón de la India y que forma parte de la presentación de la India como país invitado de honor en la FILBo, te invita cordialmente a descubrir las ricas tradiciones culinarias de la India. Inspirado en la refinada gastronomía de Lucknow, este espacio combina sabor, tradición y hospitalidad. Con un menú que incluye platos indios muy apreciados, aperitivos y chai, crea un ambiente acogedor para la conversación y el encuentro, en sintonía con el propio amor de Colombia por la comida, la comunidad y las experiencias culturales compartidas.`
    },
    exit_lobby: {
      name: "Vestíbulo de salida",
      short:
        "Al finalizar el viaje, la cometa regresa cargada de historias, rindiendo homenaje al pueblo de la India como narraciones vivas y agradeciendo a Colombia su calidez y hospitalidad.",
      long: `Ahora que vuestro viaje por el mundo de los cuentos de la India llega a su fin, os invitamos a que guardéis estas historias en vuestro corazón. Esta presentación como País Invitado de Honor en la FILBo es un sincero homenaje al rico patrimonio literario y cultural de Colombia. Siguiendo el espíritu de la hospitalidad india, os expresamos nuestra más sincera gratitud por vuestra calidez y generosidad. Esperamos daros la bienvenida en la Feria Mundial del Libro de Nueva Delhi de 2027.\n\n¡Gracias, Colombia!`
    },
    restroom: {
      name: "Aseos",
      short:
        "Los aseos más cercanos se encuentran justo delante, fuera del vestíbulo de salida. Salga por aquí y gire a la izquierda; siga el camino señalizado para llegar a ellos.",
      long: ""
    },
    help: {
      name: "Ayuda",
      short:
        "¿Necesita ayuda? Hay extintores, miembros del equipo de logística, miembros del equipo de emergencias y miembros del equipo de coordinación disponibles en todo el recinto. Siga las señales o acérquese al miembro del personal más cercano para recibir asistencia inmediata.",
      long: ""
    }
  }
};


// Map labels are positioned to match the Layout Map SVG/Figma frame.
// These are relative to each zone hotspot (top-left origin).
const MAP_LABEL_LAYOUT = [
  // Book Store
  { zoneId: "books_store", hotspotIndex: 0, dx: 137, dy: 79, w: 94, h: 24 },
  // Stage
  { zoneId: "stage", hotspotIndex: 0, dx: 107, dy: 138, w: 42, h: 24 },
  // Office (rotated label)
  { zoneId: "office", hotspotIndex: 0, dx: 16, dy: 284, w: 24, h: 80, vertical: true },
  // Exit Lobby (rotated label)
  { zoneId: "exit_lobby", hotspotIndex: 0, dx: 7, dy: 10, w: 24, h: 160, vertical: true },
  // Restaurant
  { zoneId: "restaurant", hotspotIndex: 0, dx: 170, dy: 10, w: 81, h: 24 },
  // Publishers
  { zoneId: "publishers", hotspotIndex: 0, dx: 64, dy: 66, w: 77, h: 24 },
  // Kids Zone
  { zoneId: "kids_zone", hotspotIndex: 0, dx: 45, dy: 54, w: 72, h: 24 },
  // Collective Exhibit
  { zoneId: "collective_exhibit", hotspotIndex: 0, dx: 52, dy: 95, w: 153, h: 48 },
  // Exhibition
  { zoneId: "exhibition", hotspotIndex: 0, dx: 73, dy: 96, w: 73, h: 24 },
  // Entry Lobby
  { zoneId: "entry_lobby", hotspotIndex: 0, dx: 32, dy: 62, w: 88, h: 24 },
  // Restrooms (2 labels)
  { zoneId: "restroom", hotspotIndex: 0, dx: 54, dy: 9, w: 72, h: 24 },
  { zoneId: "restroom", hotspotIndex: 1, dx: 60, dy: 9, w: 72, h: 24 }
];

// Some Spanish labels are longer than the English ones. We widen those labels (within the same zone)
// so text stays inside the blocks without shrinking the font size.
const MAP_LABEL_LAYOUT_OVERRIDES = {
  es: {
    stage: { dx: 79, w: 100 },
    publishers: { dx: 43, w: 120 },
    kids_zone: { dx: 43, w: 120 },
    restaurant: { dx: 151, w: 120 },
    exhibition: { dx: 55, w: 110 },
    // Subtle centering tweak for the vertical Spanish label.
    office: { dx: 15 },
    entry_lobby: { dx: 17, dy: 50, w: 120, h: 48 },
    exit_lobby: { dy: 10, h: 160 }
  }
};

// Active (white) label boxes should match the static trilingual label placement in frame 3.
// Coordinates are in map-pane space (same coordinate system as layout-map-v2-base.svg viewBox).
const MAP_ACTIVE_LABEL_BOX = {
  // Extracted from the Figma "Footstep Variation" frame label geometry.
  books_store: { left: 282, top: 71, width: 39, height: 68 },
  stage: { left: 558, top: 146, width: 36, height: 68 },
  office: { left: 743, top: 380, width: 27, height: 68 },
  collective_exhibit: { left: 558, top: 380, width: 80, height: 96 },
  exhibition: { left: 558, top: 623, width: 39, height: 68 },
  publishers: { left: 282, top: 336, width: 38, height: 65 },
  kids_zone: { left: 282, top: 462, width: 45, height: 65 },
  restaurant: { left: 72, top: 202, width: 44, height: 65 },
  exit_lobby: { left: 72, top: 71, width: 30, height: 68 },
  entry_lobby: { left: 703, top: 734, width: 44, height: 68 }
};

const MAP_LABEL_COPY = {
  en: {
    entry_lobby: "Entry Lobby",
    exhibition: "Exhibition",
    office: "Office",
    collective_exhibit: "Collective Exhibit of\nBooks from India",
    kids_zone: "Kids Zone",
    publishers: "Publishers",
    stage: "Stage",
    books_store: "Bookstore",
    restaurant: "Restaurant",
    exit_lobby: "Exit Lobby",
    restroom: "Restroom"
  },
  es: {
    entry_lobby: "Vestíbulo de\nentrada",
    exhibition: "Exposición",
    office: "Oficina",
    collective_exhibit: "Exhibición colectiva de\nlibros de India",
    kids_zone: "Zona infantil",
    publishers: "Editoriales",
    stage: "Escenario",
    books_store: "Librería",
    restaurant: "Restaurante",
    exit_lobby: "Vestíbulo de salida",
    restroom: "Aseos"
  }
};

// Trilingual (Spanish / Hindi / English) labels used inside the Layout Map (v2).
// These stay trilingual regardless of the UI language toggle.
const MAP_TRILINGUAL_LABEL_COPY = {
  exit_lobby: { es: ["Salida"], hi: ["निकास"], en: ["Exit"] },
  books_store: { es: ["Librería"], hi: ["पुस्तकालय"], en: ["Bookstore"] },
  restaurant: { es: ["Restaurante"], hi: ["रेस्तरां"], en: ["Restaurant"] },
  publishers: { es: ["Editores"], hi: ["प्रकाशक"], en: ["Publishers"] },
  kids_zone: { es: ["Zona infantil"], hi: ["बच्चों का क्षेत्र"], en: ["Kids Zone"] },
  stage: { es: ["Escenario"], hi: ["मंच"], en: ["Stage"] },
  collective_exhibit: {
    es: ["Exposición colectiva\nde libros de la India"],
    hi: ["भारत के पुस्तकों की\nसामूहिक प्रदर्शनी"],
    en: ["Collective Exhibit of\nBooks from India"]
  },
  office: { es: ["Oficina"], hi: ["कार्यालय"], en: ["Office"] },
  exhibition: { es: ["Exposición"], hi: ["प्रदर्शनी"], en: ["Exhibition"] },
  entry_lobby: { es: ["Bienvenidos"], hi: ["स्वागत"], en: ["Welcome"] }
};


const ZONE_SHAPES = {
  // Shapes are copied from Layout Map.svg (966x912). We render them with a -120px x-translation
  // so they line up with the cropped map pane (846x840) in the UI.
  exhibition: [
    `<path d="M827.147 549.78V712.293L755.772 732.715L755.048 732.922V807.082H657.588L575.596 723.94V549.78H827.147Z" />`
  ],
  office: [`<path d="M910.684 117V688.256L842 708.044V117H910.684Z" />`],
  collective_exhibit: [
    `<path d="M827.614 535.152H609V311.761C642.088 331.335 679.621 341.612 718.307 341.612C756.994 341.612 794.495 331.334 827.614 311.76V535.152Z" />`
  ],
  stage: [
    `<path d="M827.581 32V294.108C794.98 315.391 757.27 326.6 718.29 326.604C679.31 326.6 641.601 315.391 609 294.108V32H827.581Z" />`
  ],
  books_store: [
    `<path d="M275.889 97.4561L275.356 97.1738L271.931 95.3613L271.928 95.3604L271.298 95.0225C258.13 87.8164 250 74.1179 250 59.1084C250 48.992 253.624 39.4778 260.254 32H593.776V207.688C586.051 218.016 573.961 224.09 561.016 224.09H560.016V224.109C537.906 223.577 520.086 205.42 520.086 183.174V175.748H466.901V183.174C466.901 205.754 448.542 224.122 425.973 224.122C403.403 224.122 385.043 205.755 385.043 183.174V175.748H331.858V183.174C331.858 205.754 313.499 224.122 290.93 224.122C268.36 224.122 250 205.755 250 183.174V182.53C250.225 167.542 258.616 153.903 271.928 146.922L271.931 146.921L275.356 145.108L275.889 144.826V97.4561Z" />`
  ],
  restaurant: [
    `<path d="M235.567 189.809C238.861 217.43 262.435 238.941 290.906 238.941C319.377 238.941 342.528 217.853 346.168 190.567H370.688C374.334 217.823 397.709 238.941 425.949 238.941C454.189 238.941 477.566 217.855 481.211 190.567H505.731C509.377 217.823 532.752 238.941 560.992 238.941C572.939 238.941 584.378 235.134 593.753 228.315V279.021H176V189.809H235.567Z" />`
  ],
  exit_lobby: [
    `<path d="M242.173 32C237.604 40.1922 235.165 49.4441 235.165 59.1084C235.165 78.3788 244.968 96.0392 261.054 106.222V136.092C247.311 144.791 238.122 159.019 235.757 175.023H176V32H242.173Z" />`
  ],
  restroom: [
    `<path d="M302 294V378.844L201.729 294H302Z" />`,
    `<path d="M561 550V634.844L460.729 550H561Z" />`
  ],
  kids_zone: [
    `<path d="M405.495 448.386C425.591 448.386 438.104 459.249 452.927 472.163C471.131 488.033 491.993 506.25 531.185 506.25C561.482 506.25 581.758 495.481 593.721 486.024V534.929H369.016C365.963 529.348 359.955 516.574 359.955 502.483C359.955 485.646 364.374 472.123 372.23 462.828C380.07 453.552 391.415 448.386 405.495 448.386Z" />`
  ],
  publishers: [
    `<path d="M593.754 293.807V465.551C588.925 471.52 569.905 491.432 531.218 491.432C499.72 491.432 482.247 477.935 465.953 463.826L462.707 461C447.411 447.638 431.274 433.567 405.528 433.567C387.233 433.567 372.11 440.338 361.574 452.396C351.05 464.44 345.176 481.672 345.176 502.482C345.176 505.774 345.428 508.972 345.853 512.036L316.676 480.539V293.807H593.754Z" />`
  ],
  entry_lobby: [`<path d="M910.676 807.082H769.859V744.084L910.676 703.697V807.082Z" />`]
};

