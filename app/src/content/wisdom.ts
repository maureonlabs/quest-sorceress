/**
 * What she says when you finish your third quest of the day.
 *
 * A hundred passages: fifty from scripture, fifty written for this app. One is
 * shown once a day, and the same one does not come back until all hundred have
 * been seen.
 *
 * **The scripture is the World English Bible.** It is public domain, which
 * matters for an app anyone can open: the NIV, ESV and NLT are all under
 * copyright and could not ship here. The WEB is a modern-English revision of
 * the ASV, so it reads plainly without a licence attached.
 *
 * **The wisdom is written for this app, and attributed to nobody**, because the
 * alternative is a wall of quotations hung on names that may not have said
 * them. A misattributed quote is worse than an anonymous one, and these are in
 * the sorceress's own voice, which is the voice the rest of the app speaks in.
 */

export type WisdomKind = 'verse' | 'wisdom';

export interface Passage {
  id: string;
  kind: WisdomKind;
  text: string;
  /** Book, chapter and verse. Only scripture carries one. */
  source?: string;
  theme: 'positivity' | 'wealth' | 'success' | 'love';
}

const verse = (
  id: string,
  source: string,
  theme: Passage['theme'],
  text: string,
): Passage => ({ id: `v-${id}`, kind: 'verse', source, theme, text });

const wisdom = (id: string, theme: Passage['theme'], text: string): Passage => ({
  id: `w-${id}`,
  kind: 'wisdom',
  theme,
  text,
});

export const PASSAGES: Passage[] = [
  /* ----------------------------------------------------- scripture: positivity */
  verse('phil-4-13', 'Philippians 4:13', 'positivity', 'I can do all things through Christ, who strengthens me.'),
  verse('isa-40-31', 'Isaiah 40:31', 'positivity', 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.'),
  verse('josh-1-9', 'Joshua 1:9', 'positivity', 'Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.'),
  verse('psa-118-24', 'Psalm 118:24', 'positivity', 'This is the day that Yahweh has made. We will rejoice and be glad in it!'),
  verse('rom-8-28', 'Romans 8:28', 'positivity', 'We know that all things work together for good for those who love God.'),
  verse('psa-23-1', 'Psalm 23:1', 'positivity', 'Yahweh is my shepherd; I shall lack nothing.'),
  verse('isa-41-10', 'Isaiah 41:10', 'positivity', 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you.'),
  verse('psa-46-1', 'Psalm 46:1', 'positivity', 'God is our refuge and strength, a very present help in trouble.'),
  verse('jer-29-11', 'Jeremiah 29:11', 'positivity', 'For I know the thoughts that I think toward you, says Yahweh, thoughts of peace, and not of evil, to give you hope and a future.'),
  verse('2cor-4-16', '2 Corinthians 4:16', 'positivity', 'Therefore we don’t faint; but though our outward person is decaying, yet our inward person is renewed day by day.'),
  verse('psa-30-5', 'Psalm 30:5', 'positivity', 'Weeping may stay for the night, but joy comes in the morning.'),
  verse('phil-4-8', 'Philippians 4:8', 'positivity', 'Whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely — think about these things.'),
  verse('lam-3-23', 'Lamentations 3:22-23', 'positivity', 'His compassion doesn’t fail. They are new every morning.'),

  /* --------------------------------------------------------- scripture: wealth */
  verse('prov-13-11', 'Proverbs 13:11', 'wealth', 'Wealth gained dishonestly dwindles away, but he who gathers by hand makes it grow.'),
  verse('prov-21-5', 'Proverbs 21:5', 'wealth', 'The plans of the diligent surely lead to profit; and everyone who is hasty surely rushes to poverty.'),
  verse('prov-3-9', 'Proverbs 3:9-10', 'wealth', 'Honor Yahweh with your substance, with the first fruits of all your increase; so your barns will be filled with plenty.'),
  verse('prov-11-25', 'Proverbs 11:25', 'wealth', 'The liberal soul shall be made fat. He who waters shall be watered also himself.'),
  verse('deut-8-18', 'Deuteronomy 8:18', 'wealth', 'But you shall remember Yahweh your God, for it is he who gives you power to get wealth.'),
  verse('prov-22-7', 'Proverbs 22:7', 'wealth', 'The rich rule over the poor. The borrower is servant to the lender.'),
  verse('eccl-5-10', 'Ecclesiastes 5:10', 'wealth', 'He who loves silver shall not be satisfied with silver, nor he who loves abundance, with increase.'),
  verse('prov-28-20', 'Proverbs 28:20', 'wealth', 'A faithful man is rich with blessings.'),
  verse('mal-3-10', 'Malachi 3:10', 'wealth', 'Test me now in this, says Yahweh of Armies, if I will not open you the windows of heaven, and pour you out a blessing.'),
  verse('1tim-6-17', '1 Timothy 6:17', 'wealth', 'Charge those who are rich in this present world that they not be arrogant, nor have their hope set on the uncertainty of riches, but on God.'),
  verse('prov-10-4', 'Proverbs 10:4', 'wealth', 'He becomes poor who works with a lazy hand, but the hand of the diligent brings wealth.'),
  verse('luke-6-38', 'Luke 6:38', 'wealth', 'Give, and it will be given to you: good measure, pressed down, shaken together, and running over.'),

  /* -------------------------------------------------------- scripture: success */
  verse('prov-16-3', 'Proverbs 16:3', 'success', 'Commit your deeds to Yahweh, and your plans shall succeed.'),
  verse('col-3-23', 'Colossians 3:23', 'success', 'And whatever you do, work heartily, as for the Lord, and not for men.'),
  verse('prov-3-5', 'Proverbs 3:5-6', 'success', 'Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.'),
  verse('psa-37-5', 'Psalm 37:5', 'success', 'Commit your way to Yahweh. Trust also in him, and he will do this.'),
  verse('prov-12-24', 'Proverbs 12:24', 'success', 'The hands of the diligent ones shall rule.'),
  verse('gal-6-9', 'Galatians 6:9', 'success', 'Let us not be weary in doing good, for we will reap in due season, if we don’t give up.'),
  verse('eccl-9-10', 'Ecclesiastes 9:10', 'success', 'Whatever your hand finds to do, do it with your might.'),
  verse('prov-6-6', 'Proverbs 6:6-8', 'success', 'Go to the ant, you sluggard. Consider her ways, and be wise; which having no chief, overseer, or ruler, provides her bread in the summer.'),
  verse('psa-90-17', 'Psalm 90:17', 'success', 'Establish the work of our hands for us. Yes, establish the work of our hands.'),
  verse('phil-3-14', 'Philippians 3:14', 'success', 'I press on toward the goal for the prize of the high calling of God in Christ Jesus.'),
  verse('prov-24-16', 'Proverbs 24:16', 'success', 'For a righteous man falls seven times and rises up again.'),
  verse('james-1-4', 'James 1:4', 'success', 'Let endurance have its perfect work, that you may be perfect and complete, lacking in nothing.'),
  verse('2chr-15-7', '2 Chronicles 15:7', 'success', 'But you be strong, and don’t let your hands be slack, for your work shall be rewarded.'),

  /* ----------------------------------------------------------- scripture: love */
  verse('1cor-13-4', '1 Corinthians 13:4-5', 'love', 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way.'),
  verse('1john-4-19', '1 John 4:19', 'love', 'We love him, because he first loved us.'),
  verse('prov-17-17', 'Proverbs 17:17', 'love', 'A friend loves at all times; and a brother is born for adversity.'),
  verse('1cor-13-13', '1 Corinthians 13:13', 'love', 'But now faith, hope, and love remain — these three. The greatest of these is love.'),
  verse('john-15-12', 'John 15:12', 'love', 'This is my commandment, that you love one another, even as I have loved you.'),
  verse('rom-12-10', 'Romans 12:10', 'love', 'In love of the brothers be tenderly affectionate to one another; in honor preferring one another.'),
  verse('eph-4-32', 'Ephesians 4:32', 'love', 'And be kind to one another, tender hearted, forgiving each other.'),
  verse('col-3-14', 'Colossians 3:14', 'love', 'Above all these things walk in love, which is the bond of perfection.'),
  verse('1pet-4-8', '1 Peter 4:8', 'love', 'And above all things be earnest in your love among yourselves, for love covers a multitude of sins.'),
  verse('song-8-7', 'Song of Solomon 8:7', 'love', 'Many waters can’t quench love, neither can floods drown it.'),
  verse('rom-13-8', 'Romans 13:8', 'love', 'Owe no one anything, except to love one another; for he who loves his neighbor has fulfilled the law.'),
  verse('eccl-4-9', 'Ecclesiastes 4:9-10', 'love', 'Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow.'),

  /* ------------------------------------------------------- wisdom: positivity */
  wisdom('small-door', 'positivity', 'The day does not need to be good. It needs a door, and you have just opened three.'),
  wisdom('weather', 'positivity', 'Moods pass through you like weather through a wood. Do not build anything permanent out of one.'),
  wisdom('begin-badly', 'positivity', 'Begin badly. A bad beginning is still the only kind that leads anywhere.'),
  wisdom('tally', 'positivity', 'Nobody is keeping score but you. Be a generous judge.'),
  wisdom('tired-not-done', 'positivity', 'Tired is not the same as finished, and finished is not the same as failed.'),
  wisdom('small-true', 'positivity', 'Small and true beats large and imagined. You have done three small true things.'),
  wisdom('kind-to-tomorrow', 'positivity', 'Everything you did today was a kindness done to tomorrow-you.'),
  wisdom('storm-roots', 'positivity', 'The tree does not argue with the storm. It simply holds on and is still standing afterwards.'),
  wisdom('not-behind', 'positivity', 'You are not behind. There was never a schedule; there was only a story you were told.'),
  wisdom('morning-again', 'positivity', 'The morning returns whether or not you deserved it. That is the whole mercy of mornings.'),
  wisdom('carry-light', 'positivity', 'Put down what you were asked to carry and were never asked to keep.'),
  wisdom('one-candle', 'positivity', 'One candle does not argue with the dark. It simply changes the room.'),
  wisdom('enough-today', 'positivity', 'Enough is a decision, not an amount. Decide it now and go and rest.'),

  /* ------------------------------------------------------------ wisdom: wealth */
  wisdom('slow-gold', 'wealth', 'Gold gathered slowly stays. Gold gathered quickly has somewhere else to be.'),
  wisdom('cost-of-cheap', 'wealth', 'The cheapest thing in the room is often the one you buy twice.'),
  wisdom('spend-attention', 'wealth', 'You spend attention before you ever spend money. Watch where the first goes.'),
  wisdom('rich-enough', 'wealth', 'Wealth is the distance between what you have and what you have decided you need. Both ends move.'),
  wisdom('seed-corn', 'wealth', 'Never eat the seed corn, however hungry the winter. Spring is counting on it.'),
  wisdom('three-purses', 'wealth', 'Keep three purses: one for living, one for waiting, one for growing. Confuse them and you lose all three.'),
  wisdom('borrowed-time', 'wealth', 'A debt is tomorrow’s work, borrowed and already spent.'),
  wisdom('quiet-wealth', 'wealth', 'The loudest wealth in the room is usually the least of it.'),
  wisdom('tool-not-crown', 'wealth', 'Money is a tool, not a crown. Tools are for building; crowns are for being looked at.'),
  wisdom('compound', 'wealth', 'The small amount you set aside today is not small. It is simply young.'),
  wisdom('generous-hand', 'wealth', 'An open hand can both give and receive. A closed one can do neither.'),
  wisdom('price-peace', 'wealth', 'Before you buy it, ask what it costs in peace. Some things are expensive at any price.'),

  /* ----------------------------------------------------------- wisdom: success */
  wisdom('three-done', 'success', 'Three things finished beats thirty things begun. You have the better number.'),
  wisdom('showing-up', 'success', 'Most of what people call talent is simply somebody who kept turning up.'),
  wisdom('streak-truth', 'success', 'A streak is not a record. It is a habit learning your name.'),
  wisdom('narrow-gate', 'success', 'Do one thing properly. The one is the whole secret; the properly is the whole work.'),
  wisdom('slow-is-fast', 'success', 'Slow and finished arrives long before fast and abandoned.'),
  wisdom('break-not-end', 'success', 'A broken streak is a pause, not a verdict. Begin again tomorrow and it counts the same.'),
  wisdom('ask-for-help', 'success', 'Asking is not the opposite of competence. It is how competent people stay that way.'),
  wisdom('finish-badly', 'success', 'A finished thing done badly teaches more than a perfect thing never started.'),
  wisdom('reps-not-moods', 'success', 'Do not wait to feel like it. The feeling arrives partway through, and never before.'),
  wisdom('long-game', 'success', 'You cannot see a year of effort from inside a Tuesday. Keep going anyway.'),
  wisdom('clear-the-bench', 'success', 'Put the tools away when you stop. Starting is heaviest when the bench is still full.'),
  wisdom('two-percent', 'success', 'Be slightly better than yesterday, and let arithmetic do the rest.'),
  wisdom('name-the-next', 'success', 'Before you stop, name the next step out loud. Tomorrow-you will not have to find it.'),

  /* -------------------------------------------------------------- wisdom: love */
  wisdom('say-it', 'love', 'Say the kind thing while the person is still in the room.'),
  wisdom('tend-garden', 'love', 'People are gardens, not statues. They need tending, not admiring.'),
  wisdom('listen-whole', 'love', 'Listen all the way to the end of the sentence. Most people have never once been allowed to.'),
  wisdom('ask-again', 'love', '"How are you" asked twice gets a different answer than asked once.'),
  wisdom('forgive-early', 'love', 'Forgive early, while it is still small enough to carry out of the room.'),
  wisdom('presence-gift', 'love', 'Nobody remembers what you brought. Everybody remembers that you came.'),
  wisdom('small-messages', 'love', 'Send the message with nothing attached to it. Those are the ones people keep.'),
  wisdom('love-is-time', 'love', 'Love is mostly spelled out in hours. Check where yours are going.'),
  wisdom('be-easy', 'love', 'Be easy to reach and easy to forgive. The rest arranges itself.'),
  wisdom('alone-apart', 'love', 'Being alone and being lonely are different rooms. One has a door you can open.'),
  wisdom('thank-specific', 'love', 'Thank people for the specific thing. Vague gratitude lands like no gratitude at all.'),
  wisdom('first-move', 'love', 'Somebody has to go first. It costs very little, and it is nearly always you who can afford it.'),
];
