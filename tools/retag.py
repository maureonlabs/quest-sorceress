"""
Retag the quest library onto the feeling taxonomy (design/TAXONOMY.md).

Category stops being the filter and becomes a label; `feels` becomes the filter.
Run from the repo root. Idempotent: it recomputes `feels` and `ages` from the
quest text every time, so editing a description and re-running fixes its tags.
"""
import json, re, sys, collections, itertools

FEELINGS = ['calm', 'energised', 'focused', 'accomplished', 'playful', 'connected']
AGES = ['1-12', '13-18', '19-25', '26-32', '33-40', '41-50', '50+']
SETTINGS = ['home', 'gym', 'outdoors', 'office/desk', 'school', 'park', 'mall']
DIFFS = ['easy', 'medium', 'hard']

PRIMARY = {
    'mindfulness': 'calm',
    'fitness': 'energised',
    'learning': 'focused',
    'productivity/chores': 'accomplished',
    'fun activities': 'playful',
    'random activities': None,   # decided from the text
}

# A quest earns an extra target feeling when its text clearly serves it.
SECONDARY = {
    'connected': r'\b(talk|call|phone|friend|someone|people|person|message|text|ask|stranger|'
                 r'neighbou?r|family|parent|conversation|compliment|thank|share|together|'
                 r'classmate|colleague|greet|introduce|reply)\b',
    'calm': r'\b(breathe|breath|slow|slowly|quiet|still|rest|sit|sleep|stretch|bath|tea|'
            r'candle|gratitude|pause|unhurried|linger|bench|cloud|silence)\b',
    'energised': r'\b(walk|run|sprint|lift|climb|dance|move|stairs|swim|cycle|jog|'
                 r'push-?up|squat|row|carry|hike|stride|pace)\b',
    'focused': r'\b(read|write|study|learn|practi[cs]e|notes?|memoris|memoriz|review|'
               r'chapter|page|verb|word|problem|solve|single|one thing)\b',
    'accomplished': r'\b(clean|tidy|sort|fix|repair|finish|clear|organis|organiz|inbox|'
                    r'laundry|dish|bill|drawer|shelf|file|empty|throw out|declutter)\b',
    'playful': r'\b(game|play|draw|invent|silly|absurd|make|build|cook|sing|novelty|'
               r'try|experiment|pretend|story|imagine|bad ideas|wrong)\b',
}

# Things a child should not be handed.
CHILD_EXCLUDE = (
    r'\b(buy|purchase|spend|shop(ping)?|cost|price|money|cash|pay|wallet|budget|'
    r'coffee|espresso|caf[eé]|beer|wine|bar|pub|alcohol|'
    r'dawn|sunrise|after dark|night walk|midnight|late night|commute|drive|'
    r'inbox|e-?mail|meeting|invoice|boss|colleague|client|manager|deadline|'
    r'career|cv|r[eé]sum[eé]|tax|rent|mortgage|bank|date|dating|'
    r'bedtime|work day|workday|your work|at work|job)\b'
)

# Maximal-effort work that should not be a required step for older players.
OLDER_EXCLUDE = r'\b(burpee|box jump|plyometric|max effort|one-?rep|heavy single|' \
                r'to failure|sprint interval|hiit)\b'


def tag(q):
    # A quest written deliberately for one combination keeps the tags its author
    # gave it. The keyword tagger is good enough for the inherited library, not
    # good enough to overrule a decision.
    if q.get('manualTags'):
        return q['feels'], q['ages']

    text = f"{q['title']} {q['description']}".lower()
    feels = []

    primary = PRIMARY[q['category']]
    if primary:
        feels.append(primary)

    for feeling, pattern in SECONDARY.items():
        if feeling not in feels and re.search(pattern, text):
            feels.append(feeling)

    # Nothing matched (a stray 'random activities' quest) — playful is the
    # safest home for a quest whose whole point is that it is unexpected.
    if not feels:
        feels.append('playful')

    ages = list(AGES)
    if re.search(CHILD_EXCLUDE, text):
        ages.remove('1-12')
    if re.search(OLDER_EXCLUDE, text):
        for band in ('41-50', '50+'):
            if band in ages:
                ages.remove(band)

    return feels, ages


def gaps(quests):
    """Combinations with no quest at all, counted on the PRIMARY feeling only —
    a quest is guaranteed to be found there, secondaries are a bonus."""
    missing = []
    for s, f, d in itertools.product(SETTINGS, FEELINGS, DIFFS):
        if not any(
            q['requiredSetting'] == s and f in q['feels'] and q['difficulty'] == d
            for q in quests
        ):
            missing.append((s, f, d))
    return missing


def main():
    path = 'app/src/content/quests.json'
    quests = json.load(open(path))
    for q in quests:
        q['feels'], q['ages'] = tag(q)

    missing = gaps(quests)
    print(f"{len(quests)} quests tagged")
    print(f"feeling spread: {collections.Counter(f for q in quests for f in q['feels'])}")
    print(f"no quest for under-13: {sum(1 for q in quests if '1-12' not in q['ages'])}")
    print(f"\n{len(missing)} of 126 combinations empty")
    by_feel = collections.Counter(f for _, f, _ in missing)
    for f, n in by_feel.most_common():
        print(f"  {f:14s} {n:3d} missing")

    if '--write' in sys.argv:
        json.dump(quests, open(path, 'w'), indent=2, ensure_ascii=False)
        print("\nwritten")
    else:
        json.dump(missing, open('tools/gaps.json', 'w'), indent=1)
        print("\ngaps -> tools/gaps.json (dry run; pass --write to save tags)")


if __name__ == '__main__':
    main()
