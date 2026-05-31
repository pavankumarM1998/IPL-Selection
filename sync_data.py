"""Sync data.json from the current data.js"""
import json, re

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract teams array
start = content.index('[')
depth = 0
end = start
for i, ch in enumerate(content[start:], start):
    if ch == '[': depth += 1
    elif ch == ']':
        depth -= 1
        if depth == 0:
            end = i + 1
            break

raw = content[start:end]
raw = re.sub(r'//[^\n]*', '', raw)           # remove JS comments
raw = re.sub(r',\s*([\]}])', r'\1', raw)     # trailing commas
raw = raw.replace("'", '"')                  # single -> double quotes

teams = json.loads(raw, strict=False)
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump({'teams': teams}, f, indent=2, ensure_ascii=False)

print(f'Synced {len(teams)} teams to data.json')
for t in teams:
    print(f'  {t["shortName"]}: {len(t["players"])} players')
