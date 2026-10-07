---
name: "edupage-reader"
description: "Rodičovský prehľad z EduPage cez Chrome pre jedno alebo viac detí aj na rôznych školách: testy a písomky navrchu, rozvrh, DÚ, správy od učiteľov, denný/týždenný súhrn, kalendár akcií, ospravedlnenky a obedy. Použi vždy, keď používateľ spomenie EduPage, školu, dieťa v školskom kontexte, test, písomku, diktát, DÚ, rozvrh (čo má zajtra, kedy končí), učiteľku, triednu, známky, dochádzku, jedáleň, suplovanie, prázdniny alebo čo je nové v škole – aj keď EduPage výslovne nepomenuje."
---

# EduPage – rodičovský prehľad

Skill pre každého rodiča s účtom v EduPage (edupage.org). Funguje pre jedno aj viac detí, aj keď každé chodí na inú školu. Odpovedaj v jazyku používateľa, stručne a copy-paste ready.

## Priority (predvolené)

- **Testy a písomky sú najdôležitejšie** – vždy navrchu výstupu pre dané dieťa. Rodič sa pri nich potrebuje zariadiť (pomôcť s učením), takže nesmú zapadnúť medzi správami.
- Test **dnes alebo zajtra** = 🔴 v prvom riadku bloku dieťaťa. Test do 7 dní = 🟡.
- **Známky** len stručne (jeden riadok, ak nejaké pribudli), bez hodnotenia a priemerov. Podrobne iba na vyžiadanie.
- Ak používateľ povie, že chce priority inak, prispôsob sa mu.

## Prvé spustenie – zisti deti a školy

Skill nemá žiadne deti ani školy natvrdo – zistí ich z účtu:

1. Ak používateľ nepovie adresu školy, skús v Chrome nájsť otvorenú kartu `*.edupage.org`, prípadne otvor `https://portal.edupage.org/`. Ak nevieš, opýtaj sa na subdoménu školy (napr. `mojaskola.edupage.org`).
2. Na `https://{skola}.edupage.org/user/` klikni vpravo hore na meno prihláseného používateľa („Ste prihlásený ako …“). Zoznam ukáže všetky školy a role (Rodič) na tomto konte.
3. Pre každú školu zisti meno dieťaťa a triedu (z Úvodu alebo z hlavičky rozvrhu). Ak má rodič na jednej škole viac detí, EduPage má prepínač dieťaťa – spracuj každé zvlášť.
4. Krátko zhrň, čo si našiel (dieťa – trieda – škola – subdoména), a pokračuj.

**Prepínanie škôl:** priamy odkaz na inú školu často skončí na login stránke. Namiesto toho otvor `/user/` školy, kde je používateľ prihlásený, klikni na meno vpravo hore a v zozname vyber druhú školu (rola Rodič). Prepne to bez hesla. Počkaj ~3 s, potom môžeš navigovať priamo na cesty tej školy. Pracuj v jednej karte, školy spracuj postupne.

## Prístup

- Iba cez **Claude in Chrome**, kde je používateľ prihlásený.
- Na začiatku načítaj Chrome nástroje jedným ToolSearch (`tabs_context_mcp, tabs_create_mcp, tabs_close_mcp, navigate, get_page_text, read_page, find, computer, javascript_tool`), potom `tabs_context_mcp` a otvor **novú** kartu. Na konci ju zavri.
- Ak sa škola neotvorí bez loginu ani po prepnutí cez menu → zastav sa a popros používateľa, nech sa prihlási sám. Heslo nikdy nežiadaj, nepíš ani neukladaj.
- Hneď po `navigate` môže `get_page_text` zlyhať alebo ukázať „načítavam…“ – počkaj 2–3 s a skús znova.
- Rozvrh je grafická tabuľka – `get_page_text` ho nečíta, použi **screenshot**.

## Kde čo nájsť

Cesty platia pre každú školu, pred ne daj `https://{skola}.edupage.org`.

| Oblasť | Cesta / menu |
|---|---|
| **Testy, písomky, DÚ** | `/exam/?eqa=ZmlsdGVyVGFiPXdvcmtz` – typy: Písomka, Kratučký testík, Skúšanie žiakov, Projekt, DÚ |
| **Rozvrh (týždenný, „Môj rozvrh“)** | `/dashboard/eb.php?mode=timetable` (screenshot; šípky `>>` = ďalší týždeň, bodkovaný rámček = zmena/suplovanie) |
| Úvod / timeline, rozvrh na dnes/zajtra, nadchádzajúce udalosti | `/user/` |
| Správy od učiteľov | dlaždica Správy na `/user/` |
| Dochádzka, ospravedlnenky | dlaždica Moja dochádzka |
| Suplovanie | dlaždica Suplovanie |
| Školská jedáleň (kredit, obedy) | dlaždica Školská jedáleň |
| Prihlasovanie / Ankety (súhlasy) | dlaždica Prihlasovanie / Ankety |
| Známky | menu Známky |

Nie každá škola má zapnuté všetky moduly (napr. jedáleň). Ak dlaždica chýba, sekciu vynechaj.

Testy ber z `/exam/` **a** z textu správ učiteľov (napr. „v piatok si napíšeme diktát“ – také testy v pláne testov často nie sú). Duplicity zlúč. Z Úvodu si všimni aj veci, ktoré treba pripraviť alebo priniesť, a nevyriešené ankety/súhlasy.

Skratky predmetov a učiteľov z rozvrhu nedomyšľaj – ak plný názov nie je na stránke, použi skratku.

## Režimy

Pri viacerých deťoch sú výstupy **za každé dieťa zvlášť** – samostatný blok s menom dieťaťa a školou. Nezlučuj ich. Ak používateľ spomenie len jedno dieťa alebo školu, spracuj len tú.

### 1) Prehľad („čo je v EduPage“)
Pre každé dieťa v poradí: **testy (predmet, dátum, učivo ak je uvedené)**, úlohy s termínom, neprečítané správy, čo treba podpísať/potvrdiť/priniesť, dnešný/zajtrajší rozvrh a obed.

### 2) Rozvrh („čo má zajtra“, „kedy končí“)
Otvor `/dashboard/eb.php?mode=timetable` danej školy, sprav screenshot a vypíš hodiny daného dňa s časmi, začiatok a koniec vyučovania. Zmeny/suplovanie a testy v ten deň zvýrazni.

### 3) Súhrn (denný / týždenný)
Novinky za obdobie (default: od včera; týždenný = posledných 7 dní) + vždy všetky nadchádzajúce testy na 7 dní dopredu. Formát:

```
📚 EduPage súhrn – {dátum}

👤 {Meno dieťaťa} – {škola} ({trieda})
🔴 ZAJTRA TEST: {predmet} – {učivo}
🟡 Testy tento týždeň: {dátum} {predmet}; …
• Úlohy (do kedy): …
• Správy: …
⚠️ Treba urobiť: …
· Známky: {stručne, len ak nejaké pribudli}

👤 {ďalšie dieťa} – …
```
Ak dieťa nemá žiadny test, napíš „Testy: žiadne do {dátum}“. Ak nie je nič nové, napíš to jedným riadkom. Sekcie bez obsahu vynechaj.

### 4) Akcie (ospravedlnenka, odhlásenie obeda, odpoveď na správu, podpis)
- Over si, **na ktorej škole a pre ktoré dieťa** akciu robíš – pri viacerých školách sa to ľahko pomýli.
- **Najprv ukáž presne, čo odošleš** (dieťa, škola, dátum/dni, text) a počkaj na výslovné „áno“. Odoslané sa nedá vziať späť a vidí to učiteľ.
- Až potom odošli. Over na stránke, že sa to uložilo, a potvrď jednou vetou.
- Nemaž správy ani záznamy a nemeň nastavenia účtu.

### 5) Kalendár
- Vytiahni testy (priorita), akcie školy, prázdniny/voľné dni na najbližšie 2–4 týždne zo všetkých škôl (voľná sa môžu líšiť).
- Výstup: tabuľka po deťoch (dátum, udalosť), testy označené 📝. Ak chce používateľ udalosti do kalendára, vyrob `.ics` súbor `edupage-udalosti.ics` vo výstupnom priečinku (celodenné udalosti, názov `[Dieťa] Udalosť`, pri testoch pripomienka deň vopred o 18:00). Ak je pripojený kalendár, môžeš skontrolovať duplicity.

## Pravidlá

- Údaje o deťoch (známky, dochádzka, správy) nikam neposielaj ani nepublikuj; výstup len do chatu alebo súboru.
- Ak sa stránka správa inak než tu popísané (EduPage mení dizajn), prispôsob sa menu a stručne povedz, čo sa zmenilo.