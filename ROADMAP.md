# Roadmap / nápady do budúcna

Nezáväzný zoznam, kam by sa plugin mohol posunúť.

## Rozhodnutie o architektúre (2026-10-08)

**Verejný plugin ostáva v prehliadači rodiča (Claude in Chrome).** Rodič číta údaje vlastného dieťaťa vo vlastnom prihlásenom Chrome, k autorovi pluginu nič neodchádza a heslo sa nikde neukladá.

Prečo nie API alebo cloudový konektor:
- **Verejné API EduPage nemá.** Web a mobilná appka používajú interné endpointy; neoficiálne knižnice (napr. `edupage-api` v Pythone, GPL-3.0) ich odpozorovali bez dokumentácie a bez povolenia asc. Môžu sa kedykoľvek zmeniť a pri automatickom prihlásení môže prísť captcha. Podobne je na tom aj Bakaláři (CZ).
- **GDPR model EduPage** ([present.edupage.org/gdpr](https://present.edupage.org/gdpr/)): škola je prevádzkovateľ, asc sprostredkovateľ so zmluvou so školou; rodičia v ňom nie sú zmluvná strana. asc deklaruje, že údaje nezdieľa s tretími stranami okrem exportov, ktoré spustí sama škola. Partnerský API prístup pre službu na strane rodičov je preto nepravdepodobný bez súhlasu jednotlivých škôl.
- **Cloudová služba** (server s uloženými heslami alebo reláciami rodičov) by stála mimo tohto zmluvného modelu a spracúvala by údaje detí z cudzích škôl – právne šedá zóna. **Odložené**; bez konzultácie s odborníkom na GDPR a bez súhlasu asc/škôl nespúšťať.
- Podmienky používania EduPage zatiaľ neprečítané (stránka blokuje automatické načítanie); dajú sa vyžiadať cez [kontakt](https://present.edupage.org/contact/).

Obmedzenie, s ktorým rátame: čítanie potrebuje zapnutý počítač s Chrome. Z mobilu bez počítača pokrýva plugin screenshoty a fotky; upozornenia vie poslať aj samotná appka EduPage.

## Ďalší krok

- **Rýchla cesta cez endpointy v prehliadači** – v Chrome rodiča volať cez `javascript_tool` rovnaké interné endpointy, ktoré používa web (len GET, s cookies rodiča, bez hesla). Rýchlejšie a presnejšie než klikanie a screenshoty (rozvrh ako dáta), so záložným postupom cez UI, keď endpoint nevráti očakávané dáta. Postup: zmapovať požiadavky cez `read_network_requests` na reálnom účte (obe školy), do repa zapísať len všeobecné cesty bez subdomén a ID, nekopírovať kód z GPL knižníc. Využiť aj v edupage-notify.

## Zvážiť časom

- **B2B cez školy** – škola je prevádzkovateľ údajov, takže môže legálne schváliť integráciu alebo export. Ponuka: nastavenie a podpora AI asistenta pre rodičov žiakov danej školy, s jej súhlasom. Premyslieť obsah ponuky, cenu a čo musí škola schváliť.

- **Služba pre rodičov** — ponúknuť nastavenie a podporu platiacim klientom (nie barter). Každý rodič beží na svojom účte a svojom EduPage prihlásení; neriešia sa cudzie heslá. Bolo by treba premyslieť: onboarding (návod už je v `docs/pre-rodicov.md`), podpora, cena/predplatné, limity.
- **Perzistentný stav notifikácií** medzi behmi (napr. ľahká databáza alebo stránka), aby počítadlo zlyhaní a „čo už bolo nahlásené“ fungovalo aj pri cloudových behoch bez viazaného počítača.
- **Export do kalendára** pre testy a akcie priamo z notifikácie (`.ics`), prípadne zápis do pripojeného kalendára.
- **Stránka triedy** ako hostovaná verzia s automatickou aktualizáciou (dnes sa generuje na vyžiadanie).

## Hotové (v1.1.0)

- režim bez počítača (screenshoty, fotky oznamov), onboarding bez hesla, notifikácie do mobilu

## Hotové (v1.0.0)

- edupage-reader, edupage-report, edupage-notify
- kontrola súkromia (CI + hashovaný zoznam)
- návod pre rodičov `docs/pre-rodicov.md`
