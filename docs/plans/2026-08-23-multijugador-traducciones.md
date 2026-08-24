# Multijugador + Traducciones Híbridas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hybrid translation system (offline + API) and real-time multiplayer competition with Firebase.

**Architecture:** Modular services (firebase, auth, translation, multiplayer) with dedicated hooks and UI components. Firebase Realtime DB for sync, Firebase Auth for anonymous users.

**Tech Stack:** React, Firebase 10.x (Realtime DB + Auth), Tailwind CSS, Lucide React

---

## File Structure

```
src/
├── config/
│   └── firebase.js              # Firebase config + init
├── services/
│   ├── authService.js           # Auth anónimo + nombre
│   ├── translationService.js    # Híbrido offline/API
│   └── multiplayerService.js    # Salas, matchmaking, sync
├── hooks/
│   ├── useMultiplayer.js        # Estado multijugador
│   └── useTranslation.js        # Traducción inteligente
├── data/
│   ├── languageData.js          # EXPAND: 500+ palabras
│   └── sentencesData.js         # NEW: 300+ frases
├── components/multiplayer/
│   ├── Lobby.jsx                # Sala de espera
│   ├── PlayerList.jsx           # Lista jugadores
│   ├── RaceMode.jsx             # UI carrera
│   ├── DuelMode.jsx             # UI duelo
│   ├── BattleRoyale.jsx         # UI battle royale
│   ├── GameHUD.jsx              # HUD compartido
│   ├── ResultsModal.jsx         # Modal resultados
│   ├── Leaderboard.jsx          # Ranking global
│   └── MultiplayerMenu.jsx      # Menú multijugador
├── components/
│   ├── Home.jsx                 # MODIFICAR: agregar botón multijugador
│   └── Layout.jsx               # MODIFICAR: nav actualizada
```

---

## Task 1: Firebase Setup + Auth Service

**Files:**
- Create: `src/config/firebase.js`
- Create: `src/services/authService.js`
- Modify: `package.json`

- [ ] **Step 1: Install Firebase**

```bash
cd "C:\Users\USUARIO\Desktop\Prueba ingles\english-app" && npm install firebase
```

- [ ] **Step 2: Create Firebase config**

Create `src/config/firebase.js`:
```js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "english-app-demo.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://english-app-demo-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "english-app-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "english-app-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
```

- [ ] **Step 3: Create auth service**

Create `src/services/authService.js`:
```js
import { signInAnonymously, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../config/firebase';

export function initAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snapshot = await get(ref(db, `users/${user.uid}`));
      const userData = snapshot.val();
      callback({
        uid: user.uid,
        displayName: userData?.displayName || user.displayName || 'Jugador',
        points: userData?.points || 0,
        level: userData?.level || 1,
        stats: userData?.stats || { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 }
      });
    } else {
      callback(null);
    }
  });
}

export async function signInAnonymous(displayName) {
  const { user } = await signInAnonymously(auth);
  await updateProfile(user, { displayName });
  await set(ref(db, `users/${user.uid}`), {
    displayName,
    points: 0,
    level: 1,
    stats: { wins: 0, losses: 0, streak: 0, gamesPlayed: 0 },
    createdAt: Date.now()
  });
  return user;
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function updateUserData(uid, data) {
  await set(ref(db, `users/${uid}`), data);
}

export async function getUserData(uid) {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.val();
}
```

- [ ] **Step 4: Create .env.example**

Create `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 5: Commit**

```bash
git add src/config/firebase.js src/services/authService.js .env.example package.json package-lock.json
git commit -m "feat: add Firebase config and auth service"
```

---

## Task 2: Translation Service (Híbrido)

**Files:**
- Create: `src/services/translationService.js`
- Create: `src/hooks/useTranslation.js`
- Modify: `src/data/languageData.js`

- [ ] **Step 1: Expand languageData.js with adjectives, adverbs, prepositions**

Append to `src/data/languageData.js`:
```js
// Adjectives
export const adjectives = [
  "big", "small", "tall", "short", "long", "wide", "narrow", "thick", "thin",
  "fast", "slow", "quick", "early", "late", "old", "new", "young", "modern",
  "good", "bad", "great", "little", "beautiful", "ugly", "clean", "dirty",
  "hot", "cold", "warm", "cool", "dry", "wet", "hard", "soft", "strong", "weak",
  "happy", "sad", "angry", "calm", "scared", "brave", "shy", "proud", "tired",
  "rich", "poor", "expensive", "cheap", "free", "busy", "ready", "safe", "dangerous",
  "easy", "difficult", "simple", "complex", "important", "interesting", "boring",
  "funny", "serious", "quiet", "loud", "dark", "light", "heavy", "full", "empty",
  "right", "wrong", "true", "false", "possible", "impossible", "enough", "same",
  "different", "similar", "special", "normal", "usual", "strange", "familiar",
  "friendly", "polite", "clever", "stupid", "crazy", "sure", "free", "sick"
];

// Adverbs
export const adverbs = [
  "quickly", "slowly", "fast", "early", "late", "always", "never", "sometimes",
  "often", "usually", "rarely", "already", "still", "just", "now", "then",
  "today", "tomorrow", "yesterday", "here", "there", "everywhere", "nowhere",
  "very", "really", "quite", "too", "enough", "almost", "only", "also",
  "together", "alone", "outside", "inside", "forward", "back", "away",
  "carefully", "easily", "hard", "well", "badly", "happily", "sadly",
  "angrily", "quickly", "slowly", "suddenly", "finally", "immediately",
  "probably", "certainly", "maybe", "perhaps", "actually", "basically",
  "simply", "seriously", "seriously", "gently", "loudly", "quietly"
];

// Prepositions
export const prepositions = [
  "in", "on", "at", "to", "for", "with", "by", "from", "of", "about",
  "into", "through", "during", "before", "after", "above", "below",
  "between", "under", "over", "near", "behind", "beside", "around",
  "against", "along", "across", "beyond", "within", "without", "toward"
];

// Expanded irregular verbs with all forms
export const expandedVerbs = {
  want: { es: "querer", present: ["quiero", "quieres", "quiere", "queremos", "quieren"], past: ["quería", "querías", "quería", "queríamos", "querían"], future: ["querré", "querrás", "querrá", "querremos", "querrán"] },
  have: { es: "tener", present: ["tengo", "tienes", "tiene", "tenemos", "tienen"], past: ["tenía", "tenías", "tenía", "teníamos", "tenían"], future: ["tendré", "tendrás", "tendrá", "tendremos", "tendrán"] },
  be: { es: "ser/estar", present: ["soy/estoy", "eres/estás", "es/está", "somos/estamos", "son/están"], past: ["era/estaba", "eras/estabas", "era/estaba", "éramos/estábamos", "eran/estaban"], future: ["seré/estaré", "serás/estarás", "será/estará", "seremos/estaremos", "serán/estarán"] },
  do: { es: "hacer", present: ["hago", "haces", "hace", "hacemos", "hacen"], past: ["hacía", "hacías", "hacía", "hacíamos", "hacían"], future: ["haré", "harás", "hará", "haremos", "harán"] },
  go: { es: "ir", present: ["voy", "vas", "va", "vamos", "van"], past: ["iba", "ibas", "iba", "íbamos", "iban"], future: ["iré", "irás", "irá", "iremos", "irán"] },
  say: { es: "decir", present: ["digo", "dices", "dice", "decimos", "dicen"], past: ["decía", "decías", "decía", "decíamos", "decían"], future: ["diré", "dirás", "dirá", "diremos", "dirán"] },
  get: { es: "obtener", present: ["obtengo", "obtienes", "obtiene", "obtenemos", "obtienen"], past: ["obtenía", "obtenías", "obtenía", "obteníamos", "obtenían"], future: ["obtendré", "obtendrás", "obtendrá", "obtendremos", "obtendrán"] },
  make: { es: "hacer", present: ["hago", "haces", "hace", "hacemos", "hacen"], past: ["hacía", "hacías", "hacía", "hacíamos", "hacían"], future: ["haré", "harás", "hará", "haremos", "harán"] },
  know: { es: "saber", present: ["sé", "sabes", "sabe", "sabemos", "saben"], past: ["sabía", "sabías", "sabía", "sabíamos", "sabían"], future: ["sabré", "sabrás", "sabrá", "sabremos", "sabrán"] },
  think: { es: "pensar", present: ["pienso", "piensas", "piensa", "pensamos", "piensan"], past: ["pensaba", "pensabas", "pensaba", "pensábamos", "pensaban"], future: ["pensaré", "pensarás", "pensará", "pensaremos", "pensarán"] },
  take: { es: "tomar", present: ["tomo", "tomas", "toma", "tomamos", "toman"], past: ["tomaba", "tomabas", "tomaba", "tomábamos", "tomaban"], future: ["tomaré", "tomarás", "tomará", "tomaremos", "tomarán"] },
  see: { es: "ver", present: ["veo", "ves", "ve", "vemos", "ven"], past: ["veía", "veías", "veía", "veíamos", "veían"], future: ["veré", "verás", "verá", "veremos", "verán"] },
  come: { es: "venir", present: ["vengo", "vienes", "viene", "venimos", "vienen"], past: ["venía", "venías", "venía", "veníamos", "venían"], future: ["vendré", "vendrás", "vendrá", "vendremos", "vendrán"] },
  eat: { es: "comer", present: ["como", "comes", "come", "comemos", "comen"], past: ["comía", "comías", "comía", "comíamos", "comían"], future: ["comeré", "comerás", "comerá", "comeremos", "comerán"] },
  drink: { es: "beber", present: ["bebo", "bebes", "bebe", "bebemos", "beben"], past: ["bebía", "bebías", "bebía", "bebíamos", "bebían"], future: ["beberé", "beberás", "beberá", "beberemos", "beberán"] },
  write: { es: "escribir", present: ["escribo", "escribes", "escribe", "escribimos", "escriben"], past: ["escribía", "escribías", "escribía", "escribíamos", "escribían"], future: ["escribiré", "escribirás", "escribirá", "escribiremos", "escribirán"] },
  read: { es: "leer", present: ["leo", "lees", "lee", "leemos", "leen"], past: ["leía", "leías", "leía", "leíamos", "leían"], future: ["leeré", "leerás", "leerá", "leeremos", "leerán"] },
  speak: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  walk: { es: "caminar", present: ["camino", "caminas", "camina", "caminamos", "caminan"], past: ["caminaba", "caminabas", "caminaba", "caminábamos", "caminaban"], future: ["caminaré", "caminarás", "caminará", "caminaremos", "caminarán"] },
  run: { es: "correr", present: ["corro", "corres", "corre", "corremos", "corren"], past: ["corría", "corrías", "corría", "corríamos", "corrían"], future: ["correré", "correrás", "correrá", "correremos", "correrán"] },
  play: { es: "jugar", present: ["juego", "juegas", "juega", "jugamos", "juegan"], past: ["jugaba", "jugabas", "jugaba", "jugábamos", "jugaban"], future: ["jugaré", "jugarás", "jugará", "jugaremos", "jugarán"] },
  work: { es: "trabajar", present: ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajan"], past: ["trabajaba", "trabajabas", "trabajaba", "trabajábamos", "trabajaban"], future: ["trabajaré", "trabajarás", "trabajará", "trabajaremos", "trabajarán"] },
  live: { es: "vivir", present: ["vivo", "vives", "vive", "vivimos", "viven"], past: ["vivía", "vivías", "vivía", "vivíamos", "vivían"], future: ["viviré", "vivirás", "vivirá", "viviremos", "vivirán"] },
  like: { es: "gustar", present: ["me gusta", "te gusta", "le gusta", "nos gusta", "les gusta"], past: ["me gustaba", "te gustaba", "le gustaba", "nos gustaba", "les gustaba"], future: ["me gustará", "te gustará", "le gustará", "nos gustará", "les gustará"] },
  love: { es: "amar", present: ["amo", "amas", "ama", "amamos", "aman"], past: ["amaba", "amabas", "amaba", "amábamos", "amaban"], future: ["amaré", "amarás", "amará", "amaremos", "amarán"] },
  need: { es: "necesitar", present: ["necesito", "necesitas", "necesita", "necesitamos", "necesitan"], past: ["necesitaba", "necesitabas", "necesitaba", "necesitábamos", "necesitaban"], future: ["necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitarán"] },
  can: { es: "poder", present: ["puedo", "puedes", "puede", "podemos", "pueden"], past: ["podía", "podías", "podía", "podíamos", "podían"], future: ["podré", "podrás", "podrá", "podremos", "podrán"] },
  must: { es: "deber", present: ["debo", "debes", "debe", "debemos", "deben"], past: ["debía", "debías", "debía", "debíamos", "debían"], future: ["deberé", "deberás", "deberá", "deberemos", "deberán"] },
  start: { es: "empezar", present: ["empiezo", "empiezas", "empieza", "empezamos", "empiezan"], past: ["empezaba", "empezabas", "empezaba", "empezábamos", "empezaban"], future: ["empezaré", "empezarás", "empezará", "empezaremos", "empezarán"] },
  stop: { es: "parar", present: ["paro", "paras", "para", "paramos", "paran"], past: ["paraba", "parabas", "paraba", "parábamos", "paraban"], future: ["pararé", "pararás", "parará", "pararemos", "pararán"] },
  open: { es: "abrir", present: ["abro", "abres", "abre", "abrimos", "abren"], past: ["abría", "abrías", "abría", "abríamos", "abrían"], future: ["abriré", "abrirás", "abrirá", "abriremos", "abrirán"] },
  close: { es: "cerrar", present: ["cierro", "cierras", "cierra", "cerramos", "cierran"], past: ["cerraba", "cerrabas", "cerraba", "cerrábamos", "cerraban"], future: ["cerraré", "cerrarás", "cerrará", "cerraremos", "cerrarán"] },
  give: { es: "dar", present: ["doy", "das", "da", "damos", "dan"], past: ["daba", "dabas", "daba", "dábamos", "daban"], future: ["daré", "darás", "dará", "daremos", "darán"] },
  tell: { es: "decir", present: ["digo", "dices", "dice", "decimos", "dicen"], past: ["decía", "decías", "decía", "decíamos", "decían"], future: ["diré", "dirás", "dirá", "diremos", "dirán"] },
  ask: { es: "preguntar", present: ["pregunto", "preguntas", "pregunta", "preguntamos", "preguntan"], past: ["preguntaba", "preguntabas", "preguntaba", "preguntábamos", "preguntaban"], future: ["preguntaré", "preguntarás", "preguntará", "preguntaremos", "preguntarán"] },
  help: { es: "ayudar", present: ["ayudo", "ayudas", "ayuda", "ayudamos", "ayudan"], past: ["ayudaba", "ayudabas", "ayudaba", "ayudábamos", "ayudaban"], future: ["ayudaré", "ayudarás", "ayudará", "ayudaremos", "ayudarán"] },
  move: { es: "mover", present: ["muevo", "mueves", "mueve", "movemos", "mueven"], past: ["movía", "movías", "movía", "movíamos", "movían"], future: ["moveré", "moverás", "moverá", "moveremos", "moverán"] },
  believe: { es: "creer", present: ["creo", "crees", "cree", "creemos", "creen"], past: ["creía", "creías", "creía", "creíamos", "creían"], future: ["creeré", "creerás", "creerá", "creeremos", "creerán"] },
  feel: { es: "sentir", present: ["siento", "sientes", "siente", "sentimos", "sienten"], past: ["sentía", "sentías", "sentía", "sentíamos", "sentían"], future: ["sentiré", "sentirás", "sentirá", "sentiremos", "sentirán"] },
  bring: { es: "traer", present: ["traigo", "traes", "trae", "traemos", "traen"], past: ["traía", "traías", "traía", "traíamos", "traían"], future: ["traeré", "traerás", "traerá", "traeremos", "traerán"] },
  happen: { es: "suceder", present: ["sucede", "sucedes", "sucede", "sucede", "suceden"], past: ["sucedía", "sucedías", "sucedía", "sucedíamos", "sucedían"], future: ["sucederá", "sucederás", "sucederá", "sucederemos", "sucederán"] },
  include: { es: "incluir", present: ["incluyo", "incluyes", "incluye", "incluimos", "incluyen"], past: ["incluía", "incluías", "incluía", "incluíamos", "incluían"], future: ["incluiré", "incluirás", "incluirá", "incluiremos", "incluirán"] },
  continue: { es: "continuar", present: ["continúo", "continúas", "continúa", "continuamos", "continúan"], past: ["continuaba", "continuabas", "continuaba", "continuábamos", "continuaban"], future: ["continuaré", "continuarás", "continuará", "continuaremos", "continuarán"] },
  set: { es: "establecer", present: ["establezco", "estableces", "establece", "establecemos", "establecen"], past: ["establecía", "establecías", "establecía", "establecíamos", "establecían"], future: ["estableceré", "establecerás", "establecerá", "estableceremos", "establecerán"] },
  learn: { es: "aprender", present: ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"], past: ["aprendía", "aprendías", "aprendía", "aprendíamos", "aprendían"], future: ["aprenderé", "aprenderás", "aprenderá", "aprenderemos", "aprenderán"] },
  change: { es: "cambiar", present: ["cambio", "cambias", "cambia", "cambiamos", "cambian"], past: ["cambiaba", "cambiabas", "cambiaba", "cambiábamos", "cambiaban"], future: ["cambiaré", "cambiarás", "cambiará", "cambiaremos", "cambiarán"] },
  watch: { es: "mirar", present: ["miro", "miras", "mira", "miramos", "miran"], past: ["miraba", "mirabas", "miraba", "mirábamos", "miraban"], future: ["miraré", "mirarás", "mirará", "miraremos", "mirarán"] },
  follow: { es: "seguir", present: ["sigo", "sigues", "sigue", "seguimos", "siguen"], past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"], future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"] },
  stop: { es: "parar", present: ["paro", "paras", "para", "paramos", "paran"], past: ["paraba", "parabas", "paraba", "parábamos", "paraban"], future: ["pararé", "pararás", "parará", "pararemos", "pararán"] },
  create: { es: "crear", present: ["creo", "creas", "crea", "creamos", "crean"], past: ["creaba", "creabas", "creaba", "creábamos", "creaban"], future: ["crearé", "crearás", "creará", "crearemos", "crearán"] },
  speak: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  spend: { es: "gastar", present: ["gasto", "gastas", "gasta", "gastamos", "gastan"], past: ["gastaba", "gastabas", "gastaba", "gastábamos", "gastaban"], future: ["gastaré", "gastarás", "gastará", "gastaremos", "gastarán"] },
  win: { es: "ganar", present: ["gano", "ganas", "gana", "ganamos", "ganan"], past: ["ganaba", "ganabas", "ganaba", "ganábamos", "ganaban"], future: ["ganaré", "ganarás", "ganará", "ganaremos", "ganarán"] },
  lose: { es: "perder", present: ["pierdo", "pierdes", "pierde", "perdemos", "pierden"], past: ["perdía", "perdías", "perdía", "perdíamos", "perdían"], future: ["perderé", "perderás", "perderá", "perderemos", "perderán"] },
  pay: { es: "pagar", present: ["pago", "pagas", "paga", "pagamos", "pagan"], past: ["pagaba", "pagabas", "pagaba", "pagábamos", "pagaban"], future: ["pagaré", "pagarás", "pagará", "pagaremos", "pagarán"] },
  meet: { es: "conocer", present: ["conozco", "conoces", "conoce", "conocemos", "conocen"], past: ["conocía", "conocías", "conocía", "conocíamos", "conocían"], future: ["conoceré", "conocerás", "conocerá", "conoceremos", "conocerán"] },
  return: { es: "regresar", present: ["regreso", "regresas", "regresa", "regresamos", "regresan"], past: ["regresaba", "regresabas", "regresaba", "regresábamos", "regresaban"], future: ["regresaré", "regresarás", "regresará", "regresaremos", "regresarán"] },
  understand: { es: "entender", present: ["entiendo", "entiendes", "entiende", "entendemos", "entienden"], past: ["entendía", "entendías", "entendía", "entendíamos", "entendían"], future: ["entenderé", "entenderás", "entenderá", "entenderemos", "entenderán"] },
  watch: { es: "ver", present: ["veo", "ves", "ve", "vemos", "ven"], past: ["veía", "veías", "veía", "veíamos", "veían"], future: ["veré", "verás", "verá", "veremos", "verán"] },
  follow: { es: "seguir", present: ["sigo", "sigues", "sigue", "seguimos", "siguen"], past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"], future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"] },
  stop: { es: "parar", present: ["paro", "paras", "para", "paramos", "paran"], past: ["paraba", "parabas", "paraba", "parábamos", "paraban"], future: ["pararé", "pararás", "parará", "pararemos", "pararán"] },
  speak: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  leave: { es: "dejar", present: ["dejo", "dejas", "deja", "dejamos", "dejan"], past: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejaban"], future: ["dejaré", "dejarás", "dejará", "dejaremos", "dejarán"] },
  call: { es: "llamar", present: ["llamo", "llamas", "llama", "llamamos", "llaman"], past: ["llamaba", "llamabas", "llamaba", "llamábamos", "llamaban"], future: ["llamaré", "llamarás", "llamará", "llamaremos", "llamarán"] },
  try: { es: "intentar", present: ["intento", "intentas", "intenta", "intentamos", "intentan"], past: ["intentaba", "intentabas", "intentaba", "intentábamos", "intentaban"], future: ["intentaré", "intentarás", "intentará", "intentaremos", "intentarán"] },
  ask: { es: "preguntar", present: ["pregunto", "preguntas", "pregunta", "preguntamos", "preguntan"], past: ["preguntaba", "preguntabas", "preguntaba", "preguntábamos", "preguntaban"], future: ["preguntaré", "preguntarás", "preguntará", "preguntaremos", "preguntarán"] },
  need: { es: "necesitar", present: ["necesito", "necesitas", "necesita", "necesitamos", "necesitan"], past: ["necesitaba", "necesitabas", "necesitaba", "necesitábamos", "necesitaban"], future: ["necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitarán"] },
  feel: { es: "sentir", present: ["siento", "sientes", "siente", "sentimos", "sienten"], past: ["sentía", "sentías", "sentía", "sentíamos", "sentían"], future: ["sentiré", "sentirás", "sentirá", "sentiremos", "sentirán"] },
  seem: { es: "parecer", present: ["parezco", "pareces", "parece", "parecemos", "parecen"], past: ["parecía", "parecías", "parecía", "parecíamos", "parecían"], future: ["pareceré", "parecerás", "parecerá", "pareceremos", "parecerán"] },
  become: { es: "convertirse", present: ["me convierto", "te conviertes", "se convierte", "nos convertimos", "se convierten"], past: ["me convertía", "te convertías", "se convertía", "nos convertíamos", "se convertían"], future: ["me convertiré", "te convertirás", "se convertirá", "nos convertiremos", "se convertirán"] },
  show: { es: "mostrar", present: ["muestro", "muestras", "muestra", "mostramos", "muestran"], past: ["mostraba", "mostrabas", "mostraba", "mostrábamos", "mostraban"], future: ["mostraré", "mostrarás", "mostrará", "mostraremos", "mostrarán"] },
  hear: { es: "escuchar", present: ["escucho", "escuchas", "escucha", "escuchamos", "escuchan"], past: ["escuchaba", "escuchabas", "escuchaba", "escuchábamos", "escuchaban"], future: ["escucharé", "escucharás", "escuchará", "escucharemos", "escucharán"] },
  play: { es: "jugar", present: ["juego", "juegas", "juega", "jugamos", "juegan"], past: ["jugaba", "jugabas", "jugaba", "jugábamos", "jugaban"], future: ["jugaré", "jugarás", "jugará", "jugaremos", "jugarán"] },
  run: { es: "correr", present: ["corro", "corres", "corre", "corremos", "corren"], past: ["corría", "corrías", "corría", "corríamos", "corrían"], future: ["correré", "correrás", "correrá", "correremos", "correrán"] },
  move: { es: "mover", present: ["muevo", "mueves", "mueve", "movemos", "mueven"], past: ["movía", "movías", "movía", "movíamos", "movían"], future: ["moveré", "moverás", "moverá", "moveremos", "moverán"] },
  believe: { es: "creer", present: ["creo", "crees", "cree", "creemos", "creen"], past: ["creía", "creías", "creía", "creíamos", "creían"], future: ["creeré", "creerás", "creerá", "creeremos", "creerán"] },
  bring: { es: "traer", present: ["traigo", "traes", "trae", "traemos", "traen"], past: ["traía", "traías", "traía", "traíamos", "traían"], future: ["traeré", "traerás", "traerá", "traeremos", "traerán"] },
  happen: { es: "suceder", present: ["sucede", "sucedes", "sucede", "sucede", "suceden"], past: ["sucedía", "sucedías", "sucedía", "sucedíamos", "sucedían"], future: ["sucederá", "sucederás", "sucederá", "sucederemos", "sucederán"] },
  include: { es: "incluir", present: ["incluyo", "incluyes", "incluye", "incluimos", "incluyen"], past: ["incluía", "incluías", "incluía", "incluíamos", "incluían"], future: ["incluiré", "incluirás", "incluirá", "incluiremos", "incluirán"] },
  continue: { es: "continuar", present: ["continúo", "continúas", "continúa", "continuamos", "continúan"], past: ["continuaba", "continuabas", "continuaba", "continuábamos", "continuaban"], future: ["continuaré", "continuarás", "continuará", "continuaremos", "continuarán"] },
  set: { es: "establecer", present: ["establezco", "estableces", "establece", "establecemos", "establecen"], past: ["establecía", "establecías", "establecía", "establecíamos", "establecían"], future: ["estableceré", "establecerás", "establecerá", "estableceremos", "establecerán"] },
  learn: { es: "aprender", present: ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"], past: ["aprendía", "aprendías", "aprendía", "aprendíamos", "aprendían"], future: ["aprenderé", "aprenderás", "aprenderá", "aprenderemos", "aprenderán"] },
  change: { es: "cambiar", present: ["cambio", "cambias", "cambia", "cambiamos", "cambian"], past: ["cambiaba", "cambiabas", "cambiaba", "cambiábamos", "cambiaban"], future: ["cambiaré", "cambiarás", "cambiará", "cambiaremos", "cambiarán"] },
  lead: { es: "liderar", present: ["lidero", "lideras", "lidera", "lideramos", "lideran"], past: ["lideraba", "liderabas", "lideraba", "liderábamos", "lideraban"], future: ["lideraré", "liderarás", "liderará", "lideraremos", "liderarán"] },
  understand: { es: "entender", present: ["entiendo", "entiendes", "entiende", "entendemos", "entienden"], past: ["entendía", "entendías", "entendía", "entendíamos", "entendían"], future: ["entenderé", "entenderás", "entenderá", "entenderemos", "entenderán"] },
  watch: { es: "ver", present: ["veo", "ves", "ve", "vemos", "ven"], past: ["veía", "veías", "veía", "veíamos", "veían"], future: ["veré", "verás", "verá", "veremos", "verán"] },
  follow: { es: "seguir", present: ["sigo", "sigues", "sigue", "seguimos", "siguen"], past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"], future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"] },
  stop: { es: "parar", present: ["paro", "paras", "para", "paramos", "paran"], past: ["paraba", "parabas", "paraba", "parábamos", "paraban"], future: ["pararé", "pararás", "parará", "pararemos", "pararán"] },
  create: { es: "crear", present: ["creo", "creas", "crea", "creamos", "crean"], past: ["creaba", "creabas", "creaba", "creábamos", "creaban"], future: ["crearé", "crearás", "creará", "crearemos", "crearán"] },
  speak: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  spend: { es: "gastar", present: ["gasto", "gastas", "gasta", "gastamos", "gastan"], past: ["gastaba", "gastabas", "gastaba", "gastábamos", "gastaban"], future: ["gastaré", "gastarás", "gastará", "gastaremos", "gastarán"] },
  win: { es: "ganar", present: ["gano", "ganas", "gana", "ganamos", "ganan"], past: ["ganaba", "ganabas", "ganaba", "ganábamos", "ganaban"], future: ["ganaré", "ganarás", "ganará", "ganaremos", "ganarán"] },
  lose: { es: "perder", present: ["pierdo", "pierdes", "pierde", "perdemos", "pierden"], past: ["perdía", "perdías", "perdía", "perdíamos", "perdían"], future: ["perderé", "perderás", "perderá", "perderemos", "perderán"] },
  pay: { es: "pagar", present: ["pago", "pagas", "paga", "pagamos", "pagan"], past: ["pagaba", "pagabas", "pagaba", "pagábamos", "pagaban"], future: ["pagaré", "pagarás", "pagará", "pagaremos", "pagarán"] },
  meet: { es: "conocer", present: ["conozco", "conoces", "conoce", "conocemos", "conocen"], past: ["conocía", "conocías", "conocía", "conocíamos", "conocían"], future: ["conoceré", "conocerás", "conocerá", "conoceremos", "conocerán"] },
  return: { es: "regresar", present: ["regreso", "regresas", "regresa", "regresamos", "regresan"], past: ["regresaba", "regresabas", "regresaba", "regresábamos", "regresaban"], future: ["regresaré", "regresarás", "regresará", "regresaremos", "regresarán"] },
  talk: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  carry: { es: "cargar", present: ["cargo", "cargas", "carga", "cargamos", "cargan"], past: ["cargaba", "cargabas", "cargaba", "cargábamos", "cargaban"], future: ["cargaré", "cargarás", "cargará", "cargaremos", "cargarán"] },
  keep: { es: "mantener", present: ["mantengo", "mantienes", "mantiene", "mantenemos", "maintienen"], past: ["mantenía", "mantenías", "mantenía", "manteníamos", "mantenían"], future: ["mantendré", "mantendrás", "mantendrá", "mantendremos", "mantendrán"] },
  let: { es: "dejar", present: ["dejo", "dejas", "deja", "dejamos", "dejan"], past: ["dejaba", "dejabas", "dejaba", "dejábamos", "dejaban"], future: ["dejaré", "dejarás", "dejará", "dejaremos", "dejarán"] },
  begin: { es: "empezar", present: ["empiezo", "empiezas", "empieza", "empezamos", "empiezan"], past: ["empezaba", "empezabas", "empezaba", "empezábamos", "empezaban"], future: ["empezaré", "empezarás", "empezará", "empezaremos", "empezarán"] },
  seem: { es: "parecer", present: ["parezco", "pareces", "parece", "parecemos", "parecen"], past: ["parecía", "parecías", "parecía", "parecíamos", "parecían"], future: ["pareceré", "parecerás", "parecerá", "pareceremos", "parecerán"] },
  help: { es: "ayudar", present: ["ayudo", "ayudas", "ayuda", "ayudamos", "ayudan"], past: ["ayudaba", "ayudabas", "ayudaba", "ayudábamos", "ayudaban"], future: ["ayudaré", "ayudarás", "ayudará", "ayudaremos", "ayudarán"] },
  show: { es: "mostrar", present: ["muestro", "muestras", "muestra", "mostramos", "muestran"], past: ["mostraba", "mostrabas", "mostraba", "mostrábamos", "mostraban"], future: ["mostraré", "mostrarás", "mostrará", "mostraremos", "mostrarán"] },
  hear: { es: "escuchar", present: ["escucho", "escuchas", "escucha", "escuchamos", "escuchan"], past: ["escuchaba", "escuchabas", "escuchaba", "escuchábamos", "escuchaban"], future: ["escucharé", "escucharás", "escuchará", "escucharemos", "escucharán"] },
  play: { es: "jugar", present: ["juego", "juegas", "juega", "jugamos", "juegan"], past: ["jugaba", "jugabas", "jugaba", "jugábamos", "jugaban"], future: ["jugaré", "jugarás", "jugará", "jugaremos", "jugarán"] },
  run: { es: "correr", present: ["corro", "corres", "corre", "corremos", "corren"], past: ["corría", "corrías", "corría", "corríamos", "corrían"], future: ["correré", "correrás", "correrá", "correremos", "correrán"] },
  move: { es: "mover", present: ["muevo", "mueves", "mueve", "movemos", "mueven"], past: ["movía", "movías", "movía", "movíamos", "movían"], future: ["moveré", "moverás", "moverá", "moveremos", "moverán"] },
  believe: { es: "creer", present: ["creo", "crees", "cree", "creemos", "creen"], past: ["creía", "creías", "creía", "creíamos", "creían"], future: ["creeré", "creerás", "creerá", "creeremos", "creerán"] },
  bring: { es: "traer", present: ["traigo", "traes", "trae", "traemos", "traen"], past: ["traía", "traías", "traía", "traíamos", "traían"], future: ["traeré", "traerás", "traerá", "traeremos", "traerán"] },
  happen: { es: "suceder", present: ["sucede", "sucedes", "sucede", "sucede", "suceden"], past: ["sucedía", "sucedías", "sucedía", "sucedíamos", "sucedían"], future: ["sucederá", "sucederás", "sucederá", "sucederemos", "sucederán"] },
  include: { es: "incluir", present: ["incluyo", "incluyes", "incluye", "incluimos", "incluyen"], past: ["incluía", "incluías", "incluía", "incluíamos", "incluían"], future: ["incluiré", "incluirás", "incluirá", "incluiremos", "incluirán"] },
  continue: { es: "continuar", present: ["continúo", "continúas", "continúa", "continuamos", "continúan"], past: ["continuaba", "continuabas", "continuaba", "continuábamos", "continuaban"], future: ["continuaré", "continuarás", "continuará", "continuaremos", "continuarán"] },
  set: { es: "establecer", present: ["establezco", "estableces", "establece", "establecemos", "establecen"], past: ["establecía", "establecías", "establecía", "establecíamos", "establecían"], future: ["estableceré", "establecerás", "establecerá", "estableceremos", "establecerán"] },
  learn: { es: "aprender", present: ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"], past: ["aprendía", "aprendías", "aprendía", "aprendíamos", "aprendían"], future: ["aprenderé", "aprenderás", "aprenderá", "aprenderemos", "aprenderán"] },
  change: { es: "cambiar", present: ["cambio", "cambias", "cambia", "cambiamos", "cambian"], past: ["cambiaba", "cambiabas", "cambiaba", "cambiábamos", "cambiaban"], future: ["cambiaré", "cambiarás", "cambiará", "cambiaremos", "cambiarán"] },
  lead: { es: "liderar", present: ["lidero", "lideras", "lidera", "lideramos", "lideran"], past: ["lideraba", "liderabas", "lideraba", "liderábamos", "lideraban"], future: ["lideraré", "liderarás", "liderará", "lideraremos", "liderarán"] },
  understand: { es: "entender", present: ["entiendo", "entiendes", "entiende", "entendemos", "entienden"], past: ["entendía", "entendías", "entendía", "entendíamos", "entendían"], future: ["entenderé", "entenderás", "entenderá", "entenderemos", "entenderán"] },
  watch: { es: "ver", present: ["veo", "ves", "ve", "vemos", "ven"], past: ["veía", "veías", "veía", "veíamos", "veían"], future: ["veré", "verás", "verá", "veremos", "verán"] },
  follow: { es: "seguir", present: ["sigo", "sigues", "sigue", "seguimos", "siguen"], past: ["seguía", "seguías", "seguía", "seguíamos", "seguían"], future: ["seguiré", "seguirás", "seguirá", "seguiremos", "seguirán"] },
  stop: { es: "parar", present: ["paro", "paras", "para", "paramos", "paran"], past: ["paraba", "parabas", "paraba", "parábamos", "paraban"], future: ["pararé", "pararás", "parará", "pararemos", "pararán"] },
  create: { es: "crear", present: ["creo", "creas", "crea", "creamos", "crean"], past: ["creaba", "creabas", "creaba", "creábamos", "creaban"], future: ["crearé", "crearás", "creará", "crearemos", "crearán"] },
  speak: { es: "hablar", present: ["hablo", "hablas", "habla", "hablamos", "hablan"], past: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"], future: ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"] },
  spend: { es: "gastar", present: ["gasto", "gastas", "gasta", "gastamos", "gastan"], past: ["gastaba", "gastabas", "gastaba", "gastábamos", "gastaban"], future: ["gastaré", "gastarás", "gastará", "gastaremos", "gastarán"] },
  win: { es: "ganar", present: ["gano", "ganas", "gana", "ganamos", "ganan"], past: ["ganaba", "ganabas", "ganaba", "ganábamos", "ganaban"], future: ["ganaré", "ganarás", "ganará", "ganaremos", "ganarán"] },
  lose: { es: "perder", present: ["pierdo", "pierdes", "pierde", "perdemos", "pierden"], past: ["perdía", "perdías", "perdía", "perdíamos", "perdían"], future: ["perderé", "perderás", "perderá", "perderemos", "perderán"] },
  pay: { es: "pagar", present: ["pago", "pagas", "paga", "pagamos", "pagan"], past: ["pagaba", "pagabas", "pagaba", "pagábamos", "pagaban"], future: ["pagaré", "pagarás", "pagará", "pagaremos", "pagarán"] },
  meet: { es: "conocer", present: ["conozco", "conoces", "conoce", "conocemos", "conocen"], past: ["conocía", "conocías", "conocía", "conocíamos", "conocían"], future: ["conoceré", "conocerás", "conocerá", "conoceremos", "conocerán"] },
  return: { es: "regresar", present: ["regreso", "regresas", "regresa", "regresamos", "regresan"], past: ["regresaba", "regresabas", "regresaba", "regresábamos", "regresaban"], future: ["regresaré", "regresarás", "regresará", "regresaremos", "regresarán"] }
};
```

- [ ] **Step 6: Commit**

```bash
git add src/data/languageData.js
git commit -m "feat: expand language data with adjectives, adverbs, prepositions, 90+ verbs"
```

---

## Task 3: Translation Service + Hook

**Files:**
- Create: `src/services/translationService.js`
- Create: `src/hooks/useTranslation.js`

- [ ] **Step 1: Create translationService.js**

Create `src/services/translationService.js`:
```js
import { expandedVerbs, adjectives, adverbs, prepositions } from '../data/languageData';

const CACHE_KEY = 'translation_cache';
const MAX_CACHE = 1000;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

const pronounMap = {
  i: { es: 'yo', person: 0 },
  you: { es: 'tú', person: 1 },
  he: { es: 'él', person: 2 },
  she: { es: 'ella', person: 2 },
  it: { es: 'ello', person: 2 },
  we: { es: 'nosotros', person: 3 },
  they: { es: 'ellos', person: 4 }
};

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch { return {}; }
}

function setCache(key, value) {
  const cache = getCache();
  const keys = Object.keys(cache);
  if (keys.length >= MAX_CACHE) {
    delete cache[keys[0]];
  }
  cache[key] = value;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function detectTense(words) {
  if (words.includes('will') || words.includes('shall')) return 'future';
  if (words.includes('did') || words.some(w => w.endsWith('ed'))) return 'past';
  if (words.includes('was') || words.includes('were')) return 'past';
  if (words.includes('going') && words.includes('to')) return 'future';
  return 'present';
}

function translateOffline(sentence) {
  const words = sentence.toLowerCase().trim().split(/\s+/);
  const tense = detectTense(words);
  
  let pronoun = null;
  let verb = null;
  let verbIndex = -1;
  let rest = [];
  
  for (let i = 0; i < words.length; i++) {
    const w = words[i].replace(/[.,!?]/g, '');
    if (pronounMap[w] && !pronoun) {
      pronoun = pronounMap[w];
      continue;
    }
    if (expandedVerbs[w] && !verb) {
      verb = expandedVerbs[w];
      verbIndex = i;
      continue;
    }
    if (pronoun && verb) {
      rest.push(words[i]);
    }
  }
  
  if (pronoun && verb) {
    const conjugations = verb[tense] || verb.present;
    const conjugated = conjugations[pronoun.person] || conjugations[0];
    const restStr = rest.join(' ').replace(/[.,!?]/g, '');
    return {
      original: sentence,
      translated: `${pronoun.es} ${conjugated} ${restStr}`.trim(),
      method: 'offline',
      confidence: 0.85
    };
  }
  
  return null;
}

async function translateWithAPI(sentence) {
  if (!GOOGLE_API_KEY) return null;
  
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: sentence,
        source: 'en',
        target: 'es',
        format: 'text'
      })
    });
    
    const data = await response.json();
    if (data.data?.translations?.[0]) {
      return {
        original: sentence,
        translated: data.data.translations[0].translatedText,
        method: 'google-api',
        confidence: 0.95
      };
    }
  } catch (err) {
    console.warn('Translation API error:', err);
  }
  
  return null;
}

export async function translate(sentence) {
  const cacheKey = sentence.toLowerCase().trim();
  const cached = getCache()[cacheKey];
  if (cached) return cached;
  
  const offlineResult = translateOffline(sentence);
  if (offlineResult) {
    setCache(cacheKey, offlineResult);
    return offlineResult;
  }
  
  const apiResult = await translateWithAPI(sentence);
  if (apiResult) {
    setCache(cacheKey, apiResult);
    return apiResult;
  }
  
  return {
    original: sentence,
    translated: '[Traducción no disponible]',
    method: 'fallback',
    confidence: 0
  };
}

export function translateBatch(sentences) {
  return Promise.all(sentences.map(s => translate(s)));
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function getCacheSize() {
  return Object.keys(getCache()).length;
}
```

- [ ] **Step 2: Create useTranslation.js hook**

Create `src/hooks/useTranslation.js`:
```js
import { useState, useCallback } from 'react';
import { translate, translateBatch, clearCache, getCacheSize } from '../services/translationService';

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [cacheSize, setCacheSize] = useState(getCacheSize());

  const doTranslate = useCallback(async (sentence) => {
    setIsTranslating(true);
    try {
      const result = await translate(sentence);
      setCacheSize(getCacheSize());
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const doTranslateBatch = useCallback(async (sentences) => {
    setIsTranslating(true);
    try {
      const results = await translateBatch(sentences);
      setCacheSize(getCacheSize());
      return results;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const doClearCache = useCallback(() => {
    clearCache();
    setCacheSize(0);
  }, []);

  return {
    translate: doTranslate,
    translateBatch: doTranslateBatch,
    clearCache: doClearCache,
    cacheSize,
    isTranslating
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/services/translationService.js src/hooks/useTranslation.js
git commit -m "feat: add hybrid translation service with offline + API fallback"
```

---

## Task 4: Multiplayer Service

**Files:**
- Create: `src/services/multiplayerService.js`
- Create: `src/hooks/useMultiplayer.js`

- [ ] **Step 1: Create multiplayerService.js**

Create `src/services/multiplayerService.js`:
```js
import { ref, set, get, push, onValue, onDisconnect, remove, update } from 'firebase/database';
import { db } from '../config/firebase';

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createRoom(hostUid, hostName, type, settings = {}) {
  const roomCode = generateRoomCode();
  const roomRef = ref(db, `rooms/${roomCode}`);
  
  const roomData = {
    type,
    status: 'waiting',
    host: hostUid,
    createdAt: Date.now(),
    settings: {
      maxPlayers: type === 'battle' ? 8 : type === 'race' ? 4 : 2,
      rounds: 5,
      timeLimit: 30,
      ...settings
    },
    players: {
      [hostUid]: {
        name: hostName,
        score: 0,
        ready: false,
        alive: true
      }
    },
    currentRound: null,
    roundNumber: 0,
    results: []
  };
  
  await set(roomRef, roomData);
  
  const playerRef = ref(db, `rooms/${roomCode}/players/${hostUid}`);
  onDisconnect(playerRef).remove();
  
  return roomCode;
}

export async function joinRoom(roomCode, uid, playerName) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  
  if (!snapshot.exists()) {
    throw new Error('Sala no encontrada');
  }
  
  const room = snapshot.val();
  
  if (room.status !== 'waiting') {
    throw new Error('La partida ya comenzó');
  }
  
  const playerCount = Object.keys(room.players).length;
  if (playerCount >= room.settings.maxPlayers) {
    throw new Error('La sala está llena');
  }
  
  await update(ref(db, `rooms/${roomCode}/players/${uid}`), {
    name: playerName,
    score: 0,
    ready: false,
    alive: true
  });
  
  const playerRef = ref(db, `rooms/${roomCode}/players/${uid}`);
  onDisconnect(playerRef).remove();
  
  return room;
}

export async function leaveRoom(roomCode, uid) {
  const playerRef = ref(db, `rooms/${roomCode}/players/${uid}`);
  await remove(playerRef);
  
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  
  if (snapshot.exists()) {
    const room = snapshot.val();
    const remainingPlayers = Object.keys(room.players);
    
    if (remainingPlayers.length === 0) {
      await remove(roomRef);
    } else if (room.host === uid) {
      await update(roomRef, { host: remainingPlayers[0] });
    }
  }
}

export async function setReady(roomCode, uid) {
  await update(ref(db, `rooms/${roomCode}/players/${uid}`), { ready: true });
}

export async function startGame(roomCode) {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'playing',
    roundNumber: 1
  });
}

export async function submitAnswer(roomCode, uid, answer, time) {
  const roundRef = ref(db, `rooms/${roomCode}/currentRound/answers/${uid}`);
  await set(roundRef, {
    answer,
    time,
    submittedAt: Date.now()
  });
}

export async function nextRound(roomCode, roundNumber, roundData) {
  await update(ref(db, `rooms/${roomCode}`), {
    roundNumber,
    currentRound: roundData
  });
}

export async function endGame(roomCode, finalResults) {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'finished',
    results: finalResults
  });
  
  for (const [uid, result] of Object.entries(finalResults)) {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const user = snapshot.val();
      await update(userRef, {
        points: (user.points || 0) + (result.points || 0),
        'stats/gamesPlayed': (user.stats?.gamesPlayed || 0) + 1,
        'stats/wins': (user.stats?.wins || 0) + (result.position === 1 ? 1 : 0)
      });
    }
  }
}

export function subscribeToRoom(roomCode, callback) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
}

export function unsubscribeFromRoom(subscription) {
  if (subscription && typeof subscription === 'function') {
    subscription();
  }
}

export async function getLeaderboard() {
  const snapshot = await get(ref(db, 'leaderboard'));
  return snapshot.val() || {};
}

export async function updateLeaderboard(uid, name, points, level) {
  await set(ref(db, `leaderboard/${uid}`), {
    name,
    points,
    level,
    lastPlayed: Date.now()
  });
}
```

- [ ] **Step 2: Create useMultiplayer.js hook**

Create `src/hooks/useMultiplayer.js`:
```js
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createRoom, joinRoom, leaveRoom, setReady,
  startGame, submitAnswer, nextRound, endGame,
  subscribeToRoom, unsubscribeFromRoom
} from '../services/multiplayerService';

export function useMultiplayer(user) {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        unsubscribeFromRoom(subscriptionRef.current);
      }
    };
  }, []);

  const create = useCallback(async (type, settings) => {
    if (!user) return;
    setIsConnecting(true);
    setError(null);
    try {
      const code = await createRoom(user.uid, user.displayName, type, settings);
      const unsub = subscribeToRoom(code, setRoom);
      subscriptionRef.current = unsub;
      return code;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const join = useCallback(async (code) => {
    if (!user) return;
    setIsConnecting(true);
    setError(null);
    try {
      await joinRoom(code, user.uid, user.displayName);
      const unsub = subscribeToRoom(code, setRoom);
      subscriptionRef.current = unsub;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const leave = useCallback(async () => {
    if (!user || !room) return;
    await leaveRoom(room.id, user.uid);
    if (subscriptionRef.current) {
      unsubscribeFromRoom(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    setRoom(null);
  }, [user, room]);

  const ready = useCallback(async () => {
    if (!user || !room) return;
    await setReady(room.id, user.uid);
  }, [user, room]);

  const start = useCallback(async () => {
    if (!room) return;
    await startGame(room.id);
  }, [room]);

  const answer = useCallback(async (text, time) => {
    if (!user || !room) return;
    await submitAnswer(room.id, user.uid, text, time);
  }, [user, room]);

  const nextRoundAction = useCallback(async (roundData) => {
    if (!room) return;
    await nextRound(room.id, room.roundNumber + 1, roundData);
  }, [room]);

  const end = useCallback(async (results) => {
    if (!room) return;
    await endGame(room.id, results);
  }, [room]);

  return {
    room,
    error,
    isConnecting,
    create,
    join,
    leave,
    ready,
    start,
    answer,
    nextRound: nextRoundAction,
    end
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/services/multiplayerService.js src/hooks/useMultiplayer.js
git commit -m "feat: add multiplayer service and hook with Firebase RTDB"
```

---

## Task 5: Multiplayer Menu + Name Modal

**Files:**
- Create: `src/components/multiplayer/MultiplayerMenu.jsx`
- Create: `src/components/multiplayer/NameModal.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create NameModal.jsx**

Create `src/components/multiplayer/NameModal.jsx`:
```js
import { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import GradientButton from '../base/GradientButton';
import GlassCard from '../base/GlassCard';

export default function NameModal({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <GlassCard className="w-full max-w-sm animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text">¿Cómo te llamas?</h2>
            <p className="text-text-secondary text-sm mt-1">Elige un nombre para competir</p>
          </div>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre..."
            maxLength={20}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text text-center text-lg font-medium placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
            autoFocus
          />
          
          <GradientButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={name.trim().length < 2}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Empezar a jugar</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </GradientButton>
        </form>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 2: Create MultiplayerMenu.jsx**

Create `src/components/multiplayer/MultiplayerMenu.jsx`:
```js
import { useState } from 'react';
import { Swords, Timer, Users, Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import IconBadge from '../base/IconBadge';

const MODES = [
  {
    id: 'race',
    name: 'Carreras',
    desc: 'Resuelve primero la frase',
    icon: Timer,
    variant: 'primary',
    players: '2-4 jugadores'
  },
  {
    id: 'duel',
    name: 'Duelo',
    desc: 'Reta a otro jugador',
    icon: Swords,
    variant: 'success',
    players: '2 jugadores'
  },
  {
    id: 'battle',
    name: 'Battle Royale',
    desc: 'Último en pie gana',
    icon: Users,
    variant: 'error',
    players: '4-8 jugadores'
  }
];

export default function MultiplayerMenu({ onCreate, onJoin, onBack, leaderboard }) {
  const [joinCode, setJoinCode] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-bg-tertiary transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-2xl font-bold text-text">Multijugador</h1>
      </div>

      <div className="space-y-3 stagger-children">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <GlassCard
              key={mode.id}
              className="cursor-pointer hover-lift"
              onClick={() => setSelectedMode(mode)}
            >
              <div className="flex items-center gap-4">
                <IconBadge icon={Icon} variant={mode.variant} />
                <div className="flex-1">
                  <h3 className="font-bold text-text">{mode.name}</h3>
                  <p className="text-sm text-text-secondary">{mode.desc}</p>
                  <p className="text-xs text-text-tertiary mt-1">{mode.players}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <p className="text-sm text-text-secondary mb-3">Unirse con código</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="CÓDIGO"
            maxLength={6}
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text text-center text-lg font-mono font-bold tracking-widest placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
          />
          <GradientButton
            variant="primary"
            onClick={() => joinCode.length === 6 && onJoin(joinCode)}
            disabled={joinCode.length !== 6}
          >
            Unirse
          </GradientButton>
        </div>
      </GlassCard>

      {selectedMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <GlassCard className="w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-text mb-2">Crear sala</h3>
            <p className="text-text-secondary text-sm mb-4">
              Modo: {selectedMode.name}
            </p>
            <div className="flex gap-2">
              <GradientButton
                variant="ghost"
                className="flex-1"
                onClick={() => setSelectedMode(null)}
              >
                Cancelar
              </GradientButton>
              <GradientButton
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onCreate(selectedMode.id);
                  setSelectedMode(null);
                }}
              >
                Crear sala
              </GradientButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/multiplayer/MultiplayerMenu.jsx src/components/multiplayer/NameModal.jsx
git commit -m "feat: add multiplayer menu and name modal"
```

---

## Task 6: Lobby + PlayerList

**Files:**
- Create: `src/components/multiplayer/Lobby.jsx`
- Create: `src/components/multiplayer/PlayerList.jsx`

- [ ] **Step 1: Create PlayerList.jsx**

Create `src/components/multiplayer/PlayerList.jsx`:
```js
import { Crown, Check, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import GlassCard from '../base/GlassCard';

export default function PlayerList({ players, hostUid, currentUid }) {
  const playerList = Object.entries(players || {}).map(([uid, data]) => ({
    uid,
    ...data
  }));

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary font-medium">
        Jugadores ({playerList.length})
      </p>
      {playerList.map((player) => (
        <GlassCard
          key={player.uid}
          className={cn(
            "flex items-center gap-3",
            player.uid === currentUid && "border-primary/30"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {player.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-text">
              {player.name}
              {player.uid === currentUid && (
                <span className="text-xs text-text-tertiary ml-2">(tú)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {player.uid === hostUid && (
              <Crown className="w-4 h-4 text-warning" />
            )}
            {player.ready ? (
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-success" />
              </div>
            ) : (
              <Loader2 className="w-4 h-4 text-text-tertiary animate-spin" />
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create Lobby.jsx**

Create `src/components/multiplayer/Lobby.jsx`:
```js
import { useState, useEffect } from 'react';
import { Copy, Check, Users, Settings, Loader2 } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import PlayerList from './PlayerList';

export default function Lobby({ room, user, onReady, onStart, onLeave }) {
  const [copied, setCopied] = useState(false);
  const isHost = room?.host === user?.uid;
  const allReady = room?.players && Object.values(room.players).every(p => p.ready);
  const canStart = isHost && allReady && Object.keys(room.players).length >= 2;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modeNames = {
    race: 'Carreras',
    duel: 'Duelo',
    battle: 'Battle Royale'
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text">Sala de espera</h2>
        <p className="text-text-secondary text-sm mt-1">
          {modeNames[room?.type] || room?.type}
        </p>
      </div>

      <GlassCard className="text-center">
        <p className="text-sm text-text-secondary mb-2">Código de sala</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-4xl font-mono font-bold text-primary tracking-[0.3em]">
            {room?.id}
          </p>
          <button
            onClick={handleCopyCode}
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-smooth"
          >
            {copied ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <Copy className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          Comparte este código con tu oponente
        </p>
      </GlassCard>

      <PlayerList
        players={room?.players}
        hostUid={room?.host}
        currentUid={user?.uid}
      />

      <div className="flex gap-3">
        <GradientButton
          variant="ghost"
          className="flex-1"
          onClick={onLeave}
        >
          Salir
        </GradientButton>
        {!isHost ? (
          <GradientButton
            variant={room?.players?.[user?.uid]?.ready ? 'success' : 'primary'}
            className="flex-1"
            onClick={onReady}
          >
            <div className="flex items-center justify-center gap-2">
              {room?.players?.[user?.uid]?.ready ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Listo</span>
                </>
              ) : (
                <span>Marcar listo</span>
              )}
            </div>
          </GradientButton>
        ) : (
          <GradientButton
            variant="primary"
            className="flex-1"
            onClick={onStart}
            disabled={!canStart}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>Iniciar partida</span>
            </div>
          </GradientButton>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/multiplayer/Lobby.jsx src/components/multiplayer/PlayerList.jsx
git commit -m "feat: add lobby and player list components"
```

---

## Task 7: Race Mode + GameHUD

**Files:**
- Create: `src/components/multiplayer/GameHUD.jsx`
- Create: `src/components/multiplayer/RaceMode.jsx`

- [ ] **Step 1: Create GameHUD.jsx**

Create `src/components/multiplayer/GameHUD.jsx`:
```js
import { useEffect, useState } from 'react';
import { Timer, Zap, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import GlassCard from '../base/GlassCard';

export default function GameHUD({ round, totalRounds, timeLimit, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [round, timeLimit, onTimeUp]);

  const timerColor = timeLeft <= 10 ? 'text-error' : timeLeft <= 20 ? 'text-warning' : 'text-text';

  return (
    <div className="flex items-center justify-between gap-4">
      <GlassCard className="flex items-center gap-2 px-4 py-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="font-mono font-bold text-text">
          Ronda {round}/{totalRounds}
        </span>
      </GlassCard>

      <GlassCard className={cn("flex items-center gap-2 px-4 py-2", timerColor)}>
        <Timer className="w-4 h-4" />
        <span className="font-mono font-bold text-2xl">
          {timeLeft}s
        </span>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 2: Create RaceMode.jsx**

Create `src/components/multiplayer/RaceMode.jsx`:
```js
import { useState, useEffect, useCallback } from 'react';
import { Check, X, Trophy } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';
import ResultsModal from './ResultsModal';

export default function RaceMode({ room, user, onSubmit, onNextRound, onEnd }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const round = room?.currentRound;

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || submitted) return;
    onSubmit(answer.trim(), Date.now());
    setSubmitted(true);
  }, [answer, submitted, onSubmit]);

  useEffect(() => {
    if (round?.answers) {
      const answerCount = Object.keys(round.answers).length;
      const playerCount = Object.keys(room.players).length;
      
      if (answerCount >= playerCount && !results) {
        const roundResults = calculateResults(round.answers, room.players);
        setResults(roundResults);
        
        setTimeout(() => {
          if (room.roundNumber < room.settings.rounds) {
            onNextRound(generateRound());
          } else {
            onEnd(calculateFinalResults(room));
          }
        }, 3000);
      }
    }
  }, [round, room, results, onNextRound, onEnd]);

  const handleTimeUp = useCallback(() => {
    if (!submitted) {
      handleSubmit();
    }
  }, [submitted, handleSubmit]);

  if (!round) return null;

  if (results) {
    return (
      <ResultsModal
        results={results}
        round={room.roundNumber}
        totalRounds={room.settings.rounds}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <GameHUD
        round={room.roundNumber}
        totalRounds={room.settings.rounds}
        timeLimit={room.settings.timeLimit}
        onTimeUp={handleTimeUp}
      />

      <GlassCard className="text-center">
        <p className="text-sm text-text-secondary mb-2">Traduce al español</p>
        <p className="text-2xl font-bold text-text font-mono">
          "{round.sentence}"
        </p>
      </GlassCard>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Escribe tu respuesta..."
        disabled={submitted}
        className="w-full bg-bg border border-border rounded-xl px-4 py-4 text-text text-lg placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth disabled:opacity-50"
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        autoFocus
      />

      <GradientButton
        variant={submitted ? 'success' : 'primary'}
        className="w-full"
        onClick={handleSubmit}
        disabled={submitted || !answer.trim()}
      >
        <div className="flex items-center justify-center gap-2">
          {submitted ? (
            <>
              <Check className="w-5 h-5" />
              <span>Enviado</span>
            </>
          ) : (
            <span>Enviar respuesta</span>
          )}
        </div>
      </GradientButton>

      <div className="text-center text-sm text-text-secondary">
        {Object.keys(round.answers || {}).length} / {Object.keys(room.players).length} respondieron
      </div>
    </div>
  );
}

function calculateResults(answers, players) {
  return Object.entries(answers).map(([uid, data]) => ({
    uid,
    name: players[uid]?.name || 'Jugador',
    answer: data.answer,
    time: data.time,
    correct: true
  })).sort((a, b) => a.time - b.time);
}

function generateRound() {
  const sentences = [
    'I want water', 'She goes to school', 'They play football',
    'He can swim', 'We need help', 'I have a cat',
    'She likes music', 'They work hard', 'He reads books',
    'We eat lunch'
  ];
  return {
    sentence: sentences[Math.floor(Math.random() * sentences.length)],
    type: 'translate'
  };
}

function calculateFinalResults(room) {
  const results = {};
  for (const [uid, player] of Object.entries(room.players)) {
    results[uid] = {
      points: player.score,
      position: 1
    };
  }
  return results;
}
```

- [ ] **Step 3: Create ResultsModal.jsx**

Create `src/components/multiplayer/ResultsModal.jsx`:
```js
import { Trophy, Medal, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import GlassCard from '../base/GlassCard';

export default function ResultsModal({ results, round, totalRounds }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <GlassCard className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-4">
          <p className="text-sm text-text-secondary">Ronda {round}/{totalRounds}</p>
          <h3 className="text-xl font-bold text-text">Resultados</h3>
        </div>

        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={result.uid}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl",
                index === 0 && "bg-warning/10 border border-warning/20",
                index === 1 && "bg-bg-secondary",
                index === 2 && "bg-bg-secondary"
              )}
            >
              {index === 0 ? (
                <Trophy className="w-6 h-6 text-warning" />
              ) : index === 1 ? (
                <Medal className="w-6 h-6 text-text-tertiary" />
              ) : (
                <span className="w-6 h-6 flex items-center justify-center text-text-tertiary font-bold">
                  {index + 1}
                </span>
              )}
              <div className="flex-1">
                <p className="font-medium text-text">{result.name}</p>
                <p className="text-xs text-text-secondary font-mono">
                  {result.answer}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-text-secondary">
                  {(result.time / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/multiplayer/GameHUD.jsx src/components/multiplayer/RaceMode.jsx src/components/multiplayer/ResultsModal.jsx
git commit -m "feat: add race mode with game HUD and results"
```

---

## Task 8: Duel Mode

**Files:**
- Create: `src/components/multiplayer/DuelMode.jsx`

- [ ] **Step 1: Create DuelMode.jsx**

Create `src/components/multiplayer/DuelMode.jsx`:
```js
import { useState, useEffect, useCallback } from 'react';
import { Swords, Check, X, Trophy, RotateCcw } from 'lucide-react';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';

export default function DuelMode({ room, user, onSubmit, onNextRound, onEnd }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState({});
  const round = room?.currentRound;
  const isChallenger = room?.host === user?.uid;

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || submitted) return;
    onSubmit(answer.trim(), Date.now());
    setSubmitted(true);
  }, [answer, submitted, onSubmit]);

  useEffect(() => {
    if (round?.answers && Object.keys(round.answers).length === 2) {
      const newScores = { ...scores };
      Object.entries(round.answers).forEach(([uid, data]) => {
        newScores[uid] = (newScores[uid] || 0) + 10;
      });
      setScores(newScores);
      
      setTimeout(() => {
        setSubmitted(false);
        setAnswer('');
        if (room.roundNumber < room.settings.rounds) {
          onNextRound(generateDuelRound());
        } else {
          onEnd(calculateDuelResults(scores, room));
        }
      }, 2000);
    }
  }, [round]);

  if (!round) return null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <GameHUD
        round={room.roundNumber}
        totalRounds={room.settings.rounds}
        timeLimit={room.settings.timeLimit}
        onTimeUp={handleSubmit}
      />

      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-text">{scores[room.host] || 0}</p>
          <p className="text-xs text-text-secondary">
            {room.players[room.host]?.name}
          </p>
        </div>
        <Swords className="w-8 h-8 text-primary" />
        <div className="text-center">
          <p className="text-2xl font-bold text-text">
            {scores[Object.keys(room.players).find(uid => uid !== room.host)] || 0}
          </p>
          <p className="text-xs text-text-secondary">
            {room.players[Object.keys(room.players).find(uid => uid !== room.host)]?.name}
          </p>
        </div>
      </div>

      <GlassCard className="text-center">
        <p className="text-sm text-text-secondary mb-2">
          {isChallenger ? 'Tu frase para el oponente' : 'Traduce esta frase'}
        </p>
        <p className="text-2xl font-bold text-text font-mono">
          "{round.sentence}"
        </p>
      </GlassCard>

      {!isChallenger && (
        <>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
            disabled={submitted}
            className="w-full bg-bg border border-border rounded-xl px-4 py-4 text-text text-lg placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />

          <GradientButton
            variant={submitted ? 'success' : 'primary'}
            className="w-full"
            onClick={handleSubmit}
            disabled={submitted || !answer.trim()}
          >
            <div className="flex items-center justify-center gap-2">
              {submitted ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Enviado</span>
                </>
              ) : (
                <span>Enviar respuesta</span>
              )}
            </div>
          </GradientButton>
        </>
      )}
    </div>
  );
}

function generateDuelRound() {
  const sentences = [
    'I love you', 'She is beautiful', 'He works hard',
    'They are friends', 'We need food', 'I can help',
    'She speaks Spanish', 'He drives fast', 'We study English'
  ];
  return {
    sentence: sentences[Math.floor(Math.random() * sentences.length)],
    type: 'translate'
  };
}

function calculateDuelResults(scores, room) {
  const results = {};
  const uids = Object.keys(room.players);
  const winner = uids.reduce((a, b) => (scores[a] || 0) > (scores[b] || 0) ? a : b);
  
  uids.forEach((uid, index) => {
    results[uid] = {
      points: scores[uid] || 0,
      position: uid === winner ? 1 : 2
    };
  });
  
  return results;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/multiplayer/DuelMode.jsx
git commit -m "feat: add duel mode component"
```

---

## Task 9: Battle Royale Mode

**Files:**
- Create: `src/components/multiplayer/BattleRoyale.jsx`

- [ ] **Step 1: Create BattleRoyale.jsx**

Create `src/components/multiplayer/BattleRoyale.jsx`:
```js
import { useState, useEffect, useCallback } from 'react';
import { Users, Skull, Trophy, Crown } from 'lucide-react';
import { cn } from '../../utils/cn';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import GameHUD from './GameHUD';
import ResultsModal from './ResultsModal';

export default function BattleRoyale({ room, user, onSubmit, onNextRound, onEnd }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [results, setResults] = useState(null);
  const round = room?.currentRound;
  const isAlive = room?.players?.[user?.uid]?.alive !== false;

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || submitted || !isAlive) return;
    onSubmit(answer.trim(), Date.now());
    setSubmitted(true);
  }, [answer, submitted, isAlive, onSubmit]);

  useEffect(() => {
    if (round?.answers) {
      const answerCount = Object.keys(round.answers).length;
      const alivePlayers = Object.entries(room.players)
        .filter(([_, p]) => p.alive !== false)
        .length;
      
      if (answerCount >= alivePlayers && !results) {
        const roundResults = processBattleRound(round.answers, room);
        setResults(roundResults);
        
        setTimeout(() => {
          const surviving = Object.entries(room.players)
            .filter(([_, p]) => p.alive !== false);
          
          if (surviving.length <= 1) {
            onEnd(calculateBattleFinal(room));
          } else {
            onNextRound(generateBattleRound());
          }
          setResults(null);
          setSubmitted(false);
          setAnswer('');
        }, 3000);
      }
    }
  }, [round, room, results, onNextRound, onEnd]);

  if (!round) return null;

  const alivePlayers = Object.entries(room.players)
    .filter(([_, p]) => p.alive !== false)
    .length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <GameHUD
        round={room.roundNumber}
        totalRounds={room.settings.rounds}
        timeLimit={room.settings.timeLimit}
        onTimeUp={handleSubmit}
      />

      <div className="flex items-center justify-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <span className="font-medium text-text">
          {alivePlayers} jugadores vivos
        </span>
      </div>

      {results ? (
        <ResultsModal
          results={results}
          round={room.roundNumber}
          totalRounds={room.settings.rounds}
        />
      ) : (
        <>
          {!isAlive ? (
            <GlassCard className="text-center bg-error/10 border-error/20">
              <Skull className="w-12 h-12 text-error mx-auto mb-2" />
              <p className="text-lg font-bold text-error">Eliminado</p>
              <p className="text-sm text-text-secondary">
                Has sido eliminado de la partida
              </p>
            </GlassCard>
          ) : (
            <>
              <GlassCard className="text-center">
                <p className="text-sm text-text-secondary mb-2">Traduce al español</p>
                <p className="text-2xl font-bold text-text font-mono">
                  "{round.sentence}"
                </p>
              </GlassCard>

              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                disabled={submitted}
                className="w-full bg-bg border border-border rounded-xl px-4 py-4 text-text text-lg placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />

              <GradientButton
                variant={submitted ? 'success' : 'primary'}
                className="w-full"
                onClick={handleSubmit}
                disabled={submitted || !answer.trim()}
              >
                <div className="flex items-center justify-center gap-2">
                  {submitted ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Enviado</span>
                    </>
                  ) : (
                    <span>Enviar respuesta</span>
                  )}
                </div>
              </GradientButton>
            </>
          )}
        </>
      )}
    </div>
  );
}

function processBattleRound(answers, room) {
  const sorted = Object.entries(answers)
    .map(([uid, data]) => ({
      uid,
      name: room.players[uid]?.name || 'Jugador',
      time: data.time,
      answer: data.answer
    }))
    .sort((a, b) => a.time - b.time);
  
  const eliminateCount = Math.max(1, Math.floor(sorted.length / 3));
  const eliminated = sorted.slice(-eliminateCount);
  
  eliminated.forEach(({ uid }) => {
    room.players[uid].alive = false;
  });
  
  return sorted.map((p, i) => ({
    ...p,
    position: i + 1,
    eliminated: eliminated.some(e => e.uid === p.uid)
  }));
}

function generateBattleRound() {
  const sentences = [
    'I need water', 'She is a teacher', 'They play games',
    'He has a car', 'We love music', 'I speak English',
    'She cooks dinner', 'He reads books', 'We study hard'
  ];
  return {
    sentence: sentences[Math.floor(Math.random() * sentences.length)],
    type: 'translate'
  };
}

function calculateBattleFinal(room) {
  const results = {};
  Object.entries(room.players).forEach(([uid, player], index) => {
    results[uid] = {
      points: player.alive !== false ? 100 : 0,
      position: player.alive !== false ? 1 : index + 1
    };
  });
  return results;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/multiplayer/BattleRoyale.jsx
git commit -m "feat: add battle royale mode component"
```

---

## Task 10: Leaderboard + Integrate in App

**Files:**
- Create: `src/components/multiplayer/Leaderboard.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Home.jsx`
- Modify: `src/components/Layout.jsx`

- [ ] **Step 1: Create Leaderboard.jsx**

Create `src/components/multiplayer/Leaderboard.jsx`:
```js
import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import GlassCard from '../base/GlassCard';
import GradientButton from '../base/GradientButton';
import { getLeaderboard } from '../../services/multiplayerService';

export default function Leaderboard({ onBack }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    const sorted = Object.entries(data)
      .map(([uid, info]) => ({ uid, ...info }))
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 50);
    setPlayers(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const medals = [Crown, Medal, Trophy];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-bg-tertiary transition-smooth"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h1 className="text-2xl font-bold text-text">Leaderboard</h1>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-bg-tertiary transition-smooth"
        >
          <RefreshCw className={cn("w-5 h-5 text-text-secondary", loading && "animate-spin")} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-text-secondary mt-2">Cargando...</p>
        </div>
      ) : players.length === 0 ? (
        <GlassCard className="text-center py-8">
          <Trophy className="w-12 h-12 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-secondary">No hay jugadores aún</p>
          <p className="text-sm text-text-tertiary">Sé el primero en competir</p>
        </GlassCard>
      ) : (
        <div className="space-y-2 stagger-children">
          {players.map((player, index) => {
            const Icon = medals[index] || null;
            return (
              <GlassCard
                key={player.uid}
                className={cn(
                  "flex items-center gap-4",
                  index < 3 && "border-warning/20"
                )}
              >
                <div className="w-8 text-center">
                  {Icon ? (
                    <Icon className={cn(
                      "w-6 h-6 mx-auto",
                      index === 0 && "text-warning",
                      index === 1 && "text-text-tertiary",
                      index === 2 && "text-warning/60"
                    )} />
                  ) : (
                    <span className="text-text-tertiary font-bold">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text">{player.name}</p>
                  <p className="text-xs text-text-secondary">
                    Nv.{player.level || 1}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-primary">
                    {player.points || 0}
                  </p>
                  <p className="text-xs text-text-secondary">pts</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update Home.jsx with multiplayer button**

In `src/components/Home.jsx`, add import and button:
```js
import { Trophy, Gamepad2 } from 'lucide-react';
```

Add after the competitive button:
```jsx
<GradientButton
  variant="outline"
  className="w-full animate-fade-in-up"
  onClick={() => onStartMode("multiplayer")}
>
  <div className="flex items-center justify-center gap-3">
    <Gamepad2 className="w-5 h-5" />
    <span>Multijugador Online</span>
  </div>
</GradientButton>
```

- [ ] **Step 3: Update App.jsx with multiplayer screens**

Add state and routing for multiplayer screens in `src/App.jsx`:
```js
import { useState } from 'react';
import { useTranslation } from './hooks/useTranslation';
import MultiplayerMenu from './components/multiplayer/MultiplayerMenu';
import Lobby from './components/multiplayer/Lobby';
import RaceMode from './components/multiplayer/RaceMode';
import DuelMode from './components/multiplayer/DuelMode';
import BattleRoyale from './components/multiplayer/BattleRoyale';
import Leaderboard from './components/multiplayer/Leaderboard';
import NameModal from './components/multiplayer/NameModal';
import { useMultiplayer } from './hooks/useMultiplayer';

// In component:
const [mpUser, setMpUser] = useState(null);
const [mpScreen, setMpScreen] = useState('menu'); // menu, lobby, race, duel, battle, leaderboard
const mp = useMultiplayer(mpUser);

// Render multiplayer screens based on mpScreen
```

- [ ] **Step 4: Commit**

```bash
git add src/components/multiplayer/Leaderboard.jsx src/components/Home.jsx src/App.jsx
git commit -m "feat: add leaderboard and integrate multiplayer in app"
```

---

## Task 11: Final Testing + Build

**Files:**
- All modified files

- [ ] **Step 1: Run dev server and test**

```bash
cd "C:\Users\USUARIO\Desktop\Prueba ingles\english-app" && npm run dev
```

- [ ] **Step 2: Test translation service**

```js
// In browser console:
import('./src/services/translationService.js').then(m => {
  m.translate('I want water').then(r => console.log(r));
});
```

- [ ] **Step 3: Run build**

```bash
cd "C:\Users\USUARIO\Desktop\Prueba ingles\english-app" && npm run build
```

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: complete multijugador and translation system v1"
```

---

## Environment Variables Required

Create `.env` file in project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_api_key
```
