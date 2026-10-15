# Backlog

Ideas parked for later. This file is not published (see `exclude` in `_config.yml`).

## Festival greeting (Bihu)

A one-line greeting toast on festival days (for example Rongali Bihu in mid-April, Magh Bihu in mid-January).

- Only appears on the matching dates, once per visit.
- The dates must be maintained by hand each year, since they move. Keep them in `_data/eggs.yml`,
  for example a list of `{ from: "MM-DD", to: "MM-DD", text: "..." }` entries.
- Needs the owner to decide the exact dates and wording before building.
- Implementation sketch: a small check in `assets/js/eggs.js` that compares today's `MM-DD` with the list
  and calls the existing `toast()` helper.
