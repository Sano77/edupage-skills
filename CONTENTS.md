# Obsah pluginu edupage-skills

Prehľad toho, čo plugin obsahuje a ako je poskladaný. Verzia **1.0.0**.

## Štruktúra

```
edupage-skills/
├─ .claude-plugin/marketplace.json          # definícia marketplace (pre /plugin marketplace add)
├─ plugins/edupage/
│  ├─ .claude-plugin/plugin.json             # definícia pluginu
│  └─ skills/
│     ├─ edupage-reader/SKILL.md             # Skill 1 – prehľad
│     ├─ edupage-report/
│     │  ├─ SKILL.md                         # Skill 2 – reporty
│     │  └─ assets/agenda-template.html      # šablóna zdieľateľnej stránky triedy
│     └─ edupage-notify/SKILL.md             # Skill 3 – upozornenia
├─ scripts/
│  ├─ privacy_check.py                       # kontrola osobných údajov v repe
│  └─ add-privacy-check.sh                   # pridá rovnakú kontrolu do iných repozitárov
├─ .github/workflows/privacy.yml             # CI – spustí kontrolu pri každom pushi
├─ docs/ukazka-suhrnu.png                    # ukážka súhrnu (vymyslené dáta) do README
├─ README.md
├─ LICENSE                                   # MIT
├─ .privacy-denylist.sha256                  # hashe súkromných slov (bez kľúča nečitateľné)
├─ .privacy-salt                             # tajný kľúč – NEverejný (.gitignore)
└─ .privacy-allow.d/                         # zámerne verejné hodnoty – NEverejné (.gitignore)
```

## Skill 1 — edupage-reader (prehľad)

Číta EduPage cez Claude in Chrome v prihlásenom prehliadači. Funguje pre jedno aj viac detí, aj keď chodia na rôzne školy.

| Oblasť | Čo robí |
|---|---|
| Testy a písomky | navrchu výstupu; 🔴 dnes/zajtra, 🟡 do 7 dní; aj testy ohlásené len v správe učiteľky |
| Rozvrh | „čo má zajtra“, „kedy končí“, suplovanie |
| Domáce úlohy | s termínmi |
| Správy | od učiteľov, čo treba podpísať/priniesť, ankety a súhlasy |
| Súhrn | denný alebo týždenný, za každé dieťa zvlášť |
| Známky, dochádzka, jedáleň | na vyžiadanie |
| Akcie | ospravedlnenka, odhlásenie obeda, odpoveď učiteľke — vždy najprv ukáže text, odošle až po „áno“ |

Heslo nikdy nežiada ani neukladá. Školy na jednom konte prepína bez hesla.

## Skill 2 — edupage-report (reporty)

| Report | Obsah |
|---|---|
| Rodinný (súkromný) | týždenný/mesačný, za každé dieťa: testy s odpočtom, napísané testy, DÚ, akcie, dochádzka, voliteľne známky, na konci „čo treba urobiť“ |
| Stránka triedy (zdieľateľná) | odpočet do testu, počítadlo pri každom teste, zoznam po týždňoch, sekcia „Už bolo“ |

Stránka triedy má prísne pravidlo: **nikdy** známky, dochádzku, mená ani kontakty — len informácie na úrovni triedy. Používa šablónu `assets/agenda-template.html`, ktorá počíta všetko z aktuálneho dátumu.

## Skill 3 — edupage-notify (upozornenia)

Sleduje EduPage a hlási **len to, čo pribudlo** od poslednej kontroly:

- nová známka
- novo ohlásený test alebo písomka

Stav si pamätá v súbore `edupage-notify-state.json`, takže neupozorňuje opakovane na to isté. Prvý beh si len uloží východiskový stav. Najužitočnejšie je spustiť ho ako naplánovanú úlohu (napr. poobede cez pracovné dni) — upozornenie príde, len keď je naozaj niečo nové. Scheduled beh potrebuje Chrome prihlásený do EduPage.

## Kontrola súkromia

`scripts/privacy_check.py` + gitleaks v GitHub Actions. Zlyhá pri:

- e-mailoch, telefónoch, IBAN, rodných číslach, číslach OP
- skutočných školách na EduPage (`*.edupage.org`)
- GPS v obrázkoch
- slovách zo súkromného zoznamu (mená, škola, ulica) — uložené len ako hashe s tajným kľúčom, z repa sa nedajú spätne prečítať

Zámerne verejné hodnoty (napr. firemný telefón) sa dajú povoliť cez `.privacy-allow`.

## Súkromie celkovo

Plugin neobsahuje žiadne mená detí, školy ani adresy. Tie si každý skill zistí z účtu používateľa až pri behu a údaje o deťoch zostávajú v jeho chate.
