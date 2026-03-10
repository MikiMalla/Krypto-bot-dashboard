# Krypto-Bot v5.0 — PWA Paket

## Dateien

```
index.html          ← Dashboard (PWA-ready mit Service Worker, Manifest, Mobile UI)
manifest.json       ← App-Metadaten (Name, Icons, Farben)
sw.js               ← Service Worker (Offline-Cache, Push Notifications)
icons/
  icon-72x72.png
  icon-96x96.png
  icon-128x128.png
  icon-144x144.png
  icon-192x192.png   ← Haupt-Icon (required)
  icon-384x384.png
  icon-512x512.png   ← Haupt-Icon (required)
```

## Anleitung: PWA Builder (pwabuilder.com)

### Schritt 1: Dateien hosten

Die PWA muss über eine URL erreichbar sein (HTTPS erforderlich).
Einfachste Optionen:

**Option A — GitHub Pages (kostenlos, empfohlen):**
1. Erstelle ein GitHub-Repository (z.B. `krypto-bot-pwa`)
2. Lade ALLE Dateien aus diesem Ordner hoch (index.html, manifest.json, sw.js, icons/)
3. Gehe zu Repository → Settings → Pages → Source: "main" branch
4. Deine URL: `https://DEIN-USERNAME.github.io/krypto-bot-pwa/`

**Option B — Netlify (kostenlos):**
1. Gehe zu netlify.com → "Add new site" → "Deploy manually"
2. Ziehe den kompletten Ordner per Drag & Drop rein
3. Fertig — du bekommst eine URL wie `https://xyz.netlify.app`

**Option C — Vercel (kostenlos):**
1. Gehe zu vercel.com → Import Project → Upload Folder
2. URL: `https://xyz.vercel.app`

### Schritt 2: PWA Builder

1. Gehe zu **https://www.pwabuilder.com/**
2. Gib deine URL ein (z.B. `https://dein-username.github.io/krypto-bot-pwa/`)
3. PWA Builder analysiert deine Seite
4. Du siehst einen Score für:
   - **Manifest** — sollte grün sein (✅ alle Icons + Metadaten vorhanden)
   - **Service Worker** — sollte grün sein (✅ Offline-Support vorhanden)
   - **Security** — sollte grün sein (✅ HTTPS bei GitHub Pages / Netlify)
5. Klicke auf **"Package for stores"**
6. Wähle **Android** → **"Generate"**
7. Du bekommst eine `.apk` oder `.aab` Datei zum Download

### Schritt 3: APK installieren

**Direkt auf dem Handy:**
1. Übertrage die `.apk` auf dein Android-Handy
2. Öffne die Datei → "Installieren" (eventuell "Unbekannte Quellen" erlauben)
3. Die App erscheint auf deinem Homescreen

**Über Google Play Store (optional):**
1. PWA Builder kann auch ein `.aab` (Android App Bundle) generieren
2. Dieses kannst du über die Google Play Console hochladen
3. Kostet einmalig $25 für einen Google Developer Account

### Schritt 4: Bot-Server verbinden

1. Öffne die App auf dem Handy
2. Gehe zum Tab "Steuerung" (⚙️)
3. Gib die WebSocket-URL deines Bots ein:
   - **Gleiches WLAN:** `ws://192.168.1.X:8765` (IP deines PCs)
   - **Über Internet:** `wss://deine-domain.com:8765` (VPS mit SSL)
4. Tippe "Verbinden"

## Ohne PWA Builder: Direkt vom Browser installieren

Falls du PWA Builder nicht nutzen willst:

1. Hoste die Dateien (GitHub Pages / Netlify / etc.)
2. Öffne die URL in Chrome auf dem Handy
3. Chrome zeigt automatisch "Zum Startbildschirm hinzufügen" an
4. Alternativ: Drei-Punkte-Menü → "App installieren"
5. Die PWA läuft dann wie eine native App

## Server-Konfiguration

Falls du den Bot auf einem VPS hostest und die PWA-Dateien
vom selben Server ausliefern willst, kopiere diesen Ordner
nach `/home/claude/krypto-bot-v5/static/` und der eingebaute
HTTP-Server des Bots liefert alles aus.

## Tipps

- **Icons austauschen:** Ersetze die PNG-Dateien im `icons/` Ordner
  durch eigene Icons. Behalte die Größen bei (192x192 und 512x512 sind Pflicht).
- **Farben anpassen:** In `manifest.json` unter `theme_color` und
  `background_color`. Im `index.html` unter `:root` CSS-Variablen.
- **Push Notifications:** Funktionieren nur über HTTPS.
  Aktiviere sie in der App unter Steuerung → Benachrichtigungen.
