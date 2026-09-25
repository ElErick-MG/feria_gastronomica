/* ============================================================
   js/data.js — Catálogo de países para la Feria Gastronómica
   ============================================================
   Campos por país:
     id  → identificador único (clave en Firebase)
     iso → código ISO 3166-1 alpha-2 (para banderas de flagcdn.com)
     n   → nombre corto del país
     of  → nombre oficial
     cap → capital del país
     con → continente
     lang→ idioma(s) principal(es)
     mon → moneda oficial
     pl  → platos típicos [emoji + nombre]
     ing → ingredientes estrella de su cocina
     h   → historia gastronómica
     k   → rasgos culturales distintivos
     p   → población aproximada
     d   → dato curioso
     tip → consejo práctico para la feria
     img → URL de imagen representativa del plato icónico (Unsplash, libre de uso)
     wiki→ slug del artículo de Wikipedia sobre la gastronomía del país
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
    ing: ["Maíz", "Chile", "Aguacate", "Cacao", "Frijol", "Cilantro"],
    h:  "Fusiona técnicas mesoamericanas (maíz, chile, cacao) con ingredientes españoles. Es Patrimonio Inmaterial de la UNESCO desde 2010. La tortilla de maíz tiene más de 7.000 años de historia y sigue siendo la base de la alimentación diaria.",
    k:  "Fiestas coloridas, mariachi, Día de Muertos y gran orgullo por sus tradiciones.",
    p:  "≈ 130 millones",
    d:  "El chocolate nació aquí: los aztecas lo bebían amargo y con chile.",
    tip: "Un buen taco se arma con tortilla de maíz caliente, proteína jugosa y salsa casera. ¡No olviden el limón y la cebolla morada!",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Tomate San Marzano", "Aceite de oliva", "Albahaca", "Parmigiano", "Mozzarella", "Pasta seca"],
    h:  "Cocina regional de pocos ingredientes; el tomate llegó de América en el siglo XVI y transformó su mesa. Cada región (Sicilia, Toscana, Emilia-Romagna) tiene recetas únicas transmitidas por generaciones.",
    k:  "Sobremesas largas, familia, ópera, arte y moda.",
    p:  "≈ 59 millones",
    d:  "Existen más de 300 formas de pasta registradas.",
    tip: "La clave italiana es la calidad del ingrediente: pocos pero buenos. Si hacen pasta, respeten el punto 'al dente'. ¡Nunca partan los espaguetis!",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Ají amarillo", "Limón", "Papa", "Quinua", "Maíz morado", "Pescado fresco"],
    h:  "Une tradición inca, influencia española y migraciones africana, china y japonesa (chifa y nikkei). Lima es considerada la capital gastronómica de América Latina.",
    k:  "Textiles andinos, Machu Picchu, música folclórica y orgullo gastronómico.",
    p:  "≈ 34 millones",
    d:  "Cultiva más de 3.000 variedades de papa.",
    tip: "Para un buen ceviche, el pescado debe ser ultra fresco y cortado en cubos uniformes. El limón peruano 'cocina' el pescado en minutos. ¡Sírvanse con camote!",
    img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Arroz japonés", "Salsa de soja", "Dashi", "Wasabi", "Nori", "Mirin"],
    h:  "Basada en arroz, pescado y productos de temporada (washoku), reconocida por la UNESCO. La filosofía culinaria japonesa busca el equilibrio entre cinco sabores, cinco colores y cinco métodos de cocción.",
    k:  "Respeto, puntualidad, té, anime y una estética del detalle y la armonía.",
    p:  "≈ 124 millones",
    d:  "Presentar la comida con belleza es parte de la experiencia.",
    tip: "La presentación es tan importante como el sabor. Usen platos sencillos que resalten el color de la comida. El arroz debe quedar pegajoso pero no apelmazado.",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Cúrcuma", "Garam masala", "Cardamomo", "Comino", "Jengibre", "Yogur"],
    h:  "Milenaria, moldeada por el comercio de especias y por imperios como el mogol. Cada región tiene su identidad: el norte usa ghee y tandoor, el sur prefiere el coco y el arroz.",
    k:  "Diversidad de idiomas y religiones, Bollywood y festivales como Holi y Diwali.",
    p:  "≈ 1.430 millones",
    d:  "Es el mayor productor de especias del mundo.",
    tip: "Tostar las especias en seco antes de usarlas libera sus aceites esenciales y transforma el sabor. ¡Un buen curry comienza con paciencia!",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Aceite de oliva virgen", "Pimentón", "Azafrán", "Ajo", "Tomate", "Jamón ibérico"],
    h:  "Herencia romana y árabe, más productos de América como la papa y el tomate. La cultura de las tapas nació en Andalucía y hoy define la gastronomía social española.",
    k:  "Flamenco, tapas, fiestas populares y vida social en la calle.",
    p:  "≈ 48 millones",
    d:  "El jamón ibérico puede curarse más de 3 años.",
    tip: "Para la paella: nunca revuelvan el arroz una vez añadido al caldo. El 'socarrat' (la capa crujiente del fondo) es la firma de una buena paella.",
    img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Mantequilla", "Crema", "Hierbas finas", "Mostaza de Dijon", "Vino", "Queso"],
    h:  "Su alta cocina se codificó en el siglo XIX y su gastronomía es Patrimonio de la UNESCO. Auguste Escoffier sistematizó las técnicas que hoy se enseñan en todo el mundo.",
    k:  "Arte, moda, quesos, vino y el placer de comer bien.",
    p:  "≈ 68 millones",
    d:  "Produce más de 1.000 variedades de queso.",
    tip: "La técnica francesa se basa en salsas madres. Si hacen crepas, dejen reposar la masa 30 min para que el gluten se relaje. ¡Mantequilla, siempre mantequilla!",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Arepa de maíz", "Frijoles", "Plátano maduro", "Guascas", "Hogao", "Aguacate"],
    h:  "Mezcla indígena, española y africana, con gran diversidad regional de costa a montaña. La bandeja paisa representa la generosidad antioqueña, mientras el ajiaco es el alma de la cocina bogotana.",
    k:  "Cumbia y vallenato, café, flores y la calidez de su gente.",
    p:  "≈ 52 millones",
    d:  "Es uno de los mayores productores de café suave.",
    tip: "La arepa perfecta es doradita por fuera y suave por dentro. Para el ajiaco, las tres variedades de papa (criolla, pastusa y sabanera) son esenciales.",
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Aceite de oliva", "Queso feta", "Yogur griego", "Orégano", "Limón", "Miel"],
    h:  "Dieta mediterránea con aceite de oliva, heredera de la Antigüedad y del mundo otomano. Los griegos fueron los primeros en escribir libros de cocina en el siglo IV a.C.",
    k:  "Mitología, filosofía, danza sirtaki e islas blancas y azules.",
    p:  "≈ 10 millones",
    d:  "Está entre los mayores consumidores de aceite de oliva por persona.",
    tip: "La ensalada griega auténtica NO se mezcla: los ingredientes se colocan en capas con un bloque de feta encima. El orégano seco y el buen aceite de oliva hacen la magia.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
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
    ing: ["Comino", "Canela", "Azafrán", "Dátiles", "Almendras", "Menta"],
    h:  "Herencia bereber, árabe y andalusí, con especias como comino, canela y azafrán. El tajín se cocina lentamente en su icónica olla cónica de barro, logrando sabores profundos y tiernos.",
    k:  "Zocos, té de menta, mosaicos y una hospitalidad legendaria.",
    p:  "≈ 37 millones",
    d:  "El cuscús de los viernes es una tradición familiar.",
    tip: "Para el cuscús: hidraten la sémola con caldo caliente y desgranarla con un tenedor, no con la mano. El té de menta se sirve desde altura para crear espuma. ¡La presentación importa!",
    img: "https://images.unsplash.com/photo-1541518763-a85ee42ae48a?w=600&auto=format&fit=crop&q=80",
    wiki: "Gastronomía_de_Marruecos"
  }
];
