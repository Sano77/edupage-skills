---
name: edupage-reader
description: "Parent overview from EduPage (edupage.org) via Claude in Chrome for one or more children, even at different schools: upcoming tests first, timetable, homework, teacher messages, daily/weekly summary, school events calendar, absence excuses and lunches. Use whenever the user mentions EduPage, school, a child in a school context, a test, quiz, dictation, homework, timetable (what's on tomorrow, when school ends), a teacher, grades, attendance, school lunch, substitutions or holidays. Also triggers in Slovak/Czech: škola, test, písomka, diktát, DÚ, rozvrh, učiteľka/učitelka, triedna, známky, dochádzka/docházka, jedáleň/jídelna, ospravedlnenka/omluvenka, prázdniny."
---

# EduPage – parent overview

A skill for any parent with an EduPage account (edupage.org, used widely in Slovakia, Czechia and elsewhere). Works for one or several children, including children at different schools on the same account. **Reply in the user's language** (Slovak, Czech, English…), briefly and copy-paste ready.

## Default priorities

- **Tests and written exams come first** – always at the top of each child's block. Parents need to plan around them (help with studying), so they must not get lost among messages.
- Test **today or tomorrow** = 🔴 on the first line of that child's block. Test within 7 days = 🟡.
- **Grades** only briefly (one line, if new ones appeared), no judging and no averages. Details only on request.
- If the user wants different priorities, follow them.

## First run – discover children and schools

Nothing is hard-coded; the skill discovers children and schools from the account:

1. If the user doesn't give a school address, look for an open `*.edupage.org` tab in Chrome, or open `https://portal.edupage.org/`. Otherwise ask for the school subdomain (e.g. `myschool.edupage.org`).
2. On `https://{school}.edupage.org/user/` click the signed-in user's name at the top right. The list shows every school and role (Parent) on this account.
3. For each school find the child's name and class (from the home page or the timetable header). If a parent has several children at one school, EduPage has a child switcher – handle each child separately.
4. Briefly summarise what you found (child – class – school – subdomain) and continue.

**Switching schools:** a direct link to another school often lands on the login page. Instead open `/user/` on a school where the user is signed in, click the name at the top right and pick the other school (role Parent). It switches without a password. Wait ~3 s, then navigate directly to that school's paths. Work in one tab and handle schools one after another.

## Access

- Only via **Claude in Chrome**, where the user is signed in.
- At the start load the Chrome tools with a single ToolSearch (`tabs_context_mcp, tabs_create_mcp, tabs_close_mcp, navigate, get_page_text, read_page, find, computer, javascript_tool`), then `tabs_context_mcp`, and open a **new** tab. Close it when done.
- If a school won't open without login even after switching via the menu → stop and ask the user to sign in themselves. Never ask for, type or store a password.
- Right after `navigate`, `get_page_text` may fail or show "loading…" – wait 2–3 s and retry.
- The timetable is a graphical grid – `get_page_text` can't read it, take a **screenshot**.

## Where to find things

Paths work for every school; prefix them with `https://{school}.edupage.org`. Menu labels depend on the EduPage UI language (SK / CZ / EN shown).

| Area | Path / menu |
|---|---|
| **Tests, exams, homework** | `/exam/?eqa=ZmlsdGVyVGFiPXdvcmtz` – tile "DÚ / písomky" / "DÚ / písemky" / "Homework / tests"; types: Písomka, Kratučký testík, Skúšanie, Projekt, DÚ |
| **Timetable ("My timetable")** | `/dashboard/eb.php?mode=timetable` (screenshot; `>>` = next week, dotted frame = change/substitution) |
| Home / timeline, today/tomorrow timetable, upcoming events | `/user/` |
| Teacher messages | Messages tile on `/user/` |
| Attendance, absence excuses | tile "Moja dochádzka" / "Moje docházka" / "My attendance" (`/dashboard/eb.php?mode=attendance`) |
| Substitutions | tile "Suplovanie" / "Suplování" |
| School canteen (credit, lunches) | tile "Školská jedáleň" / "Školní jídelna" |
| Sign-ups / polls (consents) | tile "Prihlasovanie / Ankety" |
| Grades | menu "Známky" / "Grades" (`/znamky/`) |

Not every school enables every module (e.g. canteen, events calendar). If a tile is missing or access is denied, skip that section.

Take tests from `/exam/` **and** from the text of teacher messages (e.g. "on Friday we'll write a dictation" – such tests are often not in the test plan). Merge duplicates. On the home page also watch for things to prepare or bring, and unanswered polls/consents.

Don't guess subject or teacher abbreviations from the timetable – if the full name isn't on the page, use the abbreviation.

## Modes

With several children, output is **per child** – a separate block with the child's name and school. Don't merge them. If the user mentions only one child or school, handle only that one.

### 1) Overview ("what's new in EduPage")
For each child, in order: **tests (subject, date, topic if given)**, homework with due dates, unread messages, things to sign/confirm/bring, today's/tomorrow's timetable and lunch.

### 2) Timetable ("what's on tomorrow", "when does school end")
Open `/dashboard/eb.php?mode=timetable` for that school, take a screenshot and list the day's lessons with times, start and end of school. Highlight substitutions and tests that day.

### 3) Summary (daily / weekly)
News for the period (default: since yesterday; weekly = last 7 days) + always all upcoming tests for the next 7 days. Format (labels in the user's language):

```
📚 EduPage summary – {date}

👤 {Child} – {school} ({class})
🔴 TEST TOMORROW: {subject} – {topic}
🟡 Tests this week: {date} {subject}; …
• Homework (due): …
• Messages: …
⚠️ To do: …
· Grades: {briefly, only if new}

👤 {next child} – …
```
If a child has no test, write "Tests: none until {date}". If nothing is new, say so in one line. Skip empty sections.

### 4) Actions (absence excuse, cancelling lunch, replying to a message, signing)
- Double-check **which school and which child** the action is for – with several schools it's easy to mix up.
- Before submitting, check there isn't already a request for the same day.
- **First show exactly what you will send** (child, school, date/lessons, text) and wait for an explicit "yes". Sent items can't be taken back and the teacher sees them.
- Only then submit. Verify on the page that it was saved and confirm in one sentence.
- Never delete messages or records and never change account settings.

### 5) Calendar
- Collect tests (priority), school events and holidays for the next 2–4 weeks across all schools (holidays can differ).
- Output: table per child (date, event), tests marked 📝. If the user wants them in a calendar, create an `.ics` file `edupage-events.ics` in the output folder (all-day events, title `[Child] Event`, for tests a reminder the evening before at 18:00). If a calendar is connected, check for duplicates.

## Rules

- Never send or publish children's data (grades, attendance, messages, classmates); output only to the chat or a file.
- If the page behaves differently from this description (EduPage changes its design), adapt to the menu and briefly say what changed.
