(() => {
    if (!window.LANDINGEN_STATIC_SITE) {
        return;
    }

    const dataRoot = window.LANDINGEN_STATIC_DATA_ROOT || "LandingEn/Data/";
    let baseInfo = {};

    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const tokenValue = (path, fallback = "") =>
        path.split(".").reduce((value, key) => value?.[key], baseInfo) || fallback;

    const applyTokens = (value) => {
        if (typeof value === "string") {
            return value
                .replaceAll("{brandName}", tokenValue("brandName"))
                .replaceAll("{category}", tokenValue("category"))
                .replaceAll("{phoneNumber}", tokenValue("phoneNumber"))
                .replaceAll("{phoneDisplay}", tokenValue("phoneDisplay"))
                .replaceAll("{email}", tokenValue("email"))
                .replaceAll("{homeUrl}", "")
                .replaceAll("{coursesUrl}", "#courses")
                .replaceAll("{websiteUrl}", tokenValue("urls.website"))
                .replaceAll("{zaloUrl}", tokenValue("urls.zalo"))
                .replaceAll("{messengerUrl}", tokenValue("urls.messenger"))
                .replaceAll("{facebookUrl}", tokenValue("urls.facebook"));
        }

        if (Array.isArray(value)) {
            return value.map(applyTokens);
        }

        if (value && typeof value === "object") {
            return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, applyTokens(item)]));
        }

        return value;
    };

    const staticHref = (href) => {
        const value = String(href || "");
        if (value === "/") {
            return "./";
        }

        if (value.startsWith("/#")) {
            return value.slice(1);
        }

        if (value === "/Home/Courses") {
            return "#courses";
        }

        return value;
    };

    const fetchJson = async (fileName) => {
        const response = await fetch(`${dataRoot}${fileName}`, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Cannot load ${fileName}`);
        }

        return response.json();
    };

    const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value || "";
        }
    };

    const setAttr = (selector, name, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute(name, value || "");
        }
    };

    const renderNav = (layout) => {
        const links = document.querySelector(".nav-links");
        if (links && Array.isArray(layout.navigation?.links)) {
            links.innerHTML = layout.navigation.links
                .map((link) => `<a href="${escapeHtml(staticHref(link.href))}">${escapeHtml(link.text)}</a>`)
                .join("");
        }

        const cta = document.querySelector(".nav-cta");
        if (cta && layout.navigation?.cta) {
            cta.textContent = layout.navigation.cta.text || "";
            cta.href = staticHref(layout.navigation.cta.href);
        }
    };

    const renderHero = (home) => {
        setText(".hero .eyebrow", home.hero?.eyebrow);
        setText(".hero h1", home.hero?.heading);
        setText(".hero__lead", home.hero?.lead);
        setAttr(".hero__media", "style", `background-image: url('${home.hero?.backgroundImageUrl || ""}')`);

        const primary = document.querySelector(".hero__actions .btn-primary");
        if (primary) {
            primary.textContent = home.hero?.primaryActionText || "";
            primary.href = staticHref(home.hero?.primaryActionHref);
        }

        const secondary = document.querySelector(".hero__actions .btn-secondary");
        if (secondary) {
            secondary.textContent = home.hero?.secondaryActionText || "";
            secondary.href = staticHref(home.hero?.secondaryActionHref);
        }
    };

    const renderIntro = (home) => {
        setText(".intro .eyebrow", home.intro?.eyebrow);
        setText(".intro h2", home.intro?.heading);
        setAttr(".intro__image img", "src", home.intro?.imageUrl);
        setAttr(".intro__image img", "alt", home.intro?.imageAlt);

        const copy = document.querySelector(".intro__copy");
        const link = copy?.querySelector(".text-link");
        copy?.querySelectorAll("p:not(.eyebrow)").forEach((item) => item.remove());
        (home.intro?.paragraphs || []).forEach((paragraph) => {
            const element = document.createElement("p");
            element.textContent = paragraph;
            copy?.insertBefore(element, link || null);
        });

        if (link) {
            link.textContent = home.intro?.linkText || "";
            link.href = staticHref(home.intro?.linkHref);
        }
    };

    const renderStats = (home) => {
        const stats = document.querySelector(".stats-grid");
        if (!stats || !Array.isArray(home.stats)) {
            return;
        }

        stats.innerHTML = home.stats
            .map((stat) => `<div><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`)
            .join("");
    };

    const renderWhy = (home) => {
        setText(".why .eyebrow", home.why?.eyebrow);
        setText(".why h2", home.why?.heading);

        const grid = document.querySelector(".why-grid");
        if (!grid || !Array.isArray(home.why?.items)) {
            return;
        }

        grid.innerHTML = home.why.items.map((item) => `
                <article>
                    <span class="feature-icon">${escapeHtml(item.number)}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                </article>
            `).join("");
    };

    const renderCourses = (courses) => {
        const courseList = document.querySelector("[data-course-list]");
        if (!courseList || !Array.isArray(courses)) {
            return;
        }

        courseList.innerHTML = courses.map((course) => `
                <article class="course-list__card"
                         data-course-card
                         data-title="${escapeHtml(course.title)}"
                         data-type="${escapeHtml(course.type)}"
                         data-price="${escapeHtml(course.price)}"
                         data-course-video="${escapeHtml(course.videoUrl)}"
                         data-course-detail="${escapeHtml(course.detailDescription)}"
                         data-course-audience="${escapeHtml(course.audience)}"
                         data-course-schedule="${escapeHtml(course.schedule)}"
                         data-course-roadmap="${escapeHtml(course.roadmap)}">
                    <img src="${escapeHtml(course.imageUrl)}" alt="${escapeHtml(course.imageAlt)}" />
                    <div class="course-list__body">
                        <h2>${escapeHtml(course.title)}</h2>
                        <p>${escapeHtml(course.summary)}</p>
                        <div class="course-list__meta">
                            <span class="course-list__tag">${escapeHtml(course.tag)}</span>
                            <span>${escapeHtml(course.audience)}</span>
                            <span>${escapeHtml(course.schedule)}</span>
                        </div>
                        <strong>${escapeHtml(course.displayPrice)}</strong>
                        <a data-test-trigger href="#test-popup">Đăng ký tư vấn</a>
                    </div>
                </article>
            `).join("");
    };

    const renderRoadmap = (home) => {
        setText(".roadmap .eyebrow", home.roadmap?.eyebrow);
        setText(".roadmap h2", home.roadmap?.heading);
        setText(".roadmap > .page-shell > div:first-child > p:not(.eyebrow)", home.roadmap?.text);
        setAttr(".roadmap__image img", "src", home.roadmap?.imageUrl);
        setAttr(".roadmap__image img", "alt", home.roadmap?.imageAlt);

        const levels = document.querySelector(".level-list");
        if (!levels || !Array.isArray(home.roadmap?.levels)) {
            return;
        }

        levels.innerHTML = home.roadmap.levels.map((level) => `
                <div>
                    <span>${escapeHtml(level.number)}</span>
                    <strong>${escapeHtml(level.title)}</strong>
                    <p>${escapeHtml(level.text)}</p>
                </div>
            `).join("");
    };

    const renderTeachers = (home) => {
        setText(".teachers .eyebrow", home.teachers?.eyebrow);
        setText(".teachers h2", home.teachers?.heading);
        setText(".teachers .section-heading p:not(.eyebrow)", home.teachers?.text);

        const grid = document.querySelector(".teacher-grid");
        if (!grid || !Array.isArray(home.teachers?.items)) {
            return;
        }

        grid.innerHTML = home.teachers.items.map((teacher) => `
                <article>
                    <img src="${escapeHtml(teacher.imageUrl)}" alt="${escapeHtml(teacher.imageAlt)}" />
                    <h3>${escapeHtml(teacher.title)}</h3>
                </article>
            `).join("");
    };

    const renderMotto = (home) => {
        setText(".motto .eyebrow", home.motto?.eyebrow);
        setText(".motto h2", home.motto?.heading);
        setText(".motto__inner > div > p:not(.eyebrow)", home.motto?.text);
        setText(".motto blockquote p", home.motto?.quote);
        setText(".motto blockquote cite", home.motto?.cite);
    };

    const renderGallery = (home) => {
        setText(".gallery .eyebrow", home.gallery?.eyebrow);
        setText(".gallery h2", home.gallery?.heading);

        const grid = document.querySelector(".gallery-grid");
        if (!grid || !Array.isArray(home.gallery?.items)) {
            return;
        }

        grid.innerHTML = home.gallery.items.map((item) => `
                <figure>
                    <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.imageAlt)}" />
                    <figcaption>${escapeHtml(item.caption)}</figcaption>
                </figure>
            `).join("");
    };

    const renderVideos = (home) => {
        setText(".video-section .eyebrow", home.videos?.eyebrow);
        setText(".video-section h2", home.videos?.heading);
        setText(".video-section .split-layout > div:first-child > p:not(.eyebrow)", home.videos?.text);

        const grid = document.querySelector(".video-grid");
        if (!grid || !Array.isArray(home.videos?.items)) {
            return;
        }

        grid.innerHTML = home.videos.items
            .map((item) => `<article><span>▶</span><p>${escapeHtml(item)}</p></article>`)
            .join("");
    };

    const renderTestimonials = (home) => {
        setText(".testimonials .eyebrow", home.testimonials?.eyebrow);
        setText(".testimonials h2", home.testimonials?.heading);

        const grid = document.querySelector(".testimonial-grid");
        if (!grid || !Array.isArray(home.testimonials?.items)) {
            return;
        }

        grid.innerHTML = home.testimonials.items.map((testimonial) => `
                <article>
                    <div class="stars">${escapeHtml(testimonial.stars)}</div>
                    <p>${escapeHtml(testimonial.text)}</p>
                    <h3>${escapeHtml(testimonial.name)}</h3>
                </article>
            `).join("");
    };

    const renderNews = (home) => {
        setText(".news .eyebrow", home.news?.eyebrow);
        setText(".news h2", home.news?.heading);

        const grid = document.querySelector(".news-grid");
        if (!grid || !Array.isArray(home.news?.items)) {
            return;
        }

        grid.innerHTML = home.news.items.map((item) => `
                <article class="news-card">
                    <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.imageAlt)}" />
                    <div>
                        <span>${escapeHtml(item.date)}</span>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.text)}</p>
                    </div>
                </article>
            `).join("");
    };

    const renderFooter = (home, contact) => {
        const footerLogo = tokenValue("logos.footer.imageUrl") || tokenValue("logos.page.imageUrl");
        const footerLogoAlt = tokenValue("logos.footer.alt") || tokenValue("logos.page.alt");
        setAttr(".footer-logo", "src", footerLogo);
        setAttr(".footer-logo", "alt", footerLogoAlt);
        setText(".site-footer .footer-grid > div:first-child p:first-of-type", home.footer?.description);
        setText(".site-footer .footer-grid > div:first-child p:nth-of-type(2)", `${home.footer?.phoneLabel || ""}: ${tokenValue("phoneDisplay")}`);
        setText(".footer-bottom", home.footer?.copyright);

        const footerGrid = document.querySelector(".footer-grid");
        const brandColumn = footerGrid?.querySelector(":scope > div:first-child")?.outerHTML || "";
        if (!footerGrid) {
            return;
        }

        const linkGroups = (home.footer?.linkGroups || []).map((group) => `
                <div>
                    <h3>${escapeHtml(group.heading)}</h3>
                    ${(group.links || []).map((link) => `<a href="${escapeHtml(staticHref(link.href))}">${escapeHtml(link.text)}</a>`).join("")}
                </div>
            `).join("");
        const addresses = `
                <div>
                    <h3>${escapeHtml(home.footer?.addressesHeading)}</h3>
                    ${(contact.addresses || []).map((address) => `<p>${escapeHtml(address)}</p>`).join("")}
                </div>
            `;

        footerGrid.innerHTML = brandColumn + linkGroups + addresses;
    };

    const renderPopupBase = (contact) => {
        setAttr(".brand img", "src", tokenValue("logos.page.imageUrl"));
        setAttr(".brand img", "alt", tokenValue("logos.page.alt"));
        setText(".brand", "");
        document.querySelector(".brand")?.append(Object.assign(document.createElement("img"), {
            src: tokenValue("logos.page.imageUrl"),
            alt: tokenValue("logos.page.alt")
        }));

        document.querySelectorAll(".quick-chat__item--phone").forEach((link) => link.href = `tel:${tokenValue("phoneNumber")}`);
        document.querySelectorAll(".quick-chat__item--messenger").forEach((link) => link.href = tokenValue("urls.messenger"));
        document.querySelectorAll(".quick-chat__item--facebook").forEach((link) => link.href = tokenValue("urls.facebook"));
        document.querySelectorAll(".quick-chat__item--mail").forEach((link) => link.href = `mailto:${tokenValue("email")}`);
        setText(".quick-chat__item--phone span", contact.phoneLabel);
        setText(".quick-chat__item--messenger span", contact.messengerLabel);
        setText(".quick-chat__item--facebook span", contact.facebookLabel);
        setText(".quick-chat__item--mail span", contact.emailLabel);
    };

    const renderHome = (home, layout, contact) => {
        document.title = `${home.title} - ${baseInfo.brandName || ""}`.trim();
        renderNav(layout);
        renderHero(home);
        renderIntro(home);
        renderStats(home);
        renderWhy(home);
        renderRoadmap(home);
        renderTeachers(home);
        renderMotto(home);
        renderGallery(home);
        renderVideos(home);
        renderTestimonials(home);
        renderNews(home);
        renderFooter(home, contact);
        renderPopupBase(contact);
    };

    window.LANDINGEN_STATIC_DATA_READY = (async () => {
        try {
            const [base, layoutData, homeData, contactData, courseData] = await Promise.all([
                fetchJson("baseInfo.json"),
                fetchJson("layout.json"),
                fetchJson("home.json"),
                fetchJson("contact.json"),
                fetchJson("courses.json")
            ]);

            baseInfo = base || {};
            const layout = applyTokens(layoutData || {});
            const home = applyTokens(homeData || {});
            const contact = applyTokens(contactData || {});

            renderHome(home, layout, contact);
            renderCourses(courseData);
        } catch (error) {
            console.warn("Static JSON data could not be loaded. Using embedded HTML fallback.", error);
        }
    })();
})();
