export const pronouns = ["I", "You", "He", "She", "It", "We", "They"];

export const verbs = {
  present: [
    "want", "know", "have", "do", "go", "like", "eat", "see", "think", "need",
    "make", "take", "come", "give", "tell", "say", "get", "put", "read", "write",
    "play", "run", "walk", "open", "close", "ask", "help", "work", "live", "study",
    "love", "feel", "try", "use", "find", "hold", "keep", "let", "begin", "seem"
  ],
  past: [
    "wanted", "knew", "had", "did", "went", "liked", "ate", "saw", "thought", "needed",
    "made", "took", "came", "gave", "told", "said", "got", "put", "read", "wrote",
    "played", "ran", "walked", "opened", "closed", "asked", "helped", "worked", "lived", "studied",
    "loved", "felt", "tried", "used", "found", "held", "kept", "let", "began", "seemed"
  ],
  future: [
    "will want", "will know", "will have", "will do", "will go", "will like", "will eat", "will see", "will think", "will need",
    "will make", "will take", "will come", "will give", "will tell", "will say", "will get", "will put", "will read", "will write",
    "will play", "will run", "will walk", "will open", "will close", "will ask", "will help", "will work", "will live", "will study",
    "will love", "will feel", "will try", "will use", "will find", "will hold", "will keep", "will let", "will begin", "will seem"
  ]
};

export const objects = [
  "water", "the car", "something", "apples", "the truth", "a book", "the answer", "music",
  "food", "help", "a friend", "the door", "my homework", "the phone", "a coffee", "the weather",
  "a movie", "the garden", "my keys", "the bus", "a question", "the store", "dinner", "a letter",
  "the office", "my family", "the school", "a pen", "the internet", "a gift", "the cat", "a bike",
  "my jacket", "the lunch", "a song", "the baby", "a camera", "the airport", "my wallet", "a umbrella"
];

export const connectors = [
  "because", "and", "if", "but", "so", "when", "while", "after", "before", "than", "although", "unless"
];

export const contractions = [
  { formal: "I am", informal: "I'm", meaning: "soy/estoy" },
  { formal: "you are", informal: "you're", meaning: "eres/estás" },
  { formal: "he is", informal: "he's", meaning: "él es/está" },
  { formal: "she is", informal: "she's", meaning: "ella es/está" },
  { formal: "it is", informal: "it's", meaning: "es/está" },
  { formal: "we are", informal: "we're", meaning: "nosotros somos/estamos" },
  { formal: "they are", informal: "they're", meaning: "ellos son/están" },
  { formal: "I have", informal: "I've", meaning: "tengo/he" },
  { formal: "you have", informal: "you've", meaning: "tienes/have" },
  { formal: "we have", informal: "we've", meaning: "tenemos/hemos" },
  { formal: "they have", informal: "they've", meaning: "tienen/han" },
  { formal: "I will", informal: "I'll", meaning: "voy a" },
  { formal: "you will", informal: "you'll", meaning: "vas a" },
  { formal: "he will", informal: "he'll", meaning: "él va a" },
  { formal: "she will", informal: "she'll", meaning: "ella va a" },
  { formal: "we will", informal: "we'll", meaning: "vamos a" },
  { formal: "they will", informal: "they'll", meaning: "ellos van a" },
  { formal: "I would", informal: "I'd", meaning: "yo quisiera" },
  { formal: "you would", informal: "you'd", meaning: "tú quisieras" },
  { formal: "he would", informal: "he'd", meaning: "él quisiera" },
  { formal: "she would", informal: "she'd", meaning: "ella quisiera" },
  { formal: "I had", informal: "I'd", meaning: "yo tenía" },
  { formal: "do not", informal: "don't", meaning: "no" },
  { formal: "does not", informal: "doesn't", meaning: "no" },
  { formal: "did not", informal: "didn't", meaning: "no" },
  { formal: "cannot", informal: "can't", meaning: "no puedo" },
  { formal: "will not", informal: "won't", meaning: "no voy a" },
  { formal: "would not", informal: "wouldn't", meaning: "no quisiera" },
  { formal: "should not", informal: "shouldn't", meaning: "no debería" },
  { formal: "is not", informal: "isn't", meaning: "no es/está" },
  { formal: "are not", informal: "aren't", meaning: "no son/están" }
];

export const informalExpressions = [
  { expression: "I gotta go", formal: "I have to go", meaning: "Tengo que irme" },
  { expression: "I wanna eat", formal: "I want to eat", meaning: "Quiero comer" },
  { expression: "I'm gonna study", formal: "I'm going to study", meaning: "Voy a estudiar" },
  { expression: "Whatcha doin?", formal: "What are you doing?", meaning: "Qué estás haciendo?" },
  { expression: "I dunno", formal: "I don't know", meaning: "No sé" },
  { expression: "kinda tired", formal: "kind of tired", meaning: "algo cansado" },
  { expression: "gotta hurry", formal: "have to hurry", meaning: "tengo que apurarme" },
  { expression: "wanna come?", formal: "want to come?", meaning: "quieres venir?" },
  { expression: "I'm beat", formal: "I'm tired", meaning: "estoy agotado" },
  { expression: "no way", formal: "that's impossible", meaning: "ni de vaina" },
  { expression: "for real", formal: "really", meaning: "en serio" },
  { expression: "my bad", formal: "my mistake", meaning: "mi error" },
  { expression: "what's up?", formal: "how are you?", meaning: "qué tal?" },
  { expression: "I'm down", formal: "I agree", meaning: "estoy de acuerdo" },
  { expression: "let's bounce", formal: "let's leave", meaning: "vámonos" },
  { expression: "I'm stoked", formal: "I'm excited", meaning: "estoy emocionado" },
  { expression: "that's sick", formal: "that's awesome", meaning: "eso es genial" },
  { expression: "I'm crashed", formal: "I'm exhausted", meaning: "estoy muerto" },
  { expression: "hang on", formal: "wait", meaning: "espera" },
  { expression: "I gotchu", formal: "I got you", meaning: "te tengo" }
];

export const pronunciationTips = [
  { word: "can't", trick: "suena como 'kent'", rule: "La 'a' se abre mucho" },
  { word: "better", trick: "suena como 'bedder'", rule: "T entre vocales → D" },
  { word: "water", trick: "suena como 'wader'", rule: "Mismo truco que better" },
  { word: "going to", trick: "se convierte en 'gonna'", rule: "Reducción informal" },
  { word: "want to", trick: "se convierte en 'wanna'", rule: "Reducción informal" },
  { word: "have to", trick: "se convierte en 'hafta'", rule: "La V se vuelve F" },
  { word: "give me", trick: "se convierte en 'gimme'", rule: "Eliminación de vocal" },
  { word: "let me", trick: "se convierte en 'lemme'", rule: "Eliminación de vocal" },
  { word: "I don't know", trick: "se convierte en 'I dunno'", rule: "Reducción extrema" },
  { word: "should have", trick: "se convierte en 'shoulda'", rule: "HAVE → A en pasado" },
  { word: "could have", trick: "se convierte en 'coulda'", rule: "Mismo patrón" },
  { word: "would have", trick: "se convierte en 'woulda'", rule: "Mismo patrón" },
  { word: "did you", trick: "se convierte en 'didja'", rule: "D y J se fusionan" },
  { word: "what are you", trick: "se convierte en 'whatcha'", rule: "Reducción completa" },
  { word: "I'm going to", trick: "se convierte en 'I'm gonna'", rule: "Reducción doble" }
];

export const translations = {
  // Pronouns
  "I": "yo",
  "You": "tú",
  "He": "él",
  "She": "ella",
  "It": "eso",
  "We": "nosotros",
  "They": "ellos",
  
  // Present verbs
  "want": "querer",
  "know": "saber/conocer",
  "have": "tener",
  "do": "hacer",
  "go": "ir",
  "like": "gustar",
  "eat": "comer",
  "see": "ver",
  "think": "pensar",
  "need": "necesitar",
  "make": "hacer",
  "take": "tomar",
  "come": "venir",
  "give": "dar",
  "tell": "decir",
  "say": "decir",
  "get": "obtener",
  "put": "poner",
  "read": "leer",
  "write": "escribir",
  "play": "jugar/tocar",
  "run": "correr",
  "walk": "caminar",
  "open": "abrir",
  "close": "cerrar",
  "ask": "preguntar",
  "help": "ayudar",
  "work": "trabajar",
  "live": "vivir",
  "study": "estudiar",
  "love": "amar",
  "feel": "sentir",
  "try": "intentar",
  "use": "usar",
  "find": "encontrar",
  "hold": "sostener",
  "keep": "mantener",
  "let": "dejar",
  "begin": "empezar",
  "seem": "parecer",
  
  // Connectors
  "because": "porque",
  "and": "y",
  "if": "si",
  "but": "pero",
  "so": "entonces",
  "when": "cuando",
  "while": "mientras",
  "after": "después",
  "before": "antes",
  "than": "que",
  "although": "aunque",
  "unless": "a menos que",
  
  // Common objects
  "water": "agua",
  "the car": "el carro",
  "something": "algo",
  "apples": "manzanas",
  "the truth": "la verdad",
  "a book": "un libro",
  "the answer": "la respuesta",
  "music": "música",
  "food": "comida",
  "a friend": "un amigo",
  "the door": "la puerta",
  "my homework": "mi tarea",
  "the phone": "el teléfono",
  "a coffee": "un café",
  "the weather": "el clima",
  "a movie": "una película",
  "the garden": "el jardín",
  "my keys": "mis llaves",
  "the bus": "el autobús",
  "a question": "una pregunta",
  "the store": "la tienda",
  "dinner": "la cena",
  "a letter": "una carta",
  "the office": "la oficina",
  "my family": "mi familia",
  "the school": "la escuela",
  "a pen": "un bolígrafo",
  "the internet": "el internet",
  "a gift": "un regalo",
  "the cat": "el gato",
  "a bike": "una bicicleta",
  "my jacket": "mi chaqueta",
  "the lunch": "el almuerzo",
  "a song": "una canción",
  "the baby": "el bebé",
  "a camera": "una cámara",
  "the airport": "el aeropuerto",
  "my wallet": "mi billetera",
  "a umbrella": "un paraguas",
  
  // Would
  "would": "quisiera/haría"
};

// Traducciones de frases completas (natural Spanish)
export const sentenceTranslations = {
  "I want water": "Yo quiero agua",
  "I want apples": "Yo quiero manzanas",
  "I want food": "Yo quiero comida",
  "I want music": "Yo quiero música",
  "I want help": "Yo quiero ayuda",
  "I want a book": "Yo quiero un libro",
  "I want the truth": "Yo quiero la verdad",
  "I want something": "Yo quiero algo",
  "I know water": "Yo conozco el agua",
  "I know apples": "Yo conozco las manzanas",
  "I know food": "Yo conozco la comida",
  "I know music": "Yo conozco la música",
  "I know help": "Yo conozco la ayuda",
  "I know a book": "Yo conozco un libro",
  "I know the truth": "Yo conozco la verdad",
  "I know something": "Yo sé algo",
  "I have water": "Yo tengo agua",
  "I have apples": "Yo tengo manzanas",
  "I have food": "Yo tengo comida",
  "I have music": "Yo tengo música",
  "I have help": "Yo tengo ayuda",
  "I have a book": "Yo tengo un libro",
  "I have the truth": "Yo tengo la verdad",
  "I have something": "Yo tengo algo",
  "I do water": "Yo hago agua",
  "I do apples": "Yo hago manzanas",
  "I do food": "Yo cocino",
  "I do music": "Yo hago música",
  "I do help": "Yo ayudo",
  "I do a book": "Yo hago un libro",
  "I do the truth": "Yo digo la verdad",
  "I do something": "Yo hago algo",
  "I go water": "Yo voy por agua",
  "I go apples": "Yo voy por manzanas",
  "I go food": "Yo voy por comida",
  "I go music": "Yo voy a escuchar música",
  "I go help": "Yo voy a ayudar",
  "I go a book": "Yo voy por un libro",
  "I go the truth": "Yo voy por la verdad",
  "I go something": "Yo voy por algo",
  "I like water": "Me gusta el agua",
  "I like apples": "Me gustan las manzanas",
  "I like food": "Me gusta la comida",
  "I like music": "Me gusta la música",
  "I like help": "Me gusta la ayuda",
  "I like a book": "Me gusta un libro",
  "I like the truth": "Me gusta la verdad",
  "I like something": "Me gusta algo",
  "I eat water": "Yo bebo agua",
  "I eat apples": "Yo como manzanas",
  "I eat food": "Yo como comida",
  "I eat music": "Yo escucho música",
  "I eat help": "Yo acepto ayuda",
  "I eat a book": "Yo leo un libro",
  "I eat the truth": "Yo acepto la verdad",
  "I eat something": "Yo como algo",
  "I see water": "Yo veo agua",
  "I see apples": "Yo veo manzanas",
  "I see food": "Yo veo comida",
  "I see music": "Yo veo música",
  "I see help": "Yo veo ayuda",
  "I see a book": "Yo veo un libro",
  "I see the truth": "Yo veo la verdad",
  "I see something": "Yo veo algo",
  "I think water": "Yo pienso en agua",
  "I think apples": "Yo pienso en manzanas",
  "I think food": "Yo pienso en comida",
  "I think music": "Yo pienso en música",
  "I think help": "Yo pienso en ayuda",
  "I think a book": "Yo pienso en un libro",
  "I think the truth": "Yo pienso en la verdad",
  "I think something": "Yo pienso en algo",
  "I need water": "Yo necesito agua",
  "I need apples": "Yo necesito manzanas",
  "I need food": "Yo necesito comida",
  "I need music": "Yo necesito música",
  "I need help": "Yo necesito ayuda",
  "I need a book": "Yo necesito un libro",
  "I need the truth": "Yo necesito la verdad",
  "I need something": "Yo necesito algo",
  "You want water": "Tú quieres agua",
  "You want apples": "Tú quieres manzanas",
  "You want food": "Tú quieres comida",
  "You want music": "Tú quieres música",
  "You want help": "Tú quieres ayuda",
  "You want a book": "Tú quieres un libro",
  "You want the truth": "Tú quieres la verdad",
  "You want something": "Tú quieres algo",
  "He wants water": "Él quiere agua",
  "He wants apples": "Él quiere manzanas",
  "He wants food": "Él quiere comida",
  "He wants music": "Él quiere música",
  "He wants help": "Él quiere ayuda",
  "He wants a book": "Él quiere un libro",
  "He wants the truth": "Él quiere la verdad",
  "He wants something": "Él quiere algo",
  "She wants water": "Ella quiere agua",
  "She wants apples": "Ella quiere manzanas",
  "She wants food": "Ella quiere comida",
  "She wants music": "Ella quiere música",
  "She wants help": "Ella quiere ayuda",
  "She wants a book": "Ella quiere un libro",
  "She wants the truth": "Ella quiere la verdad",
  "She wants something": "Ella quiere algo",
  "We want water": "Nosotros queremos agua",
  "We want apples": "Nosotros queremos manzanas",
  "We want food": "Nosotros queremos comida",
  "We want music": "Nosotros queremos música",
  "We want help": "Nosotros queremos ayuda",
  "We want a book": "Nosotros queremos un libro",
  "We want the truth": "Nosotros queremos la verdad",
  "We want something": "Nosotros queremos algo",
  "They want water": "Ellos quieren agua",
  "They want apples": "Ellos quieren manzanas",
  "They want food": "Ellos quieren comida",
  "They want music": "Ellos quieren música",
  "They want help": "Ellos quieren ayuda",
  "They want a book": "Ellos quieren un libro",
  "They want the truth": "Ellos quieren la verdad",
  "They want something": "Ellos quieren algo",
};

// Adjectives (100+ words)
export const adjectives = [
  { en: "big", es: "grande" },
  { en: "small", es: "pequeño" },
  { en: "happy", es: "feliz" },
  { en: "sad", es: "triste" },
  { en: "fast", es: "rápido" },
  { en: "slow", es: "lento" },
  { en: "hot", es: "caliente" },
  { en: "cold", es: "frío" },
  { en: "new", es: "nuevo" },
  { en: "old", es: "viejo/antiguo" },
  { en: "young", es: "joven" },
  { en: "good", es: "bueno" },
  { en: "bad", es: "malo" },
  { en: "great", es: "genial" },
  { en: "beautiful", es: "hermoso" },
  { en: "ugly", es: "feo" },
  { en: "easy", es: "fácil" },
  { en: "difficult", es: "difícil" },
  { en: "hard", es: "duro" },
  { en: "soft", es: "suave" },
  { en: "long", es: "largo" },
  { en: "short", es: "corto/bajo" },
  { en: "tall", es: "alto" },
  { en: "wide", es: "ancho" },
  { en: "narrow", es: "angosto" },
  { en: "heavy", es: "pesado" },
  { en: "light", es: "ligero" },
  { en: "dark", es: "oscuro" },
  { en: "bright", es: "brillante" },
  { en: "clean", es: "limpio" },
  { en: "dirty", es: "sucio" },
  { en: "dry", es: "seco" },
  { en: "wet", es: "mojado" },
  { en: "full", es: "lleno" },
  { en: "empty", es: "vacío" },
  { en: "rich", es: "rico" },
  { en: "poor", es: "pobre" },
  { en: "strong", es: "fuerte" },
  { en: "weak", es: "débil" },
  { en: "safe", es: "seguro" },
  { en: "dangerous", es: "peligroso" },
  { en: "important", es: "importante" },
  { en: "interesting", es: "interesante" },
  { en: "boring", es: "aburrido" },
  { en: "funny", es: "divertido/gracioso" },
  { en: "serious", es: "serio" },
  { en: "quiet", es: "tranquilo/silencioso" },
  { en: "loud", es: "ruidoso" },
  { en: "angry", es: "enojado" },
  { en: "scared", es: "asustado" },
  { en: "brave", es: "valiente" },
  { en: "lazy", es: "perezoso" },
  { en: "smart", es: "inteligente" },
  { en: "stupid", es: "estúpido" },
  { en: "right", es: "correcto" },
  { en: "wrong", es: "equivocado" },
  { en: "same", es: "igual" },
  { en: "different", es: "diferente" },
  { en: "simple", es: "simple" },
  { en: "complex", es: "complejo" },
  { en: "free", es: "libre" },
  { en: "busy", es: "ocupado" },
  { en: "ready", es: "listo" },
  { en: "tired", es: "cansado" },
  { en: "hungry", es: "hambriento" },
  { en: "thirsty", es: "sediento" },
  { en: "sick", es: "enfermo" },
  { en: "healthy", es: "saludable" },
  { en: "sick", es: "enfermo" },
  { en: "cheap", es: "barato" },
  { en: "expensive", es: "caro" },
  { en: "fast", es: "rápido" },
  { en: "slow", es: "lento" },
  { en: "early", es: "temprano" },
  { en: "late", es: "tarde" },
  { en: "near", es: "cerca" },
  { en: "far", es: "lejos" },
  { en: "deep", es: "profundo" },
  { en: "high", es: "alto" },
  { en: "low", es: "bajo" },
  { en: "thick", es: "grueso" },
  { en: "thin", es: "delgado" },
  { en: "flat", es: "plano" },
  { en: "round", es: "redondo" },
  { en: "sharp", es: "afilado" },
  { en: "smooth", es: "suave/liso" },
  { en: "rough", es: "áspero" },
  { en: "soft", es: "blando" },
  { en: "loud", es: "fuerte" },
  { en: "quiet", es: "tranquilo" },
  { en: "fresh", es: "fresco" },
  { en: "stale", es: "rancio" },
  { en: "sweet", es: "dulce" },
  { en: "sour", es: "agrio" },
  { en: "bitter", es: "amargo" },
  { en: "spicy", es: "picante" },
  { en: "tasty", es: "sabroso" },
  { en: "delicious", es: "delicioso" },
  { en: "popular", es: "popular" },
  { en: "famous", es: "famoso" },
  { en: "new", es: "nuevo" },
  { en: "modern", es: "moderno" },
  { en: "ancient", es: "antiguo" },
  { en: "foreign", es: "extranjero" },
  { en: "local", es: "local" },
  { en: "national", es: "nacional" },
  { en: "international", es: "internacional" },
  { en: "public", es: "público" },
  { en: "private", es: "privado" },
  { en: "legal", es: "legal" },
  { en: "normal", es: "normal" },
  { en: "special", es: "especial" },
  { en: "general", es: "general" },
  { en: "specific", es: "específico" },
  { en: "basic", es: "básico" },
  { en: "extra", es: "extra" },
  { en: "main", es: "principal" },
  { en: "final", es: "final" },
  { en: "original", es: "original" },
  { en: "actual", es: "actual" },
  { en: "real", es: "real" },
  { en: "true", es: "verdadero" },
  { en: "false", es: "falso" },
  { en: "certain", es: "cierto" },
  { en: "possible", es: "posible" },
  { en: "impossible", es: "imposible" },
  { en: "necessary", es: "necesario" },
  { en: "available", es: "disponible" },
  { en: "visible", es: "visible" },
  { en: "comfortable", es: "cómodo" },
  { en: "uncomfortable", es: "incómodo" },
  { en: "convenient", es: "conveniente" },
  { en: "unusual", es: "inusual" },
  { en: "typical", es: "típico" },
  { en: "obvious", es: "obvio" },
  { en: "necessary", es: "necesario" },
  { en: "perfect", es: "perfecto" },
  { en: "complete", es: "completo" },
  { en: "whole", es: "entero" },
  { en: "total", es: "total" },
  { en: "certain", es: "cierto" },
  { en: "various", es: "varios" },
  { en: "several", es: "varios" },
  { en: "few", es: "pocos" },
  { en: "many", es: "muchos" },
  { en: "much", es: "mucho" },
  { en: "little", es: "poco" },
  { en: "enough", es: "suficiente" },
  { en: "more", es: "más" },
  { en: "less", es: "menos" },
  { en: "other", es: "otro" },
  { en: "another", es: "otro" },
  { en: "next", es: "siguiente" },
  { en: "previous", es: "anterior" },
  { en: "first", es: "primero" },
  { en: "last", es: "último" },
  { en: "second", es: "segundo" },
  { en: "third", es: "tercero" },
  { en: "half", es: "medio" },
  { en: "double", es: "doble" },
  { en: "single", es: "único" },
  { en: "separate", es: "separado" },
  { en: "alone", es: "solo" },
  { en: "together", es: "juntos" },
  { en: "apart", es: "aparte" },
  { en: "straight", es: "recto" },
  { en: "certain", es: "cierto" },
  { en: "sure", es: "seguro" },
  { en: "glad", es: "contento" },
  { en: "sorry", es: "arrepentido" },
  { en: "proud", es: "orgulloso" },
  { en: "shy", es: "tímido" },
  { en: "jealous", es: "celoso" },
  { en: "generous", es: "generoso" },
  { en: "kind", es: "amable" },
  { en: "cruel", es: "cruel" },
  { en: "honest", es: "honesto" },
  { en: "loyal", es: "leal" },
  { en: "patient", es: "paciente" },
  { en: "polite", es: "educado" },
  { en: "rude", es: "grosero" },
  { en: "friendly", es: "amigable" },
  { en: "helpful", es: "útil" },
  { en: "useful", es: "útil" },
  { en: "beautiful", es: "hermoso" },
  { en: "pretty", es: "bonito" },
  { en: "cute", es: "lindo" },
  { en: "lovely", es: "encantador" },
  { en: "amazing", es: "increíble" },
  { en: "wonderful", es: "maravilloso" },
  { en: "terrible", es: "terrible" },
  { en: "horrible", es: "horrible" },
  { en: "awful", es: "horrible" },
  { en: "fantastic", es: "fantástico" },
  { en: "excellent", es: "excelente" },
  { en: "superb", es: "excelente" },
  { en: "okay", es: "bien" },
  { en: "fine", es: "bien" },
  { en: "alright", es: "bien" }
];

// Adverbs (50+ words)
export const adverbs = [
  { en: "quickly", es: "rápidamente" },
  { en: "slowly", es: "lentamente" },
  { en: "always", es: "siempre" },
  { en: "never", es: "nunca" },
  { en: "sometimes", es: "a veces" },
  { en: "often", es: "a menudo" },
  { en: "usually", es: "usualmente" },
  { en: "rarely", es: "raramente" },
  { en: "already", es: "ya" },
  { en: "still", es: "todavía" },
  { en: "yet", es: "todavía/aún" },
  { en: "just", es: "solo/justo" },
  { en: "only", es: "solo" },
  { en: "also", es: "también" },
  { en: "too", es: "demasiado/también" },
  { en: "very", es: "muy" },
  { en: "really", es: "realmente" },
  { en: "actually", es: "realmente" },
  { en: "certainly", es: "ciertamente" },
  { en: "probably", es: "probablemente" },
  { en: "definitely", es: "definitivamente" },
  { en: "absolutely", es: "absolutamente" },
  { en: "completely", es: "completamente" },
  { en: "totally", es: "totalmente" },
  { en: "entirely", es: "enteramente" },
  { en: "nearly", es: "casi" },
  { en: "hardly", es: "apenas" },
  { en: "barely", es: "apenas" },
  { en: "almost", es: "casi" },
  { en: "exactly", es: "exactamente" },
  { en: "especially", es: "especialmente" },
  { en: "particularly", es: "particularmente" },
  { en: "simply", es: "simplemente" },
  { en: "merely", es: "simplemente" },
  { en: "clearly", es: "claramente" },
  { en: "obviously", es: "obviamente" },
  { en: "seriously", es: "seriamente" },
  { en: "honestly", es: "honestamente" },
  { en: "directly", es: "directamente" },
  { en: "immediately", es: "inmediatamente" },
  { en: "suddenly", es: "de repente" },
  { en: "finally", es: "finalmente" },
  { en: "recently", es: "recientemente" },
  { en: "lately", es: "últimamente" },
  { en: "today", es: "hoy" },
  { en: "tomorrow", es: "mañana" },
  { en: "yesterday", es: "ayer" },
  { en: "now", es: "ahora" },
  { en: "then", es: "entonces" },
  { en: "soon", es: "pronto" },
  { en: "here", es: "aquí" },
  { en: "there", es: "allí" },
  { en: "everywhere", es: "en todas partes" },
  { en: "nowhere", es: "en ningún lugar" },
  { en: "somewhere", es: "en algún lugar" },
  { en: "together", es: "juntos" },
  { en: "apart", es: "separados" },
  { en: "alone", es: "solo" },
  { en: "ahead", es: "adelante" },
  { en: "away", es: "lejos" },
  { en: "back", es: "atrás" },
  { en: "forward", es: "adelante" },
  { en: "up", es: "arriba" },
  { en: "down", es: "abajo" },
  { en: "inside", es: "dentro" },
  { en: "outside", es: "fuera" },
  { en: "above", es: "arriba" },
  { en: "below", es: "abajo" },
  { en: "nearby", es: "cerca" },
  { en: "faraway", es: "lejos" },
  { en: "today", es: "hoy" },
  { en: "tonight", es: "esta noche" },
  { en: "this morning", es: "esta mañana" },
  { en: "this afternoon", es: "esta tarde" },
  { en: "this week", es: "esta semana" },
  { en: "this month", es: "este mes" },
  { en: "this year", es: "este año" },
  { en: "next week", es: "la próxima semana" },
  { en: "next month", es: "el próximo mes" },
  { en: "next year", es: "el próximo año" },
  { en: "last week", es: "la semana pasada" },
  { en: "last month", es: "el mes pasado" },
  { en: "last year", es: "el año pasado" },
  { en: "twice", es: "dos veces" },
  { en: "three times", es: "tres veces" },
  { en: "once", es: "una vez" },
  { en: "ago", es: "hace" },
  { en: "forever", es: "para siempre" },
  { en: "constantly", es: "constantemente" },
  { en: "continually", es: "continuamente" },
  { en: "frequently", es: "frecuentemente" },
  { en: "occasionally", es: "ocasionalmente" },
  { en: "accidentally", es: "accidentalmente" },
  { en: "carefully", es: "cuidadosamente" },
  { en: "easily", es: "fácilmente" },
  { en: "naturally", es: "naturalmente" },
  { en: "normally", es: "normalmente" },
  { en: "officially", es: "oficialmente" },
  { en: "perfectly", es: "perfectamente" },
  { en: "quietly", es: "tranquilamente" },
  { en: "rapidly", es: "rápidamente" },
  { en: "safely", es: "seguramente" },
  { en: "seriously", es: "seriamente" },
  { en: "strongly", es: "fuertemente" },
  { en: "suddenly", es: "de repente" },
  { en: "truly", es: "verdaderamente" },
  { en: "usually", es: "normalmente" },
  { en: "warmly", es: "cálidamente" },
  { en: "widely", es: "ampliamente" },
  { en: "willingly", es: "voluntariamente" }
];

// Prepositions (30+ words)
export const prepositions = [
  { en: "in", es: "en" },
  { en: "on", es: "sobre" },
  { en: "at", es: "en" },
  { en: "to", es: "a" },
  { en: "for", es: "para" },
  { en: "with", es: "con" },
  { en: "from", es: "de/desde" },
  { en: "by", es: "por" },
  { en: "about", es: "sobre" },
  { en: "into", es: "dentro de" },
  { en: "through", es: "a través de" },
  { en: "during", es: "durante" },
  { en: "before", es: "antes de" },
  { en: "after", es: "después de" },
  { en: "above", es: "encima de" },
  { en: "below", es: "debajo de" },
  { en: "under", es: "debajo de" },
  { en: "over", es: "sobre" },
  { en: "between", es: "entre" },
  { en: "among", es: "entre" },
  { en: "against", es: "contra" },
  { en: "without", es: "sin" },
  { en: "within", es: "dentro de" },
  { en: "along", es: "a lo largo de" },
  { en: "across", es: "a través de" },
  { en: "behind", es: "detrás de" },
  { en: "beyond", es: "más allá de" },
  { en: "near", es: "cerca de" },
  { en: "beside", es: "junto a" },
  { en: "around", es: "alrededor de" },
  { en: "throughout", es: "a lo largo de" },
  { en: "toward", es: "hacia" },
  { en: "towards", es: "hacia" },
  { en: "until", es: "hasta" },
  { en: "up to", es: "hasta" },
  { en: "per", es: "por" },
  { en: "via", es: "vía/por medio de" },
  { en: "despite", es: "a pesar de" },
  { en: "except", es: "excepto" },
  { en: "including", es: "incluyendo" },
  { en: "concerning", es: "respecto a" },
  { en: "regarding", es: "respecto a" },
  { en: "according to", es: "según" },
  { en: "because of", es: "debido a" },
  { en: "instead of", es: "en lugar de" },
  { en: "out of", es: "fuera de" },
  { en: "on top of", es: "encima de" },
  { en: "in front of", es: "enfrente de" },
  { en: "next to", es: "junto a" },
  { en: "as well as", es: "así como" }
];

// Expanded verbs with full conjugation forms
export const expandedVerbs = {
  want: {
    es: "querer",
    present: ["quiero", "quieres", "quiere", "queremos", "quieren"],
    past: ["quería", "querías", "quería", "queríamos", "querían"],
    future: ["querré", "querrás", "querrá", "querremos", "querrán"]
  },
  have: {
    es: "tener",
    present: ["tengo", "tienes", "tiene", "tenemos", "tienen"],
    past: ["tenía", "tenías", "tenía", "teníamos", "tenían"],
    future: ["tendré", "tendrás", "tendrá", "tendremos", "tendrán"]
  },
  be: {
    es: "ser/estar",
    present: ["soy/estoy", "eres/estás", "es/está", "somos/estamos", "son/están"],
    past: ["era/estaba", "eras/estabas", "era/estaba", "éramos/estábamos", "eran/estaban"],
    future: ["seré/estaré", "serás/estarás", "será/estará", "seremos/estaremos", "serán/estarán"]
  },
  do: {
    es: "hacer",
    present: ["hago", "haces", "hace", "hacemos", "hacen"],
    past: ["hacía", "hacías", "hacía", "hacíamos", "hacían"],
    future: ["haré", "harás", "hará", "haremos", "harán"]
  },
  go: {
    es: "ir",
    present: ["voy", "vas", "va", "vamos", "van"],
    past: ["iba", "ibas", "iba", "íbamos", "iban"],
    future: ["iré", "irás", "irá", "iremos", "irán"]
  },
  say: {
    es: "decir",
    present: ["digo", "dices", "dice", "decimos", "dicen"],
    past: ["decía", "decías", "decía", "decíamos", "decían"],
    future: ["diré", "dirás", "dirá", "diremos", "dirán"]
  },
  get: {
    es: "obtener",
    present: ["obtengo", "obtienes", "obtiene", "obtenemos", "obtienen"],
    past: ["obtenía", "obtenías", "obtenía", "obteníamos", "obtenían"],
    future: ["obtendré", "obtendrás", "obtendrá", "obtendremos", "obtendrán"]
  },
  make: {
    es: "hacer",
    present: ["hago", "haces", "hace", "hacemos", "hacen"],
    past: ["hice", "hiciste", "hizo", "hicimos", "hicieron"],
    future: ["haré", "harás", "hará", "haremos", "harán"]
  },
  know: {
    es: "saber",
    present: ["sé", "sabes", "sabe", "sabemos", "saben"],
    past: ["sabía", "sabías", "sabía", "sabíamos", "sabían"],
    future: ["sabré", "sabrás", "sabrá", "sabremos", "sabrán"]
  },
  think: {
    es: "pensar",
    present: ["pienso", "piensas", "piensa", "pensamos", "piensan"],
    past: ["pensaba", "pensabas", "pensaba", "pensábamos", "pensaban"],
    future: ["pensaré", "pensarás", "pensará", "pensaremos", "pensarán"]
  },
  take: {
    es: "tomar",
    present: ["tomo", "tomas", "toma", "tomamos", "toman"],
    past: ["tomaba", "tomabas", "tomaba", "tomábamos", "tomaban"],
    future: ["tomaré", "tomarás", "tomará", "tomaremos", "tomarán"]
  },
  see: {
    es: "ver",
    present: ["veo", "ves", "ve", "vemos", "ven"],
    past: ["veía", "veías", "veía", "veíamos", "veían"],
    future: ["veré", "verás", "verá", "veremos", "verán"]
  },
  come: {
    es: "venir",
    present: ["vengo", "vienes", "viene", "venimos", "vienen"],
    past: ["venía", "venías", "venía", "veníamos", "venían"],
    future: ["vendré", "vendrás", "vendrá", "vendremos", "vendrán"]
  },
  eat: {
    es: "comer",
    present: ["como", "comes", "come", "comemos", "comen"],
    past: ["comía", "comías", "comía", "comíamos", "comían"],
    future: ["comeré", "comerás", "comerá", "comeremos", "comerán"]
  },
  drink: {
    es: "beber",
    present: ["bebo", "bebes", "bebe", "bebemos", "beben"],
    past: ["bebía", "bebías", "bebía", "bebíamos", "bebían"],
    future: ["beberé", "beberás", "beberá", "beberemos", "beberán"]
  },
  write: {
    es: "escribir",
    present: ["escribo", "escribes", "escribe", "escribimos", "escriben"],
    past: ["escribía", "escribías", "escribía", "escribíamos", "escribían"],
    future: ["escribiré", "escribirás", "escribirá", "escribiremos", "escribirán"]
  },
  read: {
    es: "leer",
    present: ["leo", "lees", "leemos", "leen"],
    past: ["leía", "leías", "leía", "leíamos", "leían"],
    future: ["leeré", "leerás", "leerá", "leeremos", "leerán"]
  },
  speak: {
    es: "hablar",
    present: ["hablo", "hablas", "habla", "hablamos", "hablan"],
    past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"],
    future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"]
  },
  walk: {
    es: "caminar",
    present: ["camino", "caminas", "camina", "caminamos", "caminan"],
    past: ["caminaba", "caminabas", "caminaba", "caminábamos", "caminaban"],
    future: ["caminaré", "caminarás", "caminará", "caminaremos", "caminarán"]
  },
  run: {
    es: "correr",
    present: ["corro", "corres", "corre", "corremos", "corren"],
    past: ["corría", "corrías", "corría", "corríamos", "corrían"],
    future: ["correré", "correrás", "correrá", "correremos", "correrán"]
  },
  play: {
    es: "jugar",
    present: ["juego", "juegas", "juega", "jugamos", "juegan"],
    past: ["jugaba", "jugabas", "jugaba", "jugábamos", "jugaban"],
    future: ["jugaré", "jugarás", "jugará", "jugaremos", "jugarán"]
  },
  work: {
    es: "trabajar",
    present: ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajan"],
    past: ["trabajaba", "trabajabas", "trabajaba", "trabajábamos", "trabajaban"],
    future: ["trabajaré", "trabajarás", "trabajará", "trabajaremos", "trabajarán"]
  },
  live: {
    es: "vivir",
    present: ["vivo", "vives", "vive", "vivimos", "viven"],
    past: ["vivía", "vivías", "vivía", "vivíamos", "vivían"],
    future: ["viviré", "vivirás", "vivirá", "viviremos", "vivirán"]
  },
  like: {
    es: "gustar",
    present: ["gusta", "gustas", "gusta", "gustamos", "gustan"],
    past: ["gustaba", "gustabas", "gustaba", "gustábamos", "gustaban"],
    future: ["gustará", "gustarás", "gustará", "gustaremos", "gustarán"]
  },
  love: {
    es: "amar",
    present: ["amo", "amas", "ama", "amamos", "aman"],
    past: ["amaba", "amabas", "amaba", "amábamos", "amaban"],
    future: ["amaré", "amarás", "amará", "amaremos", "amarán"]
  },
  need: {
    es: "necesitar",
    present: ["necesito", "necesitas", "necesita", "necesitamos", "necesitan"],
    past: ["necesitaba", "necesitabas", "necesitaba", "necesitábamos", "necesitaban"],
    future: ["necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitarán"]
  },
  can: {
    es: "poder",
    present: ["puedo", "puedes", "puede", "podemos", "pueden"],
    past: ["podía", "podías", "podía", "podíamos", "podían"],
    future: ["podré", "podrás", "podrá", "podremos", "podrán"]
  },
  must: {
    es: "deber",
    present: ["debo", "debes", "debe", "debemos", "deben"],
    past: ["debía", "debías", "debía", "debíamos", "debían"],
    future: ["deberé", "deberás", "deberá", "debemos", "deberán"]
  },
  start: {
    es: "empezar/comenzar",
    present: ["empiezo", "empiezas", "empieza", "empezamos", "empiezan"],
    past: ["empezaba", "empezabas", "empezaba", "empezábamos", "empezaban"],
    future: ["empezaré", "empezarás", "empezará", "empezaremos", "empezarán"]
  },
  stop: {
    es: "parar/detener",
    present: ["paro", "paras", "para", "paramos", "paran"],
    past: ["paraba", "parabas", "paraba", "parábamos", "paraban"],
    future: ["pararé", "pararás", "parará", "pararemos", "pararán"]
  },
  open: {
    es: "abrir",
    present: ["abro", "abres", "abre", "abrimos", "abren"],
    past: ["abría", "abrías", "abría", "abríamos", "abrían"],
    future: ["abriré", "abrirás", "abrirá", "abriremos", "abrirán"]
  },
  close: {
    es: "cerrar",
    present: ["cierro", "cierras", "cierra", "cerramos", "cierran"],
    past: ["cerraba", "cerrabas", "cerraba", "cerrábamos", "cerraban"],
    future: ["cerraré", "cerrarás", "cerrará", "cerraremos", "cerrarán"]
  },
  give: {
    es: "dar",
    present: ["doy", "das", "da", "damos", "dan"],
    past: ["daba", "dabas", "daba", "dábamos", "daban"],
    future: ["daré", "darás", "dará", "daremos", "darán"]
  },
  tell: {
    es: "decir",
    present: ["digo", "dices", "dice", "decimos", "dicen"],
    past: ["decía", "decías", "decía", "decíamos", "decían"],
    future: ["diré", "dirás", "dirá", "diremos", "dirán"]
  },
  ask: {
    es: "preguntar",
    present: ["pregunto", "preguntas", "pregunta", "preguntamos", "preguntan"],
    past: ["preguntaba", "preguntabas", "preguntaba", "preguntábamos", "preguntaban"],
    future: ["preguntaré", "preguntarás", "preguntará", "preguntaremos", "preguntarán"]
  },
  help: {
    es: "ayudar",
    present: ["ayudo", "ayudas", "ayuda", "ayudamos", "ayudan"],
    past: ["ayudaba", "ayudabas", "ayudaba", "ayudábamos", "ayudaban"],
    future: ["ayudaré", "ayudarás", "ayudará", "ayudaremos", "ayudarán"]
  },
  move: {
    es: "mover",
    present: ["muevo", "mueves", "mueve", "movemos", "mueven"],
    past: ["movía", "movías", "movía", "movíamos", "movían"],
    future: ["moveré", "moverás", "moverá", "moveremos", "moverán"]
  },
  believe: {
    es: "creer",
    present: ["creo", "crees", "cree", "creemos", "creen"],
    past: ["creía", "creías", "creía", "creíamos", "creían"],
    future: ["creeré", "creerás", "creerá", "creeremos", "creerán"]
  },
  feel: {
    es: "sentir",
    present: ["siento", "sientes", "siente", "sentimos", "sienten"],
    past: ["sentía", "sentías", "sentía", "sentíamos", "sentían"],
    future: ["sentiré", "sentirás", "sentirá", "sentiremos", "sentirán"]
  },
  bring: {
    es: "traer",
    present: ["traigo", "traes", "trae", "traemos", "traen"],
    past: ["traía", "traías", "traía", "traíamos", "traían"],
    future: ["traeré", "traerás", "traerá", "traeremos", "traerán"]
  },
  happen: {
    es: "ocurrir",
    present: ["ocurre", "ocurres", "ocurre", "ocurrimos", "ocurren"],
    past: ["ocurría", "ocurrías", "ocurría", "ocurríamos", "ocurrían"],
    future: ["ocurriré", "ocurrirás", "ocurrirá", "ocurriremos", "ocurrirán"]
  },
  include: {
    es: "incluir",
    present: ["incluyo", "incluyes", "incluye", "incluimos", "incluyen"],
    past: ["incluía", "incluías", "incluía", "incluíamos", "incluían"],
    future: ["incluiré", "incluirás", "incluirá", "incluiremos", "incluirán"]
  },
  continue: {
    es: "continuar",
    present: ["continúo", "continúas", "continúa", "continuamos", "continúan"],
    past: ["continuaba", "continuabas", "continuaba", "continuábamos", "continuaban"],
    future: ["continuaré", "continuarás", "continuará", "continuaremos", "continuarán"]
  },
  set: {
    es: "establecer",
    present: ["establezco", "estableces", "establece", "establecemos", "establecen"],
    past: ["establecía", "establecías", "establecía", "establecíamos", "establecían"],
    future: ["estableceré", "establecerás", "establecerá", "estableceremos", "establecerán"]
  },
  learn: {
    es: "aprender",
    present: ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"],
    past: ["aprendía", "aprendías", "aprendía", "aprendíamos", "aprendían"],
    future: ["aprenderé", "aprenderás", "aprenderá", "aprenderemos", "aprenderán"]
  },
  change: {
    es: "cambiar",
    present: ["cambio", "cambias", "cambia", "cambiamos", "cambian"],
    past: ["cambiaba", "cambiabas", "cambiaba", "cambiábamos", "cambiaban"],
    future: ["cambiaré", "cambiarás", "cambiará", "cambiaremos", "cambiarán"]
  },
  lead: {
    es: "liderar/llevar",
    present: ["lidero", "lideras", "lidera", "lideramos", "lideran"],
    past: ["lideraba", "liderabas", "lideraba", "liderábamos", "lideraban"],
    future: ["lideraré", "liderarás", "liderará", "lideraremos", "liderarán"]
  },
  understand: {
    es: "entender",
    present: ["entiendo", "entiendes", "entiende", "entendemos", "entienden"],
    past: ["entendía", "entendías", "entendía", "entendíamos", "entendían"],
    future: ["entenderé", "entenderás", "entenderá", "entenderemos", "entenderán"]
  },
  watch: {
    es: "mirar",
    present: ["miro", "miras", "mira", "miramos", "miran"],
    past: ["miraba", "mirabas", "miraba", "mirábamos", "miraban"],
    future: ["miraré", "mirarás", "mirará", "miraremos", "mirarán"]
  },
  follow: {
    es: "seguir",
    present: ["sigo", "sigues", "sigue", "seguimos", "siguen"],
    past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"],
    future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"]
  },
  create: {
    es: "crear",
    present: ["creo", "creas", "crea", "creamos", "crean"],
    past: ["creaba", "creabas", "creaba", "creábamos", "creaban"],
    future: ["crearé", "crearás", "creará", "crearemos", "crearán"]
  },
  spend: {
    es: "gastar",
    present: ["gasto", "gastas", "gasta", "gastamos", "gastan"],
    past: ["gastaba", "gastabas", "gastaba", "gastábamos", "gastaban"],
    future: ["gastaré", "gastarás", "gastará", "gastaremos", "gastarán"]
  },
  win: {
    es: "ganar",
    present: ["gano", "ganas", "gana", "ganamos", "ganan"],
    past: ["ganaba", "ganabas", "ganaba", "ganábamos", "ganaban"],
    future: ["ganaré", "ganarás", "ganará", "ganaremos", "ganarán"]
  },
  lose: {
    es: "perder",
    present: ["pierdo", "pierdes", "pierde", "perdemos", "pierden"],
    past: ["perdía", "perdías", "perdía", "perdíamos", "perdían"],
    future: ["perderé", "perderás", "perderá", "perderemos", "perderán"]
  },
  pay: {
    es: "pagar",
    present: ["pago", "pagas", "paga", "pagamos", "pagan"],
    past: ["pagaba", "pagabas", "pagaba", "pagábamos", "pagaban"],
    future: ["pagaré", "pagarás", "pagará", "pagaremos", "pagarán"]
  },
  meet: {
    es: "conocer/reunir",
    present: ["conozco", "conoces", "conoce", "conocemos", "conocen"],
    past: ["conocía", "conocías", "conocía", "conocíamos", "conocían"],
    future: ["conoceré", "conocerás", "conocerá", "conoceremos", "conocerán"]
  },
  return: {
    es: "regresar/volver",
    present: ["regreso", "regresas", "regresa", "regresamos", "regresan"],
    past: ["regresaba", "regresabas", "regresaba", "regresábamos", "regresaban"],
    future: ["regresaré", "regresarás", "regresará", "regresaremos", "regresarán"]
  },
  put: {
    es: "poner",
    present: ["pongo", "pones", "pone", "ponemos", "ponen"],
    past: ["ponía", "ponías", "ponía", "poníamos", "ponían"],
    future: ["pondré", "pondrás", "pondrá", "pondremos", "pondrán"]
  },
  try: {
    es: "intentar",
    present: ["intento", "intentas", "intenta", "intentamos", "intentan"],
    past: ["intentaba", "intentabas", "intentaba", "intentábamos", "intentaban"],
    future: ["intentaré", "intentarás", "intentará", "intentaremos", "intentarán"]
  },
  use: {
    es: "usar",
    present: ["uso", "usas", "usa", "usamos", "usan"],
    past: ["usaba", "usabas", "usaba", "usábamos", "usaban"],
    future: ["usaré", "usarás", "usará", "usaremos", "usarán"]
  },
  find: {
    es: "encontrar",
    present: ["encuentro", "encuentras", "encuentra", "encontramos", "encuentran"],
    past: ["encontraba", "encontrabas", "encontraba", "encontrábamos", "encontraban"],
    future: ["encontraré", "encontrarás", "encontrará", "encontraremos", "encontrarán"]
  },
  hold: {
    es: "sostener",
    present: ["sostengo", "sostienes", "sostiene", "sostenemos", "sostienen"],
    past: ["sostenía", "sostenías", "sostenía", "sosteníamos", "sostenían"],
    future: ["sostendré", "sostendrás", "sostendrá", "sostendremos", "sostendrán"]
  },
  keep: {
    es: "mantener",
    present: ["mantengo", "mantienes", "mantiene", "mantenemos", "mantienen"],
    past: ["mantenía", "mantenías", "mantenía", "manteníamos", "mantenían"],
    future: ["mantendré", "mantendrás", "mantendrá", "mantendremos", "mantendrán"]
  },
  let: {
    es: "dejar",
    present: ["dejo", "dejas", "deja", "dejamos", "dejan"],
    past: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejaban"],
    future: ["dejaré", "dejarás", "dejará", "dejaremos", "dejarán"]
  },
  begin: {
    es: "empezar",
    present: ["empiezo", "empiezas", "empieza", "empezamos", "empiezan"],
    past: ["empezaba", "empezabas", "empezaba", "empezábamos", "empezaban"],
    future: ["empezaré", "empezarás", "empezará", "empezaremos", "empezarán"]
  },
  seem: {
    es: "parecer",
    present: ["parezco", "pareces", "parece", "parecemos", "parecen"],
    past: ["parecía", "parecías", "parecía", "parecíamos", "parecían"],
    future: ["pareceré", "parecerás", "parecerá", "pareceremos", "parecerán"]
  },
  turn: {
    es: "girar/turnar",
    present: ["giro", "giras", "gira", "giramos", "giran"],
    past: ["giraba", "girabas", "giraba", "girábamos", "giraban"],
    future: ["giraré", "girarás", "girá", "giraremos", "girarán"]
  },
  move: {
    es: "mover",
    present: ["muevo", "mueves", "mueve", "movemos", "mueven"],
    past: ["movía", "movías", "movía", "movíamos", "movían"],
    future: ["moveré", "moverás", "moverá", "moveremos", "moverán"]
  },
  call: {
    es: "llamar",
    present: ["llamo", "llamas", "llama", "llamamos", "llaman"],
    past: ["llamaba", "llamabas", "llamaba", "llamábamos", "llamaban"],
    future: ["llamaré", "llamarás", "llamará", "llamaremos", "llamarán"]
  },
  try: {
    es: "intentar",
    present: ["intento", "intentas", "intenta", "intentamos", "intentan"],
    past: ["intentaba", "intentabas", "intentaba", "intentábamos", "intentaban"],
    future: ["intentaré", "intentarás", "intentará", "intentaremos", "intentarán"]
  },
  ask: {
    es: "preguntar",
    present: ["pregunto", "preguntas", "pregunta", "preguntamos", "preguntan"],
    past: ["preguntaba", "preguntabas", "preguntaba", "preguntábamos", "preguntaban"],
    future: ["preguntaré", "preguntarás", "preguntará", "preguntaremos", "preguntarán"]
  },
  need: {
    es: "necesitar",
    present: ["necesito", "necesitas", "necesita", "necesitamos", "necesitan"],
    past: ["necesitaba", "necesitabas", "necesitaba", "necesitábamos", "necesitaban"],
    future: ["necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitarán"]
  },
  feel: {
    es: "sentir",
    present: ["siento", "sientes", "siente", "sentimos", "sienten"],
    past: ["sentía", "sentías", "sentía", "sentíamos", "sentían"],
    future: ["sentiré", "sentirás", "sentirá", "sentiremos", "sentirán"]
  },
  become: {
    es: "convertirse",
    present: ["me convierto", "te conviertes", "se convierte", "nos convertimos", "se convierten"],
    past: ["me convertía", "te convertías", "se convertía", "nos convertíamos", "se convertían"],
    future: ["me convertiré", "te convertirás", "se convertirá", "nos convertiremos", "se convertirán"]
  },
  leave: {
    es: "dejar/salir",
    present: ["dejo", "dejas", "deja", "dejamos", "dejan"],
    past: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejaban"],
    future: ["dejaré", "dejarás", "dejará", "dejaremos", "dejarán"]
  },
  call: {
    es: "llamar",
    present: ["llamo", "llamas", "llama", "llamamos", "llaman"],
    past: ["llamaba", "llamabas", "llamaba", "llamábamos", "llamaban"],
    future: ["llamaré", "llamarás", "llamará", "llamaremos", "llamarán"]
  },
  put: {
    es: "poner",
    present: ["pongo", "pones", "pone", "ponemos", "ponen"],
    past: ["ponía", "ponías", "ponía", "poníamos", "ponían"],
    future: ["pondré", "pondrás", "pondrá", "pondremos", "pondrán"]
  },
  mean: {
    es: "significar",
    present: ["significo", "significas", "significa", "significamos", "significan"],
    past: ["significaba", "significabas", "significaba", "significábamos", "significaban"],
    future: ["significaré", "significarás", "significará", "significaremos", "significarán"]
  },
  keep: {
    es: "mantener",
    present: ["mantengo", "mantienes", "mantiene", "mantenemos", "mantienen"],
    past: ["mantenía", "mantenías", "mantenía", "manteníamos", "mantenían"],
    future: ["mantendré", "mantendrás", "mantendrá", "mantendremos", "mantendrán"]
  },
  let: {
    es: "dejar",
    present: ["dejo", "dejas", "deja", "dejamos", "dejan"],
    past: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejaban"],
    future: ["dejaré", "dejarás", "dejará", "dejaremos", "dejarán"]
  },
  seem: {
    es: "parecer",
    present: ["parezco", "pareces", "parece", "parecemos", "parecen"],
    past: ["parecía", "parecías", "parecía", "parecíamos", "parecían"],
    future: ["pareceré", "parecerás", "parecerá", "pareceremos", "parecerán"]
  },
  help: {
    es: "ayudar",
    present: ["ayudo", "ayudas", "ayuda", "ayudamos", "ayudan"],
    past: ["ayudaba", "ayudabas", "ayudaba", "ayudábamos", "ayudaban"],
    future: ["ayudaré", "ayudarás", "ayudará", "ayudaremos", "ayudarán"]
  },
  show: {
    es: "mostrar",
    present: ["muestro", "muestras", "muestra", "mostramos", "muestran"],
    past: ["mostraba", "mostrabas", "mostraba", "mostrábamos", "mostraban"],
    future: ["mostraré", "mostrarás", "mostrará", "mostraremos", "mostrarán"]
  },
  hear: {
    es: "oír",
    present: ["oigo", "oyes", "oye", "oímos", "oyen"],
    past: ["oía", "oías", "oía", "oíamos", "oían"],
    future: ["oíré", "oírás", "oírá", "oíremos", "oírán"]
  },
  play: {
    es: "jugar",
    present: ["juego", "juegas", "juega", "jugamos", "juegan"],
    past: ["jugaba", "jugabas", "jugaba", "jugábamos", "jugaban"],
    future: ["jugaré", "jugarás", "jugará", "jugaremos", "jugarán"]
  },
  run: {
    es: "correr",
    present: ["corro", "corres", "corre", "corremos", "corren"],
    past: ["corría", "corrías", "corría", "corríamos", "corrían"],
    future: ["correré", "correrás", "correrá", "correremos", "correrán"]
  },
  move: {
    es: "mover",
    present: ["muevo", "mueves", "mueve", "movemos", "mueven"],
    past: ["movía", "movías", "movía", "movíamos", "movían"],
    future: ["moveré", "moverás", "moverá", "moveremos", "moverán"]
  },
  live: {
    es: "vivir",
    present: ["vivo", "vives", "vive", "vivimos", "viven"],
    past: ["vivía", "vivías", "vivía", "vivíamos", "vivían"],
    future: ["viviré", "vivirás", "vivirá", "viviremos", "vivirán"]
  },
  believe: {
    es: "creer",
    present: ["creo", "crees", "cree", "creemos", "creen"],
    past: ["creía", "creías", "creía", "creíamos", "creían"],
    future: ["creeré", "creerás", "creerá", "creeremos", "creerán"]
  },
  bring: {
    es: "traer",
    present: ["traigo", "traes", "trae", "traemos", "traen"],
    past: ["traía", "traías", "traía", "traíamos", "traían"],
    future: ["traeré", "traerás", "traerá", "traeremos", "traerán"]
  },
  happen: {
    es: "ocurrir",
    present: ["ocurre", "ocurres", "ocurre", "ocurrimos", "ocurren"],
    past: ["ocurría", "ocurrías", "ocurría", "ocurríamos", "ocurrían"],
    future: ["ocurriré", "ocurrirás", "ocurrirá", "ocurriremos", "ocurrirán"]
  },
  include: {
    es: "incluir",
    present: ["incluyo", "incluyes", "incluye", "incluimos", "incluyen"],
    past: ["incluía", "incluías", "incluía", "incluíamos", "incluían"],
    future: ["incluiré", "incluirás", "incluirá", "incluiremos", "incluirán"]
  },
  continue: {
    es: "continuar",
    present: ["continúo", "continúas", "continúa", "continuamos", "continúan"],
    past: ["continuaba", "continuabas", "continuaba", "continuábamos", "continuaban"],
    future: ["continuaré", "continuarás", "continuará", "continuaremos", "continuarán"]
  },
  set: {
    es: "establecer",
    present: ["establezco", "estableces", "establece", "establecemos", "establecen"],
    past: ["establecía", "establecías", "establecía", "establecíamos", "establecían"],
    future: ["estableceré", "establecerás", "establecerá", "estableceremos", "establecerán"]
  },
  learn: {
    es: "aprender",
    present: ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"],
    past: ["aprendía", "aprendías", "aprendía", "aprendíamos", "aprendían"],
    future: ["aprenderé", "aprenderás", "aprenderá", "aprenderemos", "aprenderán"]
  },
  change: {
    es: "cambiar",
    present: ["cambio", "cambias", "cambia", "cambiamos", "cambian"],
    past: ["cambiaba", "cambiabas", "cambiaba", "cambiábamos", "cambiaban"],
    future: ["cambiaré", "cambiarás", "cambiará", "cambiaremos", "cambiarán"]
  },
  lead: {
    es: "liderar/llevar",
    present: ["lidero", "lideras", "lidera", "lideramos", "lideran"],
    past: ["lideraba", "liderabas", "lideraba", "liderábamos", "lideraban"],
    future: ["lideraré", "liderarás", "liderará", "lideraremos", "liderarán"]
  },
  understand: {
    es: "entender",
    present: ["entiendo", "entiendes", "entiende", "entendemos", "entienden"],
    past: ["entendía", "entendías", "entendía", "entendíamos", "entendían"],
    future: ["entenderé", "entenderás", "entenderá", "entenderemos", "entenderán"]
  },
  watch: {
    es: "mirar",
    present: ["miro", "miras", "mira", "miramos", "miran"],
    past: ["miraba", "mirabas", "miraba", "mirábamos", "miraban"],
    future: ["miraré", "mirarás", "mirará", "miraremos", "mirarán"]
  },
  follow: {
    es: "seguir",
    present: ["sigo", "sigues", "sigue", "seguimos", "siguen"],
    past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"],
    future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"]
  },
  create: {
    es: "crear",
    present: ["creo", "creas", "crea", "creamos", "crean"],
    past: ["creaba", "creabas", "creaba", "creábamos", "creaban"],
    future: ["crearé", "crearás", "creará", "crearemos", "crearán"]
  },
  spend: {
    es: "gastar",
    present: ["gasto", "gastas", "gasta", "gastamos", "gastan"],
    past: ["gastaba", "gastabas", "gastaba", "gastábamos", "gastaban"],
    future: ["gastaré", "gastarás", "gastará", "gastaremos", "gastarán"]
  },
  win: {
    es: "ganar",
    present: ["gano", "ganas", "gana", "ganamos", "ganan"],
    past: ["ganaba", "ganabas", "ganaba", "ganábamos", "ganaban"],
    future: ["ganaré", "ganarás", "ganará", "ganaremos", "ganarán"]
  },
  lose: {
    es: "perder",
    present: ["pierdo", "pierdes", "pierde", "perdemos", "pierden"],
    past: ["perdía", "perdías", "perdía", "perdíamos", "perdían"],
    future: ["perderé", "perderás", "perderá", "perderemos", "perderán"]
  },
  pay: {
    es: "pagar",
    present: ["pago", "pagas", "paga", "pagamos", "pagan"],
    past: ["pagaba", "pagabas", "pagaba", "pagábamos", "pagaban"],
    future: ["pagaré", "pagarás", "pagará", "pagaremos", "pagarán"]
  },
  meet: {
    es: "conocer/reunir",
    present: ["conozco", "conoces", "conoce", "conocemos", "conocen"],
    past: ["conocía", "conocías", "conocía", "conocíamos", "conocían"],
    future: ["conoceré", "conocerás", "conocerá", "conoceremos", "conocerán"]
  },
  return: {
    es: "regresar/volver",
    present: ["regreso", "regresas", "regresa", "regresamos", "regresan"],
    past: ["regresaba", "regresabas", "regresaba", "regresábamos", "regresaban"],
    future: ["regresaré", "regresarás", "regresará", "regresaremos", "regresarán"]
  },
  talk: {
    es: "hablar",
    present: ["hablo", "hablas", "habla", "hablamos", "hablan"],
    past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"],
    future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"]
  },
  carry: {
    es: "cargar",
    present: ["cargo", "cargas", "carga", "cargamos", "cargan"],
    past: ["cargaba", "cargabas", "cargaba", "cargábamos", "cargaban"],
    future: ["cargaré", "cargarás", "cargará", "cargaremos", "cargarán"]
  },
  buy: {
    es: "comprar",
    present: ["compro", "compras", "compra", "compramos", "compran"],
    past: ["compraba", "comprabas", "compraba", "comprábamos", "compraban"],
    future: ["compraré", "comprarás", "comprará", "compraremos", "comprarán"]
  },
  sell: {
    es: "vender",
    present: ["vendo", "vendes", "vende", "vendemos", "venden"],
    past: ["vendía", "vendías", "vendía", "vendíamos", "vendían"],
    future: ["venderé", "venderás", "venderá", "venderemos", "venderán"]
  },
  send: {
    es: "enviar",
    present: ["envío", "envías", "envía", "enviamos", "envían"],
    past: ["enviaba", "enviabas", "enviaba", "enviábamos", "enviaban"],
    future: ["enviaré", "enviarás", "enviará", "enviaremos", "enviarán"]
  },
  receive: {
    es: "recibir",
    present: ["recibo", "recibes", "recibe", "recibimos", "reciben"],
    past: ["recibía", "recibías", "recibía", "recibíamos", "recibían"],
    future: ["recibiré", "recibirás", "recibirá", "recibiremos", "recibirán"]
  },
  teach: {
    es: "enseñar",
    present: ["enseño", "enseñas", "enseña", "enseñamos", "enseñan"],
    past: ["enseñaba", "enseñabas", "enseñaba", "enseñábamos", "enseñaban"],
    future: ["enseñaré", "enseñarás", "enseñará", "enseñaremos", "enseñarán"]
  },
  study: {
    es: "estudiar",
    present: ["estudio", "estudias", "estudia", "estudiamos", "estudian"],
    past: ["estudiaba", "estudiabas", "estudiaba", "estudiábamos", "estudiaban"],
    future: ["estudiaré", "estudiarás", "estudiará", "estudiaremos", "estudiarán"]
  },
  sleep: {
    es: "dormir",
    present: ["duermo", "duermes", "duerme", "dormimos", "duermen"],
    past: ["dormía", "dormías", "dormía", "dormíamos", "dormían"],
    future: ["dormiré", "dormirás", "dormirá", "dormiremos", "dormirán"]
  },
  drive: {
    es: "conducir",
    present: ["conduzco", "conduces", "conduce", "conducimos", "conducen"],
    past: ["conducía", "conducías", "conducía", "conducíamos", "conducían"],
    future: ["conduciré", "conducirás", "conducirá", "conduciremos", "conducirán"]
  },
  fly: {
    es: "volar",
    present: ["vuelo", "vueles", "vuela", "volamos", "vuelan"],
    past: ["volaba", "volabas", "volaba", "volábamos", "volaban"],
    future: ["volaré", "volarás", "volará", "volaremos", "volarán"]
  },
  swim: {
    es: "nadar",
    present: ["nado", "nadas", "nada", "nadamos", "nadan"],
    past: ["nadaba", "nadabas", "nadaba", "nadábamos", "nadaban"],
    future: ["nadaré", "nadarás", "nadará", "nadaremos", "nadarán"]
  },
  sing: {
    es: "cantar",
    present: ["canto", "cantas", "canta", "cantamos", "cantan"],
    past: ["cantaba", "cantabas", "cantaba", "cantábamos", "cantaban"],
    future: ["cantaré", "cantarás", "cantará", "cantaremos", "cantarán"]
  },
  dance: {
    es: "bailar",
    present: ["bailo", "bailas", "baila", "bailamos", "bailan"],
    past: ["bailaba", "bailabas", "bailaba", "bailábamos", "bailaban"],
    future: ["bailaré", "bailarás", "bailará", "bailaremos", "bailarán"]
  },
  cook: {
    es: "cocinar",
    present: ["cocino", "cocinas", "cocina", "cocinamos", "cocinan"],
    past: ["cocinaba", "cocinabas", "cocinaba", "cocinábamos", "cocinaban"],
    future: ["cocinaré", "cocinarás", "cocinará", "cocinaremos", "cocinarán"]
  },
  clean: {
    es: "limpiar",
    present: ["limpio", "limpias", "limpia", "limpiamos", "limpian"],
    past: ["limpiaba", "limpiabas", "limpiaba", "limpiábamos", "limpiaban"],
    future: ["limpiaré", "limpiarás", "limpiará", "limpiaremos", "limpiarán"]
  },
  wash: {
    es: "lavar",
    present: ["lavo", "lavas", "lava", "lavamos", "lavan"],
    past: ["lavaba", "lavabas", "lavaba", "lavábamos", "lavaban"],
    future: ["lavaré", "lavarás", "lavará", "lavaremos", "lavarán"]
  },
  decide: {
    es: "decidir",
    present: ["decido", "decides", "decide", "decidimos", "deciden"],
    past: ["decidía", "decidías", "decidía", "decidíamos", "decidían"],
    future: ["decidiré", "decidirás", "decidirá", "decidiremos", "decidirán"]
  },
  answer: {
    es: "responder",
    present: ["respondo", "respondes", "responde", "respondemos", "responden"],
    past: ["respondía", "respondías", "respondía", "respondíamos", "respondían"],
    future: ["responderé", "responderás", "responderá", "responderemos", "responderán"]
  },
  explain: {
    es: "explicar",
    present: ["explico", "explicas", "explica", "explicamos", "explican"],
    past: ["explicaba", "explicabas", "explicaba", "explicábamos", "explicaban"],
    future: ["explicaré", "explicarás", "explicará", "explicaremos", "explicarán"]
  },
  improve: {
    es: "mejorar",
    present: ["mejoro", "mejoras", "mejora", "mejoramos", "mejoran"],
    past: ["mejoraba", "mejorabas", "mejoraba", "mejorábamos", "mejoraban"],
    future: ["mejoraré", "mejorarás", "mejorará", "mejoraremos", "mejorarán"]
  }
};