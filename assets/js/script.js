"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const preloader = document.querySelector("[data-preloader]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileLinks = document.querySelectorAll(".mobile-menu__link");
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const hudLines = document.querySelectorAll(".hud-line");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("is-active");
    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  const toggleMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    const isOpen = mobileMenu.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);
    body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu",
    );
  };

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const hidePreloader = () => {
    if (!preloader) return;

    setTimeout(
      () => {
        preloader.classList.add("is-hidden");
      },
      reduceMotion ? 0 : 280,
    );
  };

  const setupRevealAnimation = () => {
    if (!revealElements.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  };

  const setupSmoothAnchors = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        event.preventDefault();

        closeMobileMenu();

        targetElement.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  };

  const setupActiveNavigation = () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".site-nav__link");

    if (
      !sections.length ||
      !navLinks.length ||
      !("IntersectionObserver" in window)
    )
      return;

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";

            const isSameSection =
              href === `#${currentId}` || href.endsWith(`#${currentId}`);

            link.classList.toggle("is-active", isSameSection);
          });
        });
      },
      {
        threshold: 0.42,
      },
    );

    sections.forEach((section) => {
      activeObserver.observe(section);
    });
  };

  const setupGalleryLightbox = () => {
    const galleryImages = document.querySelectorAll(".gallery-item img");

    if (!galleryImages.length) return;

    const lightbox = document.createElement("div");

    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
      <button
        class="gallery-lightbox__close"
        type="button"
        aria-label="Fechar galeria"
      >
        ✕
      </button>

      <img
        class="gallery-lightbox__image"
        src=""
        alt=""
      >
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".gallery-lightbox__image");

    const closeButton = lightbox.querySelector(".gallery-lightbox__close");

    const openLightbox = (image) => {
      if (!lightboxImage) return;

      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Imagem da galeria";

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");

      body.classList.add("menu-open");

      closeButton?.focus({
        preventScroll: true,
      });
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");

      body.classList.remove("menu-open");

      if (lightboxImage) {
        lightboxImage.src = "";
        lightboxImage.alt = "";
      }
    };

    galleryImages.forEach((image) => {
      image.style.cursor = "zoom-in";

      image.addEventListener("click", () => {
        openLightbox(image);
      });
    });

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  };

  const setupHudMotion = () => {
    if (!hudLines.length || reduceMotion) return;

    window.addEventListener(
      "mousemove",
      (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 8;

        const y = (event.clientY / window.innerHeight - 0.5) * 8;

        hudLines.forEach((line, index) => {
          const depth = (index + 1) * 0.4;

          line.style.transform = `translate3d(${
            x * depth
          }px, ${y * depth}px, 0)`;
        });
      },
      {
        passive: true,
      },
    );
  };

  const setupTechBadges = () => {
    const badges = document.querySelectorAll(
      ".property-card__tag, .eyebrow, .section-kicker",
    );

    badges.forEach((badge) => {
      badge.setAttribute("data-status", "online");
    });
  };

  const setupCurationForm = () => {
    const form = document.querySelector(".curation-card");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const propertiesSection = document.querySelector("#propriedades");

      if (propertiesSection) {
        propertiesSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  };

  const setupStaggerAnimations = () => {
    if (reduceMotion) return;

    const staggerGroups = document.querySelectorAll(
      ".properties__grid, .tech-grid, .engineering-grid, .advisors__grid, .testimonials__grid, .specs-grid, .amenities-grid",
    );

    staggerGroups.forEach((group) => {
      const items = group.querySelectorAll(".reveal-on-scroll");

      items.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
      });
    });
  };

  const setupHeroParallax = () => {
    const heroMedia = document.querySelector(".hero__media img");

    if (!heroMedia || reduceMotion) return;

    window.addEventListener(
      "scroll",
      () => {
        const offset = Math.min(window.scrollY * 0.1, 90);

        heroMedia.style.transform = `translateY(${offset}px) scale(1.04)`;
      },
      {
        passive: true,
      },
    );
  };

  const setupScanlineEffect = () => {
    const cards = document.querySelectorAll(
      ".tech-card, .engineering-card, .property-card, .spec-card, .amenity-card, .feature-item",
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.classList.add("is-scanning");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-scanning");
      });
    });
  };

  const setupPrefetchOnIntent = () => {
    const links = document.querySelectorAll('a[href$=".html"]');

    const prefetched = new Set();

    const prefetch = (href) => {
      if (!href || prefetched.has(href)) return;

      const link = document.createElement("link");

      link.rel = "prefetch";
      link.href = href;

      document.head.appendChild(link);

      prefetched.add(href);
    };

    links.forEach((link) => {
      const href = link.getAttribute("href");

      link.addEventListener("mouseenter", () => prefetch(href), {
        once: true,
      });

      link.addEventListener("focus", () => prefetch(href), {
        once: true,
      });
    });
  };

  menuToggle?.addEventListener("click", toggleMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  window.addEventListener("load", hidePreloader, {
    once: true,
  });

  updateHeader();

  setupRevealAnimation();
  setupSmoothAnchors();
  setupActiveNavigation();
  setupGalleryLightbox();
  setupHudMotion();
  setupTechBadges();
  setupCurationForm();
  setupStaggerAnimations();
  setupHeroParallax();
  setupScanlineEffect();
  setupPrefetchOnIntent();
});
