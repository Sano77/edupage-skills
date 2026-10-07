---
name: edupage-notify
description: "Watches EduPage for new grades and newly announced tests and alerts only when something changed since the last check. Use when the user asks to be notified/alerted about new grades or tests, to watch or monitor EduPage, for a 'ping when a new grade appears', or wants a recurring EduPage check. Also in Slovak/Czech: upozorni/notifikuj na novú známku alebo test, sleduj EduPage, daj vedieť keď pribudne známka, kontroluj školu každý deň."
---

# EduPage – alerts for new grades and tests

Checks EduPage and reports **only what is new** since the previous check: new grades and newly announced tests/exams. Data is read exactly like in **edupage-reader** (Claude in Chrome, the signed-in parent account, school switching via the account menu); read that skill first if it is installed. **Write the alert in the user's language.**

Use this for a running watch (e.g. a scheduled afternoon check), not for a full overview – that is what edupage-reader does.

## State: what "new" means

Keep a small state file in the output folder, `edupage-notify-state.json`, so each run compares against the last one:

```json
{
  "children": {
    "<child> @ <school>": {
      "grades": ["<subject>|<date>|<value>", …],
      "tests":  ["<subject>|<date>|<topic>", …],
      "lastChecked": "YYYY-MM-DDTHH:MM"
    }
  }
}
```

- On each run, collect the current grades (`/znamky/`) and upcoming tests (`/exam/…` + teacher messages) per child.
- **New grade** = a grade entry not in the stored `grades` list.
- **New test** = an upcoming test not in the stored `tests` list (announced since last time).
- After reporting, overwrite the state file with the current lists.
- First run: there is no state, so **don't dump everything as "new"** – record the current state silently and report only "watch set up, baseline saved" plus the next upcoming test per child.
- If the state file is missing or unreadable, treat it as a first run.

Each entry is identified by subject + date (+ value/topic), so a grade that disappears and reappears, or a test whose date is edited, is handled sanely. Never store the child's name together with sensitive values anywhere outside this state file, and keep the file in the user's workspace only.

## Output

Short and scannable. If nothing changed, say so in one line.

```
🔔 EduPage – {date}

👤 {child} – {school}
🆕 Nová známka: {subject} {value} ({date})
🆕 Nový test: {subject} – {topic} ({date}, o {n} dní)

👤 {child 2} – …
nič nové
```

- Lead with tests the user still has time to prepare for (🔴 today/tomorrow).
- Grades are listed plainly, no averages, no judging – matching the edupage-reader default. If the user has said grades don't matter, drop new grades to a single count line or omit them.
- Don't repeat items already reported in a previous run (that's what the state file prevents).

## Running it regularly

This skill is most useful on a schedule. Offer to set up a recurring task (e.g. weekday afternoons after school) that runs this check and sends the alert. Keep in mind:

- A scheduled run starts a fresh session and **needs Claude in Chrome with the parent signed in to EduPage**. If the run can't reach a signed-in session, it should report that it couldn't check, not fail silently.
- Only send a notification when there is something new; a quiet run should stay quiet (no notification, or a `noop`), so the user isn't pinged for nothing.
- Keep the state file between runs in the same workspace so "new" stays meaningful.

If the user wants it, also feed new tests into the edupage-report class page or an `.ics` calendar.

## Rules

- Never send or publish children's data; the alert goes only to the user (chat or their notification).
- If EduPage changed its layout, adapt to the menu and say briefly what changed.
