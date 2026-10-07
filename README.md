# EduPage skills pre Claude

Dva skills pre rodičov: **edupage-reader** (prehľad, testy, ospravedlnenky) a **edupage-report** (súhrnné reporty a stránka triedy).

Skill, ktorý z rodičovského účtu v [EduPage](https://www.edupage.org) vytiahne to dôležité: **najbližšie testy a písomky**, domáce úlohy, rozvrh, správy od učiteľov a akcie školy. Funguje pre viac detí, aj keď každé chodí na inú školu.

Claude číta EduPage cez **Claude in Chrome** v tvojom prihlásenom prehliadači. Heslo nikam neukladá a nič neodošle (ospravedlnenka, odpoveď učiteľke…) bez tvojho výslovného „áno“.

![Ukážka súhrnu](docs/ukazka-suhrnu.png)

## Čo vie

- 🔴/🟡 testy a písomky navrchu, aj tie ohlásené len v správe učiteľky
- denný / týždenný súhrn za každé dieťa zvlášť
- „čo má zajtra?“, „kedy končí?“ z rozvrhu
- kalendár akcií a prázdnin, export do `.ics`
- ospravedlnenky, odhlásenie obeda, odpovede na správy (vždy s potvrdením)
- viac detí a viac škôl na jednom EduPage konte (prepínanie bez hesla), počet detí nie je obmedzený
- odpovedá v jazyku, v akom sa pýtaš (slovensky, česky, anglicky…)

## Súhrnné reporty (edupage-report)

- **Rodinný report** – týždenný alebo mesačný, za každé dieťa zvlášť: testy s odpočtom, napísané testy, DÚ, akcie, dochádzka, voliteľne známky a na konci zoznam „čo treba urobiť“.
- **Stránka triedy** – zdieľateľný prehľad pre spolužiakov: najbližší test s odpočtom dní, počítadlo pri každom teste, zoznam po týždňoch a sekcia „Už bolo“. Obsahuje len údaje triedy, nikdy známky, dochádzku ani mená a kontakty.

Príklady: „Sprav týždenný report pre obe deti“, „Daj testy a akcie 4.A na stránku“.

## Inštalácia

**Claude Code / Cowork (plugin):**

```
/plugin marketplace add sano77/edupage-skills
/plugin install edupage@edupage-skills
```

**Claude.ai / desktop app (len skill):** stiahni priečinok `plugins/edupage/skills/edupage-reader`, zabaľ ho do ZIP a nahraj v *Settings → Capabilities → Skills*.

Potrebuješ rozšírenie **Claude in Chrome** a byť v Chrome prihlásený do EduPage.

## Príklady

- „Čo je nové v EduPage?“
- „Aké testy majú deti tento týždeň?“
- „Čo má Janka zajtra?“
- „Napíš ospravedlnenku na piatok z rodinných dôvodov“

## Súkromie

Repozitár pri každom pushi kontroluje GitHub Actions (`scripts/privacy_check.py` + gitleaks): e-maily, telefóny, IBAN, rodné čísla, čísla OP, skutočné adresy škôl na EduPage, GPS v obrázkoch a súkromný zoznam slov uložený len ako kľúčované hashe.

Skill je napísaný po anglicky, aby ho mohli použiť rodičia kdekoľvek, ale odpovedá po slovensky, keď sa pýtaš po slovensky. Neobsahuje žiadne mená, školy ani prihlasovacie údaje – deti a školy si zistí z tvojho účtu pri prvom spustení. Údaje o deťoch zostávajú v tvojom chate.

---

## English

A Claude skill for parents using [EduPage](https://www.edupage.org) (common in Slovakia, Czechia and other countries). Through **Claude in Chrome** it reads your signed-in parent account and puts **upcoming tests first**, then homework, timetable, teacher messages and school events.

- any number of children, also at different schools on one account
- daily / weekly summary per child, "what's on tomorrow?", events calendar with `.ics` export
- absence excuses, cancelling lunch, replying to teachers – always shown first and sent only after your explicit "yes"
- a second skill, **edupage-report**, builds weekly/monthly family reports and a shareable class agenda page with a test countdown
- answers in your language; never stores passwords or children's data outside your chat

Install in Claude Code / Cowork:

```
/plugin marketplace add sano77/edupage-skills
/plugin install edupage@edupage-skills
```

Try: *"What's new in EduPage?"*, *"Which tests do the kids have this week?"*, *"Excuse Friday's absence for family reasons."*

Neoficiálny projekt, nie je spojený so spoločnosťou asc Applied Software Consultants.

MIT License
