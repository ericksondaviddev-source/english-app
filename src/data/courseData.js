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
      }
    ]
  }
];
