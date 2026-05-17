export const LANGS = ["cs", "en"];

export const UI = {
  cs: {
    metaTitle: "Program konference | CEEDUCON",
    metaDescription:
      "Program konference CEEDUCON – přehledný harmonogram podle času a místností.",
    skipLink: "Přeskočit na program",
    eyebrow: "CEEDUCON 2026",
    pageTitle: "Program konference",
    print: "Tisk / PDF",
    langLabel: "Jazyk",
    searchLabel: "Hledat v programu",
    searchPlaceholder: "Hledat příspěvek…",
    roomLabel: "Místnost",
    allRooms: "Všechny místnosti",
    resetFilters: "Zrušit filtry",
    themesTitle: "Témata",
    themesHint: "Kliknutím na štítek filtrujete program",
    timeRoom: "Čas / místnost",
    emptyTitle: "Nic nenalezeno",
    emptyText: "Zkuste upravit filtry nebo hledaný výraz.",
    footer: "Dům zahraniční spolupráce · Program lze upravit v",
    footerText: "Program konference CEEDUCON 2026 · pořádá Dům zahraniční spolupráce",
    footerEu: "Projekt spolufinancovaný z prostředků Evropské unie v rámci programu Erasmus+",
    loadError: "Nepodařilo se načíst program. Spusťte stránku přes lokální server.",
    toolbarAria: "Vyhledávání a filtry",
    legendAria: "Témata a legenda",
    roomChipsAria: "Rychlý filtr místností",
    gridAria: "Harmonogram konference",
    mobileAria: "Program – mobilní zobrazení",
    toolsAria: "Nástroje programu",
    modalClose: "Zavřít",
    addToCalendar: "Přidat do kalendáře",
    calendarGoogle: "Google Calendar",
  },
  en: {
    metaTitle: "Conference Programme | CEEDUCON",
    metaDescription:
      "CEEDUCON conference programme – clear schedule by time and room.",
    skipLink: "Skip to programme",
    eyebrow: "CEEDUCON 2026",
    pageTitle: "Conference Programme",
    print: "Print / PDF",
    langLabel: "Language",
    searchLabel: "Search programme",
    searchPlaceholder: "Search sessions…",
    roomLabel: "Room",
    allRooms: "All rooms",
    resetFilters: "Clear filters",
    themesTitle: "Themes",
    themesHint: "Click a tag to filter the programme",
    timeRoom: "Time / room",
    emptyTitle: "Nothing found",
    emptyText: "Try adjusting filters or your search term.",
    footer: "Czech National Agency for International Education · Edit programme in",
    footerText: "CEEDUCON 2026 conference programme · organised by DZS",
    footerEu: "Co-funded by the European Union under the Erasmus+ programme",
    loadError: "Could not load programme. Run the page via a local server.",
    toolbarAria: "Search and filters",
    legendAria: "Themes and legend",
    roomChipsAria: "Quick room filter",
    gridAria: "Conference schedule",
    mobileAria: "Programme – mobile view",
    toolsAria: "Programme tools",
    modalClose: "Close",
    addToCalendar: "Add to calendar",
    calendarGoogle: "Google Calendar",
  },
};

export const THEME_LABELS = {
  smart: {
    cs: "Chytrá a udržitelná mezinárodní spolupráce",
    en: "Smart & Sustainable International Cooperation",
  },
  internationalisation: {
    cs: "Internacionalizace pro všechny",
    en: "Internationalisation for All",
  },
  partnerships: {
    cs: "Globální a regionální partnerství",
    en: "Global & Regional Partnerships",
  },
  alumni: {
    cs: "Absolventi — zaměstnatelnost — dovednosti budoucnosti",
    en: "Alumni — Employability — Future Skills",
  },
};

export const THEME_SHORT = {
  smart: { cs: "Chytrá spolupráce", en: "Smart coop." },
  internationalisation: { cs: "Intl. pro všechny", en: "Intl. for all" },
  partnerships: { cs: "Partnerství", en: "Partnerships" },
  alumni: { cs: "Absolventi & dovednosti", en: "Alumni & skills" },
};

export const SLOT_TITLES = {
  registration: { cs: "REGISTRACE OTEVŘENA", en: "REGISTRATION OPEN" },
  opening: { cs: "Zahájení", en: "Opening" },
  "coffee-1": { cs: "Přestávka na kávu", en: "Coffee Break" },
  lunch: { cs: "Oběd", en: "Lunch" },
  "coffee-2": { cs: "Přestávka na kávu", en: "Coffee Break" },
};

export const SESSION_TITLES = {
  "Opening panel": {
    cs: "Úvodní panel",
    en: "Opening panel",
  },
  "Unlocking Opportunities: European Solidarity Corps programme": {
    cs: "Otevírání příležitostí: program Evropského sboru solidarity",
    en: "Unlocking Opportunities: European Solidarity Corps programme",
  },
  "Advancing Strategic Global & Regional Partnerships: Insights and Lessons from European University Alliances": {
    cs: "Rozvoj strategických globálních a regionálních partnerství: poznatky a poučení z evropských univerzitních aliancí",
    en: "Advancing Strategic Global & Regional Partnerships: Insights and Lessons from European University Alliances",
  },
  "Modern Trends, Technologies, and Tools to Boost International Alumni Relations": {
    cs: "Moderní trendy, technologie a nástroje pro posílení mezinárodních vztahů s absolventy",
    en: "Modern Trends, Technologies, and Tools to Boost International Alumni Relations",
  },
  "The Emerging Role of Inclusion Officers in HEIs and in Erasmus+": {
    cs: "Rozvíjející se role inkluzivních koordinátorů na VŠ a v programu Erasmus+",
    en: "The Emerging Role of Inclusion Officers in HEIs and in Erasmus+",
  },
  "Smart Tools for Smart Mobility: AI in the Daily Work of International Offices": {
    cs: "Chytré nástroje pro chytrou mobilitu: AI v každodenní práci mezinárodních kanceláří",
    en: "Smart Tools for Smart Mobility: AI in the Daily Work of International Offices",
  },
  "Learning Together: New Approaches to Collaboration Between Domestic and International Students": {
    cs: "Učíme se společně: nové přístupy ke spolupráci domácích a zahraničních studentů",
    en: "Learning Together: New Approaches to Collaboration Between Domestic and International Students",
  },
  "Breaking Barriers: Towards Automatic Credit Recognition for Inclusive Mobility": {
    cs: "Překonávání bariér: směrem k automatickému uznávání kreditů pro inkluzivní mobilitu",
    en: "Breaking Barriers: Towards Automatic Credit Recognition for Inclusive Mobility",
  },
  "VE for All - Chances and Challenges of VE in Less Developed Areas": {
    cs: "Virtuální výměna pro všechny – příležitosti a výzvy VE v méně rozvinutých regionech",
    en: "VE for All - Chances and Challenges of VE in Less Developed Areas",
  },
  "Next Gen Student Communities: Futures Thinking for European Universities": {
    cs: "Studentské komunity nové generace: myšlení o budoucnostech pro evropské univerzity",
    en: "Next Gen Student Communities: Futures Thinking for European Universities",
  },
  "But It Really is Our Degree: 20 Years of International Partnership - Lessons Learned": {
    cs: "Ale vždyť je to náš diplom: 20 let mezinárodního partnerství – získané poznatky",
    en: "But It Really is Our Degree: 20 Years of International Partnership - Lessons Learned",
  },
  "Developing Intercultural Competence and Work-Related Skills Thanks to a Virtual Exchange Project": {
    cs: "Rozvoj interkulturních kompetencí a pracovních dovedností díky projektu virtuální výměny",
    en: "Developing Intercultural Competence and Work-Related Skills Thanks to a Virtual Exchange Project",
  },
  "International Credit Mobility: Challenges of Cooperation with Non-EU countries": {
    cs: "Mezinárodní kreditní mobilita: výzvy spolupráce se zeměmi mimo EU",
    en: "International Credit Mobility: Challenges of Cooperation with Non-EU countries",
  },
  "Creating Together: VSB-TUO's Blended Intensive Programmes in the U!REKA Alliance": {
    cs: "Tvoříme společně: blended intensive programy VSB-TUO v alianci U!REKA",
    en: "Creating Together: VSB-TUO's Blended Intensive Programmes in the U!REKA Alliance",
  },
  "A Snapshot of National Policies for Internationalisation in Europe Today": {
    cs: "Pohled na národní politiky internacionalizace v dnešní Evropě",
    en: "A Snapshot of National Policies for Internationalisation in Europe Today",
  },
  "Embedding Internationalisation for All: Strategies for Systemic Change": {
    cs: "Zakotvení internacionalizace pro všechny: strategie systémových změn",
    en: "Embedding Internationalisation for All: Strategies for Systemic Change",
  },
  "Skills in Focus: University-Industry Cooperation in STEM Education": {
    cs: "Dovednosti v centru pozornosti: spolupráce univerzit a průmyslu ve vzdělávání STEM",
    en: "Skills in Focus: University-Industry Cooperation in STEM Education",
  },
  "Questionnaire - Experience from Abroad": {
    cs: "Dotazníkové šetření – zkušenosti ze zahraničí",
    en: "Questionnaire - Experience from Abroad",
  },
  "Quality Assurance in Erasmus Mundus Programmes: Good Practice and Processes": {
    cs: "Zajištění kvality v programech Erasmus Mundus: dobrá praxe a procesy",
    en: "Quality Assurance in Erasmus Mundus Programmes: Good Practice and Processes",
  },
  'Europe Comes to Class: A Best Practice from Germany\'s "Europa macht Schule" Program': {
    cs: "Evropa přichází do třídy: dobrá praxe z německého programu „Europa macht Schule“",
    en: 'Europe Comes to Class: A Best Practice from Germany\'s "Europa macht Schule" Program',
  },
  "Recognition of Prior Learning in Europe: Comparative Insights and Potentials": {
    cs: "Uznávání předchozího vzdělávání v Evropě: srovnávací poznatky a potenciál",
    en: "Recognition of Prior Learning in Europe: Comparative Insights and Potentials",
  },
  "Internationalisation without Mobility: How to Actively Engage Mobility Alumni and Youth Organisations": {
    cs: "Internacionalizace bez mobility: jak aktivně zapojit absolventy mobility a mládežnické organizace",
    en: "Internationalisation without Mobility: How to Actively Engage Mobility Alumni and Youth Organisations",
  },
  "Enabling Green Mobility: Student Perspectives and University Practices": {
    cs: "Podpora zelené mobility: perspektivy studentů a přístupy univerzit",
    en: "Enabling Green Mobility: Student Perspectives and University Practices",
  },
  "Critical Perspectives on Geopolitical Challenges to Current International Higher Education": {
    cs: "Kritické pohledy na geopolitické výzvy současného mezinárodního vysokého školství",
    en: "Critical Perspectives on Geopolitical Challenges to Current International Higher Education",
  },
  "Building the Case: Why International Students Matter": {
    cs: "Argumenty v praxi: proč záleží na zahraničních studentech",
    en: "Building the Case: Why International Students Matter",
  },
  "Didactic Erasmus Bingo: A Playful Tool for Evaluating Teaching Methods in Higher Education": {
    cs: "Didaktické Erasmus bingo: hravý nástroj pro hodnocení výukových metod na VŠ",
    en: "Didactic Erasmus Bingo: A Playful Tool for Evaluating Teaching Methods in Higher Education",
  },
  "Empowering Educators: Border-crossing co-creation in the EPICUR Centre for International Teaching and Learning": {
    cs: "Posilování pedagogů: přeshraniční spolutvorba v EPICUR Centre for International Teaching and Learning",
    en: "Empowering Educators: Border-crossing co-creation in the EPICUR Centre for International Teaching and Learning",
  },
  "Careers in Chaos: Career Education for a Changing Global Market": {
    cs: "Kariéry v chaosu: kariérní vzdělávání pro měnící se globální trh",
    en: "Careers in Chaos: Career Education for a Changing Global Market",
  },
  "Internationalisation and Inclusion: the SENSEI Approach": {
    cs: "Internacionalizace a inkluze: přístup SENSEI",
    en: "Internationalisation and Inclusion: the SENSEI Approach",
  },
  "Shifting the Lens: Rethinking Support for International Students and From Preparation to Reflection: Intercultural Readiness in Action": {
    cs: "Změna perspektivy: přehodnocení podpory zahraničních studentů – od přípravy k reflexi: interkulturní připravenost v praxi",
    en: "Shifting the Lens: Rethinking Support for International Students and From Preparation to Reflection: Intercultural Readiness in Action",
  },
};

export function getStoredLang() {
  const stored = localStorage.getItem("ceeducon-lang");
  return LANGS.includes(stored) ? stored : "cs";
}

export function setStoredLang(lang) {
  localStorage.setItem("ceeducon-lang", lang);
}

export function ui(lang, key) {
  return UI[lang]?.[key] ?? UI.cs[key] ?? key;
}

export function getThemeLabel(themeId, lang) {
  return THEME_LABELS[themeId]?.[lang] ?? THEME_LABELS[themeId]?.en ?? themeId;
}

export function getThemeShort(themeId, lang) {
  return THEME_SHORT[themeId]?.[lang] ?? "";
}

export function getSlotTitle(slot, lang) {
  if (slot.id && SLOT_TITLES[slot.id]) return SLOT_TITLES[slot.id][lang];
  return slot.title;
}

export function getSessionTitle(session, lang) {
  return SESSION_TITLES[session.title]?.[lang] ?? session.title;
}

export function formatFilterCount(lang, count) {
  if (lang === "en") {
    return count === 1 ? "1 session shown" : `${count} sessions shown`;
  }
  if (count === 1) return "Zobrazen 1 příspěvek";
  if (count >= 2 && count <= 4) return `Zobrazeny ${count} příspěvky`;
  return `Zobrazeno ${count} příspěvků`;
}

export function formatSessionAria(lang, title, time, rooms) {
  if (lang === "en") return `${title}, ${time}, room ${rooms}`;
  return `${title}, ${time}, místnost ${rooms}`;
}
