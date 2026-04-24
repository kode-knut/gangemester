# Gangemester 👑

En interaktiv Progressive Web App (PWA) for å øve på gangetabellen. Perfekt for barn som vil lære eller forbedre sine gangetabellferdigheter!

## Funksjoner

### Øvingsmodus
- **↑ Stigende**: Øv i rekkefølge fra 1-10
- **Blandet**: Tilfeldige gangestykker uten duplikater

### Nivåer
- 🐶 Enkelttabeller (1-10 gangen) - 10 spørsmål
- 🐙 Gruppe 1-5 - 50 spørsmål
- 🦋 Gruppe 6-10 - 50 spørsmål
- 👑 Full test (alle kombinasjoner 1×1 til 10×10) - 100 spørsmål

### Motivasjon og fremgang
Separate medaljer for Stigende og Blandet modus:
- **💭 Thought-balloon**: Fullført med 10/10, men for treg for medalje
- **🥉 Bronse**: God tid
- **🥈 Sølv**: Rask tid
- **🥇 Gull**: Meget rask tid
- **👑 Krone**: Gull i BÅDE Stigende og Blandet modus

Medaljegrenser er tilpasset vanskelighetsgrad:
- Lette tabeller (1, 2, 5, 10): Gull ≤12s | Sølv ≤18s | Bronse ≤25s
- Medium tabeller (3, 4, 6, 8): Gull ≤20s | Sølv ≤28s | Bronse ≤38s
- Vanskelige tabeller (7, 9): Gull ≤25s | Sølv ≤35s | Bronse ≤45s

### Personlige rekorder
- Beste tid lagres for hver tabell og modus
- "🏆 Rekorttid!" med pulse-animasjon når du slår din tidligere rekord

### Design
- Unike dyr for hver gangetabell
- Fargerike bakgrunner per tabell
- Rosa bakgrunn (🐙) for 1-5 gruppe
- Blå bakgrunn (🦋) for 6-10 gruppe
- Gull bakgrunn (👑) for full test
- Confetti-animasjon ved medaljer
- Auto-advance ved riktige svar

### PWA-funksjoner
- 📱 Installer på hjemskjermen som vanlig app
- ⚡ Fungerer offline
- 🎨 Tilpasset ikon og splash screen
- 💾 Fremgang lagres lokalt

## Teknologi

- Vanilla JavaScript (ingen rammeverk)
- HTML5 + CSS3
- Service Worker for offline-støtte
- LocalStorage for fremgang og rekorder
- Web App Manifest for PWA-installasjon

## Kom i gang

### Lokalt

**Alternativ 1: Direkte i nettleser**
```bash
cd /Users/jannicke.husby@m10s.io/IdeaProjects/gangemester
open index.html
```

**Alternativ 2: Med lokal server (anbefalt for PWA-testing)**
```bash
cd /Users/jannicke.husby@m10s.io/IdeaProjects/gangemester
python3 -m http.server 8000
```
Åpne `http://localhost:8000`

**Alternativ 3: VS Code Live Server**
Høyreklikk på `index.html` → "Open with Live Server"

### Produksjon
Besøk: https://kode-knut.github.io/gangemester/

## Installere som app

**På mobil (iOS/Android):**
1. Åpne appen i Safari/Chrome
2. Trykk på "Del" eller meny
3. Velg "Legg til på hjemskjerm"

**På desktop:**
- Se etter installasjonsikonet i adressefeltet

## Lisens

MIT
