# EduPage cez Claude — návod pre rodiča

Jednostranový návod, ktorý môžeš poslať komukoľvek. Každý si plugin nastaví sám a vidí len svoje EduPage. Žiadne heslá nikomu nedávaš.

## Čo to je

Claude ti z tvojho rodičovského EduPage vytiahne to dôležité: **najbližšie testy a písomky**, domáce úlohy, rozvrh, správy od učiteľov a akcie školy. Funguje pre viac detí, aj keď chodia na rôzne školy. Dá sa ním aj poslať ospravedlnenka alebo odhlásiť obed — vždy to najprv ukáže a odošle až po tvojom potvrdení.

Claude číta EduPage cez **Claude in Chrome** v tvojom vlastnom prehliadači, kde si prihlásený. Heslo nikam neukladá a vidí len tvoje údaje.

## Čo potrebuješ (raz)

1. **Účet Claude** (claude.ai) a appku / desktop.
2. Rozšírenie **Claude in Chrome** v prehliadači.
3. Byť v tom Chrome **prihlásený do svojho EduPage** (stačí raz, Chrome si to pamätá).

## Inštalácia pluginu

V Claude Code / Cowork napíš:

```
/plugin marketplace add sano77/edupage-skills
/plugin install edupage@edupage-skills
```

(Ak používaš len claude.ai bez pluginov, stiahni priečinok `plugins/edupage/skills/edupage-reader`, zabaľ do ZIP a nahraj v Settings → Capabilities → Skills.)

## Ako to používať

Napíš Claudovi normálnou rečou, napríklad:

- „Čo je nové v EduPage?“
- „Aké testy majú deti tento týždeň?“
- „Čo má malá zajtra a kedy končí?“
- „Sprav mi týždenný prehľad za obe deti.“
- „Napíš ospravedlnenku na piatok z rodinných dôvodov.“ *(odošle až po tvojom „áno“)*

Pri prvom spustení si Claude sám zistí tvoje deti a školy z tvojho EduPage konta a potvrdí ti ich.

## Z mobilu

Claude in Chrome funguje len v Chrome na počítači, nie v mobile. Z telefónu sa teda dá písať, ale EduPage sa číta na počítači, ktorý musí byť zapnutý a mať otvorený Chrome.

Keď počítač zapnutý nie je, pošli Claudovi **screenshoty z EduPage appky** (Plán testov, Správy, Rozvrh) alebo **fotky papierových oznamov** a spraví ti z nich rovnaký prehľad. Ospravedlnenky a iné akcie sa takto robiť nedajú.

## Upozornenia na nové známky a testy (voliteľné)

Môžeš si nechať automaticky posielať upozornenie, **len keď niečo pribudne** (nová známka alebo zajtrajší test). Povedz Claudovi:

> „Nastav mi každý pracovný deň poobede kontrolu EduPage a daj vedieť, len ak je niečo nové.“

Upozornenie ti príde ako notifikácia do mobilu. Claude vytvorí naplánovanú úlohu. Dôležité: aby bežala spoľahlivo, nechaj ju bežať cez svoj počítač — v Claude desktop appke jej v nastaveniach zapni **„Require this computer“** na počítači, ktorý býva zapnutý a prihlásený do EduPage. Ak sa k EduPage nedostane, Claude ti napíše, že kontrola neprebehla.

## Súkromie

- Plugin neobsahuje žiadne mená, školy ani prihlásenia — každý rodič vidí len svoje EduPage.
- Tvoje údaje o deťoch zostávajú v tvojom chate, nikam sa neposielajú.
- Claude nikdy nežiada tvoje heslo a nič v EduPage neodošle bez tvojho potvrdenia.
