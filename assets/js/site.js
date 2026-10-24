(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const setNav = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  };

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    setNav(!nav.classList.contains("is-open"));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNav(false);
      document.querySelector("[data-lightbox]")?.close();
    }
  });

  const links = [...document.querySelectorAll("[data-nav] a[href^='#']")];
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => link.classList.remove("is-active"));
          sections
            .find((item) => item.section === entry.target)
            ?.link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );
    sections.forEach(({ section }) => observer.observe(section));
  }

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-kind]")];
  const count = document.querySelector("[data-count]");

  const applyFilter = (filter) => {
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.kind === filter;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (count) {
      const noun = visible === 1 ? "project" : "projects";
      count.textContent = `${String(visible).padStart(2, "0")} ${noun}`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      applyFilter(button.dataset.filter);
    });
  });

  if (filterButtons.length) applyFilter("all");

  const ensureLightbox = () => {
    let dialog = document.querySelector("[data-lightbox]");
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.dataset.lightbox = "";
    dialog.innerHTML =
      '<button type="button" class="lightbox-close" data-close>Close</button><img alt="">';
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-close]")) {
        dialog.close();
      }
    });
    document.body.appendChild(dialog);
    return dialog;
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-zoom]");
    if (!trigger) return;
    const image = trigger.querySelector("img");
    const dialog = ensureLightbox();
    const preview = dialog.querySelector("img");
    preview.src = trigger.dataset.zoom || image?.currentSrc || image?.src || "";
    preview.alt = image?.alt || "";
    dialog.showModal();
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const contactForm = document.querySelector("#contact-form");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const address = contactForm.dataset.email || "rhymezx.code@gmail.com";
    const mailto = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    const note = contactForm.querySelector(".form-note");
    if (note) {
      note.textContent = "Your email app should open with this message addressed to me.";
    }
  });
})();
