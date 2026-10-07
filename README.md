# EduPage skills pre Claude

Skill, ktorý z rodičovského účtu v [EduPage](https://www.edupage.org) vytiahne to dôležité: **najbližšie testy a písomky**, domáce úlohy, rozvrh, správy od učiteľov a akcie školy. Funguje pre viac detí, aj keď každé chodí na inú školu.

Claude číta EduPage cez **Claude in Chrome** v tvojom prihlásenom prehliadači. Heslo nikam neukladá a nič neodošle (ospravedlnenka, odpoveď učiteľke…) bez tvojho výslovného „áno“.

## Čo vie

- 🔴/🟡 testy a písomky navrchu, aj tie ohlásené len v správe učiteľky
- denný / týždenný súhrn za každé dieťa zvlášť
- „čo má zajtra?“, „kedy končí?“ z rozvrhu
- kalendár akcií a prázdnin, export do `.ics`
- ospravedlnenky, odhlásenie obeda, odpovede na správy (vždy s potvrdením)
- viac škôl na jednom EduPage konte (prepínanie bez hesla)

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

Skill neobsahuje žiadne mená, školy ani prihlasovacie údaje – deti a školy si zistí z tvojho účtu pri prvom spustení. Údaje o deťoch zostávajú v tvojom chate.

---

**EN:** A Claude skill for parents using EduPage (Slovak/Czech school system). Reads tests, homework, timetable and teacher messages through Claude in Chrome, supports multiple children at different schools, and never submits anything without explicit confirmation.

Neoficiálny projekt, nie je spojený so spoločnosťou asc Applied Software Consultants.

MIT License
