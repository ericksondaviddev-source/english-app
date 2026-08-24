import { verbs, translations } from '../data/languageData';

// Irregular Spanish present conjugations [yo, tú, él, nosotros, ellos]
const IRREG_PRESENT = {
  querer: ['quiero','quieres','quiere','queremos','quieren'],
  saber: ['sé','sabes','sabe','sabemos','saben'],
  tener: ['tengo','tienes','tiene','tenemos','tienen'],
  hacer: ['hago','haces','hace','hacemos','hacen'],
  ir: ['voy','vas','va','vamos','van'],
  venir: ['vengo','vienes','viene','venimos','vienen'],
  decir: ['digo','dices','dice','decimos','dicen'],
  pensar: ['pienso','piensas','piensa','pensamos','piensan'],
  ver: ['veo','ves','ve','vemos','ven'],
  dar: ['doy','das','da','damos','dan'],
  sentir: ['siento','sientes','siente','sentimos','sienten'],
  empezar: ['empiezo','empiezas','empieza','empezamos','empiezan'],
  encontrar: ['encuentro','encuentras','encuentra','encontramos','encuentran'],
  poner: ['pongo','pones','pone','ponemos','ponen'],
  obtener: ['obtengo','obtienes','obtiene','obtenemos','obtienen'],
  cerrar: ['cierro','cierras','cierra','cerramos','cierran'],
  parecer: ['parezco','pareces','parece','parecemos','parecen'],
};

// English base verb -> Spanish infinitive
const INFINITIVE = {
  want:'querer', know:'saber', have:'tener', do:'hacer', go:'ir', like:'gustar',
  eat:'comer', see:'ver', think:'pensar', need:'necesitar', make:'hacer',
  take:'tomar', come:'venir', give:'dar', tell:'decir', say:'decir',
  get:'obtener', put:'poner', read:'leer', write:'escribir', play:'jugar',
  run:'correr', walk:'caminar', open:'abrir', close:'cerrar', ask:'preguntar',
  help:'ayudar', work:'trabajar', live:'vivir', study:'estudiar', love:'amar',
  feel:'sentir', try:'intentar', use:'usar', find:'encontrar', hold:'sostener',
  keep:'mantener', let:'dejar', begin:'empezar', seem:'parecer'
};

// English pronoun -> [spanish pronoun, person index]
const PRONOUNS = {
  i: ['yo',0], you: ['tú',1], he: ['él',2], she: ['ella',2],
  it: ['eso',2], we: ['nosotros',3], they: ['ellos',4]
};

function conjugatePresent(inf, pIdx) {
  const irr = IRREG_PRESENT[inf];
  if (irr) return irr[pIdx];
  const stem = inf.slice(0, -2);
  const end = inf.slice(-2);
  const endings = end === 'ar' ? ['o','as','a','amos','an']
    : end === 'ir' ? ['o','es','e','imos','en']
    : ['o','es','e','emos','en'];
  return stem + endings[pIdx];
}

// Imperfect past — almost perfectly regular in Spanish
function imperfect(inf, pIdx) {
  if (inf === 'ir') return ['iba','ibas','iba','íbamos','iban'][pIdx];
  if (inf === 'ver') return ['veía','veías','veía','veíamos','veían'][pIdx];
  const stem = inf.slice(0, -2);
  const end = inf.slice(-2);
  const endings = end === 'ar'
    ? ['aba','abas','aba','ábamos','aban']
    : ['ía','ías','ía','íamos','ían'];
  return stem + endings[pIdx];
}

function translateObject(objPhrase) {
  const key = objPhrase.trim().toLowerCase();
  if (!key) return '';
  if (translations[key]) return translations[key];
  const words = key.split(' ');
  // "my X" -> "mi X", "the/a X" -> article + translation
  if (words.length > 1 && ['the','a','my'].includes(words[0])) {
    const bare = words.slice(1).join(' ');
    const bareEs = translations[bare];
    if (bareEs) return words[0] === 'my' ? `mi ${bareEs}` : bareEs;
  }
  return objPhrase;
}

export function translateSentence(sentence) {
  if (!sentence) return '';
  const tokens = sentence.replace(/[.!?]+$/, '').trim().split(/\s+/);
  const pr = PRONOUNS[tokens[0].toLowerCase()];
  if (!pr || tokens.length < 2) return sentence;

  let idx = 1, tense = 'present', base = null;

  if (tokens[1] && tokens[1].toLowerCase() === 'will') {
    tense = 'future';
    idx = 2;
    base = (tokens[2] || '').toLowerCase();
  } else {
    const v = tokens[1].toLowerCase();
    if (verbs.present.includes(v)) {
      base = v;
    } else if (v.endsWith('es') && verbs.present.includes(v.slice(0, -2))) {
      base = v.slice(0, -2);
    } else if (v.endsWith('s') && verbs.present.includes(v.slice(0, -1))) {
      base = v.slice(0, -1);
    } else {
      const pastIdx = verbs.past.indexOf(v);
      if (pastIdx >= 0) { tense = 'past'; base = verbs.present[pastIdx]; }
      else base = v;
    }
  }

  if (!base || !INFINITIVE[base]) return sentence;
  const inf = INFINITIVE[base];
  const objEs = translateObject(tokens.slice(idx + 1).join(' '));
  const pIdx = pr[1];

  let result;
  if (base === 'like') {
    const io = ['me','te','le','nos','les'][pIdx];
    const plural = /\bs$/.test(objEs.trim());
    result = `${io} gust${plural ? 'an' : 'a'} ${objEs}`;
  } else if (tense === 'future') {
    result = `${pr[0]} ${['voy','vas','va','vamos','van'][pIdx]} a ${inf} ${objEs}`;
  } else if (tense === 'past') {
    result = `${pr[0]} ${imperfect(inf, pIdx)} ${objEs}`;
  } else {
    result = `${pr[0]} ${conjugatePresent(inf, pIdx)} ${objEs}`;
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}
