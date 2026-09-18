---
layout: page
title: GeoProof GPS Camera Privacy Policy
permalink: /geoproof/privacy/
---

**Effective date:** 2026-09-18

GeoProof GPS Camera ("GeoProof", "the app") is a camera app that stamps photos with the location
and time they were taken. This policy explains what data the app collects, how it's used, and
what stays on your device versus what leaves it.

## Data the app collects

**Photos.** When you take a photo, GeoProof saves a copy stamped with location/time information
and preserves the original, unstamped copy privately on your device. Neither ever leaves your
device except when you explicitly choose to Share a photo, export a Project as a ZIP file, or
Share a Project's map — all of which use Android's own share sheet, so you control exactly where
that copy goes.

**Location.** GeoProof uses your device's GPS/network location (via Android's location services)
only while you're using the app, and only to record where a photo was taken. Location data is
written into the stamped photo itself (visually and in its EXIF metadata) and stored in the app's
own project data — it is not sent to any GeoProof server, because GeoProof has no server; it's not
a cloud app.

**Address lookup (reverse geocoding).** To show a human-readable address (e.g. "Springfield,
IL") alongside coordinates, GeoProof sends the photo's latitude/longitude to your device's
built-in geocoding service (provided by Android/Google Play services, or your device
manufacturer), and follows Google's own privacy policy for that lookup. If it fails or you're
offline, GeoProof simply omits the address — nothing else about the app depends on it.

**Project maps.** If you open a Project's map, GeoProof loads an interactive map in the app.
To draw it, your device requests map tiles from OpenStreetMap's tile servers and the map library
from a public content delivery network (unpkg.com); the tile requests necessarily reveal the
map area being viewed (and, like any network request, your device's IP address) to those
providers, under their own privacy policies. GeoProof also occasionally checks the public npm
registry (registry.npmjs.org) for the latest version of that map library, which reveals only your
IP address. Your photos and the photo details shown in map popups are built on your device and are
never sent to these services. If you never open a Project map, none of these requests are made.

**Advertising data.** GeoProof shows ads via Google AdMob. AdMob may collect device identifiers
(such as the Android Advertising ID) and other information to serve and measure ads, per
[Google's Privacy Policy](https://policies.google.com/privacy) and
[How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).
For users in the EEA, UK, and Switzerland, GeoProof asks for your consent before requesting any
personalized ads, using Google's User Messaging Platform.

## What GeoProof does not do

- GeoProof has no account system, no sign-in, and no servers of its own — we never receive your
  photos or location data. The only third parties that see anything are the ones named above
  (the device's geocoding service, map tile/library providers, and Google AdMob).
- GeoProof does not sell your data.
- GeoProof does not access your photos, location, or files in the background — only while you're
  actively using the app to capture or manage photos.

## How to delete your data from GeoProof GPS Camera

GeoProof has no account and no server, so there is no "request" to submit or wait on — every
deletion below happens instantly, entirely on your own device, the moment you take the action.

**To delete an individual photo:** open it in GeoProof's History (or a Project) and choose
Delete. This immediately and permanently removes both the stamped copy and its preserved original
from your device — nothing is retained afterward, by GeoProof or anyone else.

**To delete a Project:** open the Project and choose Delete project. This removes the project
grouping only; its member photos are unaffected and remain in History (delete them individually,
as above, if you want those gone too).

**To delete everything at once:** uninstall GeoProof. This immediately removes all of the app's
data from your device — every preserved original and every Project — with nothing left behind and
nothing recoverable afterward (see the warning in the app's own Settings screen). Note that
already-stamped photos you can see in your device's Gallery/Photos app live in your device's
general photo storage, not inside GeoProof itself, so you'll want to delete those separately
(from your Gallery app) if you want them gone too.

**What's kept, and by whom, after any of the above:** nothing, on GeoProof's side — there is no
GeoProof server, so there is no copy anywhere for us to retain or delete on your behalf. The one
exception is Google/AdMob's own advertising data (see "Advertising data" above), which is
collected and retained under Google's own privacy policy, not GeoProof's, and isn't affected by
anything you delete within the app.

## Permissions GeoProof requests, and why

| Permission | Why |
|---|---|
| Camera | To take the photo you're capturing. |
| Location (fine/coarse) | To record where each photo was taken. |
| Internet | For the address lookup, Project maps, and ad serving described above — nothing else. |

## Children's privacy

GeoProof is intended for users aged 18 and over. It is not directed at children and does not
knowingly collect personal information from children.

## Changes to this policy

If GeoProof's data practices change, this page will be updated and the "Effective date" above
will change accordingly.

## Contact

GeoProof GPS Camera is published by Ankur Jyoti Phukan.

Questions about this policy: ajphukans@gmail.com.
