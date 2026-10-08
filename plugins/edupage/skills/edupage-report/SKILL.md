---
name: edupage-report
description: "Builds summary reports from EduPage data: a weekly or monthly family report per child (tests, homework, events, attendance, optional grades) and a shareable class agenda page with a countdown to the next test. Use when the user asks for a report, weekly/monthly summary, overview to print or send, a page or website with upcoming tests and school events, or 'put the tests on a page' – also in Slovak/Czech: report, týždenný/mesačný prehľad, súhrn, stránka triedy, najbližšie akcie, přehled."
---

# EduPage – summary reports

Turns EduPage data into a finished report. Data is collected the same way as in the **edupage-reader** skill (Claude in Chrome, the parent's signed-in account, school switching via the account menu); read that skill first if it is installed. **Write the report in the user's language.**

Ask once which report the user wants if it isn't clear, then build it without further questions.

## Before collecting data

- **Check Chrome first.** Load the Chrome tools and call `tabs_context_mcp` before anything else. If Claude in Chrome isn't connected (typically the user is on a phone and the computer is off or asleep), say so right away and offer two ways: turn on the computer with Chrome, or send screenshots from the EduPage app / photos of paper notices and build the report from those. Don't start a report and fail halfway.
- **Sign-in is the parent's job.** Never ask for, type or store a password, e-mail or verification code. If EduPage shows a login page – at first run or because the session expired mid-collection – ask the parent to sign in in the open tab, wait for "done", then continue. The first-run flow (finding the school, discovering children) is the same as in edupage-reader.

### Report from screenshots or photos
When the data comes from images instead of Chrome, build the same report from what's visible, and:
- Say at the top which sources the report is based on (e.g. "from 3 screenshots of the Tests tab"), so the parent knows what may be missing – typically attendance, messages or the timetable.
- Convert relative dates ("on Friday") to concrete dates and state the assumption if the image doesn't show when it was written. Don't guess unreadable parts; list them.
- For the **class agenda page**, the privacy rules below apply just the same – a screenshot of a family message is not class-level data. If an image mixes class info with private details (grades, names), use only the class-level part.

## Report types

### A) Family report (private)
For the parent only. One section **per child**, never merged.

Period: weekly (default, Monday–Sunday of the current or the coming week) or monthly.

Per child, in this order:
1. **Upcoming tests** – date, subject, topic, days left (🔴 today/tomorrow, 🟡 within 7 days).
2. **Tests already written** in the period – subject, date; the result only if the user wants grades in the report.
3. **Homework** with due dates.
4. **Events and things to bring / sign / pay** (trips, polls, consents, fees, days off).
5. **Attendance** – absences in the period and whether they are excused; flag unexcused ones.
6. **Grades** – only if the user asks; plain list, no judging.
7. **Next week at a glance** – first lesson and end of school per day from the timetable.

Close with a short "To do for parents" list (sign, pay, excuse, bring), most urgent first.

Output: a chat message by default. If the user wants a file or a page, build an HTML page or `.md`/`.pdf` in the output folder.

### B) Class agenda page (shareable)
A page the child's classmates or other parents can open: what's coming for **one class**.

- Use `assets/agenda-template.html`. Fill the placeholders `{{PAGE_TITLE}}`, `{{KICKER}}` (school · class), `{{HEADLINE}}`, `{{FOOTER}}` (source and date of the data, "unofficial overview") and replace `/*{{ITEMS_JSON}}*/[]` with a JSON array of items:
  `{ "d": "YYYY-MM-DD", "end": "YYYY-MM-DD" (optional), "type": "test" | "task" | "event", "title": "…", "note": "…" (optional) }`
- The page computes everything from today's date: the countdown to the next test, a day counter on each upcoming test, "today/tomorrow" badges, grouping by week, and an "Already done" section at the bottom with past tests (newest first, oldest last). A test moves there after 14:00 on its day.
- UI labels in the template are Slovak; translate them if the user's language differs.
- Include past tests of the current school period as well, so the "Already done" section is meaningful.

**Privacy rules for a shareable page – strict:**
- Only class-level information: tests, homework, class events, school holidays.
- **Never** include grades, results, attendance, absences, the child's own messages, names or contact details of classmates or parents, payment details (IBAN, variable symbols), or anything a teacher sent to one family only.
- Teachers' names only if the user wants them; subjects are enough.
- Tell the user the page shows class data and that they decide who gets the link.

## Data sources (same as edupage-reader)

| What | Where |
|---|---|
| Tests, homework | `/exam/?eqa=ZmlsdGVyVGFiPXdvcmtz` + teacher messages (tests announced only in a message) |
| Events, things to bring | `/user/` (upcoming events, messages), class teacher's messages (term dates, trips, fees) |
| Timetable | `/dashboard/eb.php?mode=timetable` (screenshot) |
| Attendance | `/dashboard/eb.php?mode=attendance` |
| Grades | `/znamky/` |

If the school blocks a module (e.g. the events calendar), say so in one line and build the report from the rest.

## Keeping it current

A report is a snapshot. Put the date of the data in the footer. If the user wants it updated regularly, offer a scheduled task (e.g. Sunday evening) that re-collects the data and republishes the same page or sends the report. Like edupage-notify, such a task needs the parent's computer with Chrome signed in to EduPage, so set it to require that computer; if a run can't reach EduPage it should say so instead of publishing a stale or empty report.
