/* ==========================================================================
   main.js — 主题切换 / 打字机 / 滚动交互 / 揭示动画 / 文章目录
   无任何第三方依赖
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. 主题（localStorage 记忆，默认跟随参考站点的深色） ---------- */
  const KEY = "zjw-theme";
  const root = document.documentElement;

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) { /* 隐私模式忽略 */ }
  }

  (function initTheme() {
    // 支持分享指定主题的链接：?theme=dark / ?theme=light
    const param = new URLSearchParams(location.search).get("theme");
    if (param === "dark" || param === "light") {
      root.setAttribute("data-theme", param);
      return;
    }
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* noop */ }
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      root.setAttribute("data-theme", "light");
    }
  })();

  const themeBtn = $("#themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 2. 打字机 ---------- */
  const roleEl = $("#roleText");
  if (roleEl) {
    const lines = [
      "Software Test Engineer",
      "功能测试 · 接口测试 · 数据库验证",
      "Python + Selenium + pytest",
      "把重复的点击，交给脚本"
    ];
    let li = 0, ci = 0, deleting = false;

    (function tick() {
      const text = lines[li];
      ci += deleting ? -1 : 1;
      roleEl.textContent = text.slice(0, ci);

      let delay = deleting ? 40 : 85;
      if (!deleting && ci === text.length) { delay = 1600; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; li = (li + 1) % lines.length; delay = 320; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- 3. 导航：滚动阴影 + 移动端菜单 + 当前区块高亮 ---------- */
  const nav = $("#nav");
  const navLinks = $("#navLinks");
  const navToggle = $("#navToggle");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    $$("a", navLinks).forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // 首页锚点高亮
  const sectionIds = ["about", "skills", "projects", "posts", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && navLinks) {
    const linkMap = new Map();
    $$("a", navLinks).forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) linkMap.set(href.slice(1), a);
    });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          linkMap.forEach((a) => a.classList.remove("active"));
          const a = linkMap.get(en.target.id);
          if (a) a.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 4. 滚动揭示 ---------- */
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en, i) => {
            if (en.isIntersecting) {
              setTimeout(() => en.target.classList.add("in"), i * 70);
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- 5. 文章页：阅读进度 + 目录高亮 ---------- */
  const progress = $("#progress");
  if (progress) {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  const tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length) {
    const heads = tocLinks
      .map((a) => ({ a, el: document.getElementById(a.getAttribute("href").slice(1)) }))
      .filter((x) => x.el);

    const mark = () => {
      let current = heads[0];
      const y = window.scrollY + 120;
      heads.forEach((h) => { if (h.el.offsetTop <= y) current = h; });
      tocLinks.forEach((a) => a.classList.remove("is-on"));
      if (current) current.a.classList.add("is-on");
    };
    window.addEventListener("scroll", mark, { passive: true });
    mark();
  }

  /* ---------- 6. 博客列表：分类筛选 ---------- */
  const filters = $$(".filter");
  const items = $$("[data-cat]");
  if (filters.length && items.length) {
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        const cat = btn.dataset.filter;
        items.forEach((it) => {
          const show = cat === "all" || it.dataset.cat === cat;
          it.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- 7. 年份 ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
