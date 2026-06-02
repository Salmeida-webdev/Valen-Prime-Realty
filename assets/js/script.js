"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const preloader = document.querySelector("[data-preloader]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileLinks = document.querySelectorAll(".mobile-menu__link");
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

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

    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
    }, 450);
  };

  const setupRevealAnimation = () => {
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
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
        root: null,
        threshold: 0.14,
        rootMargin: "0px 0px -64px 0px",
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
          behavior: "smooth",
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
    ) {
      return;
    }

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
        root: null,
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
      <button class="gallery-lightbox__close" type="button" aria-label="Fechar galeria">
        <img src="assets/icons/icon-close.svg" alt="" width="24" height="24">
      </button>
      <img class="gallery-lightbox__image" src="" alt="">
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
      document.body.classList.add("menu-open");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");

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

    if (closeButton) {
      closeButton.addEventListener("click", closeLightbox);
    }

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

  const setupCurationForm = () => {
    const form = document.querySelector(".curation-card");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const propertiesSection = document.querySelector("#propriedades");

      if (propertiesSection) {
        propertiesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("load", hidePreloader, { once: true });

  updateHeader();
  setupRevealAnimation();
  setupSmoothAnchors();
  setupActiveNavigation();
  setupGalleryLightbox();
  setupCurationForm();

  window.setTimeout(hidePreloader, 1800);
});
