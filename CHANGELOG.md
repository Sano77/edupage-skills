# Changelog

Formát podľa [Keep a Changelog](https://keepachangelog.com/), verzie podľa [SemVer](https://semver.org/).

## [1.0.0] – 2026-10-07

Prvé vydanie. Plugin pre rodičov s účtom v EduPage (edupage.org), čítanie cez Claude in Chrome.

### Pridané
- **edupage-reader** – prehľad: testy a písomky navrchu, rozvrh, domáce úlohy, správy od učiteľov, denný/týždenný súhrn, známky, dochádzka, jedáleň, ospravedlnenky (vždy s potvrdením). Viac detí aj na rôznych školách na jednom konte.
- **edupage-report** – rodinný týždenný/mesačný report a zdieľateľná stránka triedy s odpočtom do testu a sekciou „Už bolo“.
- **edupage-notify** – upozornenia len na nové známky a novo ohlásené testy, so stavom medzi behmi; vhodné ako naplánovaná úloha.
- Kontrola súkromia: `privacy_check.py` + gitleaks v GitHub Actions, hashovaný zoznam súkromných slov s tajným kľúčom.
- Dokumentácia: README (SK + EN), CONTENTS.md, ROADMAP.md, návod pre rodičov (docs/pre-rodicov.md), ukážky súhrnu a notifikácie.
- edupage-notify: upozornenie pri nedostupnom EduPage a pravidlá pre viac používateľov (každý svoje EduPage, bez miešania dát).
