# EduPage přes Claude — návod pro rodiče

Jednostránkový návod, který můžeš poslat komukoli. Každý si plugin nastaví sám a vidí jen svoje EduPage. Žádná hesla nikomu nedáváš.

## Co to je

Claude ti z tvého rodičovského EduPage vytáhne to důležité: **nejbližší testy a písemky**, domácí úkoly, rozvrh, zprávy od učitelů a akce školy. Funguje pro více dětí, i když chodí na různé školy. Dá se jím také poslat omluvenka nebo odhlásit oběd — vždy to nejdřív ukáže a odešle až po tvém potvrzení.

Claude čte EduPage přes **Claude in Chrome** v tvém vlastním prohlížeči, kde jsi přihlášený. Heslo nikam neukládá a vidí jen tvoje údaje.

## Co potřebuješ (jednou)

1. **Účet Claude** (claude.ai) a appku / desktop.
2. Rozšíření **Claude in Chrome** v prohlížeči.
3. Být v tom Chrome **přihlášený do svého EduPage** (stačí jednou, Chrome si to pamatuje).

## Instalace pluginu

V Claude Code / Cowork napiš:

```
/plugin marketplace add sano77/edupage-skills
/plugin install edupage@edupage-skills
```

(Na claude.ai bez pluginů: stáhni složku `plugins/edupage/skills/edupage-reader`, zabal do ZIP a nahraj v Settings → Capabilities → Skills.)

## Jak to používat

Napiš Claudovi normální řečí, například:

- „Co je nového v EduPage?"
- „Jaké testy mají děti tento týden?"
- „Co má dcera zítra a kdy končí?"
- „Udělej mi týdenní přehled za obě děti."
- „Napiš omluvenku na pátek z rodinných důvodů." *(odešle až po tvém „ano")*

Při prvním spuštění si Claude sám zjistí tvoje děti a školy z tvého EduPage účtu a potvrdí ti je.

## Z mobilu

Claude in Chrome funguje jen v Chrome na počítači, ne v mobilu. Z telefonu se dá psát, ale EduPage se čte na počítači, který musí být zapnutý a mít otevřený Chrome.

Když počítač zapnutý není, pošli Claudovi **screenshoty z EduPage aplikace** (Plán testů, Zprávy, Rozvrh) nebo **fotky papírových oznámení** a udělá ti z nich stejný přehled. Omluvenky a jiné akce se takto dělat nedají.

## Upozornění na nové známky a testy (volitelné)

Můžeš si nechat posílat upozornění, **jen když něco přibude** (nová známka nebo zítřejší test). Řekni Claudovi:

> „Nastav mi každý pracovní den odpoledne kontrolu EduPage a dej vědět, jen když je něco nového."

Upozornění ti přijde jako notifikace do mobilu. Claude vytvoří naplánovanou úlohu. Důležité: aby běžela spolehlivě, nech ji běžet přes svůj počítač — v Claude desktop appce jí v nastavení zapni **„Require this computer"** na počítači, který bývá zapnutý a přihlášený do EduPage. Pokud se k EduPage nedostane, Claude ti napíše, že kontrola neproběhla.

## Soukromí

- Plugin neobsahuje žádná jména, školy ani přihlášení — každý rodič vidí jen svoje EduPage.
- Tvoje údaje o dětech zůstávají v tvém chatu, nikam se neposílají.
- Claude nikdy nežádá tvoje heslo a nic v EduPage neodešle bez tvého potvrzení.
