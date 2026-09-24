/* ============================================================
   js/data.js — Catálogo de países para la Feria Gastronómica
   ============================================================
   Campos por país:
     id  → identificador único (clave en Firebase)
     iso → código ISO 3166-1 alpha-2 (para banderas de flagcdn.com)
     n   → nombre corto del país
     of  → nombre oficial
     pl  → platos típicos [emoji + nombre]
     h   → historia gastronómica
     k   → rasgos culturales distintivos
     p   → población aproximada
     d   → dato curioso
   ============================================================ */

export const PAISES = [
  {
    id: "mx", iso: "mx",
    n:  "México",
    of: "Estados Unidos Mexicanos",
    pl: ["🌮 Tacos al pastor", "🫔 Tamales", "🌶️ Mole poblano"],
    h:  "Fusiona técnicas mesoamericanas (maíz, chile, cacao) con ingredientes españoles. Es Patrimonio Inmaterial de la UNESCO.",
    k:  "Fiestas coloridas, mariachi, Día de Muertos y gran orgullo por sus tradiciones.",
    p:  "≈ 130 millones",
    d:  "El chocolate nació aquí: los aztecas lo bebían amargo y con chile."
  },
  {
    id: "it", iso: "it",
    n:  "Italia",
    of: "República Italiana",
    pl: ["🍕 Pizza napoletana", "🍝 Pasta carbonara", "🍰 Tiramisú"],
    h:  "Cocina regional de pocos ingredientes; el tomate llegó de América en el siglo XVI y transformó su mesa.",
    k:  "Sobremesas largas, familia, ópera, arte y moda.",
    p:  "≈ 59 millones",
    d:  "Existen más de 300 formas de pasta registradas."
  },
  {
    id: "pe", iso: "pe",
    n:  "Perú",
    of: "República del Perú",
    pl: ["🐟 Ceviche", "🥩 Lomo saltado", "🍗 Ají de gallina"],
    h:  "Une tradición inca, influencia española y migraciones africana, china y japonesa (chifa y nikkei).",
    k:  "Textiles andinos, Machu Picchu, música folclórica y orgullo gastronómico.",
    p:  "≈ 34 millones",
    d:  "Cultiva más de 3.000 variedades de papa."
  },
  {
    id: "jp", iso: "jp",
    n:  "Japón",
    of: "Estado de Japón",
    pl: ["🍣 Sushi", "🍜 Ramen", "🐙 Takoyaki"],
    h:  "Basada en arroz, pescado y productos de temporada (washoku), reconocida por la UNESCO.",
    k:  "Respeto, puntualidad, té, anime y una estética del detalle y la armonía.",
    p:  "≈ 124 millones",
    d:  "Presentar la comida con belleza es parte de la experiencia."
  },
  {
    id: "in", iso: "in",
    n:  "India",
    of: "República de la India",
    pl: ["🍛 Biryani", "🍗 Pollo tikka masala", "🥟 Samosas"],
    h:  "Milenaria, moldeada por el comercio de especias y por imperios como el mogol.",
    k:  "Diversidad de idiomas y religiones, Bollywood y festivales como Holi y Diwali.",
    p:  "≈ 1.430 millones",
    d:  "Es el mayor productor de especias del mundo."
  },
  {
    id: "es", iso: "es",
    n:  "España",
    of: "Reino de España",
    pl: ["🥘 Paella", "🍳 Tortilla española", "🍅 Gazpacho"],
    h:  "Herencia romana y árabe, más productos de América como la papa y el tomate.",
    k:  "Flamenco, tapas, fiestas populares y vida social en la calle.",
    p:  "≈ 48 millones",
    d:  "El jamón ibérico puede curarse más de 3 años."
  },
  {
    id: "fr", iso: "fr",
    n:  "Francia",
    of: "República Francesa",
    pl: ["🥐 Croissant", "🍆 Ratatouille", "🥞 Crepas"],
    h:  "Su alta cocina se codificó en el siglo XIX y su gastronomía es Patrimonio de la UNESCO.",
    k:  "Arte, moda, quesos, vino y el placer de comer bien.",
    p:  "≈ 68 millones",
    d:  "Produce más de 1.000 variedades de queso."
  },
  {
    id: "co", iso: "co",
    n:  "Colombia",
    of: "República de Colombia",
    pl: ["🍖 Bandeja paisa", "🫓 Arepas", "🍲 Ajiaco"],
    h:  "Mezcla indígena, española y africana, con gran diversidad regional de costa a montaña.",
    k:  "Cumbia y vallenato, café, flores y la calidez de su gente.",
    p:  "≈ 52 millones",
    d:  "Es uno de los mayores productores de café suave."
  },
  {
    id: "gr", iso: "gr",
    n:  "Grecia",
    of: "República Helénica",
    pl: ["🍆 Moussaka", "🥙 Souvlaki", "🥗 Ensalada griega"],
    h:  "Dieta mediterránea con aceite de oliva, heredera de la Antigüedad y del mundo otomano.",
    k:  "Mitología, filosofía, danza sirtaki e islas blancas y azules.",
    p:  "≈ 10 millones",
    d:  "Está entre los mayores consumidores de aceite de oliva por persona."
  },
  {
    id: "ma", iso: "ma",
    n:  "Marruecos",
    of: "Reino de Marruecos",
    pl: ["🍲 Tajín de cordero", "🍚 Cuscús", "🥧 Pastela"],
    h:  "Herencia bereber, árabe y andalusí, con especias como comino, canela y azafrán.",
    k:  "Zocos, té de menta, mosaicos y una hospitalidad legendaria.",
    p:  "≈ 37 millones",
    d:  "El cuscús de los viernes es una tradición familiar."
  }
];
