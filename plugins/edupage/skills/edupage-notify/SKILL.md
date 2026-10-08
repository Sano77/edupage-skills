---
name: edupage-notify
description: "Watches EduPage for new grades and newly announced tests and alerts only when something changed since the last check. Use when the user asks to be notified/alerted about new grades or tests, to watch or monitor EduPage, for a 'ping when a new grade appears', or wants a recurring EduPage check. Also in Slovak/Czech: upozorni/notifikuj na novú známku alebo test, sleduj EduPage, daj vedieť keď pribudne známka, kontroluj školu každý deň."
---

# EduPage – alerts for new grades and tests

Checks EduPage and reports **only what is new** since the previous check: new grades and newly announced tests/exams. Data is read exactly like in **edupage-reader** (Claude in Chrome, the signed-in parent account, school switching via the account menu); read that skill first if it is installed. **Write the alert in the user's language.**

Use this for a running watch (e.g. a scheduled afternoon check), not for a full overview – that is what edupage-reader does.

## State: what "new" means

Keep a small state file, `edupage-notify-state.json`, so each run compares against the last one. For scheduled runs it must survive between sessions – see "State between runs" below.

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

- On each run, collect the current grades and upcoming tests per child. **Use edupage-reader's fast path** (`scripts/collect.js` in the edupage-reader skill, run in the signed-in tab with `daysBack` covering the time since the last check) – it returns `tests` and `grades` in one request per school, so a scheduled check is quick and cheap. Also scan `messages` for tests announced only in a message. If it returns an `error`, fall back to the pages (`/znamky/`, `/exam/…`).
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

## Running it regularly – alerts on the phone

This skill is most useful on a schedule: the check runs on the parent's computer, and the alert arrives as a notification on their phone. Offer to set it up after the first successful check.

**How it works (explain in two sentences):** the check needs the computer to be on with Chrome signed in to EduPage; the phone only receives the result. If the computer is off at check time, the parent gets a short "couldn't check" alert instead (see below).

**Setup – use the session's own scheduling tools** (they may need loading via tool search; go by their descriptions; never a session-local cron that disappears when the chat ends):

1. Ask once for the time if the parent didn't say. Default: **weekdays ~15:00** (after school, when new grades and announcements appear). One extra evening run (~19:00) is optional.
2. Create a **scheduled task** with:
   - **requires the parent's computer** (the run must use Claude in Chrome there), so it doesn't run in the cloud without access to EduPage;
   - **push notifications on** (e-mail optional), so the alert reaches the phone;
   - a **standalone prompt** – each run starts fresh with no memory of this chat. Template:
     > Run the edupage-notify skill: check EduPage for new grades and newly announced tests for my children ({children – schools}). Compare with the state file `{path}` and update it. If something is new, send the short alert. If nothing is new, stay quiet. If EduPage can't be reached, send the "couldn't check" alert.
3. Confirm in one line: when it runs, that it needs the computer on, and how they can pause it.

The children's names in the schedule prompt stay private to that parent's account – they never belong in this shared skill.

**State between runs:** a scheduled run has no memory of the previous one, so the state file must live where the next run can read it. Prefer a folder on the parent's computer connected to the task (e.g. a `EduPage` folder in Documents) and put its path in the prompt. If no such folder is available, follow the fallback in "When EduPage can't be reached" and, without a state file, report only tests announced in the last 24 hours and grades dated today/yesterday, so the parent isn't flooded with old items.

**Quiet runs stay quiet:** only notify when there is something new or the check failed. A successful run with nothing new sends no notification (or a `noop`), so the parent isn't pinged for nothing.

If the user wants it, also feed new tests into the edupage-report class page or an `.ics` calendar.

## When EduPage can't be reached

If the signed-in EduPage isn't reachable (Claude in Chrome not connected, or not logged in), **do not stay silent** – the user needs to know their watch isn't working:

- Track a `failStreak` counter per child in the state file.
- On each failed check, increment it and send a short alert: "⚠️ Kontrola EduPage dnes neprebehla – Chrome nie je prihlásený do EduPage." On the **3rd failed run in a row**, add: "Odporúčam úlohe zapnúť ‚Require this computer', aby bežala cez tvoj počítač s prihláseným EduPage."
- Reset `failStreak` to 0 on the first successful check.
- If the state file can't persist between runs (fresh cloud sessions), you can't count a streak reliably, so alert on **every** failed check and mention the ‚Require this computer' option once.

A successful check that simply finds nothing new still stays quiet (no notification). Only a *failure* breaks the silence.

## For multiple people (per user)

This skill carries **no names, schools, children or logins** – each person runs it on their **own** EduPage. The flow for any user:

1. They install the plugin and open Claude in Chrome signed in to their own EduPage.
2. The skill discovers their children and schools from their account (see the first-run steps in edupage-reader) and watches only their data.
3. Each user sets up their **own** scheduled check; the schedule prompt may name their children/schools, but that stays private to their account – it never belongs in this shared skill.

Never mix one user's children, grades or state with another's. The state file, any `.ics` and any alert belong only to the user who ran the check.

## Rules

- Never send or publish children's data; the alert goes only to the user (chat or their notification).
- If EduPage changed its layout, adapt to the menu and say briefly what changed.
