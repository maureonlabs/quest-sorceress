"""
Build the wardrobe gallery page from art dumped out of a live render.

Always rebuilds the whole page. Two attempts at patching the previous HTML in
place both silently ate most of the file — regexes over a 150KB document full
of SVG are not worth debugging when regeneration is this cheap.
"""
import json, pathlib, sys

art = json.load(open('/tmp/art.json'))
SLOTS = ['crown','hair','robe','cloak','shoes','wings','staff','familiar','aura']
LABEL = {'crown':'Crowns','hair':'Hair','robe':'Robes','cloak':'Cloaks','shoes':'Shoes',
         'wings':'Wings','staff':'Staves','familiar':'Familiars','aura':'Spells'}
NOTE = {
 'crown':'Worn on the head. One at a time.',
 'hair':'A style, not a colour. Colour is free from the first day and set separately, so one drawing serves all eight.',
 'robe':'The outfit. Drawn over whichever figure is underneath, so it follows both silhouettes.',
 'cloak':'Hangs behind the robe, in front of the spell ring.',
 'shoes':'Under a floor-length gown only the foot shows; over a tunic the whole shaft does.',
 'wings':'Painted over the cloak, because a cloak is wide enough to swallow them.',
 'staff':'Held in the right hand.',
 'familiar':'Perches beside the right shoulder.',
 'aura':'A spell rather than a garment. Sits furthest back of anything.',
}

cards = []
for slot in SLOTS:
    rows = sorted([i for i in art['items'] if i['slot']==slot], key=lambda r: r['week'])
    tiles = '\n'.join(
      f'''<li class="tile">
        <div class="disc">{r['svg']}</div>
        <p class="nm">{r['name']}</p>
        <p class="wk"><span>week {r['week']}</span></p>
        <p class="fl">{r['flavor']}</p>
      </li>''' for r in rows)
    cards.append(f'''<section class="group" id="{slot}">
      <header class="ghead"><h2>{LABEL[slot]}</h2><p class="count">{len(rows)} pieces</p></header>
      <p class="note">{NOTE[slot]}</p>
      <ul class="grid">{tiles}</ul>
    </section>''')

nav = '\n'.join(f'<a href="#{s}">{LABEL[s]}</a>' for s in SLOTS)
defs = art['defs'].replace('style="position: absolute;"','style="position:absolute;width:0;height:0"')

CSS = """
:root {
  --forest-deep:#0b1210; --glass:rgba(226,240,234,.055); --glass-edge:rgba(255,249,232,.16);
  --gold:#c9a34e; --gold-lit:#f0d695; --mint:#6fd8c0; --text:#f2ede1; --text-dim:#9aa8a0;
  --display:'Marcellus','Iowan Old Style',Georgia,serif;
  --brand:'Pinyon Script','Snell Roundhand',cursive;
  --body:'Mulish','Helvetica Neue',Arial,sans-serif;
  color-scheme: dark;
}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(120% 80% at 50% 0%,#17241e 0%,var(--forest-deep) 60%),var(--forest-deep);
  color:var(--text);font-family:var(--body);font-weight:300;line-height:1.65}
.wrap{max-width:76rem;margin:0 auto;padding-inline:20px;padding-block:2.6rem 4rem}
header.page{text-align:center;margin-bottom:2rem}
.brand{font-family:var(--brand);font-size:clamp(2rem,7vw,3rem);color:var(--gold-lit);margin:0;line-height:1.1}
header.page h1{font-family:var(--display);font-weight:400;font-size:clamp(1.1rem,3.4vw,1.5rem);
  letter-spacing:.04em;margin:.6rem 0 0;text-wrap:balance}
.lede{max-width:36rem;margin:.8rem auto 0;color:var(--text-dim);font-size:.95rem;text-wrap:balance}
.figures{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;margin:2rem 0 0}
.figure{width:8.5rem;max-width:38vw;border:1px solid var(--glass-edge);border-radius:16px;
  background:var(--glass);padding:.7rem .7rem .4rem}
.figure svg{display:block;width:100%;height:auto}
.figure p{margin:.2rem 0 0;text-align:center;font-size:.64rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--gold)}
nav.slots{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;margin:2.2rem 0 0}
nav.slots a{padding:.3rem .8rem;border-radius:999px;border:1px solid var(--glass-edge);
  background:var(--glass);color:var(--text-dim);text-decoration:none;font-size:.8rem}
nav.slots a:hover,nav.slots a:focus-visible{color:var(--gold-lit);border-color:var(--gold)}
.group{margin-top:3rem;scroll-margin-top:1rem}
.ghead{display:flex;align-items:baseline;gap:.8rem;border-bottom:1px solid rgba(201,163,78,.25);padding-bottom:.4rem}
.ghead h2{font-family:var(--display);font-weight:400;font-size:1.35rem;color:var(--gold-lit);margin:0;letter-spacing:.03em}
.count{margin:0 0 0 auto;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--text-dim);font-variant-numeric:tabular-nums}
.note{margin:.6rem 0 0;color:var(--text-dim);font-size:.86rem;max-width:46rem}
.grid{list-style:none;margin:1.2rem 0 0;padding:0;display:grid;gap:1.4rem .9rem;
  grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr))}
.tile{min-width:0;text-align:center}
.disc{aspect-ratio:1;display:grid;place-items:center;padding:11%;border-radius:50%;
  border:1px solid rgba(201,163,78,.3);
  background:radial-gradient(circle at 38% 30%,rgba(226,240,234,.12),rgba(226,240,234,.03) 70%);
  box-shadow:inset 0 1px 0 rgba(255,252,240,.1)}
.disc svg{width:100%;height:100%;overflow:hidden}
.nm{font-family:var(--display);font-size:.86rem;line-height:1.3;margin:.55rem 0 0;text-wrap:balance}
.wk{margin:.15rem 0 0}
.wk span{font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mint);
  font-variant-numeric:tabular-nums}
.fl{margin:.35rem 0 0;font-size:.74rem;line-height:1.45;color:var(--text-dim);text-wrap:balance}
footer.page{margin-top:3.5rem;padding-top:1.2rem;border-top:1px solid rgba(201,163,78,.2);
  color:var(--text-dim);font-size:.82rem;text-wrap:balance}
footer.page b{color:var(--gold-lit);font-weight:600}
footer.page code{padding:.05em .35em;border-radius:5px;background:rgba(226,240,234,.1);
  color:var(--gold-lit);font-size:.9em;overflow-wrap:anywhere}
"""

page = f'''<title>Quest Sorceress Wardrobe</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Mulish:wght@300;400;600&family=Pinyon+Script&display=swap">
<style>/* Layout: a scrolling column of slot groups, each a responsive disc grid.
   Single committed dark theme: this is the app's own moonlit wood, and a light
   version would be a different world rather than a variant. */{CSS}</style>

<!-- Every gradient and filter the drawings reference, emitted once. Without
     this block each url(#qs-...) resolves to nothing and all sixty-one items
     render as flat black silhouettes. -->
{defs}

<div class="wrap">
  <header class="page">
    <p class="brand">Quest Sorceress</p>
    <h1>Every piece in the wardrobe</h1>
    <p class="lede">
      Sixty-one items across nine slots, all of them vector art drawn by the app rather
      than loaded from image files. These are the real renders, lifted straight out of the
      running build — not mockups of them. Each one can be replaced by a painted image,
      one piece at a time.
    </p>
    <div class="figures">
      <div class="figure">{art['figs']['sorceress']}<p>Sorceress</p></div>
      <div class="figure">{art['figs']['sorcerer']}<p>Sorcerer</p></div>
      <div class="figure">{art['figs']['bustf']}<p>Portrait</p></div>
      <div class="figure">{art['figs']['bustm']}<p>Portrait</p></div>
    </div>
    <nav class="slots">{nav}</nav>
  </header>

  {''.join(cards)}

  <footer class="page">
    <p>
      Items are earned by weeks of unbroken streak and are never taken back when a streak
      breaks. Equipping is exclusive <b>within</b> a slot and free <b>across</b> slots, so a
      crown, a robe, boots and a staff together is the intended outfit — two crowns at once
      is not.
    </p>
    <p>
      Both figures are placeholders for painted ones. Drop an image into
      <code>app/src/assets/avatar/</code> and it replaces that one layer; everything else
      keeps its drawing. The canvas and the names are in
      <code>design/AVATAR-ASSETS.md</code>.
    </p>
  </footer>
</div>
'''
out = pathlib.Path(sys.argv[1])
out.write_text(page)
print(len(page), 'bytes;', page.count('<li class="tile">'), 'tiles;', 'defs ok:', 'qs-m-gold' in page)
