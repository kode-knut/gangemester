# Gangemester 🎓

En Progressive Web App (PWA) for å øve på gangetabellen.

## Funksjoner

- ✨ Velg mellom stigende eller blandet modus
- 🎯 Øv på enkelt-tabeller (1-10)
- 📊 Øv på grupper (1-5 eller 6-10)
- 👑 Full test med alle tabeller (20 spørsmål)
- 🐶 Unike dyr og farger for hver gangetabell
- ⚡ Auto-advance ved riktige svar
- 📱 Fungerer offline (PWA)
- 🏅 Medaljer basert på resultat

## Slik kjører du appen

### Alternativ 1: Python HTTP Server
```bash
cd /Users/jannicke.husby@m10s.io/IdeaProjects/gangemester
python3 -m http.server 8000
```
Åpne deretter http://localhost:8000 i nettleseren.

### Alternativ 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```

### Alternativ 3: VS Code Live Server
Åpne mappen i VS Code og bruk Live Server-utvidelsen.

## Installere som app

Når du åpner appen i nettleseren, kan du installere den som en app:
- **På mobil**: Trykk på "Legg til på hjemskjerm"
- **På desktop**: Se etter installasjonsikonet i adressefeltet

## Teknologi

- Vanilla JavaScript (ingen rammeverk)
- CSS3 med moderne features
- Service Worker for offline-funksjonalitet
- Web App Manifest for installasjon
