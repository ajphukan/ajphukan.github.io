# ajphukan.github.io

Developer profile and resume (Jekyll on GitHub Pages). Content and design are separate, so
you can edit the text without touching the look.

## Edit content (safe)

| What | Where |
| --- | --- |
| Home page text: role, about, experience, projects, skills, education, links | `_data/profile.yml` |
| Site title, email, description | `_config.yml` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` (listed at `/blog/`) |
| Privacy policies | `geoproof-privacy.md`, `popout-privacy.md`, `ananta-privacy.md` |
| ATS resume PDF | edit `_resume/resume.html`, print it to PDF, save as `assets/Ankur_Jyoti_Phukan_Resume.pdf` |

`_data/profile.yml` is plain text. Add or remove a job, bullet or project by copying an existing entry.
Quote any value that contains a colon.

## The theme (change only if you want a new look)

| Part | File |
| --- | --- |
| Colors, spacing, light and dark palettes | `assets/css/theme.css` (color tokens are at the top) |
| Theme switch and page-peel behavior | `assets/js/theme.js` |
| Home page structure | `_layouts/profile.html` |
| Blog and policy page structure | `_layouts/default.html`, `page.html`, `post.html` |
| Shared head, top-right theme link and peel markup | `_includes/theme-head.html`, `_includes/theme-link.html`, `_includes/theme-toggle.html` |
| Favicon and link preview image | `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `assets/og-image.png` |

## Easter eggs (hidden on purpose)

Configured in `_data/eggs.yml`; the code is `assets/js/eggs.js`. Each one stays invisible until triggered,
and each can be turned off with `enabled: false`.

- Konami code, or the backtick key: opens a small terminal (`help` lists commands)
- Typing `sudo hire` anywhere: a short toast with the email link
- Clicking the name five times quickly: a line from the Zen of Python
- Opening the browser console or viewing the page source: a short hello
- A mistyped URL: the custom 404 page (`404.html`)
- `g` then `h`/`l`/`s`/`e`/`r`/`b`: jump to GitHub, LinkedIn, Stack Exchange, email, resume, blog; `?` lists them
- Terminal extras: `git log`, `neofetch`, `docker ps`, `python -c "import this"`, `fortune`, `curl -I /`, `theme matrix`
- Hidden URLs: `/teapot/`, `/hire/`, `/humans.txt`, `/robots.txt`
- Hovering the footer copyright line, and flipping the theme five times quickly
- More terminal commands: `ls -a`, `tree`, `open <dir>`, `cat .konami`, `typingtest`, `vim`, `cowsay`, `ssh`, `make coffee`, `top`
- Tapping the footer copyright line seven times (phones): opens the terminal
- Typing `ajphukan.help()` in the browser console
- Hidden URLs `/status/` and `/admin/`
- Even more terminal commands: `man ajphukan`, `uname -a`, `uptime`, `ping`, `echo $SHELL`, `alias`, `hire`, `coffee`, `ll`,
  `hello` / `namaste` / `nomoskar`, `sudo make me a sandwich`, `sudo rm -rf /`, and `matrix` (rain, then the matrix theme)
- The terminal greets you according to the time of day

### How people can find them without reading the source

A trail where each step points at the next:

1. Hover the footer copyright line: the tooltip says to press `?`.
2. `?` shows the shortcuts panel, which lists the backtick key for the terminal. The 404 page also says to press `?`.
3. Tapping or clicking the footer line repeatedly shows "Keep going..." and "Almost there...", then opens the terminal.
4. In the terminal, `help` says there are unlisted commands and that unix habits work here.
5. Each unknown command prints the next hint (`ls -a`, `man ajphukan`, `man easter`, `tree`).
6. `man easter` describes the four hiding places without naming every egg.

Edit the wording in `_data/eggs.yml` (`footer_hover`, `terminal.hints`, `terminal.man_easter`, `terminal.tap_hints`, `not_found.tip`).

## Do not change these URLs

They are referenced by published apps:
`/geoproof/privacy/`, `/popout/privacy/`, `/ananta-privacy.md`, `/app-ads.txt`.
`ananta-privacy.md` has no front matter on purpose, so it stays a raw file at that path.

## Preview locally

Jekyll 3.4 in the Gemfile is old. Use Docker instead:

```
docker run --rm -p 4000:4000 -v "${PWD}:/srv/jekyll" jekyll/jekyll:4.2.2 jekyll serve
```
