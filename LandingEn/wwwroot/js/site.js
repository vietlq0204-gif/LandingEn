document.addEventListener("DOMContentLoaded", () => {
    const zaloWidget = document.querySelector("[data-zalo-widget]");
    const quickChat = document.querySelector("[data-quick-chat]");
    const testModal = document.querySelector("[data-test-modal]");
    const courseLayout = document.querySelector("[data-course-layout]");
    const courseFilter = document.querySelector("[data-course-filter]");
    const courseCards = document.querySelectorAll("[data-course-card]");
    const courseEmpty = document.querySelector("[data-course-empty]");
    const countrySelects = document.querySelectorAll("[data-country-select]");
    const needSelects = document.querySelectorAll("[data-need-select]");
    const courseTypeSelects = document.querySelectorAll("[data-course-type-select]");
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
        const filterCloseButton = courseFilter.querySelector("[data-course-filter-close]");
        const filterOpenButton = courseLayout?.querySelector("[data-course-filter-open]");
        const nameInput = courseFilter.querySelector('input[name="courseName"]');
        const typeSelect = courseFilter.querySelector('input[name="courseType"]');
        const courseTypeSelect = courseFilter.querySelector("[data-course-type-select]");
        const courseTypeTrigger = courseTypeSelect?.querySelector(".course-type-field__trigger");
        const courseTypeLabel = courseTypeTrigger?.querySelector("span:first-child");
        const courseTypeOptions = courseTypeSelect?.querySelectorAll(".course-type-field__dropdown button") || [];
        const minPriceInput = courseFilter.querySelector('input[name="minPrice"]');
        const maxPriceInput = courseFilter.querySelector('input[name="maxPrice"]');
        const priceRange = courseFilter.querySelector("[data-course-price-range]");
        const minPriceOutput = courseFilter.querySelector("[data-course-min-price]");
        const maxPriceOutput = courseFilter.querySelector("[data-course-max-price]");
        let expandedCourse = null;
        let courseDetailBackdrop = document.querySelector("[data-course-detail-backdrop]");

        if (courseCards.length && !courseDetailBackdrop) {
            courseDetailBackdrop = document.createElement("button");
            courseDetailBackdrop.className = "course-focus-backdrop";
            courseDetailBackdrop.type = "button";
            courseDetailBackdrop.hidden = true;
            courseDetailBackdrop.setAttribute("aria-label", "Đóng chi tiết khóa học");
            courseDetailBackdrop.setAttribute("data-course-detail-backdrop", "");
            document.body.append(courseDetailBackdrop);
        }

        const setFilterOpen = (isOpen) => {
            courseLayout?.classList.toggle("is-filter-collapsed", !isOpen);
            filterCloseButton?.setAttribute("aria-expanded", String(isOpen));
            filterOpenButton?.setAttribute("aria-expanded", String(isOpen));

            if (filterOpenButton) {
                filterOpenButton.hidden = isOpen;
            }
        };

        const setCourseTypeOpen = (isOpen) => {
            courseTypeSelect?.classList.toggle("is-open", isOpen);
            courseTypeTrigger?.setAttribute("aria-expanded", String(isOpen));
        };

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

        const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

        const withYoutubeParams = (url) => {
            if (!url) {
                return "";
            }

            const separator = url.includes("?") ? "&" : "?";
            const params = new URLSearchParams({
                controls: "0",
                disablekb: "1",
                fs: "0",
                iv_load_policy: "3",
                modestbranding: "1",
                playsinline: "1",
                rel: "0"
            });

            return `${url}${separator}${params.toString()}`;
        };

        const getCourseVideoSrc = (card) => card.dataset.courseVideo?.trim() || "";

        const stopCourseVideo = (card) => {
            const videoFrame = card?.querySelector(".course-list__video-frame");
            videoFrame?.removeAttribute("src");
        };

        const closeExpandedCourse = () => {
            if (!expandedCourse) {
                return;
            }

            stopCourseVideo(expandedCourse);
            expandedCourse.classList.remove("is-expanded", "is-expand-left", "is-expand-right", "is-expand-inline");
            expandedCourse.setAttribute("aria-expanded", "false");
            expandedCourse = null;
            document.body.classList.remove("has-course-detail");

            if (courseDetailBackdrop) {
                courseDetailBackdrop.classList.remove("is-active");
                courseDetailBackdrop.hidden = true;
            }
        };

        const placeCourseDetail = (card) => {
            const rect = card.getBoundingClientRect();
            const viewportGap = 24;
            const canExpandRight = window.innerWidth - rect.right - viewportGap >= rect.width;
            const canExpandLeft = rect.left - viewportGap >= rect.width;

            card.classList.remove("is-expand-left", "is-expand-right", "is-expand-inline");

            if (window.matchMedia("(max-width: 1080px)").matches || (!canExpandRight && !canExpandLeft)) {
                card.classList.add("is-expand-inline");
                return;
            }

            card.classList.add(canExpandRight ? "is-expand-right" : "is-expand-left");
        };

        const openCourseDetail = (card) => {
            if (card.classList.contains("is-hidden")) {
                return;
            }

            if (expandedCourse && expandedCourse !== card) {
                closeExpandedCourse();
            }

            expandedCourse = card;
            placeCourseDetail(card);
            card.classList.add("is-expanded");
            card.setAttribute("aria-expanded", "true");
            document.body.classList.add("has-course-detail");

            const videoFrame = card.querySelector(".course-list__video-frame");
            if (videoFrame && !videoFrame.getAttribute("src")) {
                videoFrame.src = withYoutubeParams(videoFrame.dataset.src || "");
            }

            if (courseDetailBackdrop) {
                courseDetailBackdrop.hidden = false;
                requestAnimationFrame(() => courseDetailBackdrop?.classList.add("is-active"));
            }
        };

        const createDetailLine = (label, value) => {
            const item = document.createElement("li");
            const strong = document.createElement("strong");
            const span = document.createElement("span");

            strong.textContent = label;
            span.textContent = value;
            item.append(strong, span);
            return item;
        };

        courseCards.forEach((card) => {
            const image = card.querySelector(":scope > img");
            const body = card.querySelector(".course-list__body");
            const tag = body?.querySelector(".course-list__tag");
            const metaList = body?.querySelector(".course-list__meta");
            const title = body?.querySelector("h2")?.textContent.trim() || "Khóa học";
            const meta = Array.from(metaList?.querySelectorAll("span:not(.course-list__tag)") || []).map((item) => item.textContent.trim());
            const price = body?.querySelector("strong")?.textContent.trim() || "";
            const testLink = body?.querySelector("[data-test-trigger]");
            const videoSrc = getCourseVideoSrc(card);
            const detailDescription = card.dataset.courseDetail?.trim() || `${title} được thiết kế để giúp học viên luyện đúng trọng tâm, có lộ trình rõ theo mục tiêu đầu vào và được theo dõi tiến độ trong từng giai đoạn học.`;
            const audience = card.dataset.courseAudience?.trim() || meta[0] || "Học viên cần cải thiện kỹ năng tiếng Anh";
            const schedule = card.dataset.courseSchedule?.trim() || meta[1] || "Linh hoạt theo lớp";
            const roadmap = card.dataset.courseRoadmap?.trim() || "Kiểm tra đầu vào, học theo mục tiêu và theo dõi tiến độ trong suốt khóa học";
            const detail = document.createElement("div");
            const detailCloseButton = document.createElement("button");
            const detailScroll = document.createElement("div");
            const paragraph = document.createElement("p");
            const list = document.createElement("ul");
            const actions = document.createElement("div");
            const consultLink = document.createElement("a");

            if (tag && metaList) {
                metaList.prepend(tag);
            }

            if (image) {
                const media = document.createElement("div");
                media.className = "course-list__media";
                image.before(media);
                media.append(image);

                if (videoSrc) {
                    const videoFrame = document.createElement("iframe");
                    videoFrame.className = "course-list__video-frame";
                    videoFrame.dataset.src = videoSrc;
                    videoFrame.title = `Video ${title}`;
                    videoFrame.loading = "lazy";
                    videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                    videoFrame.allowFullscreen = true;
                    media.append(videoFrame);

                    const zoomButton = document.createElement("button");
                    zoomButton.className = "course-list__video-zoom";
                    zoomButton.type = "button";
                    zoomButton.setAttribute("aria-label", "Phóng to video");
                    zoomButton.innerHTML = "<span></span><span></span><span></span><span></span>";
                    zoomButton.addEventListener("click", (event) => {
                        event.stopPropagation();

                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                            return;
                        }

                        if (media.requestFullscreen) {
                            media.requestFullscreen();
                        }
                    });
                    media.append(zoomButton);
                }
            }

            detail.className = "course-list__detail";
            detailCloseButton.className = "course-list__detail-close";
            detailCloseButton.type = "button";
            detailCloseButton.setAttribute("aria-label", "Đóng chi tiết khóa học");
            detailCloseButton.innerHTML = "<span></span><span></span>";
            detailScroll.className = "course-list__detail-scroll";
            actions.className = "course-list__detail-actions";
            paragraph.textContent = detailDescription;
            list.append(
                createDetailLine("Đối tượng", audience),
                createDetailLine("Lịch học", schedule),
                createDetailLine("Học phí", price),
                createDetailLine("Lộ trình", roadmap)
            );

            detailScroll.append(paragraph, list);

            if (testLink) {
                testLink.classList.add("course-list__detail-action", "course-list__detail-action--primary");
                testLink.textContent = "Đăng ký test";
                testLink.addEventListener("click", closeExpandedCourse);
                actions.append(testLink);
            }

            consultLink.className = "course-list__detail-action course-list__detail-action--secondary";
            consultLink.href = "/#contact";
            consultLink.textContent = "Đăng ký tư vấn";
            actions.append(consultLink);

            detailCloseButton.addEventListener("click", (event) => {
                event.stopPropagation();
                closeExpandedCourse();
                card.focus({ preventScroll: true });
            });

            detail.append(detailCloseButton, detailScroll, actions);
            card.append(detail);
            card.tabIndex = 0;
            card.setAttribute("aria-expanded", "false");

            card.addEventListener("click", (event) => {
                if (event.target.closest("a, button, input, select")) {
                    return;
                }

                openCourseDetail(card);
            });

            card.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") {
                    return;
                }

                event.preventDefault();
                openCourseDetail(card);
            });

            card.addEventListener("mouseleave", () => {
                if (expandedCourse === card) {
                    closeExpandedCourse();
                }
            });
        });

        const syncPriceRange = (changedControl) => {
            if (!minPriceInput || !maxPriceInput) {
                return;
            }

            const rangeMin = Number(minPriceInput.min || 0);
            const rangeMax = Number(minPriceInput.max || maxPriceInput.max || 10000000);
            let minPrice = Number(minPriceInput.value || rangeMin);
            let maxPrice = Number(maxPriceInput.value || rangeMax);

            if (minPrice > maxPrice && changedControl === minPriceInput) {
                maxPrice = minPrice;
            } else if (maxPrice < minPrice) {
                minPrice = maxPrice;
            }

            minPriceInput.value = String(minPrice);
            maxPriceInput.value = String(maxPrice);
            if (minPriceOutput) {
                minPriceOutput.textContent = formatPrice(minPrice);
            }

            if (maxPriceOutput) {
                maxPriceOutput.textContent = formatPrice(maxPrice);
            }

            const rangeSize = rangeMax - rangeMin || 1;
            priceRange?.style.setProperty("--range-start", String(((minPrice - rangeMin) / rangeSize) * 100));
            priceRange?.style.setProperty("--range-end", String(((maxPrice - rangeMin) / rangeSize) * 100));
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
                } else if (expandedCourse === card) {
                    closeExpandedCourse();
                }
            });

            courseEmpty?.classList.toggle("is-visible", visibleCount === 0);
        };

        courseFilter.addEventListener("submit", (event) => {
            event.preventDefault();
            filterCourses();
        });

        [nameInput, typeSelect].forEach((control) => {
            control?.addEventListener("input", filterCourses);
            control?.addEventListener("change", filterCourses);
        });

        courseTypeTrigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            setCourseTypeOpen(!courseTypeSelect?.classList.contains("is-open"));
        });

        courseTypeOptions.forEach((option) => {
            option.addEventListener("click", (event) => {
                event.stopPropagation();

                if (typeSelect) {
                    typeSelect.value = option.dataset.value || "";
                }

                if (courseTypeLabel) {
                    courseTypeLabel.textContent = option.textContent.trim();
                }

                setCourseTypeOpen(false);
                filterCourses();
            });
        });

        [minPriceInput, maxPriceInput].forEach((control) => {
            control?.addEventListener("input", (event) => {
                syncPriceRange(event.currentTarget);
                filterCourses();
            });
            control?.addEventListener("change", (event) => {
                syncPriceRange(event.currentTarget);
                filterCourses();
            });
        });

        filterCloseButton?.addEventListener("click", () => {
            setFilterOpen(false);
        });

        filterOpenButton?.addEventListener("click", () => {
            setFilterOpen(true);
        });

        setFilterOpen(true);
        syncPriceRange();
        filterCourses();

        courseDetailBackdrop?.addEventListener("click", closeExpandedCourse);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeExpandedCourse();
            }
        });
        document.addEventListener("click", (event) => {
            if (expandedCourse && !expandedCourse.contains(event.target)) {
                closeExpandedCourse();
            }
        });
        window.addEventListener("resize", () => {
            if (expandedCourse) {
                placeCourseDetail(expandedCourse);
            }
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
        const countryCodeInput = form?.querySelector('input[name="countryCode"]');
        const needInput = form?.querySelector('input[name="need"]');
        const locationInputs = form?.querySelectorAll('input[name="location"]') || [];
        const formErrorSummary = form?.querySelector(".form-error-summary");
        const submitButton = form?.querySelector('button[type="submit"]');
        const requiredErrorMessage = formErrorSummary?.textContent || "";

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
            if (formErrorSummary) {
                formErrorSummary.textContent = requiredErrorMessage;
            }
        };

        const setFormMessage = (message) => {
            if (formErrorSummary) {
                formErrorSummary.textContent = message;
            }

            form?.classList.add("has-errors");
        };

        const getSelectedLocation = () =>
            Array.from(locationInputs).find((input) => input.checked)?.value || "";

        const buildRegistrationPayload = () => ({
            fullName: fullNameInput?.value.trim() || "",
            phone: phoneInput?.value.trim() || "",
            countryCode: countryCodeInput?.value.trim() || "",
            location: getSelectedLocation(),
            need: needInput?.value.trim() || ""
        });

        const isStaticRegistration = Boolean(window.LANDINGEN_STATIC_SITE);
        const registrationEndpoint = window.LANDINGEN_REGISTRATION_ENDPOINT || "/api/test-registration";
        const formspreePlaceholder = "https://formspree.io/f/YOUR_FORM_ID";

        const getFormspreeEndpoint = () =>
            (window.LANDINGEN_FORMSPREE_ENDPOINT || form?.getAttribute("action") || "").trim();

        const isConfiguredFormspreeEndpoint = (endpoint) =>
            /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)
            && endpoint !== formspreePlaceholder;

        const buildFormspreePayload = () => {
            const payload = buildRegistrationPayload();
            const formData = new FormData();
            const fullPhone = [payload.countryCode, payload.phone]
                .filter((value) => value)
                .join(" ");

            formData.set("fullName", payload.fullName);
            formData.set("phone", payload.phone);
            formData.set("countryCode", payload.countryCode);
            formData.set("fullPhone", fullPhone);
            formData.set("location", payload.location);
            formData.set("need", payload.need);
            formData.set("pageUrl", window.location.href);
            formData.set("submittedAt", new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh"
            }));
            formData.set("_subject", "Dang ky test trinh do moi");

            return formData;
        };

        const submitStaticRegistration = async () => {
            const formspreeEndpoint = getFormspreeEndpoint();
            if (!isConfiguredFormspreeEndpoint(formspreeEndpoint)) {
                throw new Error("Formspree endpoint is not configured.");
            }

            const response = await fetch(formspreeEndpoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: buildFormspreePayload()
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("Too many submissions.");
                }

                throw new Error("Formspree submit failed.");
            }
        };

        const submitTestRegistration = async () => {
            submitButton?.setAttribute("disabled", "disabled");

            try {
                if (isStaticRegistration) {
                    await submitStaticRegistration();
                } else {
                    const response = await fetch(registrationEndpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(buildRegistrationPayload())
                    });

                    if (!response.ok) {
                        throw new Error("Submit failed");
                    }
                }

                form?.reset();
                setTestSuccess(true);
            } catch (error) {
                if (error?.message === "Formspree endpoint is not configured.") {
                    setFormMessage("Chua cau hinh Formspree endpoint. Vui long thay YOUR_FORM_ID bang form ID that.");
                    return;
                }

                setFormMessage("Không gửi được đăng ký. Vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.");
            } finally {
                submitButton?.removeAttribute("disabled");
            }
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
                submitTestRegistration();
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
        courseTypeSelects.forEach((courseTypeSelect) => {
            courseTypeSelect.classList.remove("is-open");
            courseTypeSelect.querySelector(".course-type-field__trigger")?.setAttribute("aria-expanded", "false");
        });
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

        courseTypeSelects.forEach((courseTypeSelect) => {
            if (!courseTypeSelect.contains(event.target)) {
                courseTypeSelect.classList.remove("is-open");
                courseTypeSelect.querySelector(".course-type-field__trigger")?.setAttribute("aria-expanded", "false");
            }
        });
    });
});
