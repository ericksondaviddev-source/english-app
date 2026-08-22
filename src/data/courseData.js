export const courseModules = [
  {
    id: "basics",
    title: "Los Basics",
    icon: "📚",
    description: "Lo esencial para empezar",
    lessons: [
      {
        id: "basics-1",
        title: "Saludos",
        content: [
          { type: "text", value: "En inglés, los saludos más comunes son:" },
          { type: "list", items: ["Hello = Hola", "Hi = Hola (informal)", "Good morning = Buenos días", "Good afternoon = Buenas tardes", "Good night = Buenas noches", "How are you? = ¿Cómo estás?", "I'm fine, thank you = Estoy bien, gracias"] },
          { type: "text", value: "En inglés formal se usa 'Good morning/afternoon/evening'. En informal, solo 'Hi' o 'Hey'." },
          { type: "audio", text: "Hello! How are you? I'm fine, thank you!" },
          { type: "video", sentence: "Hello! How are you? I'm fine, thank you!" }
        ],
        practice: [
          { type: "match", question: "Hello", answer: "Hola" },
          { type: "match", question: "Good morning", answer: "Buenos días" },
          { type: "match", question: "How are you?", answer: "¿Cómo estás?" }
        ]
      },
      {
        id: "basics-2",
        title: "Números del 1 al 10",
        content: [
          { type: "text", value: "Los números en inglés del 1 al 10:" },
          { type: "list", items: ["1 = One", "2 = Two", "3 = Three", "4 = Four", "5 = Five", "6 = Six", "7 = Seven", "8 = Eight", "9 = Nine", "10 = Ten"] },
          { type: "tip", value: "Truco: 'Three' suena como 'tri' (triángulo). 'Five' suena como 'fie-v' (fiebre)." },
          { type: "audio", text: "One, two, three, four, five, six, seven, eight, nine, ten!" }
        ],
        practice: [
          { type: "match", question: "Three", answer: "3" },
          { type: "match", question: "Seven", answer: "7" },
          { type: "match", question: "Nine", answer: "9" }
        ]
      },
      {
        id: "basics-3",
        title: "Colores",
        content: [
          { type: "text", value: "Los colores en inglés:" },
          { type: "list", items: ["Red = Rojo", "Blue = Azul", "Green = Verde", "Yellow = Amarillo", "Orange = Naranja", "Purple = Morado", "Black = Negro", "White = Blanco", "Pink = Rosa", "Brown = Marrón"] },
          { type: "audio", text: "Red, blue, green, yellow, orange, purple, black, white, pink, brown!" }
        ],
        practice: [
          { type: "match", question: "Red", answer: "Rojo" },
          { type: "match", question: "Blue", answer: "Azul" },
          { type: "match", question: "Green", answer: "Verde" }
        ]
      },
      {
        id: "basics-4",
        title: "Días de la semana",
        content: [
          { type: "text", value: "Los días de la semana en inglés:" },
          { type: "list", items: ["Monday = Lunes", "Tuesday = Martes", "Wednesday = Miércoles", "Thursday = Jueves", "Friday = Viernes", "Saturday = Sábado", "Sunday = Domingo"] },
          { type: "tip", value: "Tip: 'Week' = semana, 'Weekend' = fin de semana (Saturday & Sunday)" },
          { type: "audio", text: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday!" }
        ],
        practice: [
          { type: "match", question: "Monday", answer: "Lunes" },
          { type: "match", question: "Wednesday", answer: "Miércoles" },
          { type: "match", question: "Friday", answer: "Viernes" }
        ]
      },
      {
        id: "basics-5",
        title: "Meses del año",
        content: [
          { type: "text", value: "Los meses del año:" },
          { type: "list", items: ["January = Enero", "February = Febrero", "March = Marzo", "April = Abril", "May = Mayo", "June = Junio", "July = Julio", "August = Agosto", "September = Septiembre", "October = Octubre", "November = Noviembre", "December = Diciembre"] },
          { type: "audio", text: "January, February, March, April, May, June, July, August, September, October, November, December!" }
        ],
        practice: [
          { type: "match", question: "January", answer: "Enero" },
          { type: "match", question: "June", answer: "Junio" },
          { type: "match", question: "December", answer: "Diciembre" }
        ]
      },
      {
        id: "basics-6",
        title: "Direcciones y ubicaciones",
        content: [
          { type: "text", value: "Palabras de dirección y lugar:" },
          { type: "list", items: ["Left = Izquierda", "Right = Derecha", "Straight = Derecho", "Up = Arriba", "Down = Abajo", "Near = Cerca", "Far = Lejos", "Here = Aquí", "There = Allí", "Where? = ¿Dónde?"] },
          { type: "audio", text: "Left, right, straight, near, far, here, there!" }
        ],
        practice: [
          { type: "match", question: "Left", answer: "Izquierda" },
          { type: "match", question: "Near", answer: "Cerca" },
          { type: "match", question: "Where?", answer: "¿Dónde?" }
        ]
      }
    ]
  },
  {
    id: "grammar",
    title: "Gramática Esencial",
    icon: "📝",
    description: "Las reglas que necesitas saber",
    lessons: [
      {
        id: "grammar-1",
        title: "Pronombres",
        content: [
          { type: "text", value: "Los pronombres son las palabras que reemplazan al nombre:" },
          { type: "table", headers: ["Inglés", "Español", "Ejemplo"], rows: [
            ["I", "Yo", "I eat = Yo como"],
            ["You", "Tú", "You eat = Tú comes"],
            ["He", "Él", "He eats = Él come"],
            ["She", "Ella", "She eats = Ella come"],
            ["It", "Eso", "It works = Funciona"],
            ["We", "Nosotros", "We eat = Nosotros comemos"],
            ["They", "Ellos", "They eat = Ellos comen"]
          ]},
          { type: "audio", text: "I, you, he, she, it, we, they!" }
        ],
        practice: [
          { type: "match", question: "I", answer: "Yo" },
          { type: "match", question: "She", answer: "Ella" },
          { type: "match", question: "They", answer: "Ellos" }
        ]
      },
      {
        id: "grammar-2",
        title: "Verbos Esenciales",
        content: [
          { type: "text", value: "Estos 6 verbos cubren el 80% de situaciones cotidianas:" },
          { type: "table", headers: ["Infinitivo", "Pasado", "Presente", "Futuro"], rows: [
            ["Want (querer)", "Wanted", "Want", "Will want"],
            ["Have (tener)", "Had", "Have", "Will have"],
            ["Go (ir)", "Went", "Go", "Will go"],
            ["Do (hacer)", "Did", "Do", "Will do"],
            ["Say (decir)", "Said", "Say", "Will say"],
            ["Get (obtener)", "Got", "Get", "Will get"]
          ]},
          { type: "audio", text: "Want, have, go, do, say, get!" }
        ],
        practice: [
          { type: "match", question: "Want", answer: "Querer" },
          { type: "match", question: "Have", answer: "Tener" },
          { type: "match", question: "Go", answer: "Ir" }
        ]
      },
      {
        id: "grammar-3",
        title: "Estructura SVO",
        content: [
          { type: "text", value: "El inglés usa la estructura Sujeto + Verbo + Objeto (igual que español):" },
          { type: "list", items: ["I eat apples = Yo como manzanas", "She reads books = Ella lee libros", "They play music = Ellos tocan música"] },
          { type: "tip", value: "El adjetivo va ANTES del sustantivo: 'The red car' (El carro rojo)" },
          { type: "audio", text: "I eat apples. She reads books. They play music." }
        ],
        practice: [
          { type: "match", question: "I eat apples", answer: "Yo como manzanas" },
          { type: "match", question: "She reads books", answer: "Ella lee libros" }
        ]
      },
      {
        id: "grammar-4",
        title: "Presente Simple",
        content: [
          { type: "text", value: "El presente simple describe acciones habituales:" },
          { type: "list", items: ["I/You/We/They + verbo base: I work, You study", "He/She/It + verbo + s: He works, She studies", "Negativo: I don't work, He doesn't work", "Pregunta: Do you work? Does he work?"] },
          { type: "tip", value: "Truco: Solo agrega 's' con He/She/It. ¡Es la única regla!" },
          { type: "audio", text: "I work. He works. Do you work? She doesn't work." }
        ],
        practice: [
          { type: "match", question: "He ___ (work)", answer: "works" },
          { type: "match", question: "They ___ (work)", answer: "work" },
          { type: "match", question: "___ she work?", answer: "Does" }
        ]
      },
      {
        id: "grammar-5",
        title: "Pasado Simple",
        content: [
          { type: "text", value: "El pasado simple describe acciones terminadas:" },
          { type: "list", items: ["Verbos regulares: agregar -ed (work→worked, study→studied)", "Verbos irregulares: cambiar (go→went, eat→ate, have→had)", "Negativo: I didn't go, She didn't eat", "Pregunta: Did you go? Did she eat?"] },
          { type: "audio", text: "I worked yesterday. She went home. Did you eat?" }
        ],
        practice: [
          { type: "match", question: "Go (pasado)", answer: "Went" },
          { type: "match", question: "Eat (pasado)", answer: "Ate" },
          { type: "match", question: "Did she ___?", answer: "go" }
        ]
      },
      {
        id: "grammar-6",
        title: "Preposiciones de lugar",
        content: [
          { type: "text", value: "Las preposiciones más comunes:" },
          { type: "table", headers: ["Preposición", "Español", "Ejemplo"], rows: [
            ["In", "En/Dentro", "In the box = En la caja"],
            ["On", "Sobre", "On the table = Sobre la mesa"],
            ["At", "En (lugar)", "At home = En casa"],
            ["Under", "Debajo", "Under the bed = Debajo de la cama"],
            ["Behind", "Detrás", "Behind the door = Detrás de la puerta"],
            ["Between", "Entre", "Between us = Entre nosotros"]
          ]},
          { type: "audio", text: "In, on, at, under, behind, between!" }
        ],
        practice: [
          { type: "match", question: "In", answer: "En/Dentro" },
          { type: "match", question: "Under", answer: "Debajo" },
          { type: "match", question: "Behind", answer: "Detrás" }
        ]
      }
    ]
  },
  {
    id: "vocabulary",
    title: "Vocabulario Clave",
    icon: "🗣️",
    description: "Palabras que usas todos los días",
    lessons: [
      {
        id: "vocab-1",
        title: "Familia",
        content: [
          { type: "text", value: "Las palabras de familia en inglés:" },
          { type: "list", items: ["Mother/Mom = Madre", "Father/Dad = Padre", "Sister = Hermana", "Brother = Hermano", "Grandmother = Abuela", "Grandfather = Abuelo", "Son = Hijo", "Daughter = Hija", "Family = Familia"] },
          { type: "audio", text: "Mother, father, sister, brother, grandmother, grandfather, family!" }
        ],
        practice: [
          { type: "match", question: "Mother", answer: "Madre" },
          { type: "match", question: "Brother", answer: "Hermano" },
          { type: "match", question: "Family", answer: "Familia" }
        ]
      },
      {
        id: "vocab-2",
        title: "Comida",
        content: [
          { type: "text", value: "Comida y bebida en inglés:" },
          { type: "list", items: ["Water = Agua", "Food = Comida", "Bread = Pan", "Milk = Leche", "Coffee = Café", "Apple = Manzana", "Rice = Arroz", "Chicken = Pollo", "Fish = Pescado", "Vegetables = Verduras"] },
          { type: "audio", text: "Water, food, bread, milk, coffee, apple, rice, chicken!" }
        ],
        practice: [
          { type: "match", question: "Water", answer: "Agua" },
          { type: "match", question: "Coffee", answer: "Café" },
          { type: "match", question: "Apple", answer: "Manzana" }
        ]
      },
      {
        id: "vocab-3",
        title: "El cuerpo humano",
        content: [
          { type: "text", value: "Partes del cuerpo:" },
          { type: "list", items: ["Head = Cabeza", "Eyes = Ojos", "Nose = Nariz", "Mouth = Boca", "Ears = Orejas", "Hands = Manos", "Feet = Pies", "Arms = Brazos", "Legs = Piernas", "Heart = Corazón"] },
          { type: "audio", text: "Head, eyes, nose, mouth, ears, hands, feet, arms, legs, heart!" }
        ],
        practice: [
          { type: "match", question: "Head", answer: "Cabeza" },
          { type: "match", question: "Heart", answer: "Corazón" },
          { type: "match", question: "Hands", answer: "Manos" }
        ]
      },
      {
        id: "vocab-4",
        title: "El clima y el tiempo",
        content: [
          { type: "text", value: "Palabras del clima:" },
          { type: "list", items: ["Hot = Caliente", "Cold = Frío", "Warm = Templado", "Cool = Fresco", "Rain = Lluvia", "Snow = Nieve", "Wind = Viento", "Sun = Sol", "Cloud = Nube", "Storm = Tormenta"] },
          { type: "audio", text: "Hot, cold, warm, cool, rain, snow, wind, sun, cloud!" }
        ],
        practice: [
          { type: "match", question: "Hot", answer: "Caliente" },
          { type: "match", question: "Snow", answer: "Nieve" },
          { type: "match", question: "Wind", answer: "Viento" }
        ]
      },
      {
        id: "vocab-5",
        title: "Animales",
        content: [
          { type: "text", value: "Los animales más comunes:" },
          { type: "list", items: ["Dog = Perro", "Cat = Gato", "Bird = Pájaro", "Fish = Pez", "Horse = Caballo", "Cow = Vaca", "Pig = Cerdo", "Chicken = Pollo", "Rabbit = Conejo", "Bear = Oso"] },
          { type: "audio", text: "Dog, cat, bird, fish, horse, cow, pig, chicken, rabbit, bear!" }
        ],
        practice: [
          { type: "match", question: "Dog", answer: "Perro" },
          { type: "match", question: "Horse", answer: "Caballo" },
          { type: "match", question: "Rabbit", answer: "Conejo" }
        ]
      },
      {
        id: "vocab-6",
        title: "La ropa",
        content: [
          { type: "text", value: "Ropa y accesorios:" },
          { type: "list", items: ["Shirt = Camisa", "Pants = Pantalones", "Dress = Vestido", "Shoes = Zapatos", "Hat = Sombrero", "Jacket = Chaqueta", "Socks = Calcetines", "Skirt = Falda", "Boots = Botas", "Scarf = Bufanda"] },
          { type: "audio", text: "Shirt, pants, dress, shoes, hat, jacket, socks, skirt, boots, scarf!" }
        ],
        practice: [
          { type: "match", question: "Shirt", answer: "Camisa" },
          { type: "match", question: "Shoes", answer: "Zapatos" },
          { type: "match", question: "Hat", answer: "Sombrero" }
        ]
      }
    ]
  },
  {
    id: "conversations",
    title: "Conversaciones",
    icon: "💬",
    description: "Habla como un nativo",
    lessons: [
      {
        id: "conv-1",
        title: "En la tienda",
        content: [
          { type: "text", value: "Frases útiles para comprar:" },
          { type: "list", items: ["How much is this? = ¿Cuánto cuesta esto?", "I want this one = Quiero este", "Do you have a bigger size? = ¿Tiene una talla más grande?", "Can I pay with card? = ¿Puedo pagar con tarjeta?", "Where is the exit? = ¿Dónde está la salida?"] },
          { type: "audio", text: "How much is this? I want this one. Can I pay with card?" }
        ],
        practice: [
          { type: "match", question: "How much is this?", answer: "¿Cuánto cuesta esto?" },
          { type: "match", question: "I want this one", answer: "Quiero este" }
        ]
      },
      {
        id: "conv-2",
        title: "En el restaurante",
        content: [
          { type: "text", value: "Frases para el restaurante:" },
          { type: "list", items: ["A table for two, please = Una mesa para dos, por favor", "Can I see the menu? = ¿Puedo ver el menú?", "I would like... = Me gustaría...", "The check, please = La cuenta, por favor", "It's delicious = Está delicioso"] },
          { type: "audio", text: "A table for two, please. I would like... The check, please." }
        ],
        practice: [
          { type: "match", question: "A table for two", answer: "Una mesa para dos" },
          { type: "match", question: "The check, please", answer: "La cuenta, por favor" }
        ]
      },
      {
        id: "conv-3",
        title: "Presentaciones",
        content: [
          { type: "text", value: "Cómo presentarte:" },
          { type: "list", items: ["My name is... = Mi nombre es...", "I'm from... = Soy de...", "I work as... = Trabajo como...", "Nice to meet you = Mucho gusto", "How old are you? = ¿Cuántos años tienes?", "What do you do? = ¿A qué te dedicas?"] },
          { type: "audio", text: "My name is Juan. I'm from Venezuela. Nice to meet you!" }
        ],
        practice: [
          { type: "match", question: "My name is...", answer: "Mi nombre es..." },
          { type: "match", question: "Nice to meet you", answer: "Mucho gusto" }
        ]
      },
      {
        id: "conv-4",
        title: "En el hotel",
        content: [
          { type: "text", value: "Frases útiles en hoteles:" },
          { type: "list", items: ["I have a reservation = Tengo una reservación", "A room for two nights = Una habitación por dos noches", "What time is checkout? = ¿A qué hora es el checkout?", "Is breakfast included? = ¿El desayuno está incluido?", "Can I have the WiFi password? = ¿Me puede dar la contraseña del WiFi?"] },
          { type: "audio", text: "I have a reservation. A room for two nights. Is breakfast included?" }
        ],
        practice: [
          { type: "match", question: "I have a reservation", answer: "Tengo una reservación" },
          { type: "match", question: "Is breakfast included?", answer: "¿El desayuno está incluido?" }
        ]
      },
      {
        id: "conv-5",
        title: "En el aeropuerto",
        content: [
          { type: "text", value: "Frases para viajar en avión:" },
          { type: "list", items: ["Where is gate number 5? = ¿Dónde está la puerta 5?", "I need to check in = Necesito hacer check-in", "Is my flight on time? = ¿Mi vuelo está a tiempo?", "Where is the baggage claim? = ¿Dónde se recogen las maletas?", "I lost my luggage = Perdí mi equipaje"] },
          { type: "audio", text: "Where is gate number 5? I need to check in. My flight is on time." }
        ],
        practice: [
          { type: "match", question: "Where is gate number 5?", answer: "¿Dónde está la puerta 5?" },
          { type: "match", question: "I lost my luggage", answer: "Perdí mi equipaje" }
        ]
      },
      {
        id: "conv-6",
        title: "En el doctor",
        content: [
          { type: "text", value: "Frases para ir al médico:" },
          { type: "list", items: ["I have a headache = Me duele la cabeza", "I have a stomachache = Me duele el estómago", "I feel sick = Me siento enfermo", "I need medicine = Necesito medicina", "Where is the pharmacy? = ¿Dónde está la farmacia?"] },
          { type: "audio", text: "I have a headache. I feel sick. Where is the pharmacy?" }
        ],
        practice: [
          { type: "match", question: "I have a headache", answer: "Me duele la cabeza" },
          { type: "match", question: "Where is the pharmacy?", answer: "¿Dónde está la farmacia?" }
        ]
      }
    ]
  },
  {
    id: "travel",
    title: "Inglés para Viajar",
    icon: "✈️",
    description: "Frases esenciales para tus viajes",
    lessons: [
      {
        id: "travel-1",
        title: "En el avión",
        content: [
          { type: "text", value: "Frases durante el vuelo:" },
          { type: "list", items: ["Can I have some water? = ¿Me puede dar agua?", "Where is the bathroom? = ¿Dónde está el baño?", "I need a blanket = Necesito una cobija", "We are landing soon = Pronto aterrizamos", "Fasten your seatbelt = Abróchese el cinturón"] },
          { type: "audio", text: "Can I have some water? Where is the bathroom? Fasten your seatbelt." }
        ],
        practice: [
          { type: "match", question: "Can I have some water?", answer: "¿Me puede dar agua?" },
          { type: "match", question: "Fasten your seatbelt", answer: "Abróchese el cinturón" }
        ]
      },
      {
        id: "transport-2",
        title: "Transporte público",
        content: [
          { type: "text", value: "Frases para moverte en la ciudad:" },
          { type: "list", items: ["How do I get to...? = ¿Cómo llego a...?", "One ticket to... please = Un bolete a... por favor", "Where is the bus stop? = ¿Dónde está la parada del bus?", "What time does the next train leave? = ¿A qué hora sale el próximo tren?", "Is this the right way to...? = ¿Es este el camino correcto a...?"] },
          { type: "audio", text: "How do I get to the museum? One ticket please. Where is the bus stop?" }
        ],
        practice: [
          { type: "match", question: "How do I get to...?", answer: "¿Cómo llego a...?" },
          { type: "match", question: "One ticket please", answer: "Un boleto por favor" }
        ]
      }
    ]
  },
  {
    id: "daily",
    title: "Rutinas Diarias",
    icon: "🌅",
    description: "Habla de tu día a día",
    lessons: [
      {
        id: "daily-1",
        title: "Por la mañana",
        content: [
          { type: "text", value: "Frases de la rutina matutina:" },
          { type: "list", items: ["I wake up at 7 AM = Me despierto a las 7 AM", "I take a shower = Me ducho", "I eat breakfast = Desayuno", "I brush my teeth = Me cepillo los dientes", "I get dressed = Me visto"] },
          { type: "audio", text: "I wake up at seven. I take a shower. I eat breakfast. I get dressed." }
        ],
        practice: [
          { type: "match", question: "I wake up", answer: "Me despierto" },
          { type: "match", question: "I eat breakfast", answer: "Desayuno" },
          { type: "match", question: "I get dressed", answer: "Me visto" }
        ]
      },
      {
        id: "daily-2",
        title: "Por la tarde",
        content: [
          { type: "text", value: "Frases de la tarde:" },
          { type: "list", items: ["I have lunch = Almuerzo", "I go to work = Voy al trabajo", "I'm busy = Estoy ocupado", "I finish work at 6 = Termino el trabajo a las 6", "I'm going home = Voy a casa"] },
          { type: "audio", text: "I have lunch. I go to work. I finish work at six. I'm going home." }
        ],
        practice: [
          { type: "match", question: "I have lunch", answer: "Almuerzo" },
          { type: "match", question: "I finish work at 6", answer: "Termino el trabajo a las 6" }
        ]
      },
      {
        id: "daily-3",
        title: "Por la noche",
        content: [
          { type: "text", value: "Frases de la noche:" },
          { type: "list", items: ["I eat dinner = Ceno", "I watch TV = Miro televisión", "I read a book = Leo un libro", "I go to bed = Me acuesto", "Good night = Buenas noches"] },
          { type: "audio", text: "I eat dinner. I watch TV. I read a book. I go to bed. Good night!" }
        ],
        practice: [
          { type: "match", question: "I eat dinner", answer: "Ceno" },
          { type: "match", question: "I go to bed", answer: "Me acuesto" },
          { type: "match", question: "Good night", answer: "Buenas noches" }
        ]
      }
    ]
  },
  {
    id: "intermediate",
    title: "Nivel Intermedio",
    icon: "📈",
    description: "Toma tu inglés al siguiente nivel",
    lessons: [
      {
        id: "inter-1",
        title: "Presente Continuo",
        content: [
          { type: "text", value: "El presente continuo describe acciones en este momento:" },
          { type: "list", items: ["Estructura: am/is/are + verbo-ing", "I am eating = Estoy comiendo", "She is working = Ella está trabajando", "They are playing = Ellos están jugando", "¿Qué haces? = What are you doing?"] },
          { type: "tip", value: "Truco: 'Are you doing?' = '¿Estás haciendo?'. ¡Siempre con -ing!" },
          { type: "audio", text: "I am eating. She is working. They are playing. What are you doing?" }
        ],
        practice: [
          { type: "match", question: "I am ___ (eat)", answer: "eating" },
          { type: "match", question: "She is ___ (work)", answer: "working" },
          { type: "match", question: "What ___ you doing?", answer: "are" }
        ]
      },
      {
        id: "inter-2",
        title: "Futuro con Will",
        content: [
          { type: "text", value: "Will para predicciones y decisiones espontáneas:" },
          { type: "list", items: ["I will help you = Te ayudaré", "She will call you = Ella te llamará", "It will rain tomorrow = Lloverá mañana", "Will you come? = ¿Vendrás?", "I won't forget = No olvidaré"] },
          { type: "audio", text: "I will help you. She will call you. Will you come? I won't forget." }
        ],
        practice: [
          { type: "match", question: "I ___ help you", answer: "will" },
          { type: "match", question: "She ___ call you", answer: "will" },
          { type: "match", question: "___ you come?", answer: "Will" }
        ]
      },
      {
        id: "inter-3",
        title: "Comparativos",
        content: [
          { type: "text", value: "Cómo comparar cosas en inglés:" },
          { type: "table", headers: ["Tipo", "Regla", "Ejemplo"], rows: [
            ["Corto (+1 sílaba)", "+er", "Taller = Taller"],
            ["Largo (2+ sílabas)", "more + adj", "More beautiful = Más hermoso"],
            ["Irregular", "Cambia", "Good→Better, Bad→Worse"],
            ["El... de todos", "the + comparativo + of", "The tallest of all"]
          ]},
          { type: "audio", text: "Taller, smarter, more beautiful. Better, worse. The tallest!" }
        ],
        practice: [
          { type: "match", question: "Good (comparativo)", answer: "Better" },
          { type: "match", question: "Bad (comparativo)", answer: "Worse" },
          { type: "match", question: "More ___", answer: "Adjetivo largo" }
        ]
      }
    ]
  }
];
