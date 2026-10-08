# Changelog

Formát podľa [Keep a Changelog](https://keepachangelog.com/), verzie podľa [SemVer](https://semver.org/).

## [1.2.0] – 2026-10-08

### Pridané
- **Rýchla cesta cez dáta EduPage** (`edupage-reader/scripts/collect.js`): skript beží v prihlásenej karte rodiča a jednou sériou požiadaviek (tie isté, aké robí web EduPage, len čítanie, bez hesla) vráti testy, DÚ, akcie, správy, rozvrh na dnes/zajtra aj na dva týždne, suplovanie, obedy a nové známky. Overené na dvoch rôznych školách.
- Rozvrh už netreba čítať zo screenshotu; UI cesta ostáva ako záloha.
- edupage-notify a edupage-report zbierajú dáta tou istou rýchlou cestou.

## [1.1.0] – 2026-10-08

### Pridané
- **Krok 0 – kontrola Chrome** v edupage-reader aj edupage-report: keď Claude in Chrome nie je pripojený (napr. píšeš z mobilu a počítač je vypnutý), skill to povie hneď a ponúkne náhradné riešenie.
- **Režim bez počítača**: prehľad aj report zo screenshotov EduPage appky alebo fotiek papierových oznamov (relatívne dátumy prepočíta, nečitateľné nedomýšľa, akcie nerobí).
- edupage-notify: konkrétne nastavenie naplánovanej úlohy s notifikáciou do mobilu (beh na počítači rodiča, šablóna promptu, stav v priečinku na počítači, tiché behy bez notifikácie).
- Návody pre rodičov (SK/CZ/EN): sekcia „Z mobilu“.

### Zmenené
- Prvé spustenie bez hesla: najprv hľadá otvorenú EduPage kartu, potom sa pýta len na názov školy (subdoménu dohľadá), prihlasuje sa rodič sám v Chrome, nájdené deti dá potvrdiť a hneď ukáže prvý prehľad.
- Pri odhlásení počas práce skill požiada o opätovné prihlásenie namiesto pokračovania naslepo.
- `.ics` z kalendára sa posiela rovno do chatu.

## [1.0.0] – 2026-10-07

Prvé vydanie. Plugin pre rodičov s účtom v EduPage (edupage.org), čítanie cez Claude in Chrome.

### Pridané
- **edupage-reader** – prehľad: testy a písomky navrchu, rozvrh, domáce úlohy, správy od učiteľov, denný/týždenný súhrn, známky, dochádzka, jedáleň, ospravedlnenky (vždy s potvrdením). Viac detí aj na rôznych školách na jednom konte.
- **edupage-report** – rodinný týždenný/mesačný report a zdieľateľná stránka triedy s odpočtom do testu a sekciou „Už bolo“.
- **edupage-notify** – upozornenia len na nové známky a novo ohlásené testy, so stavom medzi behmi; vhodné ako naplánovaná úloha.
- Kontrola súkromia: `privacy_check.py` + gitleaks v GitHub Actions, hashovaný zoznam súkromných slov s tajným kľúčom.
- Dokumentácia: README (SK + EN), CONTENTS.md, ROADMAP.md, návod pre rodičov (docs/pre-rodicov.md), ukážky súhrnu a notifikácie.
- edupage-notify: upozornenie pri nedostupnom EduPage a pravidlá pre viac používateľov (každý svoje EduPage, bez miešania dát).
