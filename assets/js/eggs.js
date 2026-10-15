// Easter eggs. Everything here stays invisible until a visitor triggers it.
// Triggers and text come from _data/eggs.yml (embedded by _includes/eggs.html).
(function () {
  var node = document.getElementById("eggs-config");
  if (!node) return;
  var cfg;
  try { cfg = JSON.parse(node.textContent); } catch (e) { return; }
  var eggs = cfg.eggs || {};
  var base = cfg.base || "";
  var root = document.documentElement;
  var terminalOpen = false;
  var panelOpen = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var ZEN = [
    "Beautiful is better than ugly.", "Explicit is better than implicit.", "Simple is better than complex.",
    "Complex is better than complicated.", "Flat is better than nested.", "Sparse is better than dense.",
    "Readability counts.", "Special cases aren't special enough to break the rules.",
    "Although practicality beats purity.", "Errors should never pass silently.", "Unless explicitly silenced.",
    "In the face of ambiguity, refuse the temptation to guess.",
    "There should be one-- and preferably only one --obvious way to do it.",
    "Although that way may not be obvious at first unless you're Dutch.", "Now is better than never.",
    "Although never is often better than *right* now.", "If the implementation is hard to explain, it's a bad idea.",
    "If the implementation is easy to explain, it may be a good idea.",
    "Namespaces are one honking great idea -- let's do more of those!"
  ];

  // ---- console banner ------------------------------------------------------------------------
  if (eggs.console && eggs.console.enabled && window.console) {
    try {
      console.log("%c" + (eggs.console.banner || ""), "color:#7aa7ff;font-family:monospace;font-weight:bold");
      console.log("%c" + (eggs.console.message || ""), "font-size:13px");
      console.log("%cTry: ajphukan.help()", "font-size:13px;color:#7aa7ff");
    } catch (e) {}
    try {
      window.ajphukan = {
        email: cfg.email || "",
        hire: function () { window.location.href = "mailto:" + (cfg.email || ""); return "Opening your mail app..."; },
        resume: function () { window.open(cfg.resumeUrl, "_blank", "noopener"); return "Opening resume..."; },
        profile: function () { return loadData().then(function (d) { return d.profile; }); },
        help: function () {
          console.log("ajphukan.hire()     open an email\najphukan.resume()   open the resume\najphukan.profile()  profile data (a Promise)");
          return "Type a method name followed by () to run it.";
        }
      };
    } catch (e) {}
  }

  // ---- 404 joke ------------------------------------------------------------------------------
  var joke = document.getElementById("egg-404-joke");
  if (joke && eggs.not_found && eggs.not_found.jokes && eggs.not_found.jokes.length) {
    var js = eggs.not_found.jokes;
    joke.textContent = js[Math.floor(Math.random() * js.length)];
  }

  // ---- footer hover --------------------------------------------------------------------------
  if (eggs.footer_hover) {
    var fl = document.querySelector(".site-foot span");
    if (fl) fl.setAttribute("title", eggs.footer_hover);
  }

  // ---- tap the copyright line N times: opens the terminal on phones --------------------------
  var tapsNeeded = (eggs.terminal && eggs.terminal.enabled && eggs.terminal.footer_taps) || 0;
  if (tapsNeeded) {
    var fspan = document.querySelector(".site-foot span");
    if (fspan) {
      var taps = 0, tapTimer = 0;
      var tapHints = eggs.terminal.tap_hints || [];
      fspan.addEventListener("click", function () {
        taps++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function () { taps = 0; }, 3000);
        if (tapHints[0] && taps === tapsNeeded - 3) toast(tapHints[0]);
        if (tapHints[1] && taps === tapsNeeded - 1) toast(tapHints[1]);
        if (taps >= tapsNeeded) { taps = 0; openTerminal(); }
      });
    }
  }

  // ---- toast ---------------------------------------------------------------------------------
  var toastTimer = 0;
  function toast(text, linkText, linkHref) {
    var old = document.querySelector(".egg-toast");
    if (old) old.parentNode.removeChild(old);
    clearTimeout(toastTimer);
    var el = document.createElement("div");
    el.className = "egg-toast";
    el.setAttribute("role", "status");
    el.appendChild(document.createTextNode(text));
    if (linkText && linkHref) {
      el.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = linkHref;
      a.textContent = linkText;
      el.appendChild(a);
    }
    document.body.appendChild(el);
    toastTimer = setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 5000);
  }

  // ---- theme flip counter --------------------------------------------------------------------
  if (eggs.theme_flips && window.MutationObserver) {
    var flips = [];
    new MutationObserver(function () {
      var now = Date.now();
      flips.push(now);
      var win = (eggs.theme_flips.seconds || 20) * 1000;
      flips = flips.filter(function (t) { return now - t <= win; });
      if (flips.length >= (eggs.theme_flips.count || 5)) {
        flips = [];
        toast(eggs.theme_flips.message || "Decisions, decisions...");
      }
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  // ---- go-to shortcuts: g then a key, ? for the cheat sheet ----------------------------------
  var sc = eggs.shortcuts && eggs.shortcuts.enabled ? (eggs.shortcuts.items || []) : [];
  var goPending = false, goTimer = 0;

  function go(url) {
    if (url.indexOf("://") > -1) { window.open(url, "_blank", "noopener"); return; }
    if (url.indexOf("mailto:") === 0) { window.location.href = url; return; }
    window.location.href = base + url;
  }
  function closePanel() {
    var el = document.querySelector(".egg-help-back");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    panelOpen = false;
  }
  function openPanel() {
    if (panelOpen) return;
    panelOpen = true;
    var back = document.createElement("div");
    back.className = "egg-help-back";
    var box = document.createElement("div");
    box.className = "egg-help";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Keyboard shortcuts");
    var h = document.createElement("div");
    h.className = "egg-help-title";
    h.textContent = "Keyboard shortcuts";
    box.appendChild(h);
    function row(keys, label) {
      var r = document.createElement("div");
      r.className = "egg-help-row";
      var k = document.createElement("span");
      k.className = "egg-help-keys";
      k.textContent = keys;
      var l = document.createElement("span");
      l.textContent = label;
      r.appendChild(k); r.appendChild(l);
      box.appendChild(r);
    }
    sc.forEach(function (s) { row("g " + s.key, s.label); });
    if (eggs.terminal && eggs.terminal.enabled && eggs.terminal.backquote) row("`", "Terminal");
    row("?", "This list");
    row("Esc", "Close");
    back.appendChild(box);
    back.addEventListener("mousedown", closePanel);
    document.body.appendChild(back);
  }

  // ---- keyboard ------------------------------------------------------------------------------
  function typingInField(e) {
    var t = e.target;
    if (!t) return false;
    var tag = (t.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable;
  }
  var konami = (eggs.terminal && eggs.terminal.konami) || [];
  var konamiPos = 0;
  var typed = "";
  var phrase = eggs.sudo_hire && eggs.sudo_hire.enabled ? (eggs.sudo_hire.phrase || "").toLowerCase() : "";

  document.addEventListener("keydown", function (e) {
    if (panelOpen && e.key === "Escape") { closePanel(); return; }
    if (terminalOpen || typingInField(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    var key = e.key;

    if (panelOpen) { closePanel(); return; }

    // g + key
    if (sc.length) {
      if (goPending) {
        goPending = false;
        clearTimeout(goTimer);
        for (var i = 0; i < sc.length; i++) {
          if (sc[i].key === key.toLowerCase()) { e.preventDefault(); go(sc[i].url); return; }
        }
      } else if (key === "g") {
        goPending = true;
        goTimer = setTimeout(function () { goPending = false; }, 1200);
      }
      // Some keyboard layouts report "/" with Shift instead of "?".
      if (key === "?" || (key === "/" && e.shiftKey)) { e.preventDefault(); openPanel(); return; }
    }

    if (eggs.terminal && eggs.terminal.enabled) {
      if (eggs.terminal.backquote && (key === "`" || key === "~")) {
        e.preventDefault();
        openTerminal();
        return;
      }
      var want = konami[konamiPos];
      var k = key.length === 1 ? key.toLowerCase() : key;
      if (want && k === (want.length === 1 ? want.toLowerCase() : want)) {
        konamiPos++;
        if (konamiPos === konami.length) {
          konamiPos = 0;
          e.preventDefault(); // otherwise the last key is typed into the new prompt
          openTerminal();
          return;
        }
      } else {
        konamiPos = k === konami[0] ? 1 : 0;
      }
    }

    if (phrase && key.length === 1) {
      typed = (typed + key.toLowerCase()).slice(-phrase.length);
      if (typed === phrase) {
        typed = "";
        toast(eggs.sudo_hire.message, "Email", "mailto:" + (window.__ajEmail || "ajphukans@gmail.com"));
      }
    }
  });

  // ---- click the name N times ----------------------------------------------------------------
  if (eggs.zen && eggs.zen.enabled && eggs.zen.quotes && eggs.zen.quotes.length) {
    var title = document.querySelector(".hero h1");
    if (title) {
      var clicks = 0, clickTimer = 0;
      title.addEventListener("click", function () {
        clicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () { clicks = 0; }, 2000);
        if (clicks >= (eggs.zen.clicks || 5)) {
          clicks = 0;
          var q = eggs.zen.quotes;
          toast(q[Math.floor(Math.random() * q.length)]);
        }
      });
    }
  }

  // ---- matrix rain (terminal: matrix) --------------------------------------------------------
  function rain(done) {
    var cv = document.createElement("canvas");
    cv.className = "egg-rain";
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    document.body.appendChild(cv);
    var ctx = cv.getContext("2d");
    var size = 16, cols = Math.floor(cv.width / size), drops = [], i;
    for (i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    var chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#%&*+=<>";
    var start = performance.now(), timer = 0;
    function stop() {
      clearInterval(timer);
      document.removeEventListener("keydown", stop, true);
      if (cv.parentNode) cv.parentNode.removeChild(cv);
      if (done) done();
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cv.width, cv.height);
    timer = setInterval(function () {
      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#39ff6a";
      ctx.font = size + "px monospace";
      for (var c = 0; c < cols; c++) {
        ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), c * size, drops[c] * size);
        if (drops[c] * size > cv.height && Math.random() > 0.975) drops[c] = 0;
        drops[c]++;
      }
      if (performance.now() - start > 4500) stop();
    }, 50);
    document.addEventListener("keydown", stop, true);
  }

  // ---- terminal ------------------------------------------------------------------------------
  var data = null, dataPromise = null;
  function loadData() {
    if (data) return Promise.resolve(data);
    if (!dataPromise) {
      dataPromise = fetch(cfg.dataUrl).then(function (r) { return r.json(); }).then(function (d) {
        data = d; window.__ajEmail = d.email; return d;
      }).catch(function () { data = { name: "", email: "", profile: {} }; return data; });
    }
    return dataPromise;
  }
  function hash7(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return ("0000000" + h.toString(16)).slice(-7);
  }
  function slug(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function elapsed(since) {
    var m = /^(\d{4})-(\d{2})$/.exec(since || "");
    if (!m) return null;
    var now = new Date();
    var total = (now.getFullYear() - +m[1]) * 12 + (now.getMonth() + 1 - +m[2]);
    return { y: Math.floor(total / 12), m: total % 12 };
  }
  function years(since) {
    var m = /^(\d{4})-(\d{2})$/.exec(since || "");
    if (!m) return null;
    var now = new Date();
    return Math.floor(((now.getFullYear() - +m[1]) * 12 + (now.getMonth() + 1 - +m[2])) / 12);
  }

  function openTerminal() {
    if (terminalOpen) return;
    terminalOpen = true;
    var opener = document.activeElement;
    var T = eggs.terminal || {};
    var prompt = T.prompt || "guest@site:~$";
    var history = [], hpos = 0, unknown = 0;

    var back = document.createElement("div");
    back.className = "egg-term-back";
    var box = document.createElement("div");
    box.className = "egg-term";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Terminal");
    var out = document.createElement("div");
    out.className = "egg-term-out";
    out.setAttribute("aria-live", "polite");
    var row = document.createElement("div");
    row.className = "egg-term-row";
    var pl = document.createElement("span");
    pl.className = "egg-term-prompt";
    pl.textContent = prompt;
    var input = document.createElement("input");
    input.className = "egg-term-input";
    input.type = "text";
    input.spellcheck = false;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Command");
    row.appendChild(pl);
    row.appendChild(input);
    box.appendChild(out);
    box.appendChild(row);
    back.appendChild(box);
    document.body.appendChild(back);
    input.focus();
    // The keypress that opened the terminal can still land in the prompt; start clean.
    setTimeout(function () { input.value = ""; }, 0);

    function line(text, cls) {
      var d = document.createElement("div");
      d.className = "egg-term-line" + (cls ? " " + cls : "");
      d.textContent = text;
      out.appendChild(d);
      return d;
    }
    function lines(arr) { arr.forEach(function (t) { line(t); }); }
    function link(label, href) {
      var d = document.createElement("div");
      d.className = "egg-term-line";
      var a = document.createElement("a");
      a.href = href; a.target = "_blank"; a.rel = "noopener";
      a.textContent = label;
      d.appendChild(a);
      out.appendChild(d);
    }
    function close() {
      if (back.parentNode) back.parentNode.removeChild(back);
      terminalOpen = false;
      if (opener && opener.focus) { try { opener.focus(); } catch (e) {} }
    }
    function pad(s, n) { s = String(s); while (s.length < n) s += " "; return s; }

    var p = function () { return (data && data.profile) || {}; };
    var commands = {
      help: function () {
        lines(["about        who I am", "experience   where I have worked (experience <n> for details)",
          "projects     things I built", "skills       what I work with", "contact      how to reach me",
          "resume       open the PDF resume", "theme        theme dark | light | matrix | toggle",
          "ls, pwd, whoami, date, history, clear, exit",
          "...and a few things that are not listed. Unix habits work here."]);
      },
      whoami: function () { lines([(data && data.name) || "guest", p().role || ""]); },
      about: function () { line(p().about || ""); },
      ls: function () { line("about  experience  projects  skills  contact  resume"); },
      pwd: function () { line("/home/guest/portfolio"); },
      date: function () { line(new Date().toString()); },
      experience: function (args) {
        var jobs = p().experience || [];
        var n = parseInt(args[0], 10);
        if (n >= 1 && n <= jobs.length) {
          var j = jobs[n - 1];
          line(j.title + " (" + j.dates + ")", "egg-term-strong");
          (j.bullets || []).forEach(function (b) { line("- " + b); });
          return;
        }
        jobs.forEach(function (j, i) { line((i + 1) + ". " + j.title + " (" + j.dates + ")"); });
        line("Run 'experience <number>' for details.", "egg-term-dim");
      },
      projects: function () {
        (p().projects || []).forEach(function (x) { line(x.name + " [" + x.meta + "]", "egg-term-strong"); line("  " + x.text); });
      },
      skills: function () { (p().skills || []).forEach(function (s) { line(s.label + ": " + s.value); }); },
      contact: function () {
        line("Email: " + ((data && data.email) || ""));
        (p().links || []).forEach(function (l) {
          if (l.url.indexOf("://") > -1) link(l.label + ": " + l.url, l.url);
        });
      },
      resume: function () { window.open(cfg.resumeUrl, "_blank", "noopener"); line("Opening resume..."); },
      theme: function (args) {
        var api = window.AJTheme;
        if (!api) { line("theme switching is not available here."); return; }
        var want = args[0];
        if (want === "toggle" || !want) want = api.current() === "dark" ? "light" : "dark";
        if (want !== "dark" && want !== "light" && want !== "matrix") { line("usage: theme dark | light | matrix | toggle"); return; }
        api.set(want);
        line("theme: " + want + (want === "matrix" ? "  (resets on reload)" : ""));
      },
      clear: function () { out.textContent = ""; },
      history: function () { history.forEach(function (h, i) { line((i + 1) + "  " + h); }); },
      exit: function () { close(); },
      sudo: function (args) {
        var rest = args.join(" ").toLowerCase();
        if (rest === "hire" || rest === "hire me" || rest === "hire ankur") {
          line((eggs.sudo_hire && eggs.sudo_hire.message) || "permission granted.");
          link("Email " + ((data && data.email) || ""), "mailto:" + ((data && data.email) || ""));
        } else if (rest === "make me a sandwich") {
          line("Okay.");
        } else if (/^rm\s+-rf/.test(rest)) {
          lines(["Deleting /home/guest ...", "Just kidding. This is a static site; there is nothing to delete."]);
        } else {
          line("guest is not in the sudoers file. This incident will be reported.");
        }
      },
      rm: function () { line("Nice try."); },

      // --- hidden commands ---
      git: function (args) {
        var sub = args[0] || "";
        if (sub === "status") { lines(["On branch main", "nothing to commit, working tree clean"]); return; }
        if (sub !== "log") { line("usage: git log | git status"); return; }
        var jobs = p().experience || [];
        jobs.forEach(function (j, i) {
          line("commit " + hash7(j.title + j.dates) + (i === 0 ? " (HEAD -> main)" : ""), "egg-term-cmd");
          line("Date:   " + j.dates);
          line("");
          line("    " + j.title);
          line("");
        });
      },
      neofetch: function () {
        var art = ((eggs.console && eggs.console.banner) || "").replace(/\n+$/, "").split("\n");
        var yrs = years(T.uptime_since);
        var info = [
          "guest@ajphukan", "--------------",
          "OS: GitHub Pages (Jekyll)", "Host: ajphukan.github.io", "Role: " + (p().role || ""),
          "Languages: " + ((p().skills || []).filter(function (s) { return s.label === "Languages"; }).map(function (s) { return s.value; })[0] || ""),
          "Uptime: " + (yrs === null ? "a while" : yrs + " years (since " + T.uptime_since + ")"),
          "Shell: portfolio-sh", "Theme: " + (window.AJTheme ? window.AJTheme.current() : "?"),
          "Location: Assam, India (IST)"
        ];
        var n = Math.max(art.length, info.length);
        for (var i = 0; i < n; i++) line(pad(art[i] || "", 20) + "  " + (info[i] || ""));
      },
      docker: function (args) {
        if (args[0] !== "ps") { line("usage: docker ps"); return; }
        line(pad("CONTAINER ID", 14) + pad("IMAGE", 30) + pad("STATUS", 26) + "NAMES", "egg-term-strong");
        (p().projects || []).forEach(function (x) {
          var status = /closed testing/i.test(x.meta) ? "Up (closed testing)" : "Up";
          line(pad(hash7(x.name), 14) + pad(slug(x.meta.split(",")[0]) + ":latest", 30) + pad(status, 26) + slug(x.name));
        });
      },
      python: function (args) {
        var joined = args.join(" ");
        if (/import\s+this/.test(joined)) { commands["import"](["this"]); return; }
        line("Python 3.13 (portfolio build). Try: python -c \"import this\"");
      },
      "import": function (args) {
        if (args[0] !== "this") { line("ModuleNotFoundError: No module named '" + (args[0] || "") + "'"); return; }
        line("The Zen of Python, by Tim Peters", "egg-term-strong");
        line("");
        ZEN.forEach(function (z) { line(z); });
      },
      fortune: function () {
        var q = (eggs.zen && eggs.zen.quotes && eggs.zen.quotes.length) ? eggs.zen.quotes : ZEN;
        line(q[Math.floor(Math.random() * q.length)]);
      },
      curl: function (args) {
        if (!args.length) { line("curl: try 'curl -I /'"); return; }
        lines(["HTTP/2 200", "server: GitHub.com", "content-type: text/html; charset=utf-8",
          "x-powered-by: stubbornness", "x-hire-me: please"]);
      }
    };
    commands.quit = commands.exit;
    commands.python3 = commands.python;

    var DIRS = { teapot: "/teapot/", hire: "/hire/", status: "/status/", blog: "/blog/" };
    commands.ls = function (args) {
      var all = args.some(function (a) { return /^-.*a/.test(a); });
      var names = ["about", "experience", "projects", "skills", "contact", "resume"];
      if (all) names = [".", "..", ".konami", ".hushlogin"].concat(names, ["blog/", "hire/", "status/", "teapot/", "humans.txt", "robots.txt"]);
      line(names.join("  "));
    };
    commands.tree = function () {
      lines([".", "|-- about", "|-- experience", "|-- projects", "|-- skills", "|-- contact", "|-- resume",
        "|-- blog/", "|-- hire/", "|-- status/", "|-- teapot/", "`-- humans.txt"]);
    };
    commands.open = function (args) {
      var t = (args[0] || "").replace(/\/$/, "");
      if (DIRS[t]) { line("Opening " + DIRS[t] + " ..."); window.location.href = base + DIRS[t]; }
      else line("open: " + (args[0] || "") + ": no such directory. Try 'tree'.");
    };
    commands.cd = commands.open;
    commands.cat = function (args) {
      var f = args[0] || "";
      if (["about", "skills", "projects", "experience", "contact"].indexOf(f) > -1) { commands[f]([]); return; }
      if (f === ".konami") { line("up up down down left right left right b a"); return; }
      if (f === ".hushlogin") { line("No news is good news."); return; }
      if (f === "humans.txt" || f === "robots.txt") {
        fetch(base + "/" + f).then(function (r) { return r.text(); }).then(function (t) {
          lines(t.replace(/\n+$/, "").split("\n"));
          out.scrollTop = out.scrollHeight;
        }).catch(function () { line("cat: " + f + ": cannot read"); });
        return;
      }
      line("cat: " + f + ": No such file");
    };

    // typing test: type over the sentence; characters turn green or red as you go
    var typing = null;
    function paintTyping(value) {
      var t = typing;
      if (!t) return;
      var typedOk = 0;
      for (var i = 0; i < t.spans.length; i++) {
        var cls = "";
        if (i < value.length) {
          cls = value.charAt(i) === t.text.charAt(i) ? "ok" : "bad";
          if (cls === "ok") typedOk++;
        } else if (i === value.length) {
          cls = "cur";
        }
        t.spans[i].className = cls;
      }
      var secs = t.start ? (performance.now() - t.start) / 1000 : 0;
      var acc = value.length ? Math.round(typedOk / value.length * 100) : 100;
      var wpm = secs > 1 ? Math.round((typedOk / 5) / (secs / 60)) : 0;
      t.stat.textContent = value.length + "/" + t.text.length + "   " + wpm + " WPM   " + acc + "% accuracy";
      if (value.length >= t.text.length) finishTyping(value);
    }
    commands.typingtest = function () {
      var pool = ZEN.slice(), picks = [];
      while (picks.length < 2) picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      var text = picks.join(" ");
      line("Typing test. Type the text below. Ctrl+C cancels.", "egg-term-dim");
      var boxEl = document.createElement("div");
      boxEl.className = "egg-typing";
      var spans = text.split("").map(function (ch) {
        var s = document.createElement("span");
        s.textContent = ch;
        boxEl.appendChild(s);
        return s;
      });
      out.appendChild(boxEl);
      var stat = line("", "egg-term-dim");
      typing = { text: text, start: null, spans: spans, stat: stat };
      row.classList.add("typing");
      input.value = "";
      input.focus();
      paintTyping("");
    };
    function endTypingMode() {
      typing = null;
      row.classList.remove("typing");
      input.value = "";
    }
    function finishTyping(value) {
      var t = typing;
      var secs = t.start ? (performance.now() - t.start) / 1000 : 0;
      endTypingMode();
      t.stat.textContent = "";
      var ok = 0;
      for (var i = 0; i < t.text.length; i++) if (value.charAt(i) === t.text.charAt(i)) ok++;
      var acc = Math.round(ok / t.text.length * 100);
      var wpm = secs ? Math.round((t.text.length / 5) / (secs / 60)) : 0;
      line(wpm + " WPM  |  " + acc + "% accuracy  |  " + secs.toFixed(1) + "s", "egg-term-strong");
      try {
        var best = parseInt(localStorage.getItem("ajBestWpm") || "0", 10);
        if (wpm > best) {
          localStorage.setItem("ajBestWpm", String(wpm));
          line(best ? "New best! (was " + best + " WPM)" : "Saved as your best on this device.", "egg-term-dim");
        } else {
          line("Best on this device: " + best + " WPM", "egg-term-dim");
        }
      } catch (e) {}
      var st = (p().projects || []).filter(function (x) { return x.name === "ShadowTyping"; })[0];
      if (st) link("Want a longer test? " + st.link, st.link);
      out.scrollTop = out.scrollHeight;
    }

    // small jokes
    commands.vim = commands.vi = commands.nano = function () {
      lines(["You are now in vim. Nobody has ever left.", "Type :q! and see what happens."]);
    };
    commands[":q"] = commands[":q!"] = commands[":wq"] = function () { line("You escaped. Very few do."); };
    commands.cowsay = function (args) {
      var msg = args.join(" ") || "Hire me?";
      lines([" " + new Array(msg.length + 3).join("_"), "< " + msg + " >", " " + new Array(msg.length + 3).join("-"),
        "        \\   ^__^", "         \\  (oo)\\_______", "            (__)\\       )\\/\\",
        "                ||----w |", "                ||     ||"]);
    };
    commands.ssh = function (args) {
      line("Connecting to " + (args[0] || "hire@ajphukan") + " ...");
      line("Key accepted. Welcome aboard.");
      line("(That was a joke, but the email is real: " + ((data && data.email) || "") + ")");
    };
    commands.make = function (args) {
      if (args[0] === "coffee") line("make: *** HTTP 418: I'm a teapot. See /teapot/");
      else line("make: *** No rule to make target '" + (args[0] || "") + "'.  Stop.");
    };
    commands.top = function () {
      line("PID   %CPU  COMMAND", "egg-term-strong");
      (T.top || []).forEach(function (r, i) { line(pad(1000 + i * 7, 6) + pad(r.cpu, 6) + r.name); });
      line("load average: caffeine", "egg-term-dim");
    };
    commands.man = function (args) {
      if (args[0] === "easter") { lines(T.man_easter || ["EASTER(6)"]); return; }
      if (args[0] !== "ajphukan") { line("No manual entry for " + (args[0] || "nothing") + ". Try 'man ajphukan'."); return; }
      lines(["AJPHUKAN(1)                  Portfolio Manual", "",
        "NAME", "    ajphukan - " + (p().role || ""), "",
        "SYNOPSIS", "    ajphukan [--remote] [--hire]", "",
        "DESCRIPTION", "    " + (p().about || ""), "",
        "OPTIONS", "    --remote   Open to remote roles (IST, UTC+5:30)", "    --hire     Try: sudo hire", "",
        "SEE ALSO", "    about(1), experience(1), projects(1), skills(1), contact(1), easter(6)", "",
        "BUGS", "    Cannot resist adding one more easter egg."]);
    };
    commands.uname = function () { line("Linux ajphukan 6.1.0-github-pages #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"); };
    commands.uptime = function () {
      var e = elapsed(T.uptime_since);
      var now = new Date();
      var hh = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
      line(" " + hh + " up " + (e ? e.y + " years, " + e.m + " months" : "a while") + ", 1 user, load average: caffeine");
    };
    commands.ping = function (args) {
      var host = args[0] || "ajphukan.github.io";
      line("PING " + host + ": 56 data bytes");
      for (var i = 0; i < 4; i++) {
        line("64 bytes from " + host + ": icmp_seq=" + i + " ttl=57 time=" + (8 + Math.random() * 30).toFixed(1) + " ms");
      }
      lines(["", "4 packets transmitted, 4 received, 0% packet loss"]);
    };
    commands.echo = function (args) {
      var map = { "$SHELL": "/bin/portfolio-sh", "$USER": "guest", "$HOME": "/home/guest", "$EDITOR": "vim (send help)" };
      line(args.map(function (a) { return map[a] || a; }).join(" "));
    };
    commands.alias = function () { lines(["alias hire='sudo hire'", "alias coffee='make coffee'", "alias ll='ls -a'"]); };
    commands.hire = function () { commands.sudo(["hire"]); };
    commands.coffee = function () { commands.make(["coffee"]); };
    commands.ll = function () { commands.ls(["-a"]); };
    commands.hello = commands.hi = commands.namaste = commands.nomoskar = function () {
      lines(["Nomoskar! (\u09A8\u09AE\u09B8\u09CD\u0995\u09BE\u09F0)", "Welcome. Type 'help' to look around."]);
    };
    commands.matrix = function () {
      var api = window.AJTheme;
      if (reduce.matches || !api) {
        if (api) api.set("matrix");
        line("Wake up, guest...");
        return;
      }
      line("Wake up, guest...");
      rain(function () { api.set("matrix"); });
    };

    function run(text) {
      line(prompt + " " + text, "egg-term-cmd");
      var parts = text.trim().split(/\s+/);
      var name = parts[0];
      if (!name) return;
      history.push(text); hpos = history.length;
      loadData().then(function () {
        var fn = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
        if (fn) { fn(parts.slice(1)); } else {
          var hints = T.hints && T.hints.length ? T.hints : ["Try 'help'."];
          line(name + ": command not found. " + hints[unknown % hints.length]);
          unknown++;
        }
        out.scrollTop = out.scrollHeight;
      });
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "c" && e.ctrlKey && typing) {
        e.preventDefault();
        typing.stat.textContent = "";
        endTypingMode();
        line("^C");
        return;
      }
      if (e.key === "Enter") {
        if (typing) { e.preventDefault(); return; }
        var v = input.value; input.value = "";
        run(v);
        return;
      }
      if (e.key === "ArrowUp") { e.preventDefault(); if (hpos > 0) { hpos--; input.value = history[hpos]; } return; }
      if (e.key === "ArrowDown") { e.preventDefault(); if (hpos < history.length - 1) { hpos++; input.value = history[hpos]; } else { hpos = history.length; input.value = ""; } return; }
      if (e.key === "Tab") {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        var hit = Object.keys(commands).filter(function (c) { return c.indexOf(v) === 0; });
        if (hit.length === 1) input.value = hit[0];
        return;
      }
      if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.textContent = ""; }
    });
    input.addEventListener("input", function () {
      if (!typing) return;
      if (!typing.start) typing.start = performance.now();
      paintTyping(input.value);
    });
    back.addEventListener("mousedown", function (e) { if (e.target === back) close(); });
    box.addEventListener("click", function () { if (!window.getSelection().toString()) input.focus(); });

    var tg = T.time_greetings || {};
    var hr = new Date().getHours();
    var when = hr < 5 ? tg.night : hr < 12 ? tg.morning : hr < 17 ? tg.afternoon : hr < 22 ? tg.evening : tg.night;
    if (when) line(when, "egg-term-dim");
    line(T.greeting || "Type 'help'.", "egg-term-dim");
    loadData();
  }
})();
