# Program konference CEEDUCON

Úkol pro pozici Webmaster/ka v DZS – responzivní zobrazení programu konference podle přiložené tabulky.

## Jak to spustit

Stránka bere data z JSON přes `fetch`, takže nestačí jen otevřít soubor v prohlížeči. Stačí jednoduchý lokální server:

```bash
python3 -m http.server 8080
```

Pak [http://localhost:8080](http://localhost:8080). Případně `npx serve .`.

## Co je v repozitáři

- `data/program.json` – samotný program (časy, místnosti, přednášky, témata)
- `index.html` – kostra stránky
- `css/` – styly (`styles.css` + `enhancements.css`)
- `js/` – vykreslení programu, filtry, překlady, modal
- `assets/` – logo DZS, font Tabac Sans, favicon

## Jak jsem to řešil

Program je v podstatě tabulka čas × místnost. Na širší obrazovce jsem nechal mřížku podobnou příloze z zadání, na mobilu by ale stejná tabulka byla nepoužitelná – tam je program jako časová osa s kartami pod sebou.

Data jsou v JSON odděleně od vzhledu. Když se změní přednáška nebo čas, stačí upravit `program.json`, nemusí se sahat do HTML. Do budoucna by šlo stejnou strukturu generovat z WordPressu (ACF repeater nebo vlastní endpoint) – záměrně jsem to neřešil přes šablonu, ale přes čistý front-end bez buildu.

Vizuál jsem nekopíroval pixel po pixelu z obrázku v zadání. Chtěl jsem spíš něco blíž webu DZS – světlejší pozadí, čitelná typografie, barvy podle témat přednášek. Inspiroval jsem se i weby z přílohy (evropskydobrovolnik.cz, schoolink.cz).

Filtry podle místnosti a tématu plus vyhledávání v názvech dávají smysl u tak velkého programu. Po kliknutí na přednášku se otevře detail a odkaz do Google kalendáře. Tisk/PDF řeším přes `window.print()` a vlastní print styly.

Přidal jsem i češtinu a angličtinu – originální názvy přednášek jsou anglicky v JSON, české verze jsou v `js/i18n.js`.

Live režim (zvýraznění aktuálního času) a přepínání více dnů jsem neimplementoval – u jednodenního programu to nepřišlo nutné, ale šlo by to doplnit (`day` u slotů v JSON + přepínač v UI).

## Poznámka k úpravě programu

V `program.json` jsou sloty s typem `break` (přes celou šířku), `plenary` (sloučené místnosti) nebo běžné `sessions` s přiřazením k místnostem a tématu.
