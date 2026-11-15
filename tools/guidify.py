#!/usr/bin/env python
"""
Turn a host article into a topic guide.
Usage: python tools/guidify.py <host-slug> <spec.json>

spec.json:
{
  "title": "...", "excerpt": "...", "dek": "...",
  "problem": "Fix it",            # optional, keeps current if missing
  "tier": "...", "permissions": "...", "minutes": 12,
  "verified": "2026-11-15", "validated": "2026-11-15 10:00 ET",
  "howto": [["Step name", "Step text"], ...],
  "body": "path/to/body.html"     # inner HTML of <article class="prose">, without the vote div
}
Rewrites articles/<host>/index.html (title, meta, og, JSON-LD, badges, h1, dek,
facts, body) and the host entry in articles.js (type guide + the fields above).
Then run merge.js for the members and node tools/build.js.
"""
import json, re, sys, html, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
slug, spec_path = sys.argv[1], sys.argv[2]
S = json.loads(Path(spec_path).read_text(encoding='utf-8'))
body = Path(S['body']).read_text(encoding='utf-8')
page = ROOT / 'articles' / slug / 'index.html'
h = page.read_text(encoding='utf-8')
nl = '\r\n' if '\r\n' in h else '\n'
e = lambda s: html.escape(s, quote=True)
j = lambda s: json.dumps(s, ensure_ascii=False)[1:-1]
for bad in ('—', '– '):
    for k in ('title', 'excerpt', 'dek'):
        assert bad not in S[k], f'dash in {k}'
    assert bad not in body, 'dash in body'

def sub(pat, rep, s, flags=0):
    out, n = re.subn(pat, rep, s, count=1, flags=flags)
    if not n: sys.exit(f'pattern not found: {pat}')
    return out

T, X = S['title'], S['excerpt']
h = sub(r'<title>.*?</title>', lambda m: f'<title>{e(T)} - HubSpot Field Notes</title>', h)
h = sub(r'<meta name="description" content="[^"]*">', lambda m: f'<meta name="description" content="{e(X)}">', h)
h = sub(r'<meta property="og:title" content="[^"]*">', lambda m: f'<meta property="og:title" content="{e(T)}">', h)
h = sub(r'<meta property="og:description" content="[^"]*">', lambda m: f'<meta property="og:description" content="{e(X)}">', h)
h = sub(r'"headline": "[^"]*"', lambda m: f'"headline": "{j(T)}"', h)
h = sub(r'("@type": "TechArticle",\s*"headline": "[^"]*",\s*)"description": "[^"]*"', lambda m: m.group(1) + f'"description": "{j(X)}"', h, re.S)
h = sub(r'"dateModified": "[^"]*"', f'"dateModified": "{S["verified"]}"', h)
h = sub(r'(<meta property="article:modified_time" content=")[^"]*', lambda m: m.group(1) + S['verified'], h)
h = re.sub(r'("position": 2, "name": )"[^"]*"', lambda m: m.group(1) + f'"{j(T)}"', h, count=1)
if S.get('howto'):
    steps = (',' + nl).join(f'        {{"@type": "HowToStep", "name": "{j(a)}", "text": "{j(b)}"}}' for a, b in S['howto'])
    h = sub(r'("@type": "HowTo",\s*"name": )"[^"]*"(,\s*"totalTime": )"[^"]*"(,\s*"step": \[).*?(\n\s*\])',
            lambda m: m.group(1) + f'"{j(T)}"' + m.group(2) + f'"PT{S["minutes"]}M"' + m.group(3) + nl + steps + m.group(4), h, re.S)
h = sub(r'<span class="badge badge-type">[^<]*</span>', '<span class="badge badge-type">Guide</span>', h)
if S.get('problem'):
    h = sub(r'<span class="badge badge-problem">[^<]*</span>', lambda m: f'<span class="badge badge-problem">{e(S["problem"])}</span>', h)
h = sub(r'<h1>.*?</h1>', lambda m: f'<h1>{e(T)}</h1>', h, re.S)
h = sub(r'<p class="dek">.*?</p>', lambda m: f'<p class="dek">{e(S["dek"])}</p>', h, re.S)
d = datetime.date.fromisoformat(S['verified'])
nice = d.strftime('%B ') + str(d.day) + d.strftime(', %Y')
facts = (f'<dl class="facts">{nl}'
         f'        <div class="fact"><dt>Subscription</dt><dd>{e(S["tier"])}</dd></div>{nl}'
         f'        <div class="fact"><dt>Permissions</dt><dd>{e(S["permissions"])}</dd></div>{nl}'
         f'        <div class="fact"><dt>Time</dt><dd>{S["minutes"]} min &middot; Intermediate</dd></div>{nl}'
         f'        <div class="fact"><dt>Last verified</dt><dd><time datetime="{S["verified"]}">{nice}</time></dd></div>{nl}'
         f'      </dl>')
h = sub(r'<dl class="facts">.*?</dl>', lambda m: facts, h, re.S)
body = body.strip().replace('\r\n', '\n').replace('\n', nl)
h = sub(r'(<article class="prose">).*?(\s*<div class="vote" data-vote></div>)', lambda m: m.group(1) + nl + body + m.group(2), h, re.S)
page.write_text(h, encoding='utf-8', newline='')

# articles.js
p = ROOT / 'articles.js'
src = p.read_text(encoding='utf-8')
m = re.search(r'^([ \t]*)slug: [\'"]' + re.escape(slug) + r'[\'"],\r?\n(.*?)(?=^[ \t]*\},?\s*$)', src, re.M | re.S)
if not m: sys.exit('entry not found in articles.js')
ind, block = m.group(1), m.group(2)
def setf(block, key, val):
    line = f'{ind}{key}: {val},'
    if re.search(rf'^[ \t]*{key}: ', block, re.M):
        return re.sub(rf'^[ \t]*{key}: .*?,?(\r?\n)', lambda mm: line + mm.group(1), block, count=1, flags=re.M)
    block = re.sub(r'([^,\s])(\s*)$', r'\1,\2', block)  # previous last line needs a comma
    return block + line + nl
q = lambda s: json.dumps(s, ensure_ascii=False)
block = setf(block, 'title', q(T))
block = setf(block, 'excerpt', q(X))
block = setf(block, 'type', '"guide"')
if S.get('problem'): block = setf(block, 'problem', q(S['problem']))
block = setf(block, 'tier', q(S['tier']))
block = setf(block, 'permissions', q(S['permissions']))
block = setf(block, 'verified', q(S['verified']))
block = setf(block, 'validated', q(S['validated']))
block = setf(block, 'minutes', str(S['minutes']))
src = src[:m.start(2)] + block + src[m.end(2):]
p.write_text(src, encoding='utf-8', newline='')
words = len(re.sub(r'<[^>]+>', ' ', body).split())
print(f'guidified {slug}: {words} words in body')
