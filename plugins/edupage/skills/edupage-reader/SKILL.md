---
name: edupage-reader
description: "Parent overview from EduPage (edupage.org) via Claude in Chrome for one or more children, even at different schools: upcoming tests first, timetable, homework, teacher messages, daily/weekly summary, school events calendar, absence excuses and lunches. Without a computer it builds the same overview from screenshots of the EduPage app or photos of paper school notices. Use whenever the user mentions EduPage, school, a child in a school context, a test, quiz, dictation, homework, timetable (what's on tomorrow, when school ends), a teacher, grades, attendance, school lunch, substitutions or holidays, or sends an EduPage screenshot or a photo of a school notice. Also triggers in Slovak/Czech: škola, test, písomka, diktát, DÚ, rozvrh, učiteľka/učitelka, triedna, známky, dochádzka/docházka, jedáleň/jídelna, ospravedlnenka/omluvenka, prázdniny."
---

# EduPage – parent overview

A skill for any parent with an EduPage account (edupage.org, used widely in Slovakia, Czechia and elsewhere). Works for one or several children, including children at different schools on the same account. **Reply in the user's language** (Slovak, Czech, English…), briefly and copy-paste ready.

## Default priorities

- **Tests and written exams come first** – always at the top of each child's block. Parents need to plan around them (help with studying), so they must not get lost among messages.
- Test **today or tomorrow** = 🔴 on the first line of that child's block. Test within 7 days = 🟡.
- **Grades** only briefly (one line, if new ones appeared), no judging and no averages. Details only on request.
- If the user wants different priorities, follow them.

## Step 0 – is Chrome available?

The skill reads EduPage through **Claude in Chrome**, an extension for desktop Chrome. Mobile Chrome has no extensions, so from a phone the skill works only as a remote control for a computer where Chrome is running with the extension.

Before anything else, load the Chrome tools (see **Access**) and call `tabs_context_mcp`.

- **Connected** → continue with First run or the requested mode.
- **Not connected / tools missing / no response** → say so right away, briefly, and offer two ways forward. Don't wait for something to fail later:

  > To read EduPage I need Chrome on your computer with the Claude in Chrome extension – it isn't connected right now (the computer may be off or asleep, or Chrome closed).
  > • Turn on the computer with Chrome and message me again, or
  > • send me screenshots from the EduPage app (Tests, Messages, Timetable) or photos of paper notices – I'll build the same overview from them.

  If the parent sends images, switch to **No-computer mode**.

## First run – sign-in, children and schools

Nothing is hard-coded; the skill discovers children and schools from the account. If you already know them from this conversation or from memory, skip what you know.

**Never ask for, type or store a password, e-mail or verification code.** The parent always signs in themselves in their own Chrome – it's safer, and Chrome keeps the session for later runs. If the parent pastes a password into the chat, don't use it and suggest they change it.

1. **Try to find the school without asking.** In `tabs_context_mcp`, look for an open `*.edupage.org` tab. If there is one, use its subdomain and go to step 4.
2. **Otherwise ask one question:** "What's the name of your child's school, or its EduPage address (e.g. `myschool.edupage.org`)?"
   - Only a name and town → find the subdomain with a web search and ask the parent to confirm it.
   - No idea → open `https://portal.edupage.org/`; after sign-in EduPage lists every school on the account.
3. **The parent signs in.** Open `https://{school}.edupage.org/` in a new tab. If a login page appears, say: "Please sign in in the open Chrome tab (username and password, or Google/Microsoft) and reply 'done'." Wait for the reply.
4. **Children and schools:** on `https://{school}.edupage.org/user/` click the signed-in user's name at the top right. The list shows every school and role (Parent) on this account – one parent login usually covers several schools, no second sign-in needed. For each school find the child's name and class (from the home page or the timetable header). If a parent has several children at one school, EduPage has a child switcher – handle each child separately.
5. **Confirm and show a result right away:** "I found: {child} – {class} – {school}; … Is that right?" Add one sentence on privacy: I read your children's data only from your signed-in Chrome and send it nowhere. Then go straight into the **Overview**, so the parent gets value immediately, not just a setup.
6. Optionally, in one sentence: they can save the school name in their Claude preferences so you won't need to ask next time.

**Switching schools:** a direct link to another school often lands on the login page. Instead open `/user/` on a school where the user is signed in, click the name at the top right and pick the other school (role Parent). It switches without a password. Wait ~3 s, then navigate directly to that school's paths. Work in one tab and handle schools one after another.

**Signed out mid-task:** EduPage logs out after a while. If a page redirects to the login, don't carry on blindly – ask the parent to sign in again in the tab (step 3) and wait.

## Access

- At the start load the Chrome tools with a single ToolSearch (`tabs_context_mcp, tabs_create_mcp, tabs_close_mcp, navigate, get_page_text, read_page, find, computer, javascript_tool`), then `tabs_context_mcp`, and open a **new** tab. Close it when done.
- If a school won't open even after the parent signed in and you switched via the menu → stop and say what you see.
- Right after `navigate`, `get_page_text` may fail or show "loading…" – wait 2–3 s and retry.
- Prefer the **Fast path** below. In the UI fallback the timetable is a graphical grid – `get_page_text` can't read it, take a **screenshot**.

## Fast path – read the data directly (preferred)

Instead of clicking through pages and taking screenshots, run the bundled collector **in the signed-in EduPage tab**: read `scripts/collect.js` (next to this file) and pass its whole content as the `javascript_tool` text. It makes the same same-origin requests the EduPage web makes, with the parent's own cookies – read-only, no password, nothing leaves the browser except the result returned to you. One run returns a compact JSON (~15 KB) for the **current school**:

| Key | What it holds |
|---|---|
| `children` | child id, name, class |
| `tests` | upcoming tests in the window: `date` (the test day), `type` (Písomka, Kratučký testík, Veľká písomka, Skúšanie, Projekt…), `subject`, `title`, `announced` |
| `homework` | `due`, `subject`, `title`, `details` |
| `events` | school events, trips, holidays in the window |
| `messages` | teacher messages and news from the last days: `date`, `from`, `text` (trimmed) |
| `today_tomorrow` | lessons for today and tomorrow with times, subjects, teachers – already reflects substitutions |
| `week` | timetable for this and next week by date (use for days beyond tomorrow) |
| `substitutions`, `lunches`, `bells` | substitution notices, lunch menu, bell times |
| `grades` | recent grades: `date`, `subject`, `value`, `what` |

- Adjust `OPTIONS` at the top of the script when needed (`daysAhead`, `daysBack`, `weekTimetable`). Weekly summary → `daysBack: 7`; calendar → `daysAhead: 28`.
- **Several schools:** run it once per school – switch schools via the account menu first (see **Switching schools**), then run it again in the same tab.
- **Several children at one school:** the script reports the currently selected child; switch the child in EduPage and run again.
- **Teacher messages still matter for tests:** scan `messages[].text` for tests announced only in a message ("v piatok diktát") and merge them into `tests`.
- **Fall back to the UI** (the table below) when the result has `error` (`signed_out` → ask the parent to sign in; anything else → EduPage probably changed), when `week` has an `error`, or when a section you need is missing. Say in one line that you used the slower way.
- Present the result in the usual output formats below – never dump the raw JSON on the parent.

## Where to find things (UI fallback)

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
Use `today_tomorrow` (or `week` for later days) from the Fast path; only if that fails, open `/dashboard/eb.php?mode=timetable` and take a screenshot. List the day's lessons with times, start and end of school. Highlight substitutions and tests that day.

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
- In No-computer mode you can't perform actions – say so and tell the parent what to tap in the app.

### 5) Calendar
- Collect tests (priority), school events and holidays for the next 2–4 weeks across all schools (holidays can differ).
- Output: table per child (date, event), tests marked 📝. If the user wants them in a calendar, create an `.ics` file `edupage-events.ics` and hand it to the user in the chat (all-day events, title `[Child] Event`, for tests a reminder the evening before at 18:00). If a calendar is connected, check for duplicates.

## No-computer mode (screenshots and photos)

When Chrome isn't available, or the parent simply sends images, produce the same output from what's in the images.

- **What you accept:** screenshots of the EduPage app or website (Tests, Messages, Timetable, Home, Grades) and photos of paper notices – a letter from school, a note in the pupil's book, a photographed board or exercise book with homework.
- **What to extract:** tests and exams (subject, date, topic), homework with due dates, things to bring/sign/pay, events and days off. Output in the same format as **Summary**, tests first.
- **Dates:** turn "on Friday" or "next week" into a concrete date from today's date; if you can't tell when a notice was written, state your assumption ("assuming this notice is from this week").
- **Whose is it:** with several children, if an image doesn't show which child it belongs to, ask one question.
- **Unreadable parts:** don't guess – say what you can't read and ask for a clearer photo.
- End with one sentence: the most complete overview (messages and test plan at once) comes when the computer with Chrome is on.

## Rules

- Never send or publish children's data (grades, attendance, messages, classmates); output only to the chat or a file.
- If the page behaves differently from this description (EduPage changes its design), adapt to the menu and briefly say what changed.
