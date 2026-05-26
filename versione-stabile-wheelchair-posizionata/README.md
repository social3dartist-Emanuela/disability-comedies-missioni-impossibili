# Disability Comedies — Missioni Impossibili

Una prima versione MVP di un gioco 3D comico ed educativo sull'accessibilità. 

## Requisiti

Il gioco utilizza HTML, CSS, e JavaScript Vanilla con [Three.js](https://threejs.org/) (caricato tramite CDN). Non ci sono framework complessi, ed è pronto per essere eseguito in locale o pubblicato su GitHub Pages.

## Come Giocare (Localmente)

Puoi avviare il gioco con qualsiasi server HTTP locale. Ad esempio, se hai Python installato:

```bash
python -m http.server 8000
```

Poi apri `http://localhost:8000` nel tuo browser.

## Struttura

- `index.html`: La struttura base e i layer dell'interfaccia utente.
- `style.css`: Gli stili del gioco, l'interfaccia responsive e i popup.
- `script.js`: La logica di gioco, la configurazione di Three.js e il sistema di salvataggio via `localStorage`.
- `assets/`: Cartelle predisposte per futuri modelli 3D, texture e audio.

## Obiettivo del gioco

Interagire con gli ostacoli (evidenziati con un effetto semi-trasparente) per scoprire le barriere architettoniche presenti nei livelli. 
- Risposta esatta: +100 punti
- Completamento livello: +200 punti
- Risposta sbagliata: gag comica e possibilità di ritentare.
