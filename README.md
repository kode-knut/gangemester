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
- **👑 Krone**: Oppnå gullmedalje 3 ganger på samme tabell (per modus)

Medaljegrenser er tilpasset vanskelighetsgrad:

**Enkelttabeller (tidsbasert):**
- Lette tabeller (1, 2, 5, 10): Gull ≤12s | Sølv ≤18s | Bronse ≤25s
- Medium tabeller (3, 4, 6, 8): Gull ≤20s | Sølv ≤28s | Bronse ≤38s
- Vanskelige tabeller (7, 9): Gull ≤25s | Sølv ≤35s | Bronse ≤45s

**Grupper (tidsbasert):**
- 1-5 gangen: Gull ≤90s | Sølv ≤130s | Bronse ≤180s
- 6-10 gangen: Gull ≤120s | Sølv ≤170s | Bronse ≤230s

**Test hele gangetabellen (feilbasert):**
- Gull: 0 feil (100/100)
- Sølv: Mindre enn 5 feil (96+/100)
- Bronse: Mindre enn 11 feil (90+/100)

### Personlige rekorder
- Beste tid lagres for hver tabell og modus
- "🏆 Rekorttid!" med pulse-animasjon når du slår din tidligere rekord

### Design
- Unike dyr for hver gangetabell
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

## Installere som app

**På mobil (iOS/Android):**
1. Åpne appen i Safari/Chrome
2. Trykk på "Del" eller meny
3. Velg "Legg til på hjemskjerm"

**På desktop:**
- Se etter installasjonsikonet i adressefeltet

## Lisens

MIT
