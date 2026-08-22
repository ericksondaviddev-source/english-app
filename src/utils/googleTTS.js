import { translations, sentenceTranslations } from '../data/languageData';

export function getGoogleTTSUrl(text, lang = 'en') {
  const tl = lang.startsWith('es') ? 'es' : 'en';
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;
}

export function speakGoogleTTS(text, lang = 'en') {
  return new Promise(resolve => {
    const url = getGoogleTTSUrl(text, lang);
    const audio = new Audio(url);
    audio.volume = 1.0;
    let resolved = false;
    const done = () => { if (!resolved) { resolved = true; resolve(); } };
    audio.onended = done;
    audio.onerror = () => {
      // Fallback to Web Speech API
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang.startsWith('es') ? 'es-ES' : 'en-US';
        utt.rate = 0.9;
        utt.onend = done;
        utt.onerror = done;
        window.speechSynthesis.speak(utt);
        setTimeout(done, text.length * 120 + 3000);
      } else {
        done();
      }
    };
    audio.play().catch(() => {
      // Fallback to Web Speech API
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang.startsWith('es') ? 'es-ES' : 'en-US';
        utt.rate = 0.9;
        utt.onend = done;
        utt.onerror = done;
        window.speechSynthesis.speak(utt);
        setTimeout(done, text.length * 120 + 3000);
      } else {
        done();
      }
    });
    setTimeout(done, text.length * 120 + 5000);
  });
}

export function createAudioStream(text, lang = 'en') {
  return new Promise((resolve, reject) => {
    const url = getGoogleTTSUrl(text, lang);
    const audio = new Audio(url);
    audio.volume = 1.0;

    audio.oncanplaythrough = () => {
      try {
        const stream = audio.captureStream ? audio.captureStream() : audio.mozCaptureStream?.();
        resolve({ audio, stream });
      } catch (e) {
        resolve({ audio, stream: null });
      }
    };
    audio.onerror = () => reject(new Error('TTS load failed'));
    setTimeout(() => reject(new Error('TTS timeout')), 10000);
    audio.load();
  });
}

export function playSequential(texts) {
  return new Promise(resolve => {
    if (!texts.length) { resolve(); return; }
    let i = 0;
    const playNext = () => {
      if (i >= texts.length) { resolve(); return; }
      const { text, lang } = texts[i];
      i++;
      speakGoogleTTS(text, lang).then(playNext);
    };
    playNext();
  });
}

export function getAllListenBuildPhrases() {
  const phrases = [];
  const seen = new Set();

  for (const [en, es] of Object.entries(sentenceTranslations)) {
    if (!seen.has(en)) {
      seen.add(en);
      phrases.push({ en, es });
    }
  }

  const extras = [
    { en: "How are you doing today?", es: "Como estas hoy?" },
    { en: "I would like a cup of coffee", es: "Me gustaria una taza de cafe" },
    { en: "Can you help me please?", es: "Puedes ayudarme por favor?" },
    { en: "Where is the nearest hospital?", es: "Donde esta el hospital mas cercano?" },
    { en: "I need to go to the store", es: "Necesito ir a la tienda" },
    { en: "What time does the movie start?", es: "A que hora empieza la pelicula?" },
    { en: "I am learning to speak English", es: "Estoy aprendiendo a hablar ingles" },
    { en: "She is very happy today", es: "Ella esta muy feliz hoy" },
    { en: "We have a meeting tomorrow morning", es: "Tenemos una reunion manana por la manana" },
    { en: "They went to the park yesterday", es: "Ellos fueron al parque ayer" },
    { en: "I will call you later tonight", es: "Te llamare mas tarde esta noche" },
    { en: "Do you want to go for a walk?", es: "Quieres ir a caminar?" },
    { en: "The weather is really nice today", es: "El clima esta muy agradable hoy" },
    { en: "I forgot my keys at home", es: "Olvide mis llaves en casa" },
    { en: "Can I have some water please?", es: "Puedo tomar agua por favor?" },
    { en: "I am very tired after work", es: "Estoy muy cansado despues del trabajo" },
    { en: "She reads a book every night", es: "Ella lee un libro cada noche" },
    { en: "We need to buy some groceries", es: "Necesitamos comprar unas cosas" },
    { en: "He plays soccer on weekends", es: "El juega futbol los fines de semana" },
    { en: "The train leaves at eight o'clock", es: "El tren sale a las ocho en punto" },
    { en: "I want to travel around the world", es: "Quiero viajar por todo el mundo" },
    { en: "My favorite color is blue", es: "Mi color favorito es el azul" },
    { en: "I have two brothers and one sister", es: "Tengo dos hermanos y una hermana" },
    { en: "She works at a hospital", es: "Ella trabaja en un hospital" },
    { en: "I don't understand this question", es: "No entiendo esta pregunta" },
    { en: "Could you repeat that please?", es: "Puedes repetir eso por favor?" },
    { en: "I am looking for my phone", es: "Estoy buscando mi telefono" },
    { en: "The restaurant is very popular", es: "El restaurante es muy popular" },
    { en: "I need to study more English", es: "Necesito estudiar mas ingles" },
    { en: "He is taller than his brother", es: "El es mas alto que su hermano" },
    { en: "We should leave now", es: "Deberiamos irnos ahora" },
    { en: "I will be there in five minutes", es: "Ere ahi en cinco minutos" },
    { en: "What did you do last weekend?", es: "Que hiciste el fin de semana pasado?" },
    { en: "I am going to cook dinner tonight", es: "Voy a cocinar la cena esta noche" },
    { en: "She wants to learn how to dance", es: "Ella quiere aprender a bailar" },
    { en: "The bus arrives in ten minutes", es: "El autobus llega en diez minutos" },
    { en: "I already ate breakfast this morning", es: "Ya desayune esta manana" },
    { en: "Can you open the window please?", es: "Puedes abrir la ventana por favor?" },
    { en: "I think this is a great idea", es: "Creo que esta es una gran idea" },
    { en: "He doesn't like spicy food", es: "A el no le gusta la comida picante" },
    { en: "We went to the beach last summer", es: "Fuimos a la playa el verano pasado" },
    { en: "I need to finish this project today", es: "Necesito terminar este proyecto hoy" },
    { en: "She is the best student in class", es: "Ella es la mejor estudiante de la clase" },
    { en: "Do you have any plans for tonight?", es: "Tienes planes para esta noche?" },
    { en: "I love watching movies on weekends", es: "Me encanta ver peliculas los fines de semana" },
    { en: "The coffee shop is across the street", es: "La cafeteria esta al otro lado de la calle" },
    { en: "I am sorry for being late", es: "Lo siento por llegar tarde" },
    { en: "He speaks three languages fluently", es: "El habla tres idiomas con fluidez" },
    { en: "We should exercise more often", es: "Deberiamos hacer ejercicio mas seguido" },
    { en: "I want to be a doctor when I grow up", es: "Quiero ser doctor cuando sea grande" },
    { en: "The museum opens at nine in the morning", es: "El museo abre a las nueve de la manana" },
    { en: "She called me yesterday afternoon", es: "Ella me llamo ayer por la tarde" },
    { en: "I am not feeling very well today", es: "No me siento muy bien hoy" },
    { en: "They are building a new school nearby", es: "Estan construyendo una escuela nueva cerca" },
    { en: "Can I borrow your pen for a moment?", es: "Puedo pedir prestado tu lapiz un momento?" },
    { en: "I have never been to Europe before", es: "Nunca he estado en Europa antes" },
    { en: "The baby is sleeping in the other room", es: "El bebe esta durmiendo en la otra habitacion" },
    { en: "I would like to order some food please", es: "Me gustaria pedir comida por favor" },
    { en: "My parents live in a small town", es: "Mis padres viven en un pueblo pequeno" },
    { en: "I am going to visit my grandparents", es: "Voy a visitar a mis abuelos" },
    { en: "He always wakes up early in the morning", es: "El siempre se despierta temprano en la manana" },
    { en: "I need to send an email to my boss", es: "Necesito enviar un correo a mi jefe" },
    { en: "She is wearing a beautiful blue dress", es: "Ella lleva un vestido azul hermoso" },
    { en: "We live in a very quiet neighborhood", es: "Vivimos en un barrio muy tranquilo" },
    { en: "The test was more difficult than I expected", es: "El examen fue mas dificil de lo que esperaba" },
    { en: "I would love to visit Japan someday", es: "Me encantaria visitar Japon algun dia" },
    { en: "He is learning to play the guitar", es: "Esta aprendiendo a tocar la guitarra" },
    { en: "My sister works at a bank downtown", es: "Mi hermana trabaja en un banco en el centro" },
    { en: "I prefer tea over coffee in the morning", es: "Prefiero el te antes que el cafe por la manana" },
    { en: "The children are playing in the garden", es: "Los ninos estan jugando en el jardin" },
    { en: "I have a dentist appointment tomorrow", es: "Tengo cita con el dentista manana" },
    { en: "She always makes me laugh", es: "Ella siempre me hace reir" },
    { en: "I need to water the plants today", es: "Necesito regar las plantas hoy" },
    { en: "He finished his homework before dinner", es: "Termino su tarea antes de la cena" },
    { en: "We are planning a trip for next month", es: "Estamos planeando un viaje para el proximo mes" },
    { en: "I love the sound of rain at night", es: "Me encanta el sonido de la lluvia en la noche" },
    { en: "She is thinking about changing jobs", es: "Ella esta pensando en cambiar de trabajo" },
    { en: "The grocery store closes at nine PM", es: "La tienda de abarrotes cierra a las nueve PM" },
    { en: "I want to learn how to cook Italian food", es: "Quiero aprender a cocinar comida italiana" },
    { en: "He has a lot of experience in this field", es: "Tiene mucha experiencia en este campo" },
    { en: "I usually go to bed around midnight", es: "Normalmente me acuesto alrededor de medianoche" },
    { en: "She loves taking photos of nature", es: "Ama tomar fotos de la naturaleza" },
    { en: "We need to talk about something important", es: "Necesitamos hablar de algo importante" },
    { en: "I am thinking about buying a new car", es: "Estoy pensando en comprar un carro nuevo" },
    { en: "He promised to call me this evening", es: "Prometio llamarme esta tarde" },
    { en: "The book I am reading is very interesting", es: "El libro que estoy leyendo es muy interesante" },
    { en: "I am grateful for everything you have done", es: "Estoy agradecido por todo lo que has hecho" },
    { en: "She has beautiful blue eyes", es: "Tiene ojos azules hermosos" },
    { en: "I need to make a phone call", es: "Necesito hacer una llamada telefonica" },
    { en: "He works very hard every day", es: "Trabaja muy duro cada dia" },
    { en: "We should study for the exam tomorrow", es: "Deberiamos estudiar para el examen de manana" },
    { en: "I am going to the gym after work", es: "Voy al gimnasio despues del trabajo" },
    { en: "The weather forecast says it will rain", es: "El pronostico del tiempo dice que va a llover" },
    { en: "She always arrives on time", es: "Ella siempre llega a tiempo" },
    { en: "I want to improve my English skills", es: "Quiero mejorar mis habilidades de ingles" },
    { en: "He is afraid of spiders", es: "Le tienen miedo a las aranas" },
    { en: "My mother cooks the best food", es: "Mi madre cocina la mejor comida" },
    { en: "I need a new pair of shoes", es: "Necesito un par de zapatos nuevos" },
    { en: "She is interested in learning new things", es: "Le interesa aprender cosas nuevas" },
    { en: "We had a great time at the party", es: "La pasamos genial en la fiesta" },
    { en: "I am proud of my children", es: "Estoy orgulloso de mis hijos" },
    { en: "He forgot to bring his umbrella", es: "Olvido traer su paraguas" },
    { en: "The concert starts at seven PM", es: "El concierto empieza a las siete PM" },
    { en: "I enjoy spending time with my family", es: "Disfruto pasar tiempo con mi familia" },
    { en: "She is always helpful and kind", es: "Ella siempre es servicial y amable" },
    { en: "I need to clean my house this weekend", es: "Necesito limpiar mi casa este fin de semana" },
    { en: "He wants to become a professional athlete", es: "Quiere convertirse en atleta profesional" },
    { en: "We should respect each other", es: "Deberiamos respetarnos unos a otros" },
    { en: "I am looking forward to the holidays", es: "Estoy esperando las vacaciones con entusiasmo" },
    { en: "She speaks English very well", es: "Ella habla ingles muy bien" },
    { en: "I need to buy a gift for my friend", es: "Necesito comprar un regalo para mi amigo" },
    { en: "He plays the piano beautifully", es: "El toca el piano hermosamente" },
    { en: "The movie was really exciting", es: "La pelicula fue realmente emocionante" },
    { en: "I am going to start a new hobby", es: "Voy a empezar un pasatiempo nuevo" },
    { en: "She helps her neighbors every day", es: "Ella ayuda a sus vecinos todos los dias" },
    { en: "I want to travel to South America", es: "Quiero viajar a Sudamerica" },
    { en: "He is very good at mathematics", es: "Es muy bueno en matematicas" },
    { en: "We need more time to finish this", es: "Necesitamos mas tiempo para terminar esto" },
    { en: "I am happy with my new job", es: "Estoy contento con mi nuevo trabajo" },
    { en: "She is reading a book about history", es: "Ella esta leyendo un libro sobre historia" },
    { en: "The flowers in the garden are beautiful", es: "Las flores en el jardin son hermosas" },
    { en: "I will help you with your homework", es: "Te ayudare con tu tarea" },
    { en: "He is going to visit his grandmother", es: "Va a visitar a su abuela" },
    { en: "We love watching the sunset together", es: "Nos encanta ver el atardecer juntos" },
    { en: "I need to update my computer software", es: "Necesito actualizar el software de mi computadora" },
    { en: "She always listens to music in the morning", es: "Ella siempre escucha musica por la manana" },
    { en: "I am very excited about the new project", es: "Estoy muy emocionado con el nuevo proyecto" },
    { en: "He has a big family with five children", es: "Tiene una familia grande con cinco hijos" },
    { en: "The school is near my house", es: "La escuela esta cerca de mi casa" },
    { en: "I want to learn how to paint", es: "Quiero aprender a pintar" },
    { en: "She is a very talented singer", es: "Ella es una cantante muy talentosa" },
    { en: "We should exercise at least three times a week", es: "Deberiamos hacer ejercicio al menos tres veces por semana" },
    { en: "I am planning to learn French next year", es: "Estoy planeando aprender frances el proximo ano" },
    { en: "He always makes time for his family", es: "Siempre hace tiempo para su familia" },
    { en: "The sun sets behind the mountains", es: "El sol se oculta detras de las montanas" },
    { en: "I am grateful for this beautiful day", es: "Estoy agradecido por este hermoso dia" },
    { en: "She wants to travel the world someday", es: "Quiere viajar por el mundo algun dia" },
    { en: "I need to organize my closet", es: "Necesito organizar mi closet" },
    { en: "He is very patient with children", es: "Es muy paciente con los ninos" },
    { en: "We had delicious food at the restaurant", es: "Comimos comida deliciosa en el restaurante" },
    { en: "I am looking for a new apartment", es: "Estoy buscando un apartamento nuevo" },
    { en: "She teaches English at the university", es: "Ella ensena ingles en la universidad" },
    { en: "I need to go to the pharmacy", es: "Necesito ir a la farmacia" },
    { en: "He enjoys reading before going to sleep", es: "Disfruta leer antes de dormir" },
    { en: "We are going to have a family dinner", es: "Vamos a tener una cena familiar" },
    { en: "I want to become a better person", es: "Quiero ser una mejor persona" },
    { en: "She is wearing a red jacket today", es: "Ella lleva una chaqueta roja hoy" },
    { en: "The dog is playing in the park", es: "El perro esta jugando en el parque" },
    { en: "I have a lot of work to do today", es: "Tengo mucho que hacer hoy" },
    { en: "He is thinking about moving to another city", es: "Esta pensando en mudarse a otra ciudad" },
    { en: "We should take better care of the environment", es: "Deberiamos cuidar mejor el medio ambiente" },
    { en: "I am very happy to see you again", es: "Estoy muy feliz de verte de nuevo" },
    { en: "She wants to learn how to swim", es: "Quiere aprender a nadar" },
    { en: "I need to prepare for the presentation", es: "Necesito preparar la presentacion" },
    { en: "He plays basketball with his friends", es: "Juega baloncesto con sus amigos" },
    { en: "The ocean is very beautiful at sunset", es: "El oceano es muy hermoso al atardecer" },
    { en: "I am going to take a long vacation", es: "Voy a tomarme unas vacaciones largas" },
    { en: "She always stays positive and optimistic", es: "Ella siempre se mantiene positiva y optimista" },
    { en: "I want to help people in need", es: "Quiero ayudar a las personas necesitadas" },
    { en: "He is the kindest person I know", es: "Es la persona mas amable que conozco" },
    { en: "We need to save money for the future", es: "Necesitamos ahorrar dinero para el futuro" },
    { en: "I am going to start eating healthier", es: "Voy a empezar a comer mas saludable" },
    { en: "She loves spending time outdoors", es: "Le encanta pasar tiempo al aire libre" },
    { en: "I need to call my mother tonight", es: "Necesito llamar a mi mama esta noche" },
    { en: "He is very passionate about his work", es: "Es muy apasionado por su trabajo" },
    { en: "We should always be honest with each other", es: "Deberiamos siempre ser honestos entre nosotros" },
    { en: "I am learning to play the drums", es: "Estoy aprendiendo a tocar la bateria" },
    { en: "She is a very caring and loving person", es: "Ella es una persona muy cariniosa y amorosa" },
    { en: "I want to make a positive difference in the world", es: "Quiero hacer una diferencia positiva en el mundo" },
    { en: "He always tries his best at everything", es: "Siempre se esfuerza al maximo en todo" },
    { en: "The mountains look amazing in the morning", es: "Las montanas se ven increibles por la manana" },
    { en: "I am grateful for my friends and family", es: "Estoy agradecido por mis amigos y familia" },
    { en: "She is thinking about going back to school", es: "Esta pensando en regresar a la escuela" },
    { en: "I need to finish reading this book", es: "Necesito terminar de leer este libro" },
    { en: "He wants to learn how to cook", es: "Quiere aprender a cocinar" },
    { en: "We should spend more quality time together", es: "Deberiamos pasar mas tiempo de calidad juntos" },
    { en: "I am going to volunteer at the shelter", es: "Voy a ser voluntario en el refugio" },
    { en: "She is very creative and artistic", es: "Es muy creativa y artistica" },
    { en: "I need to fix my computer keyboard", es: "Necesito arreglar el teclado de mi computadora" },
    { en: "He plays volleyball on Saturday mornings", es: "Juega voleibol los sabados por la manana" },
    { en: "The forest is peaceful and relaxing", es: "El bosque es pacifico y relajante" },
    { en: "I am looking forward to meeting you", es: "Estoy esperando conocerte" },
    { en: "She always speaks with a big smile", es: "Siempre habla con una gran sonrisa" },
    { en: "I want to write a book someday", es: "Quiero escribir un libro algun dia" },
    { en: "He is very responsible and hardworking", es: "Es muy responsable y trabajador" },
    { en: "We need to take care of our health", es: "Necesitamos cuidar nuestra salud" },
    { en: "I am going to travel alone next summer", es: "Voy a viajar solo el proximo verano" },
    { en: "She loves gardening and planting flowers", es: "Le encanta jardinizar y plantar flores" },
    { en: "I need to organize my schedule better", es: "Necesito organizar mejor mi horario" },
    { en: "He wants to run a marathon next year", es: "Quiere correr un maraton el proximo ano" },
    { en: "We should be more understanding of others", es: "Deberiamos ser mas comprensivos con los demas" },
    { en: "I am learning to be more patient", es: "Estoy aprendiendo a ser mas paciente" },
    { en: "She is very dedicated to her studies", es: "Es muy dedicada a sus estudios" },
    { en: "I want to adopt a rescue dog", es: "Quiero adoptar un perro rescatado" },
    { en: "He works as a software developer", es: "Trabaja como desarrollador de software" },
    { en: "The city looks beautiful at night", es: "La ciudad se ve hermosa de noche" },
    { en: "I am going to start a garden this spring", es: "Voy a empezar un jardin esta primavera" },
    { en: "She teaches children how to read", es: "Ella ensena a los ninos a leer" },
    { en: "I need to drink more water every day", es: "Necesito beber mas agua todos los dias" },
    { en: "He enjoys cooking for his family", es: "Disfruta cocinar para su familia" },
    { en: "We went on a beautiful hike last weekend", es: "Fuimos de una hermosa caminata el fin de semana pasado" },
    { en: "I am grateful for this opportunity", es: "Estoy agradecido por esta oportunidad" },
    { en: "She is always willing to help others", es: "Siempre esta dispuesta a ayudar a otros" },
    { en: "I want to learn about different cultures", es: "Quiero aprender sobre diferentes culturas" },
    { en: "He is very talented at playing soccer", es: "Es muy talentoso jugando futbol" },
    { en: "We should always follow our dreams", es: "Deberiamos siempre seguir nuestros suenos" },
    { en: "I am going to learn how to bake bread", es: "Voy a aprender a hornear pan" },
    { en: "She has a wonderful sense of humor", es: "Tiene un maravilloso sentido del humor" },
    { en: "I need to reduce my screen time", es: "Necesito reducir mi tiempo de pantalla" },
    { en: "He wants to travel to Asia someday", es: "Quiere viajar a Asia algun dia" },
    { en: "We are planning a surprise party for Mom", es: "Estamos planeando una fiesta sorpresa para Mama" },
    { en: "I am very excited about the new year", es: "Estoy muy emocionado por el nuevo ano" },
    { en: "She always keeps her promises", es: "Siempre cumple sus promesas" },
    { en: "I need to update my resume", es: "Necesito actualizar mi curriculum" },
    { en: "He is very generous with his time", es: "Es muy generoso con su tiempo" },
    { en: "We should appreciate the little things in life", es: "Deberiamos apreciar las cosas pequenas de la vida" },
    { en: "I am going to take a cooking class", es: "Voy a tomar una clase de cocina" },
    { en: "She loves animals and wants to be a vet", es: "Ama a los animales y quiere ser veterinaria" },
    { en: "I need to fix the leaky faucet", es: "Necesito arreglar el grifo que gotea" },
    { en: "He is always learning new things", es: "Siempre esta aprendiendo cosas nuevas" },
    { en: "We had a wonderful vacation last month", es: "Tuvimos unas vacaciones maravillosas el mes pasado" },
    { en: "I am going to start journaling every day", es: "Voy a empezar a escribir un diario todos los dias" },
    { en: "She is very compassionate and caring", es: "Es muy compasiva y cariniosa" },
    { en: "I want to build a stronger relationship with my family", es: "Quiero construir una relacion mas fuerte con mi familia" },
    { en: "He is very creative in solving problems", es: "Es muy creativo para resolver problemas" },
    { en: "We should always strive to be better", es: "Deberiamos siempre esforzarnos por ser mejores" },
    { en: "I am going to volunteer at the local shelter", es: "Voy a hacer voluntariado en el refugio local" },
    { en: "She is an excellent communicator", es: "Es una comunicadora excelente" },
    { en: "I need to plan my finances better", es: "Necesito planear mejor mis finanzas" },
    { en: "He enjoys learning about history", es: "Disfruta aprender sobre historia" },
    { en: "We are going to adopt a kitten", es: "Vamos a adoptar un gatito" },
    { en: "I am very thankful for my education", es: "Estoy muy agradecido por mi educacion" },
    { en: "She always encourages others to do their best", es: "Siempre anima a otros a dar lo mejor de si" },
    { en: "I want to create something meaningful", es: "Quiero crear algo significativo" },
    { en: "He is a very loyal and trustworthy friend", es: "Es un amigo muy leal y confiable" },
    { en: "We should practice gratitude every day", es: "Deberiamos practicar la gratitud todos los dias" },
    { en: "I am going to read more books this year", es: "Voy a leer mas libros este ano" },
    { en: "She is an inspiring role model", es: "Es un modelo a seguir inspirador" },
    { en: "I need to learn to let go of the past", es: "Necesito aprender a dejar ir el pasado" },
    { en: "He always makes time to help others", es: "Siempre hace tiempo para ayudar a otros" },
    { en: "We are grateful for this beautiful life", es: "Estamos agradecidos por esta hermosa vida" },
    { en: "I am going to practice mindfulness daily", es: "Voy a practicar meditacion a diario" },
    { en: "She is a true inspiration to everyone", es: "Es una verdadera inspiracion para todos" },
  ];

  for (const p of extras) {
    if (!seen.has(p.en)) {
      seen.add(p.en);
      phrases.push(p);
    }
  }

  return phrases;
}
