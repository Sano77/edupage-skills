# EduPage via Claude — a guide for parents

A one-page guide you can send to anyone. Each person sets it up themselves and sees only their own EduPage. You never share passwords.

## What it is

Claude pulls the important things from your EduPage parent account: **upcoming tests and exams**, homework, timetable, teacher messages and school events. It works for several children, even at different schools. You can also file an absence excuse or cancel a lunch through it — it always shows you first and only submits after you confirm.

Claude reads EduPage through **Claude in Chrome** in your own browser, where you're signed in. It never stores your password and sees only your data.

## What you need (once)

1. A **Claude account** (claude.ai) and the app / desktop.
2. The **Claude in Chrome** browser extension.
3. Being **signed in to your EduPage** in that Chrome (once is enough; Chrome remembers it).

## Installing the plugin

In Claude Code / Cowork type:

```
/plugin marketplace add sano77/edupage-skills
/plugin install edupage@edupage-skills
```

(On claude.ai without plugins: download the folder `plugins/edupage/skills/edupage-reader`, zip it and upload under Settings → Capabilities → Skills.)

## How to use it

Just talk to Claude, for example:

- "What's new in EduPage?"
- "Which tests do the kids have this week?"
- "What does my daughter have tomorrow and when does school end?"
- "Give me a weekly overview for both kids."
- "File an absence excuse for Friday, family reasons." *(submits only after your "yes")*

On the first run Claude discovers your children and schools from your EduPage account and confirms them with you.

## Alerts for new grades and tests (optional)

You can get an alert **only when something new appears** (a new grade or a test tomorrow). Tell Claude:

> "Set up a weekday afternoon EduPage check and ping me only if there's something new."

Claude creates a scheduled task. Important: for it to run reliably, let it run on your own computer — in the Claude desktop app turn on **"Require this computer"** in the task's settings, on a computer that's usually on and signed in to EduPage. If it can't reach EduPage, Claude tells you the check didn't run.

## Privacy

- The plugin contains no names, schools or logins — each parent sees only their own EduPage.
- Your children's data stays in your chat and isn't sent anywhere.
- Claude never asks for your password and never submits anything in EduPage without your confirmation.
