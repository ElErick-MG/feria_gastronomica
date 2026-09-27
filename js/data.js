/* ============================================================
   js/data.js — Catálogo de países para la Feria Gastronómica
   ============================================================
   Campos por país:
     id    → identificador único (clave en Firebase)
     iso   → código ISO 3166-1 alpha-2 (para banderas de flagcdn.com)
     n     → nombre corto del país
     of    → nombre oficial
     cap   → capital del país
     con   → continente
     lang  → idioma(s) principal(es)
     mon   → moneda oficial
     pl    → platos típicos [emoji + nombre] (retrocompatibilidad)
     platos→ platos típicos con fotos web, emoji y descripción apetitosa
     zonas → zonas/regiones de mayor relevancia gastronómica y cultural con fotos web
     ing   → ingredientes estrella de su cocina
     h     → historia gastronómica
     k     → rasgos culturales distintivos
     p     → población aproximada
     d     → dato curioso
     tip   → consejo práctico para la feria
     img   → URL de imagen representativa del plato icónico (Unsplash, libre de uso)
     wiki  → slug del artículo de Wikipedia sobre la gastronomía del país
   ============================================================ */

export const PAISES = [
  {
    id: "mx", iso: "mx",
    n:  "México",
    of: "Estados Unidos Mexicanos",
    cap: "Ciudad de México",
    con: "América del Norte",
    lang: "Español",
    mon: "Peso mexicano (MXN)",
    pl: ["🌮 Tacos al pastor", "🫔 Tamales", "🌶️ Mole poblano"],
    platos: [
      {
        nombre: "Tacos al pastor",
        emoji: "🌮",
        desc: "Carne de cerdo marinada con achiote y chiles, asada en trompo vertical y servida con piña caramelizada.",
        img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Tamales tradicionales",
        emoji: "🫔",
        desc: "Masa de maíz rellena de guisos y salsas tradicionales, envuelta en hojas de maíz o plátano y cocida al vapor.",
        img: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Mole poblano",
        emoji: "🌶️",
        desc: "Salsa compleja y aterciopelada a base de chiles secos, chocolate amargo, semillas tostadas y especias.",
        img: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Oaxaca",
        tipo: "Cuna gastronómica y del mole",
        desc: "Tierra de los siete moles, mezcal artesanal, quesillo y los aromas del histórico Mercado 20 de Noviembre.",
        img: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Ciudad de México",
        tipo: "Epicentro culinario mundial",
        desc: "Desde taquerías legendarias en cada esquina hasta restaurantes de vanguardia y mercados centenarios.",
        img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Maíz", "Chile", "Aguacate", "Cacao", "Frijol", "Cilantro"],
    h:  "Fusiona técnicas mesoamericanas (maíz, chile, cacao) con ingredientes españoles. Es Patrimonio Inmaterial de la UNESCO desde 2010. La tortilla de maíz tiene más de 7.000 años de historia y sigue siendo la base de la alimentación diaria.",
    k:  "Fiestas coloridas, mariachi, Día de Muertos y gran orgullo por sus tradiciones.",
    p:  "≈ 130 millones",
    d:  "El chocolate nació aquí: los aztecas lo bebían amargo y con chile.",
    tip: "Un buen taco se arma con tortilla de maíz caliente, proteína jugosa y salsa casera. ¡No olviden el limón y la cebolla morada!",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_México"
  },
  {
    id: "it", iso: "it",
    n:  "Italia",
    of: "República Italiana",
    cap: "Roma",
    con: "Europa",
    lang: "Italiano",
    mon: "Euro (EUR)",
    pl: ["🍕 Pizza napoletana", "🍝 Pasta carbonara", "🍰 Tiramisú"],
    platos: [
      {
        nombre: "Pizza napoletana",
        emoji: "🍕",
        desc: "Masa fermentada lentamente a mano, salsa de tomate San Marzano, mozzarella fresca y albahaca.",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Pasta carbonara",
        emoji: "🍝",
        desc: "Receta romana auténtica con guanciale crujiente, yemas de huevo frescas, pecorino romano y pimienta negra recién molida.",
        img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Tiramisú",
        emoji: "🍰",
        desc: "Capas de bizcochos savoiardi empapados en café espresso fuerte, crema aireada de mascarpone y fino cacao amargo.",
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Nápoles & Campania",
        tipo: "Cuna de la pizza mundial",
        desc: "Hogar de la auténtica pizza en horno de leña, el tomate San Marzano y la mozzarella di bufala campana.",
        img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Toscana",
        tipo: "Colinas de vino y tradición campesina",
        desc: "Famosa por su aceite de oliva extra virgen, bistec a la fiorentina y prestigiosos viñedos de Chianti.",
        img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Tomate San Marzano", "Aceite de oliva", "Albahaca", "Parmigiano", "Mozzarella", "Pasta seca"],
    h:  "Cocina regional de pocos ingredientes; el tomate llegó de América en el siglo XVI y transformó su mesa. Cada región (Sicilia, Toscana, Emilia-Romagna) tiene recetas únicas transmitidas por generaciones.",
    k:  "Sobremesas largas, familia, ópera, arte y moda.",
    p:  "≈ 59 millones",
    d:  "Existen más de 300 formas de pasta registradas.",
    tip: "La clave italiana es la calidad del ingrediente: pocos pero buenos. Si hacen pasta, respeten el punto 'al dente'. ¡Nunca partan los espaguetis!",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Italia"
  },
  {
    id: "pe", iso: "pe",
    n:  "Perú",
    of: "República del Perú",
    cap: "Lima",
    con: "América del Sur",
    lang: "Español, Quechua, Aimara",
    mon: "Sol peruano (PEN)",
    pl: ["🐟 Ceviche", "🥩 Lomo saltado", "🍗 Ají de gallina"],
    platos: [
      {
        nombre: "Ceviche tradicional",
        emoji: "🐟",
        desc: "Pescado blanco ultra fresco curado al instante con limón norteño, ají limo, cebolla roja, camote y choclo tierno.",
        img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Lomo saltado",
        emoji: "🥩",
        desc: "Tiras jugosas de lomo fino salteadas al wok con cebolla, tomate, ají amarillo, sillao y vinagre, acompañadas de papas fritas.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Ají de gallina",
        emoji: "🍗",
        desc: "Crema suave y aterciopelada a base de ají amarillo, pechuga deshilachada, leche evaporada, queso fresco y nueces.",
        img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Lima & Costa Central",
        tipo: "Capital gastronómica de Latinoamérica",
        desc: "Puerto pesquero artesanal y cuna de fusiones únicas como el chifa (chino-peruano) y el nikkei (japonés-peruano).",
        img: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Cusco & Valle Sagrado",
        tipo: "Tierra de papas nativas y granos andinos",
        desc: "Herencia agrícola incaica con más de 3.000 tipos de papa, maíz gigante de Urubamba, quinua y pachamanca.",
        img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Ají amarillo", "Limón", "Papa", "Quinua", "Maíz morado", "Pescado fresco"],
    h:  "Une tradición inca, influencia española y migraciones africana, china y japonesa (chifa y nikkei). Lima es considerada la capital gastronómica de América Latina.",
    k:  "Textiles andinos, Machu Picchu, música folclórica y orgullo gastronómico.",
    p:  "≈ 34 millones",
    d:  "Cultiva más de 3.000 variedades de papa.",
    tip: "Para un buen ceviche, el pescado debe ser ultra fresco y cortado en cubos uniformes. El limón peruano 'cocina' el pescado en minutos. ¡Sírvanse con camote!",
    img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_del_Perú"
  },
  {
    id: "jp", iso: "jp",
    n:  "Japón",
    of: "Estado de Japón",
    cap: "Tokio",
    con: "Asia",
    lang: "Japonés",
    mon: "Yen (JPY)",
    pl: ["🍣 Sushi", "🍜 Ramen", "🐙 Takoyaki"],
    platos: [
      {
        nombre: "Sushi & Sashimi",
        emoji: "🍣",
        desc: "Arroz avinagrado perfeccionado con cortes precisos de pescado fresco de temporada y toque sutil de wasabi.",
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Ramen artesanal",
        emoji: "🍜",
        desc: "Fideos firmes en caldo umami cocinado por horas, servido con cerdo chashu tierno, huevo ajitsuke marinado y algas.",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Takoyaki",
        emoji: "🐙",
        desc: "Bolitas crujientes de masa rellenas de trozos de pulpo, con salsa agridulce, mayonesa japonesa y copos de katsuobushi.",
        img: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Tokio",
        tipo: "Metrópolis de mercados y alta precisión",
        desc: "El famoso mercado de Toyosu, callejones de izakayas en Shinjuku y cientos de barras especializadas en ramen.",
        img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Kioto & Osaka",
        tipo: "Tradición Kaiseki y street food",
        desc: "Kioto preserva la alta cocina estacional de templos, mientras Osaka es la capital del street food y la comida callejera.",
        img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Arroz japonés", "Salsa de soja", "Dashi", "Wasabi", "Nori", "Mirin"],
    h:  "Basada en arroz, pescado y productos de temporada (washoku), reconocida por la UNESCO. La filosofía culinaria japonesa busca el equilibrio entre cinco sabores, cinco colores y cinco métodos de cocción.",
    k:  "Respeto, puntualidad, té, anime y una estética del detalle y la armonía.",
    p:  "≈ 124 millones",
    d:  "Presentar la comida con belleza es parte de la experiencia.",
    tip: "La presentación es tan importante como el sabor. Usen platos sencillos que resalten el color de la comida. El arroz debe quedar pegajoso pero no apelmazado.",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Japón"
  },
  {
    id: "in", iso: "in",
    n:  "India",
    of: "República de la India",
    cap: "Nueva Delhi",
    con: "Asia",
    lang: "Hindi, Inglés (+21 idiomas oficiales)",
    mon: "Rupia india (INR)",
    pl: ["🍛 Biryani", "🍗 Pollo tikka masala", "🥟 Samosas"],
    platos: [
      {
        nombre: "Biryani aromático",
        emoji: "🍛",
        desc: "Arroz basmati de grano largo cocinado en capas con azafrán, cebolla caramelizada, especias enteras y carnes marinadas.",
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Pollo tikka masala",
        emoji: "🍗",
        desc: "Trozos de pollo asados en horno tandoor bañados en salsa suave de tomate, yogur, garam masala y mantequilla.",
        img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Samosas crujientes",
        emoji: "🥟",
        desc: "Empanadillas triangulares fritas rellenas de papas condimentadas, chícharos, jengibre y semillas de comino tostadas.",
        img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Delhi & El Norte",
        tipo: "Reino del horno Tandoor y curries mogoles",
        desc: "Calles históricas de Old Delhi, panes naan recién salidos del barro y curries untuosos con especias cálidas.",
        img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Kerala & La Costa Sur",
        tipo: "Costa de las especias y el coco",
        desc: "Cuna milenaria del cardamomo y la pimienta negra, arroz en hojas de plátano y curries ligeros con leche de coco.",
        img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Cúrcuma", "Garam masala", "Cardamomo", "Comino", "Jengibre", "Yogur"],
    h:  "Milenaria, moldeada por el comercio de especias y por imperios como el mogol. Cada región tiene su identidad: el norte usa ghee y tandoor, el sur prefiere el coco y el arroz.",
    k:  "Diversidad de idiomas y religiones, Bollywood y festivales como Holi y Diwali.",
    p:  "≈ 1.430 millones",
    d:  "Es el mayor productor de especias del mundo.",
    tip: "Tostar las especias en seco antes de usarlas libera sus aceites esenciales y transforma el sabor. ¡Un buen curry comienza con paciencia!",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_la_India"
  },
  {
    id: "es", iso: "es",
    n:  "España",
    of: "Reino de España",
    cap: "Madrid",
    con: "Europa",
    lang: "Español",
    mon: "Euro (EUR)",
    pl: ["🥘 Paella", "🍳 Tortilla española", "🍅 Gazpacho"],
    platos: [
      {
        nombre: "Paella valenciana",
        emoji: "🥘",
        desc: "Arroz bomba cocinado a fuego lento en paellera con azafrán, romero, verduras de huerta, mariscos o carnes.",
        img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Tortilla de patatas",
        emoji: "🍳",
        desc: "Papas pochadas pacientemente en abundante aceite de oliva virgen extra, cuajadas con huevos frescos y cebolla.",
        img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Gazpacho andaluz",
        emoji: "🍅",
        desc: "Sopa fría muy refrescante con tomates maduros triturados, pepino, pimiento, ajo, vinagre de Jerez y aceite de oliva.",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Sevilla & Andalucía",
        tipo: "Cuna del tapeo y el aceite de oliva",
        desc: "Tabernas con jamón ibérico de bellota cortado a cuchillo, pescaíto frito y la vida social en las terrazas.",
        img: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Barcelona & Cataluña",
        tipo: "Mercados mediterráneos y mar y montaña",
        desc: "El célebre Mercado de la Boquería, pan con tomate, calçots con romesco y una vanguardia culinaria de prestigio.",
        img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Aceite de oliva virgen", "Pimentón", "Azafrán", "Ajo", "Tomate", "Jamón ibérico"],
    h:  "Herencia romana y árabe, más productos de América como la papa y el tomate. La cultura de las tapas nació en Andalucía y hoy define la gastronomía social española.",
    k:  "Flamenco, tapas, fiestas populares y vida social en la calle.",
    p:  "≈ 48 millones",
    d:  "El jamón ibérico puede curarse más de 3 años.",
    tip: "Para la paella: nunca revuelvan el arroz una vez añadido al caldo. El 'socarrat' (la capa crujiente del fondo) es la firma de una buena paella.",
    img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_España"
  },
  {
    id: "fr", iso: "fr",
    n:  "Francia",
    of: "República Francesa",
    cap: "París",
    con: "Europa",
    lang: "Francés",
    mon: "Euro (EUR)",
    pl: ["🥐 Croissant", "🍆 Ratatouille", "🥞 Crepas"],
    platos: [
      {
        nombre: "Croissant artesanal",
        emoji: "🥐",
        desc: "Hojaldre laminado artesanalmente con mantequilla francesa pura, crujiente por fuera y con miga alveolar tierna.",
        img: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Ratatouille provenzal",
        emoji: "🍆",
        desc: "Finas láminas de berenjena, calabacín, tomate y cebolla horneadas con aceite de oliva y hierbas aromáticas de la Provenza.",
        img: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Crepas tradicionales",
        emoji: "🥞",
        desc: "Delgadas y delicadas láminas doradas preparadas a la plancha con mantequilla, servidas dulces o saladas.",
        img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "París",
        tipo: "Capital de la alta cocina y boulangeries",
        desc: "Bistrós clásicos en Montmartre, queserías especializadas y alta pastelería en cada bulevar parisino.",
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Provenza & Costa Azul",
        tipo: "Jardín mediterráneo de hierbas y olivos",
        desc: "Campos de lavanda, olivos centenarios, quesos de cabra artesanales y la cuna de los sabores del campo provenzal.",
        img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Mantequilla", "Crema", "Hierbas finas", "Mostaza de Dijon", "Vino", "Queso"],
    h:  "Su alta cocina se codificó en el siglo XIX y su gastronomía es Patrimonio de la UNESCO. Auguste Escoffier sistematizó las técnicas que hoy se enseñan en todo el mundo.",
    k:  "Arte, moda, quesos, vino y el placer de comer bien.",
    p:  "≈ 68 millones",
    d:  "Produce más de 1.000 variedades de queso.",
    tip: "La técnica francesa se basa en salsas madres. Si hacen crepas, dejen reposar la masa 30 min para que el gluten se relaje. ¡Mantequilla, siempre mantequilla!",
    img: "https://images.unsplash.com/photo-1502364271109-0a9a75a2a9df?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Francia"
  },
  {
    id: "co", iso: "co",
    n:  "Colombia",
    of: "República de Colombia",
    cap: "Bogotá",
    con: "América del Sur",
    lang: "Español",
    mon: "Peso colombiano (COP)",
    pl: ["🍖 Bandeja paisa", "🫓 Arepas", "🍲 Ajiaco"],
    platos: [
      {
        nombre: "Bandeja paisa",
        emoji: "🍖",
        desc: "Generoso banquete antioqueño con frijoles cargamanto, arroz blanco, carne molida, chicharrón crocante y plátano maduro.",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Arepas tradicionales",
        emoji: "🫓",
        desc: "Tortas de masa de maíz blanco o amarillo asadas a la plancha, doraditas por fuera y rellenas de queso derretido.",
        img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Ajiaco santafereño",
        emoji: "🍲",
        desc: "Sopa insignia bogotana elaborada con tres variedades de papas nativas, pollo tierno, mazorca, crema de leche y guascas.",
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Eje Cafetero",
        tipo: "Paisaje cultural cafetero y tradición",
        desc: "Haciendas cafeteras entre montañas verdes, café suave de altura y la generosa gastronomía campesina.",
        img: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Bogotá & Altiplano",
        tipo: "Sopas andinas y plazas de mercado",
        desc: "Mercados vibrantes como Paloquemao repletos de frutas exóticas y la tradición del ajiaco caliente en días fríos.",
        img: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Arepa de maíz", "Frijoles", "Plátano maduro", "Guascas", "Hogao", "Aguacate"],
    h:  "Mezcla indígena, española y africana, con gran diversidad regional de costa a montaña. La bandeja paisa representa la generosidad antioqueña, mientras el ajiaco es el alma de la cocina bogotana.",
    k:  "Cumbia y vallenato, café, flores y la calidez de su gente.",
    p:  "≈ 52 millones",
    d:  "Es uno de los mayores productores de café suave.",
    tip: "La arepa perfecta es doradita por fuera y suave por dentro. Para el ajiaco, las tres variedades de papa (criolla, pastusa y sabanera) son esenciales.",
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Colombia"
  },
  {
    id: "gr", iso: "gr",
    n:  "Grecia",
    of: "República Helénica",
    cap: "Atenas",
    con: "Europa",
    lang: "Griego",
    mon: "Euro (EUR)",
    pl: ["🍆 Moussaka", "🥙 Souvlaki", "🥗 Ensalada griega"],
    platos: [
      {
        nombre: "Moussaka tradicional",
        emoji: "🍆",
        desc: "Pastel horneado en capas de berenjenas tiernas, carne picada especiada con canela y una suave bechamel gratinada.",
        img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Souvlaki & Gyros",
        emoji: "🥙",
        desc: "Brochetas de carne marinadas en limón y orégano griego, asadas al fuego y servidas con pan pita caliente y salsa tzatziki.",
        img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Horiatiki (Ensalada griega)",
        emoji: "🥗",
        desc: "Tomates maduros, pepinos crujientes, cebolla roja, aceitunas kalamata y generoso bloque de auténtico queso feta con orégano.",
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Santorini & Las Cícladas",
        tipo: "Islas de viñedos volcánicos y frutos del mar",
        desc: "Pescados frescos del mar Egeo, fava santorinesa, vino blanco Assyrtiko y tabernas blancas asomadas al mar.",
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Atenas & Barrio de Plaka",
        tipo: "Tavernas clásicas bajo la Acrópolis",
        desc: "Callejones empedrados con música tradicional, mezedes para compartir en familia y carnes asadas al carbón.",
        img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Aceite de oliva", "Queso feta", "Yogur griego", "Orégano", "Limón", "Miel"],
    h:  "Dieta mediterránea con aceite de oliva, heredera de la Antigüedad y del mundo otomano. Los griegos fueron los primeros en escribir libros de cocina en el siglo IV a.C.",
    k:  "Mitología, filosofía, danza sirtaki e islas blancas y azules.",
    p:  "≈ 10 millones",
    d:  "Está entre los mayores consumidores de aceite de oliva por persona.",
    tip: "La ensalada griega auténtica NO se mezcla: los ingredientes se colocan en capas con un bloque de feta encima. El orégano seco y el buen aceite de oliva hacen la magia.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Grecia"
  },
  {
    id: "ma", iso: "ma",
    n:  "Marruecos",
    of: "Reino de Marruecos",
    cap: "Rabat",
    con: "África",
    lang: "Árabe, Bereber, Francés",
    mon: "Dírham marroquí (MAD)",
    pl: ["🍲 Tajín de cordero", "🍚 Cuscús", "🥧 Pastela"],
    platos: [
      {
        nombre: "Tajín de cordero con ciruelas",
        emoji: "🍲",
        desc: "Estofado cocinado lentamente en cazuela cónica de barro con cordero tierno, ciruelas caramelizadas, almendras y canela.",
        img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Cuscús tradicional",
        emoji: "🍚",
        desc: "Sémola fina de trigo cocida al vapor sobre caldo aromático, servida con siete verduras tiernas, garbanzos y carne jugosa.",
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Pastela marroquí",
        emoji: "🥧",
        desc: "Fina masa crujiente de hojaldre warqa rellena de ave especiada y almendras tostadas, espolvoreada con canela y azúcar glas.",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
      }
    ],
    zonas: [
      {
        nombre: "Marrakech",
        tipo: "Zocos de especias y Plaza Yamaa el Fna",
        desc: "Espectáculo nocturno de aromas a ras el hanout, brochetas al carbón, té de menta fresco y dátiles maduros.",
        img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&auto=format&fit=crop&q=80"
      },
      {
        nombre: "Chefchaouen",
        tipo: "La perla azul y cocina de montaña",
        desc: "Calles azules de la cordillera del Rif famosas por sus quesos de cabra frescos, hierbas silvestres y aceite de oliva virgen.",
        img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80"
      }
    ],
    ing: ["Comino", "Canela", "Azafrán", "Dátiles", "Almendras", "Menta"],
    h:  "Herencia bereber, árabe y andalusí, con especias como comino, canela y azafrán. El tajín se cocina lentamente en su icónica olla cónica de barro, logrando sabores profundos y tiernos.",
    k:  "Zocos, té de menta, mosaicos y una hospitalidad legendaria.",
    p:  "≈ 37 millones",
    d:  "El cuscús de los viernes es una tradición familiar.",
    tip: "Para el cuscús: hidraten la sémola con caldo caliente y desgranarla con un tenedor, no con la mano. El té de menta se sirve desde altura para crear espuma. ¡La presentación importa!",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Marruecos"
  }
];
