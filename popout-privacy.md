---
layout: page
title: PopOut Privacy Policy
permalink: /popout/privacy/
---

**Effective date:** 22-09-2026

This document is written to be hosted at a public URL (see the front matter
above — it's written as a GitHub Pages/Jekyll page, the same pattern used
for GeoProof GPS Camera's privacy policy) and linked from PopOut's Google
Play Store listing and Data Safety form — Play Console requires a live
link, which this file is not by itself until it's pushed to a Pages repo.
See `docs/STORE_LISTING.md` for that still-open step. The wording below
describes PopOut's real behavior as implemented; it should be re-checked
against the app whenever that behavior changes.

PopOut ("the app") turns your phone into an instant-film camera. This
policy explains what data the app collects, how it's used, and what stays
on your device versus what leaves it.

## Summary

PopOut does not have accounts, does not use the internet, does not collect
analytics, does not show ads, and does not track you. Every photo you take
stays on your device unless you personally choose to share it or export a
backup file — PopOut never uploads anything anywhere on its own.

## Data the app collects

**Photos.** When you take a photo, PopOut saves the finished print to
`Pictures/PopOut` on your device, exactly like a normal camera app, and
keeps a private, unprocessed "negative" copy in the app's own storage so
you can change its look or border later. A collage you export from
Collage Studio is saved separately, to `Pictures/PopOut Canvas`. None of
this ever leaves your device except when you explicitly choose to share a
photo (Android's own share sheet) or create a backup file (see below) —
you control exactly where that copy goes.

**Photo metadata.** A local, on-device database records details about
your own photos — capture date, which film look/border was applied,
favorites, and album membership — so the app can show your scrapbook,
filter it, and let you re-edit a print later. This database is never sent
anywhere; it exists only to make the app work.

**Biometric confirmation.** If you use the optional Locked Album feature
to hide specific photos, PopOut asks Android's own `BiometricPrompt`
system (your fingerprint, face, or device screen lock) to confirm it's
you. PopOut never builds, sees, or stores your fingerprint, face data, or
PIN/pattern/password itself — it only receives a yes/no answer from
Android.

## What PopOut does not do

- No account creation or sign-in of any kind.
- No cloud photo backup or sync — PopOut has no server to sync to.
- No analytics, crash reporting, or usage tracking.
- No advertising, and no data shared with advertisers or any other third
  party.
- No location access or location stamping of any kind.
- No internet access is used for anything described above — PopOut's
  camera, editing, and scrapbook features all work fully offline.

## Backup files

Settings includes an optional "Backup & Restore" feature that exports your
whole scrapbook (photos, edits, favorites, and albums) to a single file,
encrypted (AES-256-GCM) with a passphrase only you know. This file is
created only when you explicitly choose to create one, is saved only to a
location you pick yourself, and is never transmitted anywhere by PopOut —
it exists purely so you can move your photos to a new phone or keep your
own backup copy.

## How to delete your data from PopOut

PopOut has no account and no server, so there is no "request" to submit or
wait on — every deletion below happens instantly, entirely on your own
device, the moment you take the action.

**To delete an individual photo:** open it in the Scrapbook and choose
Delete. This removes it from your device (and, per Android's own delete
flow on newer versions, may ask you to confirm) — its private negative and
metadata row are cleaned up as part of the same action.

**To delete everything at once:** uninstall PopOut. This immediately
removes all of the app's own private data from your device — every
negative and the whole metadata database — with nothing left behind and
nothing recoverable afterward. Note that the prints themselves (in
`Pictures/PopOut` and `Pictures/PopOut Canvas`) live in your device's
general photo storage, not inside PopOut itself, so uninstalling the app
does not delete them — remove those separately from your Gallery/Photos
app if you want them gone too.

**What's kept, and by whom, after any of the above:** nothing. There is no
PopOut server, so there is no copy anywhere for anyone to retain or delete
on your behalf.

## Permissions PopOut requests, and why

| Permission | Why |
|---|---|
| Camera | To take the photo you're capturing. |
| Storage (read/write, Android 9 and below only) | To save prints to, and read them back from, `Pictures/PopOut`. Not requested on Android 10+, which needs no permission for an app to manage its own gallery files. |
| Notifications (Android 13+) | Only if you turn on the optional "Reminders" setting (off by default), for a single local reminder if you haven't taken a photo in a while. Nothing is sent over the network. |
| Biometric | Only used if you turn on the optional Locked Album feature — see "Biometric confirmation" above. |

## Children's privacy

PopOut does not knowingly collect any personal information from anyone,
including children, because it does not collect personal information from
anyone at all — everything described above stays on-device.

## Changes to this policy

If PopOut's data practices ever change, this document will be updated
before that change ships, and the "Effective date" above will change to
match.

## Contact

PopOut is published by ANKUR JYOTI PHUKAN.

Questions about this policy: ajphukans@gmail.com, or the
contact address listed on PopOut's Google Play Store page.
