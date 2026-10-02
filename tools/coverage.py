"""Coverage per age band — the check that actually matters (TAXONOMY.md R5/R6)."""
import json, itertools, collections, sys
sys.path.insert(0, 'tools')
from retag import tag, AGES, FEELINGS, SETTINGS, DIFFS

quests = json.load(open('app/src/content/quests.json'))
for q in quests:
    q['feels'], q['ages'] = tag(q)

worst = {}
for band in AGES:
    pool = [q for q in quests if band in q['ages']]
    miss = [
        (s, f, d)
        for s, f, d in itertools.product(SETTINGS, FEELINGS, DIFFS)
        if not any(q['requiredSetting'] == s and f in q['feels'] and q['difficulty'] == d
                   for q in pool)
    ]
    worst[band] = miss
    print(f"{band:7s}  pool {len(pool):3d}   empty {len(miss):3d}")

m = worst['1-12']
print(f"\nunder-13 gaps ({len(m)}):")
for s, f in sorted(collections.Counter((s, f) for s, f, d in m).items()):
    print(f"  {s[0]:12s} {s[1]:13s} x{f}")
json.dump({k: v for k, v in worst.items()}, open('tools/gaps.json', 'w'), indent=1)
