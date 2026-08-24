// Peer-to-peer multiplayer via Trystero (WebRTC + Nostr signaling).
// No accounts, no backend: players join a room by its 6-char code.
import { joinRoom as trystJoinRoom } from 'trystero/nostr';

const APP_ID = 'ed-english-app-p2p-v1';
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

let trystRoom = null;
let myUid = null;
let myName = 'Jugador';
let amHost = false;
const peerToUid = {}; // trystero peerId -> uid
const actions = {};   // name -> [send, receive]

const state = {
  id: null,
  host: null,
  mode: 'race',
  status: 'waiting', // waiting | playing | ended
  settings: {},
  questions: null,
  players: {}
};

const listeners = new Set();

function emit() {
  const snap = JSON.parse(JSON.stringify(state));
  listeners.forEach(cb => { try { cb(snap); } catch {} });
}

function makeCode() {
  return Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

function myProfile() {
  const prev = state.players[myUid];
  return {
    uid: myUid,
    displayName: myName,
    isHost: amHost,
    score: prev?.score ?? 0,
    progress: prev?.progress ?? 0,
    status: prev?.status ?? 'ready',
    joinedAt: prev?.joinedAt ?? Date.now()
  };
}

function metaPayload() {
  return { host: state.host, mode: state.mode, settings: state.settings, status: state.status };
}

function teardown() {
  try { trystRoom?.leave(); } catch {}
  trystRoom = null;
  Object.keys(actions).forEach(k => delete actions[k]);
  Object.keys(peerToUid).forEach(k => delete peerToUid[k]);
  state.id = null;
  state.host = null;
  state.status = 'waiting';
  state.questions = null;
  state.players = {};
}

function connect(code, mode, settings, host) {
  teardown();
  amHost = host;
  myUid = myUid; // set by caller
  state.id = code;
  if (host) {
    state.mode = mode;
    state.settings = settings;
    state.host = myUid;
  }

  trystRoom = trystJoinRoom({ appId: APP_ID }, code);

  actions.meta = trystRoom.makeAction('meta');
  actions.profile = trystRoom.makeAction('profile');
  actions.start = trystRoom.makeAction('start');
  actions.end = trystRoom.makeAction('end');

  const [sendMeta, onMeta] = actions.meta;
  const [sendProfile, onProfile] = actions.profile;

  onMeta(meta => {
    state.host = meta.host;
    state.mode = meta.mode;
    state.settings = meta.settings || {};
    state.status = meta.status || 'waiting';
    emit();
  });

  onProfile((data, peerId) => {
    if (!data?.uid) return;
    peerToUid[peerId] = data.uid;
    if (data.isHost && !state.host) state.host = data.uid;
    state.players[data.uid] = { ...data };
    emit();
  });

  actions.start[1](payload => {
    state.status = 'playing';
    state.questions = payload?.questions ?? null;
    state.startedAt = Date.now();
    emit();
  });

  actions.end[1](() => {
    state.status = 'ended';
    emit();
  });

  trystRoom.onPeerJoin(() => {
    // Announce ourselves; host also shares room metadata
    sendProfile(myProfile());
    if (amHost) sendMeta(metaPayload());
    emit();
  });

  trystRoom.onPeerLeave(peerId => {
    const uid = peerToUid[peerId];
    if (uid) {
      delete state.players[uid];
      emit();
    }
  });
}

export async function createRoom(hostId, hostName, mode, settings = {}) {
  myUid = hostId;
  myName = hostName;
  const code = makeCode();
  connect(code, mode, {
    maxPlayers: mode === 'duel' ? 2 : mode === 'battleRoyale' ? 8 : 6,
    timeLimit: settings.timeLimit || 120,
    questionCount: settings.questionCount || 10,
    ...settings
  }, true);

  state.players[myUid] = myProfile();
  emit();
  return code;
}

export async function joinRoom(roomId, playerId, playerName) {
  if (!roomId || roomId.length < 4) throw new Error('Código de sala inválido');
  myUid = playerId;
  myName = playerName;
  connect(roomId.toUpperCase(), 'race', {}, false);

  // Announce with retries — host may not have relayed our join yet
  const [sendProfile] = actions.profile;
  const [sendMeta] = actions.meta;
  sendProfile(myProfile());
  const retries = [800, 2000, 4000];
  retries.forEach(ms => setTimeout(() => {
    if (trystRoom) { sendProfile(myProfile()); if (!state.host) sendMeta(myProfile()); }
  }, ms));

  emit();
  return roomId.toUpperCase();
}

export function subscribeToRoom(roomId, callback) {
  listeners.add(callback);
  callback(JSON.parse(JSON.stringify(state)));
  return () => listeners.delete(callback);
}

export async function startGame(roomId, uid, questions = null) {
  state.status = 'playing';
  state.questions = questions;
  state.startedAt = Date.now();
  emit();
  actions.start[0]({ questions });
}

export async function updateProgress(roomId, uid, progress, score) {
  if (!state.players[uid]) state.players[uid] = myProfile();
  state.players[uid].progress = progress;
  state.players[uid].score = score;
  actions.profile[0](state.players[uid]);
  emit();
}

export async function endGame(roomId) {
  state.status = 'ended';
  emit();
  actions.end[0]({ endedAt: Date.now() });
}

export async function leaveRoom(roomId, uid) {
  teardown();
  emit();
}

export async function deleteRoom(roomId) {
  teardown();
  emit();
}
