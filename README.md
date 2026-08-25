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

- **Save file** writes every player to `dreybird-save.json`.
- **Load file** reads one back, merging by player. On a conflict it keeps
  the *better* of each number, so importing an old backup can never lower a
  best score or wipe a medal.

Scores live in IndexedDB, falling back to `localStorage` automatically where
IndexedDB is blocked (private windows, some embedded browsers). If you played
an earlier version, your existing best score is migrated into the first
player rather than lost.

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

**Five birds.** Classic is yours from the start; Bluebird, Ember, Ghost and
Circuit unlock at a best score of 5, 15, 25 and 40. Pick one from the palette
button in the top-left corner.

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
node test/profiles.mjs   # 19 storage, profile and import/export checks
node test/make-icons.mjs # regenerate the app icons
```

`smoke.mjs` drops screenshots of each game state into `test/shots/`.
`pwa.mjs` serves the repo on localhost, waits for the service worker to take
control, then pulls the network out and proves the game still boots, starts
on a tap and scores. `profiles.mjs` covers the storage layer: migration from
the old single-player build, two players not bleeding into each other,
surviving a reload both with and without an explicit flush, both answers to
the persistent-storage request, export/import round trips, and the game still
working with IndexedDB blocked entirely.

`.github/workflows/pages.yml` deploys `index.html`, the manifest, the service
worker and the icons to GitHub Pages on every push.

---

Made as a homage to Dong Nguyen's *Flappy Bird* (2013). All code and art here
are original.
