# SDD: Traducciones Híbridas + Multijugador Online

## Resumen
Agregar sistema de traducciones híbrido (offline mejorado + API fallback) y competición multijugador online con Firebase Realtime DB.

**Fecha**: 2026-08-23
**Estado**: Aprobado para implementación

---

## 1. Sistema de Traducciones Híbrido

### Arquitectura
```
translateService.translate(sentence)
  ├── 1. Diccionario offline (500+ palabras)
  ├── 2. Conjugador programático mejorado
  ├── 3. Google Translate API (fallback, 2M chars/mes gratis)
  └── 4. Cache en localStorage
```

### Mejoras offline
- **Diccionario**: 70 → 500+ palabras (adjetivos, adverbios, preposiciones, colaciones)
- **Conjugador**: Oraciones compuestas, gerundios, perfectos, subjuntivo básico
- **Frases hechas**: ~300 nuevas (total ~420)
- **Cobertura**: S+V+O, S+V+O+O, S+V+O+C, preguntas, negaciones complejas

### API fallback
- Google Translate API v2
- Solo para frases que el motor offline no puede manejar
- Cache en localStorage (máx 1000 entradas)
- Rate limit: 100 req/día para tier gratuito

### Datos expandidos
```js
// languageData.js - Nuevas categorías
adjectives: ["big", "small", "happy", "sad", ...] // 100+
adverbs: ["quickly", "slowly", "always", ...] // 50+
prepositions: ["in", "on", "at", "with", ...] // 30+
irregularVerbs: { ... } // 40 verbos (was 17)
```

---

## 2. Multijugador Online

### Stack
- Firebase Realtime DB (salas, sincronización)
- Firebase Auth (anónimo + nombre)
- Sin servidor propio

### Estructura Firebase
```
/english-app/
├── users/{uid}/
│   ├── displayName: string
│   ├── points: number
│   ├── level: number
│   └── stats: { wins, losses, streak, gamesPlayed }
├── rooms/{roomId}/
│   ├── type: "race" | "duel" | "battle"
│   ├── status: "waiting" | "playing" | "finished"
│   ├── host: uid
│   ├── players: { [uid]: { name, score, ready, alive } }
│   ├── currentRound: RoundData
│   ├── roundNumber: number
│   ├── settings: RoomSettings
│   └── results: RoundResult[]
└── leaderboard/
    └── {uid}: { name, points, level, wins, lastPlayed }
```

### Autenticación
1. Usuario abre app
2. Modal: "Elige tu nombre de jugador"
3. Firebase Auth anónimo → uid
4. Guardar displayName en DB
5. Sin registro, sin contraseña

### Flujo de salas
1. Crear sala → genera código de 6 dígitos
2. Compartir código → amigo lo ingresa
3. Sala llena → inicio automático
4. Partida → rounds según modo
5. Resultados → actualización ranking global

---

## 3. Modos de Juego

### 3.1 Race Mode (Carreras)
- **Jugadores**: 2-4
- **Mecánica**: Todos reciben la misma frase simultáneamente
- **Objetivo**: Resolver primero con menos errores
- **Puntuación**: velocidad (50%) + precisión (50%)
- **Tiempo**: 30s por ronda
- **Rondas**: 5 por partida

### 3.2 Duel Mode (Duelo por turnos)
- **Jugadores**: 2
- **Mecánica**: Jugador A reta → Jugador B responde
- **Elegir**: Dificultad (fácil/medio/difícil) y tipo (traducir/mutar/combinar)
- **Puntuación**: precisión (60%) + tiempo (40%)
- **Formato**: Best of 5 rounds
- **Revenge**: Opción de revancha

### 3.3 Battle Royale
- **Jugadores**: 4-8
- **Mecánica**: Eliminación progresiva
- **Rondas**: 
  - R1: todos → eliminan 2 peores
  - R2: restantes → eliminan 2 peores
  - R3: semifinal → elimina 1
  - R4: final → último en pie
- **Dificultad**: Aumenta cada ronda
- **Puntuación**: Posición final (1ro: 100pts, 2do: 75pts, 3ro: 50pts, etc.)

---

## 4. Componentes UI

### Nuevos componentes
```
src/components/multiplayer/
├── Lobby.jsx          # Sala de espera con código
├── PlayerList.jsx     # Lista de jugadores en sala
├── RaceMode.jsx       # UI de carrera
├── DuelMode.jsx       # UI de duelo
├── BattleRoyale.jsx   # UI de battle royale
├── GameHUD.jsx        # HUD compartido (timer, scores, ronda)
├── ResultsModal.jsx   # Modal de resultados post-partida
└── Leaderboard.jsx    # Ranking global
```

### Nuevo menú multijugador
```
Home.jsx → Botón "Multijugador"
  └── MultiplayerMenu.jsx
        ├── Crear Sala (elegir modo)
        ├── Unirse con código
        └── Leaderboard global
```

---

## 5. Datos y Estado

### Nuevo hook: useMultiplayer.js
```js
{
  // Estado
  user: { uid, displayName, points, level },
  room: { id, type, status, players, currentRound },
  isConnected: boolean,
  
  // Acciones
  createRoom(type, settings) → roomId,
  joinRoom(roomId) → void,
  leaveRoom() → void,
  submitAnswer(answer) → void,
  setReady() → void,
  
  // Callbacks
  onRoundStart: (round) => void,
  onRoundEnd: (results) => void,
  onGameEnd: (finalResults) => void,
  onPlayerJoin: (player) => void,
  onPlayerLeave: (player) => void,
}
```

### Nuevo hook: useTranslation.js
```js
{
  translate(sentence) → { original, translated, method, confidence },
  translateBatch(sentences) → Translation[],
  isOnline: boolean,
  cacheSize: number,
  clearCache() → void,
}
```

---

## 6. Configuración Firebase

### Archivo: src/config/firebase.js
```js
const firebaseConfig = {
  apiKey: "env:FIREBASE_API_KEY",
  authDomain: "english-app-multijugador.firebaseapp.com",
  databaseURL: "https://english-app-multijugador-default-rtdb.firebaseio.com",
  projectId: "english-app-multijugador",
  storageBucket: "english-app-multijugador.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### Reglas Realtime DB
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid"
      }
    },
    "rooms": {
      "$roomId": {
        ".read": "root.child('rooms/' + $roomId + '/players').child(auth.uid).exists()",
        ".write": "root.child('rooms/' + $roomId + '/host').val() === auth.uid || !data.exists()"
      }
    },
    "leaderboard": {
      ".read": true,
      ".write": "$uid === auth.uid"
    }
  }
}
```

---

## 7. Dependencias nuevas

```json
{
  "firebase": "^10.14.0",
  "firebase-functions": "^5.0.0"
}
```

---

## 8. Orden de implementación

1. **Firebase setup** → Config, auth, reglas DB
2. **Translation service** → Híbrido offline/API
3. **useMultiplayer hook** → Estado y sincronización
4. **Lobby + salas** → Crear/unirse, sala de espera
5. **Race mode** → Primer modo funcional
6. **Duel mode** → Segundo modo
7. **Battle royale** → Tercer modo
8. **Leaderboard** → Ranking global
9. **Testing y polish**

---

## 9. Fuera de scope (v1)

- Chat en sala
- Emotes/reacciones
- Torneos programados
- Spectator mode
- Anti-cheat avanzado
- Notificaciones push
