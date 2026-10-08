# Roadmap / nápady do budúcna

Nezáväzný zoznam, kam by sa plugin mohol posunúť.

## Zvážiť časom

- **Služba pre rodičov** — ponúknuť nastavenie a podporu platiacim klientom (nie barter). Každý rodič beží na svojom účte a svojom EduPage prihlásení; neriešia sa cudzie heslá. Bolo by treba premyslieť: onboarding (návod už je v `docs/pre-rodicov.md`), podpora, cena/predplatné, limity.
- **Český/anglický návod** pre rodičov (`docs/pre-rodicov.md` zatiaľ po slovensky; skilly sú anglické a fungujú vo viacerých krajinách).
- **Perzistentný stav notifikácií** medzi behmi (napr. ľahká databáza alebo stránka), aby počítadlo zlyhaní a „čo už bolo nahlásené“ fungovalo aj pri cloudových behoch bez viazaného počítača.
- **Export do kalendára** pre testy a akcie priamo z notifikácie (`.ics`), prípadne zápis do pripojeného kalendára.
- **Stránka triedy** ako hostovaná verzia s automatickou aktualizáciou (dnes sa generuje na vyžiadanie).

## Hotové (v1.1.0)

- režim bez počítača (screenshoty, fotky oznamov), onboarding bez hesla, notifikácie do mobilu

## Hotové (v1.0.0)

- edupage-reader, edupage-report, edupage-notify
- kontrola súkromia (CI + hashovaný zoznam)
- návod pre rodičov `docs/pre-rodicov.md`
