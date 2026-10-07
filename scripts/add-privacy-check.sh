#!/usr/bin/env bash
# Pridá kontrolu súkromia (GitHub Actions) do ďalších repozitárov.
# Použitie:  scripts/add-privacy-check.sh Dostihy Demander Skills navitimer
# Potrebuje: git, gh (prihlásený), súbor .privacy-salt v tomto repe.
set -euo pipefail
OWNER=sano77
HERE="$(cd "$(dirname "$0")/.." && pwd)"
SALT_FILE="$HERE/.privacy-salt"
WORK="$(mktemp -d)"
for REPO in "$@"; do
  echo "== $REPO"
  git clone -q "https://github.com/$OWNER/$REPO.git" "$WORK/$REPO"
  cd "$WORK/$REPO"
  mkdir -p .github/workflows
  cat > .github/workflows/privacy.yml <<'YML'
name: Privacy check
on:
  push:
  pull_request:
jobs:
  privacy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Get checker
        run: |
          pip install pillow
          mkdir -p scripts
          curl -fsSL https://raw.githubusercontent.com/sano77/edupage-skills/main/scripts/privacy_check.py -o scripts/privacy_check.py
          curl -fsSL https://raw.githubusercontent.com/sano77/edupage-skills/main/.privacy-denylist.sha256 -o .privacy-denylist.sha256
      - name: Personal data
        run: python3 scripts/privacy_check.py
        env:
          PRIVACY_SALT: ${{ secrets.PRIVACY_SALT }}
      - name: Secrets (whole history)
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
YML
  # zámerne verejné údaje (napr. firemný telefón na webe) – súbor .privacy-allow.d/REPO (git-ignored)
  [ -f "$HERE/.privacy-allow.d/$REPO" ] && cp "$HERE/.privacy-allow.d/$REPO" .privacy-allow
  git add -A
  git commit -q -m "CI: kontrola súkromia"
  git push -q
  [ -f "$SALT_FILE" ] && gh secret set PRIVACY_SALT -R "$OWNER/$REPO" < "$SALT_FILE"
  cd "$HERE"
done
rm -rf "$WORK"
echo "Hotovo."
