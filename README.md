# EnglishApp - Aprende Inglés

PWA interactiva para practicar inglés con modos de juego variados, progreso persistente y soporte offline.

## Características

- **Construcción** — Arma frases seleccionando bloques de pronombres, verbos y objetos
- **Mutación** — Transforma frases entre formas afirmativa, negativa e interrogativa
- **Combinación** — Une dos oraciones con conectores
- **Slang** — Adivina expresiones informales del inglés
- **Pronunciación** — Aprende trucos de pronunciación con audio bilingüe
- **Modo Competitivo** — Contrarreloj con puntuación bonus
- **Ranking y Logros** — Sistema de niveles, streaks y achievementes
- **Exportar audio/video** — Descarga frases como MP3 o video MP4
- **PWA** — Instalable, funciona offline con service worker

## Stack

- React 19 + Vite 8
- Tailwind CSS v4
- vite-plugin-pwa (service worker + manifest)

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run build
npm run preview
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Linting con oxlint |
