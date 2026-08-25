# DreyBird

A one-file tribute to Flappy Bird. Tap to flap, thread the pipes, chase a medal.

**Play it: https://dreymar87.github.io/DreyBird**

No build step, no dependencies, no assets — the whole game is `index.html`.
Open it in any browser (phone included) and play.

```
open index.html          # macOS
xdg-open index.html      # Linux
```

## Install it

DreyBird is a progressive web app, so it can live on your home screen and
play with no signal at all.

- **Android / Chrome** — open the link above and tap **Install DreyBird**
  (the button appears once the browser offers it), or use the ⋮ menu →
  *Add to Home screen*.
- **iPhone / Safari** — open the link, tap **Share**, then
  **Add to Home Screen**.

It launches fullscreen and portrait, with no browser bar. Your best score and
chosen bird come along, because the installed app shares the browser's
storage for the same site.

## Players

Tap the person icon (top-left) to manage players. Several people can share
one device — each keeps their own bird, best score, medal case and game
count, and the title screen shows whose turn it is. Rename and delete live
on the row of whoever is active; you can't delete the last one.

These are labels, not accounts: no passwords, no sign-in, no server. Nothing
you do in DreyBird leaves your device.

### What "saved" actually means

Browser storage is evictable by default. Chrome discards it under disk
pressure, and iOS Safari drops site data after about a week without a visit.
DreyBird asks for an exemption via `navigator.storage.persist()` and tells
you the real answer in the Players sheet — Safari only grants it once the
game is on your home screen, which is one more reason to install it.

Two things make that safe:

- **Save file** writes every player to a dated file. The button tells you
  where you stand: **Saved ✓** when the copy you have is current,
  **Save file (3)** when three runs have happened since. No more saving
  "just in case" and ending up with `(1)`, `(2)`, `(3)`.
- **Load file** reads one back, merging by player. On a conflict it keeps
  the *better* of each number, so importing an old backup can never lower a
  best score, wipe a medal or repossess something you bought.

Where the browser supports it (desktop Chromium), DreyBird remembers the
file you chose and writes back over it — a real overwrite. iOS Safari and
Android Chrome don't offer that API, so there each save is a new dated
file, and the button says so.

**On security, honestly:** the save is plain JSON and the badge is a
change detector, not a tamper detector. A hash computed in a page anyone
can read proves nothing about who wrote a file. Your live save also sits
in IndexedDB, editable from devtools in seconds. Making a save genuinely
tamper-proof needs either a native app with private storage or a server
that owns the data — neither of which a static page can be. DreyBird has
no leaderboard and nothing at stake, so this is a deliberate trade rather
than an oversight.

Coins, purchases and scores live in IndexedDB, falling back to `localStorage` where
IndexedDB is blocked (private windows, some embedded browsers). If you played
an earlier version, your existing best score is migrated into the first
player rather than lost — and your pipes, power-ups and medals from before
the shop existed are paid out in coins, once.

## Background

Every world drifts through its own times of day as you fly — Meadow through
day, sunset, night and dawn; Neon Grid through dusk, midnight and signal. If
you'd rather it held still, Settings (the gear, top-left) lets you pin any
one of them. You pick by looking at a strip of the actual sky rather than
choosing a name from a list, and the choice is saved per player.

## The world

Pipes come in **formations**, not just independent random gaps — ascents,
descents, valleys, zigzags and narrow corridors, shuffled from the run's
seed. They unlock as a run goes on, so the opening is always plain drift
and the shapes arrive once you're warmed up.

Three **hazards** turn up later in a run:

- **Movers** — the pipe pair swings up and down, and the gap swings with it.
- **Gusts** — an updraft or downdraft pushes you for a few seconds, always
  announced first by chevrons down both edges pointing the way you'll be
  pushed. A gust you can't see coming is unfair, not hard.
- **Fog** — a band of haze hides part of the playfield. It changes what you
  can see, never what the world does.

Hazard frequency ramps on how far into the run you are, and **assist mode
halves it**. Everything is drawn from the seed, so two people playing the
same seed meet the same formations and the same weather.

## Levels and birds

Every run pays **XP** as well as coins, and they measure different things:
coins reward volume (a coin a pipe), XP rewards depth and improvement —
your score plus your medal, doubled when you beat your own best. XP is
only ever earned, never spent, so buying a hat never costs you progress.

**The twelve birds now fly differently**, and every one of them trades
something. Ember has a punchy flap but falls heavy; Ghost slips through
gaps but dives fast; Coal's shield takes two hits but it's heavy; Gilded
earns much more but sinks. Classic is the baseline and trades nothing.
Each card shows its trade before you buy.

No bird is strictly better than another — that's enforced by a test, not
by good intentions: every non-baseline bird must be better at something
*and* worse at something, or the suite fails.

**Perks** ("feathers") unlock with level and equip into slots that open at
levels **4, 12 and 22**. They're mild global modifiers — a coin bonus,
longer power-ups, an extra shield hit:

| Perk | Level | What it does |
| --- | --- | --- |
| Thrift | 4 | Every pipe pays a little more |
| Study | 6 | Runs teach you faster |
| Updraft | 9 | The air holds you up a touch |
| Slipstream | 12 | A slightly finer profile |
| Reservoir | 16 | Power-ups run longer |
| Plating | 20 | Shields take an extra hit |

Every perk unlocks at a level where a slot already exists to hold it, so
nothing is ever shown as available while being unusable. The Perks tab
tells you where the next slot is (`LV 7 · 1/1 SLOTS · NEXT AT 12`), and a
card with nowhere to go says which level frees one.

Traits and perks change **the bird, never the world**. Pipe layout, gap
width, speed and hazards come from the seed alone, so two people on the
same seed fly the same world whatever they've equipped. That's what makes
a shared daily challenge possible later, and a test asserts it across all
twelve birds.

## Comfort

Settings (the gear, top-left) also holds:

- **Haptics** — a buzz on flap and crash. Off by default, and Android only:
  iPhones ignore vibration from a web page whatever you set here.
- **Assist mode** — gentler gravity, a softer flap, a wider gap and slower
  pipes, for anyone finding the original feel too punishing. Assist runs
  earn coins normally but **do not set a best score**, and the game-over
  panel says so. A record set on easier physics isn't the same record, and
  quietly recording it would be worse than not recording it.

**Pause** appears in the top-right while you're flying, and leaving the tab
pauses automatically rather than costing you the run.

## How to play

| Input | Action |
| --- | --- |
| Tap / click | Flap |
| <kbd>Space</kbd>, <kbd>↑</kbd> | Flap |
| Tap after a crash | Play again |
| <kbd>Esc</kbd> | Close the bird picker |

Your best score is kept in the browser, on your device.

## What's in it

**The faithful part.** 288×512 playfield, gravity-and-impulse flight,
scrolling pipes, ground and ceiling collisions, a forgiving hitbox, and
bronze / silver / gold / platinum medals at 10, 20, 30 and 40 points.

**Day/night cycle.** The sky drifts through day → sunset → night → dawn as
you fly. Stars come out, city windows light up, the ground cools off. It's
cosmetic — it never changes the difficulty.

**Coins and a shop.** Clearing a pipe pays 1 coin, a power-up 2, and
finishing with a medal pays a bonus (bronze 5, silver 15, gold 30, platinum
60). Spend them in the shop — the palette button in the top-left corner.

**Thirty cosmetics**, in four kinds:

- **12 birds.** Classic is yours from the start; Bluebird, Ember, Ghost and
  Circuit still unlock at a best score of 5, 15, 25 and 40 — they were earned
  before the shop existed, so they stay free. The other seven cost coins.
- **6 hats** — ball cap, party hat, halo, crown, horns, top hat. Drawn on the
  bird's head and leaning with the dive, independent of which bird you fly,
  so the combinations multiply.
- **5 flight trails** — sparks, bubbles, embers, frost, rainbow.
- **4 world themes** beyond the default Meadow: Endless Sunset, Monochrome,
  Neon Grid and Sakura, each repainting the pipes, sky and ground — and each
  carrying its own three times of day.

Coins are earned by playing. There is no real money in DreyBird, nothing to
buy with a card, and no server to check anything — the wallet lives in your
own save file. Editing it only cheats you.

**Two power-ups**, floating between pipes once you're past 4 points:

- **Shield** — absorbs one crash, then pops.
- **Slow-mo** — drops the world into ~60% speed for about six seconds.

## How it's built

Plain JavaScript on a `<canvas>`, roughly 900 lines:

- **Fixed timestep.** The world advances in 60 Hz ticks with an accumulator,
  and rendering interpolates between them. A 120 Hz phone plays exactly like
  a 60 Hz one — no double-speed gravity.
- **No sprites.** The bird is a 17×12 character grid painted from a palette,
  so a new skin is just a new set of colors. Pipes, clouds, skyline and ground
  are canvas rectangles.
- **No audio files.** Every sound is a WebAudio oscillator built on the fly,
  created on first tap so mobile browsers unlock it.
- **Seeded runs.** Anything that shapes a run — pipe gaps, power-up spawns —
  draws from a seeded generator, so a seed reproduces a run exactly. The
  draws happen unconditionally, before the score is consulted, so the pipe
  sequence depends on the seed alone and not on how well you are playing.
  Cosmetic jitter deliberately stays unseeded: it can't affect fairness.
- **Nothing external.** One optional Google Fonts request for the pixel
  typeface; the game plays fine without it.
- **Offline by default.** `sw.js` is a hand-written service worker — no
  Workbox — that precaches the app shell and keeps the pixel typeface in a
  stale-while-revalidate cache. Bump `CACHE` in it to ship an update.
- **Async storage, synchronous loop.** The vault is read once during boot
  into a plain object; the game loop never awaits anything. Writes go through
  an ordered queue so a reload can't catch the store half-updated, and they
  fire immediately rather than on a debounce — the moment a run ends is
  exactly when someone closes the tab.
- **Icons are generated, not drawn.** `test/make-icons.mjs` renders them with
  the game's own bird code, so the app icon can never drift from the bird.

The game exposes `window.__dreybird` so a headless browser can drive the same
loop with synthetic timestamps. `test/smoke.mjs` uses that to check the
physics, scoring, collisions, power-ups, unlocks and mobile layout:

```
npm i -D playwright && npx playwright install chromium
node test/smoke.mjs      # 15 gameplay checks
node test/pwa.mjs        # installability + a real offline run
node test/profiles.mjs   # 20 storage, profile and import/export checks
node test/cosmetics.mjs  # 15 economy, shop and rendering checks
node test/determinism.mjs # 12 seeded-run and background checks
node test/comfort.mjs    # 16 haptics, pause and assist checks
node test/dynamics.mjs   # 16 formation and hazard checks
node test/progression.mjs # 23 XP, trait and perk checks
node test/make-icons.mjs # regenerate the app icons
```

`smoke.mjs` drops screenshots of each game state into `test/shots/`.
`pwa.mjs` serves the repo on localhost, waits for the service worker to take
control, then pulls the network out and proves the game still boots, starts
on a tap and scores. `profiles.mjs` covers the storage layer: migration from
the old single-player build, two players not bleeding into each other,
surviving a reload both with and without an explicit flush, both answers to
the persistent-storage request, export/import round trips, and the game still
working with IndexedDB blocked entirely. `cosmetics.mjs` checks the
catalogue for malformed art and duplicate ownership keys, drives real runs to
verify what they pay, and screenshots the same frame with and without
cosmetics equipped to prove they reach the canvas.

`.github/workflows/pages.yml` deploys `index.html`, the manifest, the service
worker and the icons to GitHub Pages on every push.

---

Made as a homage to Dong Nguyen's *Flappy Bird* (2013). All code and art here
are original.
