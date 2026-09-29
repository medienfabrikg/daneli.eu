# CLAUDE.md

## Projekt

Statische, deutschsprachige Website für **DANELI** – ein Verbund von 12 mittelständischen Druckereien in 4 Ländern (DE, LI, NL, AT), seit 2013. Betreiber laut Impressum: Medienfabrik Graz GmbH. Zielgruppe: Printeinkäufer, Partner, Lieferanten.

Kein Framework, kein Build-Step, keine Dependencies – reines HTML/CSS/Vanilla-JS, von Hand gepflegt.

## Struktur

```
build/            ← die ausgelieferte Website (Deploy-Root)
  index.html      One-Pager: Header, Hero, #about, #philosophie, #ziele, #angebot,
                  Stats, #standorte, #portfolio (per JS), Lightbox, #kontakt, Footer
  impressum.html  Impressum, gleicher Header, eigener <style>-Block
  style.css       gemeinsames Stylesheet (CSS-Variablen in :root, ein Breakpoint 768px)
  script.js       Nav-Toggle, Header-Scroll-Effekt, Portfolio-Grid + Lightbox, Fade-ins
  pics/           Bilder
  .nojekyll       GitHub Pages: Jekyll-Verarbeitung aus
.github/workflows/pages.yml   Deploy von build/ auf GitHub Pages bei Push auf main
.env                          Azure-IDs vom alten SWA-Hosting (gitignored, nur lokal)
```

## Konventionen

- **Alle lokalen Pfade relativ** (`style.css`, `pics/pic1.jpg`, `index.html#about`) – niemals mit `/` beginnen, sonst bricht das Hosting unter einem GitHub-Pages-Subpfad (`user.github.io/<repo>/`).
- Dateinamen kleingeschrieben halten (GitHub Pages ist case-sensitive).
- Farben/Abstände über die CSS-Variablen in `style.css` (`--red-color #D20A11`, `--blue-color #004b87`, …), nicht hartkodieren.
- Schrift ist `Arial, Helvetica, sans-serif` (`--font-primary`).
- Header/Nav ist in `index.html` und `impressum.html` dupliziert – Änderungen in beiden Dateien machen.
- Texte sind Deutsch.

## Bilder

- `pic1–pic3.jpg` (1024px): Hintergründe von Hero/#philosophie/#ziele (inline `style`).
- `pic4–pic23.jpg` (150×150): Portfolio. **Nur über eine Schleife in `script.js` referenziert** (`pics/pic${i}.jpg`, i=4..23) – per grep nach Dateinamen nicht auffindbar. Neue Portfolio-Bilder → Schleifengrenzen in `script.js` anpassen.
- `pic24.png`: Logo.
- Die Lightbox zeigt die 150px-Dateien vergrößert an → unscharf. Für bessere Qualität größere Versionen (~1200px) ergänzen.

## Lokal testen

```sh
cd build && python3 -m http.server 8000   # → http://localhost:8000
```

## Hosting: GitHub Pages

`.github/workflows/pages.yml` veröffentlicht `build/` bei jedem Push auf `main` (oder manuell per `workflow_dispatch`). Einmalig in den Repo-Settings → Pages die Source auf „GitHub Actions“ stellen.

- Eigene Domain: in Settings → Pages eintragen (bei Actions-Deploy wird eine CNAME-Datei ignoriert); DNS `www` → CNAME `<user>.github.io`, Apex → A-Records 185.199.108–111.153. Domain vorher aus Azure SWA entfernen.
- Nach Umstellung können `.env` und die Azure-Ressource (`danelieunew`, RG `danelieunew-rg`) weg.

## Bekannte Probleme

1. Tote Reste: Kontaktformular/Captcha-CSS (`.contact-form`, `.form-*`, `.captcha-*`), No-op-Lazy-Load (`img.src = img.src`), leeres `debouncedScroll`, ungenutztes `lastScroll`, mehrere ungenutzte CSS-Klassen.
2. Google Fonts „Inter“ wird geladen, aber nicht verwendet.
3. Mobile-Menü öffnet bei `top: 70px`, Header ist mobil aber ~38px hoch; Hero hat hartkodiertes `margin-top: 54px`.
4. Inhaltliche Widersprüche (offen, wird fachlich geprüft): Umsatz „über 100 Millionen“ vs. „200 Mio €“, „zwölf Standorte“ vs. „18 Standorte“, © 2014 (Impressum) vs. © 2025 (Footer).
5. SEO: kein `<h1>` auf der Startseite, kein Favicon, keine Open-Graph-Tags; Lightbox-Thumbnails ohne `alt`.
6. Fade-in (IntersectionObserver, `threshold: 0.1`): Sections starten mit `opacity: 0`; eine nur knapp angeschnittene Section unter dem Hero bleibt bis zum Scrollen unsichtbar (weiße Fläche).
