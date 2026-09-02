document.addEventListener("DOMContentLoaded", () => {
    const zaloWidget = document.querySelector("[data-zalo-widget]");
    const quickChat = document.querySelector("[data-quick-chat]");
    const testModal = document.querySelector("[data-test-modal]");
    const courseFilter = document.querySelector("[data-course-filter]");
    const courseCards = document.querySelectorAll("[data-course-card]");
    const courseEmpty = document.querySelector("[data-course-empty]");
    const countrySelects = document.querySelectorAll("[data-country-select]");
    const needSelects = document.querySelectorAll("[data-need-select]");
    let setZaloOpen = () => {};
    let setQuickChatOpen = () => {};

    if (zaloWidget) {
        const trigger = zaloWidget.querySelector(".zalo-widget__trigger");
        const closeButtons = zaloWidget.querySelectorAll("[data-zalo-close]");

        setZaloOpen = (isOpen) => {
            zaloWidget.classList.toggle("is-open", isOpen);
            trigger?.setAttribute("aria-expanded", String(isOpen));
        };

        trigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            setZaloOpen(!zaloWidget.classList.contains("is-open"));
        });

        closeButtons.forEach((closeButton) => {
            closeButton.addEventListener("click", (event) => {
                event.stopPropagation();
                setZaloOpen(false);
            });
        });
    }

    if (quickChat) {
        const trigger = quickChat.querySelector(".quick-chat__trigger");

        setQuickChatOpen = (isOpen) => {
            quickChat.classList.toggle("is-open", isOpen);
            trigger?.setAttribute("aria-expanded", String(isOpen));
        };

        quickChat.addEventListener("mouseenter", () => {
            setQuickChatOpen(true);
        });

        trigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            setQuickChatOpen(!quickChat.classList.contains("is-open"));
        });
    }

    document.addEventListener("click", (event) => {
        if (zaloWidget && !zaloWidget.contains(event.target)) {
            zaloWidget.classList.remove("is-open");
            zaloWidget.querySelector(".zalo-widget__trigger")?.setAttribute("aria-expanded", "false");
        }
    });

    if (courseFilter) {
        const nameInput = courseFilter.querySelector('input[name="courseName"]');
        const typeSelect = courseFilter.querySelector('select[name="courseType"]');
        const minPriceInput = courseFilter.querySelector('input[name="minPrice"]');
        const maxPriceInput = courseFilter.querySelector('input[name="maxPrice"]');

        const normalizeText = (value) =>
            value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .trim();

        const parsePrice = (value) => {
            const digits = value.replace(/\D/g, "");
            return digits ? Number(digits) : null;
        };

        const filterCourses = () => {
            const query = normalizeText(nameInput?.value || "");
            const selectedType = typeSelect?.value || "";
            const minPrice = parsePrice(minPriceInput?.value || "");
            const maxPrice = parsePrice(maxPriceInput?.value || "");
            let visibleCount = 0;

            courseCards.forEach((card) => {
                const title = normalizeText(card.dataset.title || "");
                const types = card.dataset.type || "";
                const price = Number(card.dataset.price || 0);
                const matchesName = !query || title.includes(query);
                const matchesType = !selectedType || types.split(" ").includes(selectedType);
                const matchesMin = minPrice === null || price >= minPrice;
                const matchesMax = maxPrice === null || price <= maxPrice;
                const isVisible = matchesName && matchesType && matchesMin && matchesMax;

                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            courseEmpty?.classList.toggle("is-visible", visibleCount === 0);
        };

        courseFilter.addEventListener("submit", (event) => {
            event.preventDefault();
            filterCourses();
        });

        [nameInput, typeSelect, minPriceInput, maxPriceInput].forEach((control) => {
            control?.addEventListener("input", filterCourses);
            control?.addEventListener("change", filterCourses);
        });
    }

    if (testModal) {
        const testTriggers = document.querySelectorAll("[data-test-trigger]");
        const closeButtons = testModal.querySelectorAll("[data-test-close]");
        const form = testModal.querySelector(".test-form");
        const registerContent = testModal.querySelector(".test-modal__register");
        const successContent = testModal.querySelector(".test-modal__success");
        const contactButtons = testModal.querySelectorAll("[data-test-contact]");
        const fullNameInput = form?.querySelector('input[name="fullName"]');
        const phoneInput = form?.querySelector('input[name="phone"]');
        const needInput = form?.querySelector('input[name="need"]');
        const locationInputs = form?.querySelectorAll('input[name="location"]') || [];

        const setTestOpen = (isOpen) => {
            testModal.classList.toggle("is-open", isOpen);
            testModal.setAttribute("aria-hidden", String(!isOpen));
            testTriggers.forEach((trigger) => {
                trigger.setAttribute("aria-expanded", String(isOpen));
            });
        };

        const setTestSuccess = (isSuccess) => {
            testModal.classList.toggle("is-success", isSuccess);
            registerContent?.setAttribute("aria-hidden", String(isSuccess));
            successContent?.setAttribute("aria-hidden", String(!isSuccess));
        };

        const closeTestModal = () => {
            setTestOpen(false);
            setTestSuccess(false);
        };

        const setFieldError = (fieldName, hasError) => {
            const field = form?.querySelector(`[data-field="${fieldName}"]`);
            field?.classList.toggle("is-invalid", hasError);
        };

        const validateTestForm = () => {
            const hasFullNameError = !fullNameInput?.value.trim();
            const hasPhoneError = !phoneInput?.value.trim();
            const hasLocationError = !Array.from(locationInputs).some((input) => input.checked);
            const hasNeedError = !needInput?.value.trim();

            setFieldError("fullName", hasFullNameError);
            setFieldError("phone", hasPhoneError);
            setFieldError("location", hasLocationError);
            setFieldError("need", hasNeedError);

            const hasErrors = hasFullNameError || hasPhoneError || hasLocationError || hasNeedError;
            form?.classList.toggle("has-errors", hasErrors);
            return !hasErrors;
        };

        const clearFieldError = (fieldName) => {
            setFieldError(fieldName, false);
            form?.classList.remove("has-errors");
        };

        testTriggers.forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                setTestSuccess(false);
                setTestOpen(true);
            });
        });

        if (window.location.hash === "#test-popup") {
            setTestSuccess(false);
            setTestOpen(true);
        }

        closeButtons.forEach((closeButton) => {
            closeButton.addEventListener("click", () => {
                closeTestModal();
            });
        });

        contactButtons.forEach((contactButton) => {
            contactButton.addEventListener("click", (event) => {
                event.stopPropagation();
                const action = contactButton.dataset.testContact;

                closeTestModal();

                if (action === "zalo") {
                    setZaloOpen(true);
                    return;
                }

                setQuickChatOpen(true);

                if (action === "messenger") {
                    quickChat?.querySelector(".quick-chat__item--messenger")?.click();
                    return;
                }

                if (action === "mail") {
                    quickChat?.querySelector(".quick-chat__item--mail")?.click();
                }
            });
        });

        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            if (validateTestForm()) {
                setTestSuccess(true);
            }
        });

        fullNameInput?.addEventListener("input", () => clearFieldError("fullName"));
        phoneInput?.addEventListener("input", () => clearFieldError("phone"));
        locationInputs.forEach((input) => {
            input.addEventListener("change", () => clearFieldError("location"));
        });
    }

    countrySelects.forEach((countrySelect) => {
        const trigger = countrySelect.querySelector(".phone-field__country");
        const flag = countrySelect.querySelector(".phone-field__flag");
        const hiddenCode = countrySelect.querySelector('input[name="countryCode"]');
        const phoneInput = countrySelect.querySelector('input[name="phone"]');
        const searchInput = countrySelect.querySelector('.phone-field__search input');
        const options = countrySelect.querySelectorAll(".phone-field__dropdown button");

        const setOpen = (isOpen) => {
            countrySelect.classList.toggle("is-open", isOpen);
            trigger?.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) {
                searchInput?.focus();
            }
        };

        trigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            setOpen(!countrySelect.classList.contains("is-open"));
        });

        options.forEach((option) => {
            option.addEventListener("click", (event) => {
                event.stopPropagation();
                const code = option.dataset.code || "";
                flag.textContent = option.dataset.flag || flag.textContent;
                hiddenCode.value = code;
                phoneInput.placeholder = `${code} 000 000 000`.trim();
                setOpen(false);
                phoneInput.focus();
            });
        });

        searchInput?.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            options.forEach((option) => {
                option.hidden = !option.textContent.toLowerCase().includes(query);
            });
        });
    });

    needSelects.forEach((needSelect) => {
        const trigger = needSelect.querySelector(".need-field__trigger");
        const label = trigger?.querySelector("span:first-child");
        const hiddenValue = needSelect.querySelector('input[name="need"]');
        const options = needSelect.querySelectorAll(".need-field__dropdown button");

        const setOpen = (isOpen) => {
            needSelect.classList.toggle("is-open", isOpen);
            trigger?.setAttribute("aria-expanded", String(isOpen));
        };

        trigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            setOpen(!needSelect.classList.contains("is-open"));
        });

        options.forEach((option) => {
            option.addEventListener("click", (event) => {
                event.stopPropagation();
                const value = option.dataset.value || option.textContent.trim();
                hiddenValue.value = value;
                label.textContent = option.textContent.trim();
                needSelect.closest("[data-field]")?.classList.remove("is-invalid");
                needSelect.closest(".test-form")?.classList.remove("has-errors");
                setOpen(false);
            });
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        zaloWidget?.classList.remove("is-open");
        zaloWidget?.querySelector(".zalo-widget__trigger")?.setAttribute("aria-expanded", "false");
        testModal?.classList.remove("is-open");
        testModal?.classList.remove("is-success");
        testModal?.setAttribute("aria-hidden", "true");
        document.querySelectorAll("[data-test-trigger]").forEach((trigger) => {
            trigger.setAttribute("aria-expanded", "false");
        });
        countrySelects.forEach((countrySelect) => countrySelect.classList.remove("is-open"));
        needSelects.forEach((needSelect) => needSelect.classList.remove("is-open"));
    });

    document.addEventListener("click", (event) => {
        countrySelects.forEach((countrySelect) => {
            if (!countrySelect.contains(event.target)) {
                countrySelect.classList.remove("is-open");
                countrySelect.querySelector(".phone-field__country")?.setAttribute("aria-expanded", "false");
            }
        });

        needSelects.forEach((needSelect) => {
            if (!needSelect.contains(event.target)) {
                needSelect.classList.remove("is-open");
                needSelect.querySelector(".need-field__trigger")?.setAttribute("aria-expanded", "false");
            }
        });
    });
});
