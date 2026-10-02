# -*- coding: utf-8 -*-
"""
Quests written by hand for the feeling taxonomy.

These carry `manualTags` so `retag.py` leaves their `feels` and `ages` alone —
the keyword tagger is good enough for the inherited library but not good enough
to trust with a quest written deliberately for one combination.

Most of these exist because the under-13 band had fourteen empty combinations:
nearly every mall quest in the old library involved spending money.
"""

A = ['1-12', '13-18', '19-25', '26-32', '33-40', '41-50', '50+']   # everyone
T = A[1:]                                                          # 13 and over

def q(id, title, flavor, steps, cat, diff, setting, feels, ages=A):
    body = '\n'.join(f'{i + 1}. {s}' for i, s in enumerate(steps))
    return {
        'id': id, 'title': title,
        'description': f'{flavor}\n\n{body}',
        'category': cat, 'difficulty': diff, 'requiredSetting': setting,
        'feels': feels, 'ages': ages, 'manualTags': True,
    }

QUESTS = [
    # ---------------------------------------------------- the empty combinations
    q('gym-ask-how', 'Ask How It Works',
      'Everyone here is doing the same hard thing alone, next to each other.',
      ['Find a machine you have never understood.',
       'Ask someone who looks like they know. Mean the question.',
       'Say thanks and let them get back to their set.'],
      'random activities', 'medium', 'gym', ['connected']),

    q('out-three-pieces', 'Three Pieces',
      'The smallest possible repair to a place you did not break.',
      ['Collect three pieces of litter as you go.',
       'Put them in the next bin you pass.',
       'Look back at the stretch of ground you just fixed.'],
      'productivity/chores', 'easy', 'outdoors', ['accomplished']),

    q('school-bag-dig', 'The Bag Excavation',
      'Something in there has been fossilising since the first week of term.',
      ['Empty the whole bag onto a flat surface. Everything.',
       'Bin it, file it, or return it. Nothing goes back unexamined.',
       'Repack so tomorrow-you finds things without looking.'],
      'productivity/chores', 'hard', 'school', ['accomplished']),

    q('park-one-tree', 'One Tree, Properly',
      'You have walked past it a hundred times and could not draw it.',
      ['Pick one tree and stay with it for fifteen minutes.',
       'Study the bark, the branching, where light lands, what lives on it.',
       'Note down five things you had never once noticed.'],
      'learning', 'hard', 'park', ['focused']),

    q('park-leave-better', 'Leave the Patch Better',
      'A park is maintained by people you will never meet. Join them for ten minutes.',
      ['Choose one patch — a bench, a path edge, a set of steps.',
       'Clear it of whatever has collected there.',
       'Stand back and look at the before and the after.'],
      'productivity/chores', 'medium', 'park', ['accomplished']),

    q('park-dog-question', 'The Dog Question',
      'Nobody in the history of parks has minded being asked about their dog.',
      ['Find someone walking a dog.',
       'Ask its name and how old it is.',
       'Let the conversation go where it goes. Say thanks at the end.'],
      'random activities', 'medium', 'park', ['connected']),

    q('mall-middle-bench', 'The Bench in the Middle',
      'This whole building is designed so that you never stop moving. Stop moving.',
      ['Find a seat where you can watch people pass.',
       'Stay there ten minutes. Breathe slowly and do nothing else.',
       'Leave without going anywhere else first.'],
      'mindfulness', 'medium', 'mall', ['calm']),

    q('mall-every-floor', 'Every Floor on Foot',
      'The escalator is right there. Walk straight past it.',
      ['Take the stairs to the top floor. All of them.',
       'Walk the full length of every floor on the way back down.',
       'Count the floors when you finish. That was exercise.'],
      'fitness', 'medium', 'mall', ['energised']),

    q('mall-window-study', 'The Window Study',
      'Someone was paid to arrange that. Read their work.',
      ['Pick one window display and study it for five minutes.',
       'Work out the single thing it wants your eye to land on first.',
       'Write down how they made that happen.'],
      'learning', 'medium', 'mall', ['focused']),

    q('mall-floorplan', 'The Floor Plan From Memory',
      'You know this place. Prove it.',
      ['Walk one whole floor, reading the layout as you go. No photographs.',
       'Find a seat and draw the floor plan from memory.',
       'Walk it again and mark every single thing you got wrong.'],
      'learning', 'hard', 'mall', ['focused']),

    q('mall-backstory', 'Invent the Backstory',
      'Everyone here is the main character of something.',
      ['Pick a stranger at random.',
       'Invent where they are going and why. Make it absurd.',
       'Do it twice more, then stop before it gets strange.'],
      'fun activities', 'easy', 'mall', ['playful']),

    q('mall-wrong-music', 'The Wrong Soundtrack',
      'Public places are much funnier set to the wrong music.',
      ['Pick music in your head that does not match this room at all.',
       'Walk one full lap scoring everything you see to it.',
       'Decide which moment fit best entirely by accident.'],
      'fun activities', 'medium', 'mall', ['playful']),

    q('mall-colour-hunt', 'The Colour Hunt',
      'A game that turns a dull errand into a search.',
      ['Pick one colour before you walk in.',
       'Find twenty things in that colour and keep a tally.',
       'The last five may not be clothing. That is where it gets hard.'],
      'fun activities', 'hard', 'mall', ['playful']),

    q('mall-thank-properly', 'Thank Someone Properly',
      'People who work here get thanked carelessly forty times a day.',
      ['Find someone working — cleaning, stacking, directing.',
       'Thank them for something specific they actually did.',
       'Wait for the reply. Do not walk off mid-sentence.'],
      'random activities', 'medium', 'mall', ['connected']),

    # -------------------------------------------------------------------- home
    q('home-lava', 'The Floor Is Lava',
      'A rule invented by children and abandoned far too early.',
      ['Cross one room without touching the floor.',
       'Now cross it back by a different route.',
       'If it was easy, make the rule harder and go again.'],
      'fun activities', 'easy', 'home', ['playful', 'energised']),

    q('home-real-question', 'One Real Question',
      '"How was your day" has been answered honestly about four times ever.',
      ['Find someone in the house.',
       'Ask them something nobody asked them today.',
       'Listen to the whole answer without planning your reply.'],
      'random activities', 'easy', 'home', ['connected']),

    q('home-recycling-build', 'Build It From the Bin',
      'The recycling is a free craft shop that empties every week.',
      ['Take three things out of the recycling.',
       'Make one object that did not exist this morning.',
       'It does not have to be good. It has to be finished.'],
      'fun activities', 'medium', 'home', ['playful']),

    q('home-cloud-watch', 'The Window Cloud Watch',
      'The oldest free entertainment there is.',
      ['Find a window with sky in it.',
       'Watch the clouds for ten minutes without reaching for anything.',
       'Name the three best shapes you saw.'],
      'mindfulness', 'easy', 'home', ['calm']),

    q('home-ten-songs', 'Ten Minutes, Loud',
      'Nobody is watching. That is the entire point.',
      ['Pick the loudest thing you own.',
       'Dance badly for ten minutes.',
       'Stop while you still want one more song.'],
      'fitness', 'easy', 'home', ['energised', 'playful']),

    q('home-one-shelf', 'One Shelf Only',
      'A whole room is a project. One shelf is a quest.',
      ['Choose a single shelf. Only one.',
       'Clear it completely, then put back only what earns its place.',
       'Stop there. Do not start on the next one.'],
      'productivity/chores', 'easy', 'home', ['accomplished']),

    q('home-actual-letter', 'An Actual Letter',
      'Nobody throws away a handwritten page.',
      ['Pick someone who would not expect to hear from you.',
       'Write a page by hand. Say something true in it.',
       'Send it, or hand it over. A letter in a drawer is not a letter.'],
      'random activities', 'medium', 'home', ['connected']),

    q('home-invent-dinner', 'The Invented Dinner',
      'Recipes are suggestions written by people who do not know what is in your kitchen.',
      ['Look at what you actually have. No trip anywhere.',
       'Cook something that is not a recipe you already know.',
       'Eat it at a table, even if it went wrong.'],
      'fun activities', 'hard', 'home', ['playful', 'accomplished']),

    q('home-one-chapter', 'One Chapter, Phone Elsewhere',
      'Reading with a phone nearby is not reading. It is waiting.',
      ['Put the phone in a different room. Actually different.',
       'Read one full chapter without stopping.',
       'Notice how far in you were before you stopped wanting it back.'],
      'learning', 'easy', 'home', ['focused', 'calm']),

    q('home-slow-tea', 'The Slow Drink',
      'Made properly, waited for, and drunk sitting down.',
      ['Make a hot drink the slow way, start to finish.',
       'Sit down with it. No screen, no book, no second task.',
       'Finish it before you get up.'],
      'mindfulness', 'medium', 'home', ['calm']),

    # ------------------------------------------------------------------ school
    q('school-learn-name', 'Learn One Name',
      'You have shared a room with these people for months.',
      ['Find someone whose name you do not know.',
       'Ask. Use it immediately so it sticks.',
       'Use it again tomorrow.'],
      'random activities', 'easy', 'school', ['connected']),

    q('school-doodle-lesson', 'Draw the Lesson',
      'Drawing a thing is a sneakier way of remembering it.',
      ['Pick one idea from today.',
       'Draw it instead of writing it. Badly is fine.',
       'Keep the drawing. It will make sense later when the notes do not.'],
      'fun activities', 'easy', 'school', ['playful', 'focused']),

    q('school-corridor-breath', 'The Corridor Breath',
      'Four seconds is enough to change which version of you walks in.',
      ['Stop just before the next door you go through.',
       'Breathe in for four, out for six. Three times.',
       'Then walk in.'],
      'mindfulness', 'easy', 'school', ['calm']),

    q('school-long-way', 'The Long Way Round',
      'The shortest route is a habit, not a rule.',
      ['Pick the longest sensible way to your next room.',
       'Walk it quickly enough to feel it.',
       'Arrive on time anyway. That is the quest.'],
      'fitness', 'medium', 'school', ['energised']),

    q('school-sit-new', 'Sit Somewhere Else',
      'Your seat is not assigned. It only feels that way.',
      ['Sit somewhere you have never sat.',
       'Say one thing to whoever is next to you.',
       'Stay there for the whole thing.'],
      'random activities', 'medium', 'school', ['connected']),

    # -------------------------------------------------------------------- park
    q('park-cloud-shapes', 'Shapes, Out Loud',
      'Saying it out loud is what makes it a game instead of staring.',
      ['Lie back or sit where you can see sky.',
       'Name what each cloud looks like. Out loud, or under your breath.',
       'Keep going until one of them genuinely surprises you.'],
      'fun activities', 'easy', 'park', ['playful', 'calm']),

    q('park-tree-touch', 'Touch Five Trees',
      'A route invented on the spot, which is the best kind.',
      ['Pick five trees spread across the park.',
       'Get to all five as fast as you reasonably can.',
       'Touch each one. That is how you know it counts.'],
      'fitness', 'easy', 'park', ['energised', 'playful']),

    q('park-barefoot', 'Shoes Off',
      'Grass is a texture most people stopped feeling at about nine years old.',
      ['Find a clean patch of grass.',
       'Take your shoes off and stand there for five minutes.',
       'Walk a slow circle before you put them back on.'],
      'mindfulness', 'medium', 'park', ['calm']),

    q('park-stack-stones', 'Stack or Skim',
      'An old game that asks nothing of you except patience.',
      ['Gather a handful of flat stones.',
       'Stack them as high as they will go, or skim them if there is water.',
       'Knock the stack down yourself when you are done.'],
      'fun activities', 'medium', 'park', ['playful', 'calm']),

    # ---------------------------------------------------------------- outdoors
    q('out-good-morning', 'Three Greetings',
      'A nod costs nothing and lands more than people expect.',
      ['Greet three people you pass. Out loud.',
       'Wait for the reply before looking away.',
       'Count how many gave you a proper one back.'],
      'random activities', 'easy', 'outdoors', ['connected']),

    q('out-ten-doors', 'Ten Doors',
      'Doors are the most decorated thing nobody looks at.',
      ['Photograph ten front doors on your way.',
       'No two the same colour.',
       'Pick your favourite at the end and work out why.'],
      'fun activities', 'easy', 'outdoors', ['playful']),

    q('out-name-trees', 'Name Five',
      'You can identify a logo at a hundred paces and not the tree beside it.',
      ['Find five different trees or plants.',
       'Learn the name of each one. Look them up properly.',
       'Say all five out loud before you get home.'],
      'learning', 'easy', 'outdoors', ['focused']),

    q('out-quietest-spot', 'The Quietest Spot',
      'Somewhere near you is quieter than everywhere else near you.',
      ['Walk until the sound drops.',
       'Stand still and let it drop further.',
       'Stay five minutes. Remember where it was.'],
      'mindfulness', 'easy', 'outdoors', ['calm']),

    q('out-hill-twice', 'The Hill, Twice',
      'The second time up is a different hill entirely.',
      ['Find the steepest climb nearby.',
       'Go up it hard, walk down easy.',
       'Go up it a second time. Slower is fine. Stopping is not.'],
      'fitness', 'hard', 'outdoors', ['energised'], T),

    # --------------------------------------------------------------------- gym
    q('gym-new-machine', 'The One You Avoid',
      'There is a machine you have walked past every single visit.',
      ['Pick the one you have never touched.',
       'Learn it properly — light weight, full range, no audience in your head.',
       'Three sets. Then never be scared of it again.'],
      'fun activities', 'easy', 'gym', ['playful', 'energised']),

    q('gym-long-cooldown', 'The Long Cool-Down',
      'The part everyone skips is the part that makes tomorrow possible.',
      ['When you would normally leave, stay ten more minutes.',
       'Stretch slowly. Breathe out on every hold.',
       'Leave when you feel calm, not when the clock says so.'],
      'mindfulness', 'easy', 'gym', ['calm']),

    q('gym-one-lift', 'One Lift, Perfect',
      'Load is the easiest thing to add and the least useful.',
      ['Pick one movement and drop the weight well down.',
       'Five slow sets, studying the form every rep.',
       'Keep the weight light the whole way through. That is the discipline.'],
      'fitness', 'medium', 'gym', ['focused']),

    q('gym-rack-everything', 'Rack Everything',
      'Two minutes of work that the next person silently thanks you for.',
      ['Finish your session as normal.',
       'Clear your station completely, then one more that somebody abandoned.',
       'Leave it better than the state you found it in.'],
      'productivity/chores', 'easy', 'gym', ['accomplished']),

    # -------------------------------------------------------------- office/desk
    q('desk-two-min-window', 'Two Minutes at the Window',
      'Your eyes have been locked at arm’s length for hours.',
      ['Stand up and go to the furthest window.',
       'Look at the furthest thing you can find for two minutes.',
       'Go back without checking anything on the way.'],
      'mindfulness', 'easy', 'office/desk', ['calm']),

    q('desk-margin-doodle', 'The Margin Doodle',
      'The best ideas have always arrived in margins.',
      ['Take a blank page, not a screen.',
       'Draw for five minutes with no subject in mind.',
       'Keep it. Do not show it to anyone.'],
      'fun activities', 'easy', 'office/desk', ['playful']),

    q('desk-say-hello', 'Just to Say Hello',
      'Every message you send has a reason attached. Send one without.',
      ['Pick someone you have not spoken to in months.',
       'Send a message with nothing being asked for in it.',
       'Say the specific thing that made you think of them.'],
      'random activities', 'easy', 'office/desk', ['connected']),

    q('desk-one-tab', 'The One Tab Rule',
      'Thirty open tabs is thirty unfinished decisions.',
      ['Go through every tab. Act on it, save it, or close it.',
       'Get down to one.',
       'Work in that one for twenty minutes.'],
      'productivity/chores', 'medium', 'office/desk', ['accomplished', 'focused']),

    q('desk-single-hour', 'The Single Task Hour',
      'One thing for an hour is rarer than it sounds and worth more than it looks.',
      ['Choose the one thing. Write it on paper.',
       'Everything else goes away — tabs, phone, notifications.',
       'One hour on that single thing. Stop when the hour stops.'],
      'learning', 'hard', 'office/desk', ['focused']),

    # -------------------------------------------------------------------- mall
    q('mall-quiet-corner', 'The Quiet Corner',
      'Even the loudest building has a corner the noise does not reach.',
      ['Walk until the noise drops away.',
       'Stay there five minutes doing nothing at all.',
       'Notice how different the same building sounds.'],
      'mindfulness', 'easy', 'mall', ['calm']),

    q('mall-full-lap', 'The Full Lap',
      'You have never once walked the whole thing on purpose.',
      ['Walk a complete lap of one floor without stopping.',
       'Keep a pace that is slightly too fast to be comfortable.',
       'Finish where you started.'],
      'fitness', 'easy', 'mall', ['energised']),

    q('mall-hold-door', 'Hold the Door, Properly',
      'Most door-holding is done while already walking away.',
      ['Hold a door for someone and actually wait.',
       'Make eye contact. Say something.',
       'Do it three times before you leave.'],
      'random activities', 'easy', 'mall', ['connected']),
]

if __name__ == '__main__':
    import json
    path = 'app/src/content/quests.json'
    existing = json.load(open(path))
    have = {x['id'] for x in existing}
    added = [x for x in QUESTS if x['id'] not in have]
    print(f'{len(QUESTS)} authored, {len(added)} new')
    json.dump(existing + added, open(path, 'w'), indent=2, ensure_ascii=False)
