/*
 * Concordia — site logic.
 *
 * The document list comes from the tables in README.md, so adding a row there
 * adds the document to the site. Documents are fetched as Markdown from this
 * repository and rendered in the browser. Citations such as I.4.c are turned
 * into links, with a preview of the cited provision on hover.
 */
"use strict";

(() => {
    const REPO = "https://github.com/d4140n-4h3-1/Republic_of_Concordia";
    const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const R = "(?:X|IX|VIII|VII|VI|V|IV|III|II|I)";

    const ICONS = {
        scroll: '<svg viewBox="0 0 24 24"><path d="M6 3h11a3 3 0 0 1 3 3v1h-3V6a1 1 0 0 0-2 0v13a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3v-1h11v1a1 1 0 0 0 2 0V6a3 3 0 0 0-.2-1H6a1 1 0 0 0-1 1v9H3V6a3 3 0 0 1 3-3zm2 5h5v2H8zm0 4h5v2H8z"/></svg>',
        columns: '<svg viewBox="0 0 24 24"><path d="M12 2 2 7v2h20V7zM4 10h3v8H4zm6.5 0h3v8h-3zm6.5 0h3v8h-3zM2 19h20v3H2z"/></svg>',
        book: '<svg viewBox="0 0 24 24"><path d="M3 4.5C5.8 3.6 8.8 3.8 11 5.4V20c-2.2-1.4-5.2-1.6-8-.8zm18 0v14.7c-2.8-.8-5.8-.6-8 .8V5.4c2.2-1.6 5.2-1.8 8-.9z"/></svg>',
        scales: '<svg viewBox="0 0 24 24"><path d="M11 3h2v2.1l5.6 1.1L21.5 13a3.5 3.5 0 0 1-7 0l2.4-5.2L13 7.1V19h4v2H7v-2h4V7.1L7.1 7.8 9.5 13a3.5 3.5 0 0 1-7 0l2.9-6.8L11 5.1zM6 9.4 4.4 13h3.2zm12 0L16.4 13h3.2z"/></svg>',
    };

    // README section heading → how the group is shown on the site.
    const GROUPS = {
        "The Articles": {
            key: "constitution", label: "The Constitution", color: "var(--q-blue)", icon: "scroll",
            blurb: "The Preamble and ten Articles: rights, custody and justice, elections, the three branches, citizenship, ratification, amendment, and arms.",
        },
        "Bills": {
            key: "bills", label: "Bills", color: "var(--q-red)", icon: "columns",
            blurb: "Ordinary laws drafted under the Constitution to test how its rules work in practice.",
        },
        "Education": {
            key: "education", label: "Education", color: "var(--q-green)", icon: "book",
            blurb: "Education acts modeled on Singapore's system, carrying out the right to education in Article I, Section 2.",
        },
        "Economy": {
            key: "economy", label: "Economy", color: "var(--q-purple)", icon: "scales",
            blurb: "Economic acts drawing on the strongest policies of the Nordic countries.",
        },
    };

    const $ = (sel) => document.querySelector(sel);
    const content = $("#content");
    const outline = $("#outline");
    const libraryList = $("#library-list");
    const preview = $("#cite-preview");
    const searchInput = $("#search-input");
    const searchResults = $("#search-results");

    let readme = "";
    let groups = [];
    let docs = [];
    let docsById = new Map();
    let docsByCode = new Map();
    let current = null;
    const texts = new Map();

    // ---------- Utilities ----------

    const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

    const romanOf = (doc) => {
        const m = doc && doc.path.match(/article_(\d+)\.md$/);
        return m ? ROMAN[Number(m[1]) - 1] : null;
    };

    const articleFor = (roman) => docsById.get(`article_${ROMAN.indexOf(roman) + 1}`);

    const route = (doc, anchor) => `#/${doc.id}${anchor ? "/" + anchor : ""}`;

    const plain = (md) => md
        .replace(/^\s*(-{3,}|\*{3,})\s*$/gm, "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_`#>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

    function load(path) {
        if (!texts.has(path)) {
            texts.set(path, fetch(path).then((r) => {
                if (!r.ok) throw new Error(`${path}: ${r.status}`);
                return r.text();
            }));
            texts.get(path).catch(() => texts.delete(path));
        }
        return texts.get(path);
    }

    /*
     * The id for a heading. Article sections and subsections get their
     * citation (I.4, I.4.c) so citations link straight to them; other
     * headings get a slug. Shared by the renderer and the search index so
     * both agree.
     */
    function headingId(doc, level, text, used) {
        const roman = romanOf(doc);
        if (roman) {
            const sec = level === 2 && text.match(/^Section (\d+)\b/);
            if (sec) return `${roman}.${sec[1]}`;
            const sub = level === 3 && text.match(new RegExp(`^(${R}\\.\\d+\\.[a-z]+)\\b`));
            if (sub) return sub[1];
        }
        let id = slug(text);
        const n = used.get(id) || 0;
        used.set(id, n + 1);
        return n ? `${id}-${n + 1}` : id;
    }

    // ---------- The library (from README.md) ----------

    function parseLibrary(md) {
        const out = [];
        let group = null;
        let headers = null;
        const add = (doc) => {
            if (!docs.some((d) => d.path === doc.path)) {
                doc.id = doc.path.replace(/^constitution\//, "").replace(/\.md$/, "");
                doc.group = group;
                group.docs.push(doc);
                docs.push(doc);
            }
        };
        for (const line of md.split("\n")) {
            const h = line.match(/^## (.+?)\s*$/);
            if (h) {
                group = GROUPS[h[1]] ? { ...GROUPS[h[1]], heading: h[1], docs: [] } : null;
                headers = null;
                if (group) out.push(group);
                continue;
            }
            if (!group) continue;
            if (line.startsWith("|")) {
                const cells = line.split("|").slice(1, -1).map((c) => c.trim());
                const link = cells[0].match(/^\[([^\]]+)\]\(([^)\s]+\.md)\)$/);
                if (link) {
                    add({ code: link[1], path: link[2], title: cells[1] || link[1], third: cells[2] || "", thirdLabel: headers ? headers[2] : "" });
                } else if (!/^[-:\s]+$/.test(cells.join(""))) {
                    headers = cells;
                }
            } else {
                for (const m of line.matchAll(/\[([^\]]+)\]\(([^)\s]+\.md)\)/g)) {
                    add({ code: "", path: m[2], title: m[1], third: "", thirdLabel: "" });
                }
            }
        }
        return out;
    }

    const codeLabel = (doc) => (romanOf(doc) ? `Article ${doc.code}` : doc.code);

    function renderLibrary() {
        libraryList.innerHTML = groups.map((g) => `
            <details data-group="${g.key}">
                <summary><span class="swatch" style="background:${g.color}"></span>${escapeHtml(g.label)}</summary>
                <ul>${g.docs.map((d) => `
                    <li><a href="${route(d)}" data-doc="${d.id}">
                        ${d.code ? `<span class="doc-code">${escapeHtml(d.code)}</span>` : ""}
                        <span>${escapeHtml(d.title)}</span>
                    </a></li>`).join("")}
                </ul>
            </details>`).join("");
    }

    function markLibrary() {
        for (const a of libraryList.querySelectorAll("a[data-doc]")) {
            if (current && a.dataset.doc === current.id) {
                a.setAttribute("aria-current", "page");
            } else {
                a.removeAttribute("aria-current");
            }
        }
    }

    // ---------- Citations ----------

    const CITE_RE = new RegExp(
        `(Article (${R}), Sections? (\\d+)(?: and (\\d+))?)` +
        `|(?<![\\w.])(${R}\\.\\d+\\.[a-z])(?![a-z])` +
        `|(?<![\\w.])(${R}\\.\\d+)(?![.\\d]?\\w)` +
        `|\\bArticle (${R})\\b` +
        `|\\b([ben]-\\d{2})\\b`,
        "g",
    );

    function citeLink(text, ref) {
        const a = document.createElement("a");
        a.className = "cite";
        a.textContent = text;
        a.dataset.ref = ref;
        const target = resolveRef(ref);
        a.href = target ? route(target.doc, target.anchor) : "#/";
        return a;
    }

    // A citation → { doc, anchor }.
    function resolveRef(ref) {
        const code = docsByCode.get(ref);
        if (code) return { doc: code, anchor: null };
        const m = ref.match(new RegExp(`^(${R})(?:\\.(\\d+)(?:\\.([a-z]+))?)?$`));
        if (!m) return null;
        const doc = articleFor(m[1]);
        if (!doc) return null;
        return { doc, anchor: m[2] ? ref : null };
    }

    function linkCitations(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => node.parentElement.closest("a, code, pre, h1, h2, h3, h4, .cite-label, .doc-kicker")
                ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        for (const node of nodes) {
            const text = node.nodeValue;
            CITE_RE.lastIndex = 0;
            if (!CITE_RE.test(text)) continue;
            CITE_RE.lastIndex = 0;
            const frag = document.createDocumentFragment();
            let last = 0;
            for (const m of text.matchAll(CITE_RE)) {
                const [whole, prose, pRoman, pN1, pN2, sub, sec, art, code] = m;
                if (code && !docsByCode.has(code)) continue;
                frag.append(text.slice(last, m.index));
                if (prose) {
                    const cut = pN2 ? whole.lastIndexOf(" and ") : whole.length;
                    frag.append(citeLink(whole.slice(0, cut), `${pRoman}.${pN1}`));
                    if (pN2) frag.append(" and ", citeLink(pN2, `${pRoman}.${pN2}`));
                } else {
                    frag.append(citeLink(whole, sub || sec || art || code));
                }
                last = m.index + whole.length;
            }
            frag.append(text.slice(last));
            node.replaceWith(frag);
        }
    }

    // The Markdown for one provision, for the hover preview.
    async function previewMarkdown(ref) {
        const target = resolveRef(ref);
        if (!target) return null;
        const { doc } = target;
        if (!romanOf(doc) || !target.anchor) {
            const lines = [`#### ${codeLabel(doc)} — ${doc.title}`];
            if (romanOf(doc)) {
                const text = await load(doc.path);
                for (const m of text.matchAll(/^## (Section \d+ — .+)$/gm)) lines.push(`* ${m[1]}`);
            } else if (doc.third) {
                lines.push(doc.thirdLabel === "Status" ? `Status: ${doc.third}` : doc.third);
            }
            return { doc, md: lines.join("\n\n") };
        }
        const lines = (await load(doc.path)).split("\n");
        const isSection = ref.split(".").length === 2;
        const start = lines.findIndex((l) => isSection
            ? l.startsWith(`## Section ${ref.split(".")[1]} `)
            : l.startsWith(`### ${ref} `));
        if (start < 0) return { doc, md: `*${ref} was not found in ${codeLabel(doc)}.*` };
        const out = [lines[start].replace(/^#+/, "####")];
        for (let i = start + 1; i < lines.length; i++) {
            const l = lines[i];
            if (/^## /.test(l) || (!isSection && /^### /.test(l)) || /^---\s*$/.test(l)) break;
            if (isSection) {
                if (/^### /.test(l)) out.push(`* ${l.replace(/^### /, "")}`);
            } else {
                out.push(l);
            }
            if (out.join("\n").length > 1400) break;
        }
        return { doc, md: out.join("\n") };
    }

    let previewTimer = null;
    let previewFor = null;

    function placePreview(anchor) {
        const r = anchor.getBoundingClientRect();
        const w = preview.offsetWidth;
        const h = preview.offsetHeight;
        let left = Math.min(Math.max(16, r.left), window.innerWidth - w - 16);
        let top = r.bottom + 8;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
    }

    async function showPreview(anchor) {
        previewFor = anchor;
        let result;
        try {
            result = await previewMarkdown(anchor.dataset.ref);
        } catch (e) {
            return;
        }
        if (previewFor !== anchor || !result) return;
        preview.innerHTML = `<div class="preview-doc">${escapeHtml(codeLabel(result.doc))}</div>${marked.parse(result.md)}`;
        preview.hidden = false;
        placePreview(anchor);
    }

    function hidePreview() {
        clearTimeout(previewTimer);
        previewFor = null;
        preview.hidden = true;
    }

    const canHover = window.matchMedia("(hover: hover)").matches;
    document.addEventListener("pointerover", (e) => {
        const a = e.target.closest && e.target.closest("a.cite");
        if (!a || !canHover) return;
        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => showPreview(a), 220);
    });
    document.addEventListener("pointerout", (e) => {
        const a = e.target.closest && e.target.closest("a.cite");
        if (a && !a.contains(e.relatedTarget)) hidePreview();
    });
    document.addEventListener("focusin", (e) => {
        if (e.target.matches("a.cite")) showPreview(e.target);
    });
    document.addEventListener("focusout", (e) => {
        if (e.target.matches("a.cite")) hidePreview();
    });
    window.addEventListener("scroll", hidePreview, { passive: true });

    // A link to the address already shown fires no hashchange; scroll anyway.
    document.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest('a[href^="#/"]');
        if (a && a.getAttribute("href") === location.hash) {
            e.preventDefault();
            navigate();
        }
    });

    // ---------- Rendering ----------

    function resolveLinks(root, doc) {
        const base = new URL(doc.path, location.href);
        for (const a of root.querySelectorAll("a[href]")) {
            const href = a.getAttribute("href");
            if (/^(#|[a-z]+:)/i.test(href)) continue;
            const url = new URL(href, base);
            const rel = url.pathname.slice(new URL(".", location.href).pathname.length);
            const target = docs.find((d) => d.path === rel);
            if (target) {
                a.href = route(target, url.hash.slice(1));
            } else {
                a.href = `${REPO}/blob/main/${rel.replace(/\/$/, "") || ""}`;
                a.target = "_blank";
                a.rel = "noopener";
            }
        }
        for (const img of root.querySelectorAll("img[src]")) {
            const src = img.getAttribute("src");
            if (!/^[a-z]+:/i.test(src)) img.src = new URL(src, base).href;
        }
    }

    function decorate(root, doc) {
        const used = new Map();
        for (const h of root.querySelectorAll("h2, h3, h4")) {
            const level = Number(h.tagName[1]);
            const text = h.textContent.trim();
            h.id = headingId(doc, level, text, used);
            const sub = romanOf(doc) && level === 3 && text.match(new RegExp(`^(${R}\\.\\d+\\.[a-z]+) — (.*)$`));
            if (sub) h.innerHTML = `<span class="cite-label">${sub[1]}</span>${escapeHtml(sub[2])}`;
            const link = document.createElement("a");
            link.className = "anchor-link";
            link.href = route(doc, h.id);
            link.setAttribute("aria-label", `Link to ${text}`);
            link.textContent = "#";
            h.prepend(link);
        }
        for (const table of root.querySelectorAll("table")) {
            const wrap = document.createElement("div");
            wrap.className = "table-wrap";
            table.replaceWith(wrap);
            wrap.append(table);
        }
        resolveLinks(root, doc);
        linkCitations(root);
    }

    function renderOutline(article) {
        const heads = [...article.querySelectorAll("h2, h3")];
        if (heads.length < 2) {
            outline.innerHTML = "";
            return;
        }
        const many = article.querySelectorAll("h3").length > 14;
        let html = "<h2>On this page</h2><ul>";
        let open = false;
        for (const h of heads) {
            const label = escapeHtml([...h.childNodes]
                .filter((n) => !(n.classList && n.classList.contains("anchor-link")))
                .map((n) => n.textContent.trim()).join(" "));
            const item = `<a href="${route(current, h.id)}" data-target="${escapeHtml(h.id)}">${label}</a>`;
            if (h.tagName === "H2") {
                if (open) html += "</ul></li>";
                html += `<li class="${many ? "collapsed" : ""}">${item}<ul>`;
                open = true;
            } else {
                html += `<li>${item}</li>`;
            }
        }
        if (open) html += "</ul></li>";
        html += "</ul>";
        outline.innerHTML = html;
        updateOutline();
    }

    function updateOutline() {
        const article = content.querySelector(".doc");
        if (!article || !outline.firstChild) return;
        const offset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) + 10;
        let active = null;
        for (const h of article.querySelectorAll("h2, h3")) {
            if (h.getBoundingClientRect().top - offset <= 0) active = h;
            else break;
        }
        for (const a of outline.querySelectorAll("a")) {
            const on = active && a.dataset.target === active.id;
            a.classList.toggle("active", on);
        }
        for (const li of outline.querySelectorAll(":scope > ul > li")) {
            const holds = active && li.querySelector(`a[data-target="${CSS.escape(active.id)}"]`);
            if (li.classList.contains("collapsed") || li.dataset.expanded) {
                li.classList.toggle("collapsed", !holds);
                li.dataset.expanded = holds ? "1" : "";
            }
        }
    }

    let outlineFrame = 0;
    window.addEventListener("scroll", () => {
        if (!outlineFrame) outlineFrame = requestAnimationFrame(() => {
            outlineFrame = 0;
            updateOutline();
        });
    }, { passive: true });

    async function renderDoc(doc) {
        content.innerHTML = '<p class="loading">Loading…</p>';
        outline.innerHTML = "";
        const text = await load(doc.path);
        const index = docs.indexOf(doc);
        const prev = docs[index - 1];
        const next = docs[index + 1];
        const words = text.split(/\s+/).length;
        const lede = doc.third && doc.thirdLabel !== "Status" ? doc.third : "";

        const article = document.createElement("article");
        article.className = "doc";
        article.innerHTML = marked.parse(text);

        const h1 = article.querySelector("h1");
        const head = document.createElement("div");
        head.innerHTML = `
            <p class="doc-kicker"><span class="swatch" style="background:${doc.group.color}"></span>${escapeHtml(doc.group.label)}${doc.code ? ` · ${escapeHtml(codeLabel(doc))}` : ""}</p>`;
        const meta = document.createElement("div");
        meta.className = "doc-meta";
        meta.innerHTML = `
            ${doc.thirdLabel === "Status" ? `<span>Status: ${escapeHtml(doc.third)}</span>` : ""}
            <span>About ${Math.max(1, Math.round(words / 230))} min read</span>
            <a href="${REPO}/blob/main/${doc.path}" target="_blank" rel="noopener">View source</a>
            <a href="${REPO}/commits/main/${doc.path}" target="_blank" rel="noopener">Revision history</a>`;
        if (h1) {
            h1.before(head.firstElementChild);
            h1.after(meta);
            if (lede) {
                const p = document.createElement("p");
                p.innerHTML = `<em>${escapeHtml(lede)}</em>`;
                meta.before(p);
            }
        } else {
            article.prepend(head.firstElementChild, meta);
        }

        decorate(article, doc);

        const pager = document.createElement("nav");
        pager.className = "pager";
        pager.setAttribute("aria-label", "Previous and next documents");
        pager.innerHTML = `
            ${prev ? `<a class="prev" href="${route(prev)}"><small>Previous</small>${escapeHtml(prev.code ? codeLabel(prev) + " · " : "")}${escapeHtml(prev.title)}</a>` : ""}
            ${next ? `<a class="next" href="${route(next)}"><small>Next</small>${escapeHtml(next.code ? codeLabel(next) + " · " : "")}${escapeHtml(next.title)}</a>` : ""}`;
        article.append(pager);

        content.replaceChildren(article);
        renderOutline(article);
        document.title = `${doc.code ? codeLabel(doc) + ": " : ""}${doc.title} — Concordia`;
    }

    async function renderHome() {
        outline.innerHTML = "";
        document.title = "Constitution of Concordia";
        const preamble = docs.find((d) => /preamble\.md$/.test(d.path));
        const first = docs[0];
        const constitution = groups.find((g) => g.key === "constitution");
        const article1 = constitution && constitution.docs.find((d) => romanOf(d) === "I");

        let preambleHtml = "";
        if (preamble) {
            const md = await load(preamble.path);
            preambleHtml = marked.parse(md.replace(/^# .*\n/, ""));
        }
        const features = readme.match(/## Key Features\n([\s\S]*?)(?=\n## )/);

        content.innerHTML = `
            <div class="home-page">
                <section class="hero">
                    <div>
                        <p class="hero-kicker">A fictional nation · Draft in progress</p>
                        <h1>The Constitution of Concordia</h1>
                        <p class="hero-lede">The founding document of an imagined republic, written as worldbuilding. Read the ten Articles, the bills drafted under them, and the acts on education and the economy. Every citation links to the provision it names.</p>
                        <div class="hero-actions">
                            ${first ? `<a class="button primary" href="${route(first)}">Start reading</a>` : ""}
                            ${article1 ? `<a class="button" href="${route(article1)}">Article I: Rights</a>` : ""}
                        </div>
                    </div>
                    <div class="hero-flag"><img src="constitution/1c39deb5-4efc-4ec9-a588-920318794957.png" alt="The flag of Concordia: a navy field crossed by a gold-and-white band, with a white disc holding four colored quarters" width="1536" height="1024"></div>
                </section>

                ${preambleHtml ? `<section class="preamble"><h2>Preamble</h2>${preambleHtml}</section>` : ""}

                <h2 class="section-title">The Library</h2>
                <div class="quadrants">
                    ${groups.map((g) => `
                        <section class="quadrant" style="--accent:${g.color}">
                            <div class="quadrant-head">
                                <span class="quadrant-icon">${ICONS[g.icon]}</span>
                                <div><h3>${escapeHtml(g.label)}</h3><span class="quadrant-count">${g.docs.length} documents</span></div>
                            </div>
                            <p>${escapeHtml(g.blurb)}</p>
                            <ul>${g.docs.map((d) => `<li><a href="${route(d)}">${d.code ? `<span class="doc-code">${escapeHtml(d.code)}</span>` : ""}${escapeHtml(d.title)}</a></li>`).join("")}</ul>
                        </section>`).join("")}
                </div>

                ${features ? `<h2 class="section-title">Key Features</h2><div class="features-wrap">${marked.parse(features[1])}</div>` : ""}
            </div>`;

        const list = content.querySelector(".features-wrap ul");
        if (list) list.className = "features";
        linkCitations(content.querySelector(".features-wrap") || document.createElement("div"));
        linkCitations(content.querySelector(".preamble") || document.createElement("div"));
    }

    function scrollToAnchor(anchor) {
        const el = anchor && document.getElementById(anchor);
        if (!el) {
            window.scrollTo(0, 0);
            return;
        }
        el.scrollIntoView();
        el.classList.remove("flash");
        void el.offsetWidth;
        el.classList.add("flash");
    }

    function parseHash() {
        const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
        if (!raw) return { doc: null, anchor: null };
        // A bare citation such as #/I.4.c or #/b-05.
        const cite = resolveRef(raw);
        if (cite) return cite;
        const doc = [...docs].sort((a, b) => b.id.length - a.id.length)
            .find((d) => raw === d.id || raw.startsWith(d.id + "/"));
        if (!doc) return { doc: undefined, anchor: null };
        return { doc, anchor: raw.slice(doc.id.length + 1) || null };
    }

    async function navigate() {
        hidePreview();
        closeLibrary();
        const { doc, anchor } = parseHash();
        try {
            if (doc === undefined) {
                current = null;
                document.body.classList.add("home");
                outline.innerHTML = "";
                content.innerHTML = `<div class="doc"><h1>Not found</h1><p>There is no document at this address. <a href="#/">Return to the library.</a></p></div>`;
            } else if (doc === null) {
                current = null;
                document.body.classList.add("home");
                await renderHome();
                window.scrollTo(0, 0);
            } else {
                document.body.classList.remove("home");
                if (current !== doc || !content.querySelector(".doc")) {
                    current = doc;
                    await renderDoc(doc);
                    content.focus({ preventScroll: true });
                }
                scrollToAnchor(anchor);
                updateOutline();
            }
        } catch (e) {
            showLoadError(e);
        }
        markLibrary();
    }

    function showLoadError(e) {
        content.innerHTML = `
            <div class="error">
                <p><strong>This document could not be loaded.</strong></p>
                <p>${location.protocol === "file:"
                    ? "Browsers block loading files from a page opened directly from disk. From the repository folder, run <code>python3 -m http.server</code> and open <code>http://localhost:8000</code>."
                    : escapeHtml(String(e.message || e))}</p>
            </div>`;
    }

    // ---------- Search ----------

    let index = null;

    function buildIndex() {
        if (!index) {
            index = Promise.all(docs.map(async (doc) => {
                const lines = (await load(doc.path)).split("\n");
                const used = new Map();
                const entries = [];
                let entry = { doc, anchor: null, heading: doc.title, body: [] };
                let fence = false;
                for (const line of lines) {
                    if (/^```/.test(line)) fence = !fence;
                    const h = !fence && line.match(/^(#{1,4}) (.+)$/);
                    if (h) {
                        entries.push(entry);
                        const level = h[1].length;
                        const text = plain(h[2]);
                        entry = {
                            doc,
                            anchor: level === 1 ? null : headingId(doc, level, text, used),
                            heading: level === 1 ? doc.title : text,
                            body: [],
                        };
                    } else if (!/^\s*-{3,}\s*$/.test(line)) {
                        entry.body.push(line);
                    }
                }
                entries.push(entry);
                return entries.map((e) => {
                    const body = plain(e.body.join(" "));
                    return { ...e, body, haystack: `${e.heading} ${body}`.toLowerCase(), headLower: e.heading.toLowerCase() };
                }).filter((e) => e.body || e.anchor);
            })).then((all) => all.flat());
        }
        return index;
    }

    function highlight(text, terms) {
        let html = escapeHtml(text);
        for (const t of terms) {
            if (t.length < 2) continue;
            html = html.replace(new RegExp(`(${escapeHtml(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
        }
        return html;
    }

    function snippet(body, terms) {
        const lower = body.toLowerCase();
        let at = -1;
        for (const t of terms) {
            const i = lower.indexOf(t);
            if (i >= 0 && (at < 0 || i < at)) at = i;
        }
        const start = Math.max(0, at - 50);
        let s = body.slice(start, start + 170);
        if (start > 0) s = "…" + s.replace(/^\S*\s/, "");
        if (start + 170 < body.length) s = s.replace(/\s\S*$/, "") + "…";
        return s;
    }

    let results = [];
    let selected = -1;

    async function runSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.hidden = true;
            return;
        }
        const entries = await buildIndex();
        if (searchInput.value.trim() !== query) return;

        const direct = query.match(new RegExp(`^(${R.toLowerCase()}|${R})(\\.\\d+(?:\\.[a-z]+)?)?$`, "i"))
            ? query.replace(/^[ivx]+/i, (r) => r.toUpperCase()).replace(/\.([A-Z]+)$/, (m, s) => "." + s.toLowerCase())
            : null;
        const directTarget = direct && resolveRef(direct) || resolveRef(query.toLowerCase());

        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const phrase = query.toLowerCase();
        const scored = [];
        for (const e of entries) {
            if (!terms.every((t) => e.haystack.includes(t))) continue;
            let score = 0;
            for (const t of terms) if (e.headLower.includes(t)) score += 10;
            if (e.haystack.includes(phrase)) score += 6;
            if (e.headLower.includes(phrase)) score += 12;
            if (!e.anchor) score += 3;
            scored.push({ e, score });
        }
        scored.sort((a, b) => b.score - a.score);

        results = [];
        if (directTarget) {
            const anchor = directTarget.anchor;
            const hit = entries.find((e) => e.doc === directTarget.doc && e.anchor === anchor);
            results.push({
                href: route(directTarget.doc, anchor),
                title: hit ? hit.heading : directTarget.doc.title,
                doc: `Go to · ${codeLabel(directTarget.doc)}`,
                snippet: hit ? escapeHtml(snippet(hit.body, [])) : "",
            });
        }
        for (const { e } of scored.slice(0, 40)) {
            results.push({
                href: route(e.doc, e.anchor),
                title: highlight(e.heading, terms),
                doc: `${escapeHtml(e.doc.group.label)}${e.doc.code ? " · " + escapeHtml(codeLabel(e.doc)) : ""}`,
                snippet: highlight(snippet(e.body, terms), terms),
                html: true,
            });
        }

        selected = results.length ? 0 : -1;
        searchResults.innerHTML = results.length
            ? results.map((r, i) => `
                <a class="search-result" role="option" id="result-${i}" href="${r.href}" aria-selected="${i === selected}">
                    <div class="search-result-doc">${r.doc}</div>
                    <div class="search-result-title">${r.html ? r.title : escapeHtml(r.title)}</div>
                    ${r.snippet ? `<div class="search-result-snippet">${r.snippet}</div>` : ""}
                </a>`).join("")
            : `<div class="search-empty">Nothing matches “${escapeHtml(query)}”.</div>`;
        searchResults.hidden = false;
    }

    function select(i) {
        const items = searchResults.querySelectorAll(".search-result");
        if (!items.length) return;
        selected = (i + items.length) % items.length;
        items.forEach((el, n) => el.setAttribute("aria-selected", n === selected));
        items[selected].scrollIntoView({ block: "nearest" });
    }

    function closeSearch() {
        searchResults.hidden = true;
    }

    let searchTimer = null;
    searchInput.addEventListener("focus", () => {
        buildIndex();
        if (searchInput.value.trim()) runSearch();
    });
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(runSearch, 110);
    });
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); select(selected + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); select(selected - 1); }
        else if (e.key === "Enter") {
            const item = searchResults.querySelectorAll(".search-result")[selected];
            if (item) { e.preventDefault(); location.hash = item.getAttribute("href"); closeSearch(); searchInput.blur(); }
        } else if (e.key === "Escape") { closeSearch(); searchInput.blur(); }
    });
    searchResults.addEventListener("click", (e) => {
        if (e.target.closest(".search-result")) { closeSearch(); searchInput.blur(); }
    });
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search")) closeSearch();
    });
    document.addEventListener("keydown", (e) => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        if ((e.key === "/" && !typing) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        } else if (e.key === "Escape") {
            closeLibrary();
            hidePreview();
        }
    });

    // ---------- Library drawer and theme ----------

    const menuButton = $("#menu-button");
    const scrim = $("#scrim");

    function closeLibrary() {
        document.body.classList.remove("library-open");
        menuButton.setAttribute("aria-expanded", "false");
        scrim.hidden = true;
    }

    menuButton.addEventListener("click", () => {
        const open = !document.body.classList.contains("library-open");
        document.body.classList.toggle("library-open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        scrim.hidden = !open;
    });
    scrim.addEventListener("click", closeLibrary);

    $("#theme-button").addEventListener("click", () => {
        const root = document.documentElement;
        const dark = root.dataset.theme
            ? root.dataset.theme === "dark"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.dataset.theme = dark ? "light" : "dark";
        try { localStorage.setItem("concordia-theme", root.dataset.theme); } catch (e) {}
    });

    // ---------- Start ----------

    async function start() {
        try {
            readme = await load("README.md");
        } catch (e) {
            showLoadError(e);
            return;
        }
        groups = parseLibrary(readme);
        docsById = new Map(docs.map((d) => [d.id, d]));
        docsByCode = new Map(docs.filter((d) => /^[ben]-\d+$/.test(d.code)).map((d) => [d.code, d]));
        renderLibrary();
        window.addEventListener("hashchange", navigate);
        navigate();
    }

    start();
})();
