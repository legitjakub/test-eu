# CEEDUCON – Program konference

Responzivní webová stránka s programem konference podle zadání DZS (pozice Webmaster/ka).

## Spuštění

Stránka načítá data z JSON – je potřeba lokální server (kvůli `fetch`):

```bash
# Python
python3 -m http.server 8080

# nebo npx
npx serve .
```

Poté otevřete [http://localhost:8080](http://localhost:8080).

## Struktura

| Soubor | Účel |
|--------|------|
| `index.html` | Kostra stránky, filtry, legenda |
| `data/program.json` | **Editovatelná data** – časy, místnosti, přednášky, témata |
| `css/styles.css` | Vizuální styl (inspirovaný přiloženým obrázkem) |
| `js/program.js` | Vykreslení tabulky + mobilní karty, filtry, živý režim |

## Popis řešení (zadání)

### Jak jsem nad řešením přemýšlel/a

Program konference je v podstatě **matice čas × místnost**. Na desktopu je nejpřehlednější tabulkové zobrazení (jako na obrázku), na mobilu by ale stejná tabulka byla nečitelná – proto jsem zvolil **dvě reprezentace stejných dat**: mřížku pro široké obrazovky a časové bloky s kartami pro mobil.

Data jsou oddělena od prezentace v `program.json`, aby šel program upravovat bez zásahu do HTML/CSS.

### Proč daná struktura a technický postup

- **JSON jako zdroj pravdy** – snadná údržba, možnost později napojit na CMS/WordPress REST API.
- **Vanilla HTML/CSS/JS** – žádná závislost na buildu, rychlé nasazení, snadné předání.
- **Sémantické HTML** (`header`, `main`, `section`, role pro tabulku) kvůli přístupnosti a SEO.
- **CSS Grid** pro desktopovou mřížku – flexibilní `colspan` přes `grid-column`.

### Responzivita

- **≥ 1024 px**: horizontálně scrollovatelná mřížka 9 sloupců (čas + 8 místností), sticky sloupec času.
- **< 1024 px**: vertikální timeline – každý časový blok obsahuje karty s místností, tématem a názvem přednášky.
- Typografie a mezery přes `clamp()` a flexibilní layout filtrů.

### Možnosti dalšího rozvoje

| Funkce | Stav | Poznámka |
|--------|------|----------|
| Filtrování místnosti / tématu | ✅ | Select filtry, ztlumení/skrytí neodpovídajících buněk |
| Živý režim (aktuální čas) | ✅ | Tlačítko „Živý režim“, zvýraznění řádku podle `event.date` v JSON |
| Tisk / PDF | ✅ | `@media print` + tlačítko `window.print()` |
| Vícedenní program | 🔜 | V JSON přidat pole `day` u slotů + přepínač dnů v UI |
| WordPress integrace | 🔜 | Custom post type nebo ACF repeater generující stejný JSON |
| Export PDF server-side | 🔜 | Např. Puppeteer pro přesnější PDF než tisk z prohlížeče |

## Úprava programu

Upravte `data/program.json`:

- `slots` – časové bloky (`start`, `end`)
- `type: "break"` + `span: "all"` pro přestávky přes celou šířku
- `type: "plenary"` + `rooms: ["C1","C2","C3"]` pro sloučené buňky
- `sessions` – pole přednášek s `rooms`, `title`, `theme` (id z `themes`)

## Reference

- Zadání: program podle přiloženého obrázku (ceeducon.cz)
- Inspirační weby: [evropskydobrovolnik.cz](https://www.evropskydobrovolnik.cz/), [schoolink.cz](https://schoolink.cz/)
