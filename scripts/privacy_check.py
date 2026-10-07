#!/usr/bin/env python3
"""Fails if the repo contains personal data that must never be published.

- generic patterns: e-mails, phone numbers, IBANs, birth numbers, ID card numbers,
  real EduPage school subdomains, GPS data in images
- private denylist: keyed hashes (HMAC-SHA256) of normalized words (names, schools,
  streets). The key lives only in .privacy-salt (git-ignored) and in the GitHub secret
  PRIVACY_SALT, so the list cannot be reversed by hashing common names.
  Add a word:  python3 scripts/privacy_check.py --hash "word" >> .privacy-denylist.sha256
"""
import hashlib, hmac, os, re, subprocess, sys, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DENYLIST = os.path.join(ROOT, ".privacy-denylist.sha256")
SKIP = {".privacy-denylist.sha256", "scripts/privacy_check.py", ".privacy-salt"}
ALLOWED_SUBDOMAINS = {"portal", "www", "help", "myschool", "mojaskola", "mojeskola", "school", "skola", "{school}", "{skola}"}
ALLOWED_EMAIL = re.compile(r"(noreply|no-reply)@|@users\.noreply\.github\.com$|@example\.(com|org)$", re.I)

PATTERNS = {
    "e-mail": re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+"),
    "phone": re.compile(r"(?:\+|00)4(?:20|21)[ ]?\d{3}[ ]?\d{3}[ ]?\d{3}|\b09\d{2}[ ]?\d{3}[ ]?\d{3}\b"),
    "IBAN": re.compile(r"\b(?:SK|CZ)\d{2}(?:[ ]?\d{4}){5}\b"),
    "birth number": re.compile(r"\b\d{2}[0156]\d[0-3]\d/?\d{3,4}\b"),
    "ID card no.": re.compile(r"\b[A-Z]{2}\d{6}\b"),
    "school subdomain": re.compile(r"\b([a-z0-9-]+)\.edupage\.org", re.I),
}
FAKE_ID = re.compile(r"^(?:[A-Z]{2})?(?:123456|000000|111111)$")

def norm(w):
    w = unicodedata.normalize("NFKD", w.lower())
    return "".join(c for c in w if not unicodedata.combining(c))

def salt():
    s = os.environ.get("PRIVACY_SALT", "")
    f = os.path.join(ROOT, ".privacy-salt")
    if not s and os.path.exists(f):
        s = open(f).read().strip()
    return s.encode()

def h(w, key=None):
    return hmac.new(key if key is not None else salt(), norm(w).encode(), hashlib.sha256).hexdigest()

def files():
    r = subprocess.run(["git", "ls-files", "-co", "--exclude-standard", "-z"], cwd=ROOT, capture_output=True, text=True)
    out = [f for f in r.stdout.split("\0") if f]
    if r.returncode != 0 or not out:  # not a git checkout: walk the folder
        out = [os.path.relpath(os.path.join(d, f), ROOT) for d, ds, fs in os.walk(ROOT)
               if "/.git" not in d + "/" for f in fs]
        out = [f for f in out if not f.startswith(".git" + os.sep)]
    return [f for f in out if f not in SKIP]

def image_gps(path):
    try:
        from PIL import Image
        exif = Image.open(path).getexif()
        return 34853 in exif and bool(exif.get_ifd(34853))
    except Exception:
        return False

def main():
    if len(sys.argv) == 3 and sys.argv[1] == "--hash":
        print(h(sys.argv[2])); return 0
    deny = set()
    if not salt():
        print("note: PRIVACY_SALT not set – private denylist skipped, generic checks only")
    elif os.path.exists(DENYLIST):
        deny = {l.split()[0] for l in open(DENYLIST) if l.strip() and not l.startswith("#")}
    problems = []
    for f in files():
        p = os.path.join(ROOT, f)
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".heic", ".webp")):
            if image_gps(p): problems.append(f"{f}: image contains GPS location")
            continue
        try: text = open(p, encoding="utf-8").read()
        except (UnicodeDecodeError, IsADirectoryError, FileNotFoundError): continue
        for n, line in enumerate(text.splitlines(), 1):
            for name, rx in PATTERNS.items():
                for m in rx.finditer(line):
                    v = m.group(0)
                    if name == "e-mail" and ALLOWED_EMAIL.search(v): continue
                    if name == "school subdomain" and m.group(1).lower() in ALLOWED_SUBDOMAINS: continue
                    if name == "ID card no." and FAKE_ID.match(v): continue
                    if name == "birth number" and "1234" in v: continue
                    problems.append(f"{f}:{n}: {name}")
            for w in re.findall(r"[\w.@-]{3,}", line):
                if h(w) in deny or h(w.strip(".-")) in deny:
                    problems.append(f"{f}:{n}: private word from denylist")
    if problems:
        print("Privacy check FAILED – remove these before publishing:")
        for p in sorted(set(problems)): print("  " + p)
        return 1
    print("Privacy check OK")
    return 0

if __name__ == "__main__":
    sys.exit(main())
