# Runway

A weekly outfit-design competition. One shared wardrobe, five looks each, and the gallery decides.

```
index.html                    the whole app
manifest.webmanifest          makes it installable to a home screen
icon-*.png                    app icons
netlify/functions/state.js    shared season state (Netlify Blobs)
netlify.toml                  build + functions config
package.json                  the one dependency the function needs
_redirects                    fallback route for /api/state
```

## Before you deploy

Open `index.html` and edit the two lines under `CONFIG`:

```js
const HOST_CODE = "atelier";   // change this — it unlocks host mode
const API = "/api/state";      // leave as-is for Netlify
```

## Deploy

**From Git (recommended — this is what makes the season shared):**

1. Push this folder to a repo.
2. In Netlify: *Add new site → Import an existing project*, pick the repo.
3. Leave the build command empty. Publish directory: `.`
4. Deploy. Netlify installs `@netlify/blobs` and picks up the function automatically.

**Netlify CLI:**

```bash
npm install
npx netlify deploy --prod
```

**Drag-and-drop** works too, but Netlify Drop does not always run functions. If `/api/state`
isn't live, the app still works — it just falls back to this-device-only storage, and the
header will read "This device only" instead of "Shared".

Check the backend after deploying by opening `https://your-site.netlify.app/api/state`.
It should return `null` on a fresh site, then real JSON once someone submits a look.

## Signing in: a 4-digit pin

Each player makes a name and a **four digit pin** on first visit. The pin is their account —
typing it on any phone brings back their looks, wins, advantages and model. Pins must be
unique, so the app checks the shared season before letting someone claim one, and it asks
for the pin twice on signup. There is no recovery: if a pin is forgotten, the host can look
it up in a JSON backup, or the player starts again.

The pin is shown (hidden by default) under **You → Your pin**, along with *Sign out of this
device*.

## The model

Every player styles a model, and every look remembers the model it was designed on:

- **skin** — six tones
- **hair** — eight styles including braids and a headscarf, in sixteen colours
  (four gingers, from copper through to auburn)
- **lips and cheeks** — bare, natural, bold, berry, gloss, glitter
- **eyeliner** — none, thin, winged, sharp wing, smoky, graphic
- **face** — glasses and freckles, on or off
- **height** — petite, average, tall
- **pose** — straight on, hip out, arms out, wave, mid step, three quarter

Poses move the arms rather than just tilting the figure. Sleeves, gloves, watches and
hand-held bags are drawn in the same rotating group as the limb, so they stay attached.

Edit it in **Studio → Your model**, or from the profile screen. Changes save as your default
for next time.

## The clothes

Seven slots: top, bottom, outerwear, shoes, bag, accessory and **pet**. Top, bottom and
shoes are required; the rest are optional. Eighty-four pieces, including the baby doll top,
flared jeans, cargo mini, mary janes, cowboy boots, baguette bag, phone on a strap, pearl
clips, chunky watch, padded headband, and four pets (cat, dog, bunny, bird).

**Any item can be recoloured.** Tap the colour dot next to a chosen piece in the studio and
pick from sixteen shades, or go back to *as made*. The recolour belongs to that look, not to
the wardrobe, so two players can style the same jacket in different colours in the same round.

**New pieces drop as the season runs.** Some items are locked until a later round — pets
arrive in round two, the baby doll top and phone in round three, and more in rounds four and
five. Anything landing this week is badged **NEW** and has its own filter in the studio.

## Voting

Voting is **anonymous**: designer names are hidden in the gallery and on the runway until
results are published, so people vote for the outfit rather than the friend. The host still
sees names.

Everyone gets a **budget** rather than unlimited hearts:

- **three** votes for Best look (the round winner)
- **one** vote each for Best styling, Best caption, Boldest colour and Best pet

Best pet only accepts looks that actually have a pet. Remaining votes are shown at the top of
the gallery. On top of voting, anyone can leave **reactions** (five fixed emoji, no free text)
on any look once the gallery unseals.

## Points, seasons and a champion

Every scored round pays out: **10** for winning, **6** for second, **4** for third, **1** for
entering, and **2** for each side award. Standings sit at the bottom of the Results screen with
a progress bar toward the season target (eight rounds by default).

The host can **crown the champion** at any point, then **start the next season** — which files
the winner in the **hall of fame** and resets the table while keeping every past round, look
and player intact.

## Sharing a look

**Save as image** on any look renders it to a PNG card with the theme, name and designer, then
opens the phone share sheet (or downloads it on desktop). It's the main way new players find
out the game exists.

## Drafts and restyling

An unfinished look **saves itself as a draft** as you build it, per round, on your device.
Leave the studio and it's waiting when you come back; *Start over* clears it.

**Restyle this** on any look from a finished round opens the studio pre-loaded with that
outfit, colours and model. Change whatever you like — it submits as your own entry for the
current week.

## Add to home screen

The site ships a manifest and icons, so **Add to Home Screen** on iOS or **Install** on Android
gives it an icon and opens it without browser chrome.

## The runway

From the gallery, **Watch the runway** plays every entry in the round full screen, one model
at a time, auto-advancing every four seconds with pause, back and next, arrow-key support,
and a vote button when voting is open.

## Host mode and player mode

Everyone lands in **player mode**: design looks, vote, see results, manage your own profile.

**Host mode** adds a sixth tab and unlocks:

- ending the design phase early, closing voting, adding a day to a deadline, starting the next round
- editing the current theme, brief, and both deadlines
- live vote standings while voting is still open
- removing any entry from the gallery
- choosing the advantage on the winner's behalf if they go quiet
- downloading a JSON backup, restoring from one, resetting the season

Two ways in:

- Visit **`https://your-site.netlify.app/?host=atelier`** (using your own `HOST_CODE`)
- Or open **You → Host access** and enter the passphrase

Host mode is remembered on that device until you choose *Leave host mode*. Treat the
passphrase as a soft lock — it keeps players out of the controls, but anyone who reads the
page source can find it. Fine for a group of friends; not a security boundary.

## How the week runs

Every round is a calendar week, Monday to Monday:

| | |
| --- | --- |
| **Monday 00:00** | new brief, wardrobe opens, designing begins |
| **Saturday 18:00** | entries close, the gallery unseals, voting opens |
| **Sunday 20:00** | voting closes, winner and awards are locked in |
| **Sunday night** | winner picks an advantage |
| **Monday 00:00** | next brief |

Those times come from the device that starts the round, so a group in one place all share the
same deadlines. To move them, change `CLOSE_DAY` / `CLOSE_HOUR` / `VOTE_DAY` / `VOTE_HOUR` at
the top of the script — the rest of the app follows.

Starting a round mid-week slots it into the current week if at least a day of designing is
left, and otherwise into next Monday, so a late host never creates a round that closes in an
hour. The host can still end any phase early, or add a day.

## Looks are sealed until Saturday

During the design phase the gallery shows only how many looks have been entered and your own
submissions. Nobody sees anyone else's outfit until entries close, so there's no copying and
no anchoring. At Saturday 18:00 everything unseals at once, still anonymous — designer names
appear only when results publish on Sunday night.

The host can see entries mid-week, for moderation.

Because the gallery is sealed, **Restyle this** lives on the Results screen: riff on any look
from a finished round and it opens the studio for the current week.

The winner picks one advantage, which applies to the *next* round:

| Advantage | Effect |
| --- | --- |
| Sixth look | six submissions instead of five |
| First look | the wardrobe opens to them 24h early |
| The archive | six rare pieces only they can use |
| Set the brief | they write the next theme |
| Double vote | their votes count twice |

The next round can't start until the advantage is claimed, since it may change the theme
or the opening time.

## Troubleshooting: "we can't see each other's looks"

Almost always the shared backend isn't live. Check the header — it reads **Shared** when the
season is synced and **This device only** when it isn't. Then open
`https://your-site.netlify.app/api/state` directly: `null` or JSON means the function is
running; a 404 means it isn't, and the fix is redeploying from Git or the CLI rather than
drag-and-drop.

Changes take up to six seconds to appear on another phone, because that's the polling
interval.

## Sharing and conflicts

Each client keeps a local copy and polls `/api/state` every six seconds. State merges by
record rather than overwriting wholesale: entries and rounds resolve by `updatedAt`, votes
by `at`, and deletions are tombstones, so two people acting at once don't erase each other.

Writes are read-merge-write: a client re-reads the season, merges, then saves, so a look
submitted by someone else seconds earlier isn't erased. Player records merge by `updatedAt`
so a rename or a model change isn't reverted by a stale device, and seed data is stamped as
old as possible so a client that starts fresh can never overwrite a real season.

It's a small-group design — a few dozen players is comfortable. If you outgrow that, the
thing to replace is the single-blob store, not the app.

## Notes

- React and Babel load from unpkg and JSX compiles in the browser. That keeps this a
  no-build project. If you want a faster first paint, precompile the script block and drop
  the Babel tag.
- Wardrobe items live in the `WARDROBE` array. Each needs `id`, `name`, `slot`, `shape`,
  and `color`; `pattern`, `accent`, `note` and `rare` are optional. A `shape` needs an entry
  in **both** `SHAPES` (the flat drawing on the wardrobe tile) and `WORN` (the version drawn
  on the model). Adding an item with a brand-new shape means writing both. To make a piece
  arrive mid-season, add its id to `DROPS` with a round number.
- Award kinds live in `AWARDS` (change the vote budgets there), emoji in `REACTIONS`, and
  points in `POINTS` / `POINTS_AWARD`.
- The model is drawn in a 120 x 260 SVG space: shoulders at y58, waist y104, hips y138,
  knees y186, ankles y228. Worn garments are authored against those landmarks. Layer order
  is bottom, shoes, top, outerwear, accessory, bag, then sleeves, head accessories and pet —
  which is why boots sit over trousers. Sleeves live in `SLEEVED` and are drawn last, inside
  the rotating arm group.
- `buildSeed()` defines a brand new season: no players, no past rounds, one round
  starting immediately and closing on the next Saturday. Change the opening theme there.
- *Host → Reset season* wipes everything and starts a new **epoch**. Different epochs never
  merge — the newer one wins outright — so a reset can't be undone by a phone that still has
  the old season cached. Everything else merges record by record as normal.
