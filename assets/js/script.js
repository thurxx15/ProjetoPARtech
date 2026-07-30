"use strict";

/* =====================================================
   PAR TECH — SCRIPT PRINCIPAL
===================================================== */

const CONFIG = {
    whatsappNumber: "5514997674157",
    headerScrollLimit: 40,
    messageMaximumLength: 1200,
    desktopBreakpoint: 1024
};

document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileMenu();
    initAccordion();
    initQuoteForm();
    initRevealAnimations();
    initCurrentYear();
});

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function getElement(...selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}

function getElements(...selectors) {
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);

        if (elements.length > 0) {
            return [...elements];
        }
    }

    return [];
}

function getFieldWrapper(field) {
    return field.closest(".form-field");
}

function getFieldError(field) {
    if (!field.name) {
        return null;
    }

    return document.querySelector(
        `[data-error-for="${field.name}"]`
    );
}

function getSelectedOptionText(select) {
    if (!select || !select.value) {
        return "";
    }

    const selectedOption =
        select.options[select.selectedIndex];

    return selectedOption
        ? selectedOption.textContent.trim()
        : "";
}

function getCheckedValues(form, fieldName) {
    const checkedFields = form.querySelectorAll(
        `input[name="${fieldName}"]:checked`
    );

    return [...checkedFields].map((field) => {
        const label = field.closest("label");

        const labelText = label?.querySelector(
            ".checkbox__label"
        );

        return (
            labelText?.textContent.trim() ||
            field.value
        );
    });
}

function sanitizeMessageValue(value) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim();
}

/* =====================================================
   HEADER DURANTE O SCROLL
===================================================== */

function initHeaderScroll() {
    const header = getElement(
        "[data-header]",
        ".header"
    );

    if (!header) {
        return;
    }

    function updateHeader() {
        const isScrolled =
            window.scrollY > CONFIG.headerScrollLimit;

        header.classList.toggle(
            "is-scrolled",
            isScrolled
        );
    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );
}

/* =====================================================
   MENU MOBILE
===================================================== */

function initMobileMenu() {
    const menuButton = document.querySelector(
        "#mobile-menu-button"
    );

    const mobileMenu = document.querySelector(
        "#mobile-menu"
    );

    const overlay = document.querySelector(
        "#mobile-menu-overlay"
    );

    if (!menuButton || !mobileMenu || !overlay) {
        return;
    }

    const menuLinks = mobileMenu.querySelectorAll(
        "a"
    );

    function setMenuState(isOpen) {
        mobileMenu.classList.toggle(
            "is-open",
            isOpen
        );

        overlay.classList.toggle(
            "is-visible",
            isOpen
        );

        menuButton.classList.toggle(
            "is-active",
            isOpen
        );

        document.body.classList.toggle(
            "is-menu-open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Fechar menu de navegação"
                : "Abrir menu de navegação"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        overlay.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );
    }

    function openMenu() {
        setMenuState(true);

        const firstLink =
            mobileMenu.querySelector("a");

        firstLink?.focus();
    }

    function closeMenu({
        returnFocus = false
    } = {}) {
        const wasOpen =
            menuButton.getAttribute(
                "aria-expanded"
            ) === "true";

        setMenuState(false);

        if (wasOpen && returnFocus) {
            menuButton.focus();
        }
    }

    function toggleMenu() {
        const isOpen =
            menuButton.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuButton.addEventListener(
        "click",
        toggleMenu
    );

    overlay.addEventListener("click", () => {
        closeMenu();
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        const isOpen =
            menuButton.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeMenu({
                returnFocus: true
            });
        }
    });

    window.addEventListener("resize", () => {
        if (
            window.innerWidth >
            CONFIG.desktopBreakpoint
        ) {
            closeMenu();
        }
    });
}

/* =====================================================
   FAQ — ACORDEÃO
===================================================== */

function initAccordion() {
    const accordions = document.querySelectorAll(
        "[data-accordion]"
    );

    if (accordions.length === 0) {
        return;
    }

    accordions.forEach((accordion) => {
        const buttons = [
            ...accordion.querySelectorAll(
                "[data-accordion-button]"
            )
        ];

        function getAccordionContent(button) {
            const contentId =
                button.getAttribute(
                    "aria-controls"
                );

            if (!contentId) {
                return null;
            }

            return document.getElementById(
                contentId
            );
        }

        function closeItem(button) {
            const content =
                getAccordionContent(button);

            const item = button.closest(
                ".accordion-item"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            item?.classList.remove(
                "is-open"
            );

            if (content) {
                content.hidden = true;
            }
        }

        function openItem(button) {
            const content =
                getAccordionContent(button);

            const item = button.closest(
                ".accordion-item"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );

            item?.classList.add(
                "is-open"
            );

            if (content) {
                content.hidden = false;
            }
        }

        buttons.forEach((button) => {
            const isInitiallyOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (isInitiallyOpen) {
                openItem(button);
            } else {
                closeItem(button);
            }

            button.addEventListener(
                "click",
                () => {
                    const isOpen =
                        button.getAttribute(
                            "aria-expanded"
                        ) === "true";

                    buttons.forEach(
                        (otherButton) => {
                            if (
                                otherButton !==
                                button
                            ) {
                                closeItem(
                                    otherButton
                                );
                            }
                        }
                    );

                    if (isOpen) {
                        closeItem(button);
                    } else {
                        openItem(button);
                    }
                }
            );
        });
    });
}

/* =====================================================
   FORMULÁRIO DE ORÇAMENTO
===================================================== */

function initQuoteForm() {
    const form = getElement(
        "[data-quote-form]",
        "#quote-form"
    );

    if (!form) {
        return;
    }

    const phoneInput = form.querySelector(
        "[data-phone-input]"
    );

    const messageInput = form.querySelector(
        "[data-message-input]"
    );

    const characterCounter = form.querySelector(
        "[data-character-counter]"
    );

    const submitButton = form.querySelector(
        "[data-submit-button]"
    );

    const submitText = form.querySelector(
        "[data-submit-text]"
    );

    initPhoneMask(phoneInput);

    initCharacterCounter(
        messageInput,
        characterCounter
    );

    const fields = [
        ...form.querySelectorAll(
            "input, select, textarea"
        )
    ];

    fields.forEach((field) => {
        field.addEventListener("blur", () => {
            validateField(field);
        });

        field.addEventListener("input", () => {
            const wrapper =
                getFieldWrapper(field);

            if (
                wrapper?.classList.contains(
                    "is-invalid"
                )
            ) {
                validateField(field);
            }
        });

        field.addEventListener("change", () => {
            validateField(field);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFormStatus(form);

        const requiredFields = fields.filter(
            (field) => field.required
        );

        const validationResults =
            requiredFields.map(
                (field) => validateField(field)
            );

        const isFormValid =
            validationResults.every(Boolean);

        if (!isFormValid) {
            showFormStatus(
                form,
                "error",
                "Revise os campos destacados antes de enviar sua solicitação."
            );

            const firstInvalidField =
                form.querySelector(
                    '[aria-invalid="true"]'
                );

            firstInvalidField?.focus();

            return;
        }

        setSubmittingState(
            submitButton,
            submitText,
            true
        );

        const whatsappMessage =
            createWhatsAppMessage(form);

        const whatsappURL =
            `https://wa.me/${CONFIG.whatsappNumber}` +
            `?text=${encodeURIComponent(
                whatsappMessage
            )}`;

        showFormStatus(
            form,
            "success",
            "As informações foram organizadas. O WhatsApp será aberto para você confirmar o envio."
        );

        window.setTimeout(() => {
            const whatsappWindow = window.open(
                whatsappURL,
                "_blank"
            );

            if (whatsappWindow) {
                whatsappWindow.opener = null;
            } else {
                window.location.href =
                    whatsappURL;
            }

            setSubmittingState(
                submitButton,
                submitText,
                false
            );
        }, 500);
    });
}

/* =====================================================
   VALIDAÇÃO DOS CAMPOS
===================================================== */

function validateField(field) {
    if (!field) {
        return true;
    }

    if (
        field.type === "checkbox" &&
        field.required &&
        !field.checked
    ) {
        setFieldError(
            field,
            "Você precisa aceitar esta condição."
        );

        return false;
    }

    if (
        field.type === "radio" &&
        field.required
    ) {
        const form = field.form;

        const checkedRadio =
            form?.querySelector(
                `input[name="${field.name}"]:checked`
            );

        if (!checkedRadio) {
            setFieldError(
                field,
                "Selecione uma opção."
            );

            return false;
        }
    }

    const value = field.value.trim();

    if (field.required && value === "") {
        setFieldError(
            field,
            "Este campo é obrigatório."
        );

        return false;
    }

    if (
        field.type === "email" &&
        value !== "" &&
        !isValidEmail(value)
    ) {
        setFieldError(
            field,
            "Digite um endereço de e-mail válido."
        );

        return false;
    }

    if (
        field.type === "tel" &&
        value !== "" &&
        !isValidPhone(value)
    ) {
        setFieldError(
            field,
            "Digite um WhatsApp válido com DDD."
        );

        return false;
    }

    if (
        field.minLength > 0 &&
        value.length > 0 &&
        value.length < field.minLength
    ) {
        setFieldError(
            field,
            `Digite pelo menos ${field.minLength} caracteres.`
        );

        return false;
    }

    if (
        field.maxLength > 0 &&
        value.length > field.maxLength
    ) {
        setFieldError(
            field,
            `Digite no máximo ${field.maxLength} caracteres.`
        );

        return false;
    }

    clearFieldError(field);

    return true;
}

function setFieldError(field, message) {
    const wrapper =
        getFieldWrapper(field);

    const errorElement =
        getFieldError(field);

    wrapper?.classList.add(
        "is-invalid"
    );

    field.setAttribute(
        "aria-invalid",
        "true"
    );

    if (errorElement) {
        errorElement.textContent =
            message;
    }
}

function clearFieldError(field) {
    const wrapper =
        getFieldWrapper(field);

    const errorElement =
        getFieldError(field);

    wrapper?.classList.remove(
        "is-invalid"
    );

    field.removeAttribute(
        "aria-invalid"
    );

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(
        email
    );
}

function isValidPhone(phone) {
    const digits = phone.replace(
        /\D/g,
        ""
    );

    return (
        digits.length === 10 ||
        digits.length === 11
    );
}

/* =====================================================
   MÁSCARA DE TELEFONE
===================================================== */

function initPhoneMask(phoneInput) {
    if (!phoneInput) {
        return;
    }

    phoneInput.addEventListener("input", () => {
        phoneInput.value = formatPhone(
            phoneInput.value
        );
    });
}

function formatPhone(value) {
    const digits = value
        .replace(/\D/g, "")
        .slice(0, 11);

    if (digits.length === 0) {
        return "";
    }

    if (digits.length <= 2) {
        return `(${digits}`;
    }

    if (digits.length <= 6) {
        return (
            `(${digits.slice(0, 2)}) ` +
            digits.slice(2)
        );
    }

    if (digits.length <= 10) {
        return (
            `(${digits.slice(0, 2)}) ` +
            `${digits.slice(2, 6)}-` +
            digits.slice(6)
        );
    }

    return (
        `(${digits.slice(0, 2)}) ` +
        `${digits.slice(2, 7)}-` +
        digits.slice(7)
    );
}

/* =====================================================
   CONTADOR DA MENSAGEM
===================================================== */

function initCharacterCounter(
    messageInput,
    characterCounter
) {
    if (
        !messageInput ||
        !characterCounter
    ) {
        return;
    }

    const maximumLength =
        Number(messageInput.maxLength) ||
        CONFIG.messageMaximumLength;

    function updateCounter() {
        const currentLength =
            messageInput.value.length;

        characterCounter.textContent =
            `${currentLength}/${maximumLength}`;

        characterCounter.classList.toggle(
            "is-near-limit",
            currentLength >=
                maximumLength * 0.85 &&
                currentLength <
                maximumLength
        );

        characterCounter.classList.toggle(
            "is-at-limit",
            currentLength >=
                maximumLength
        );
    }

    updateCounter();

    messageInput.addEventListener(
        "input",
        updateCounter
    );
}

/* =====================================================
   MENSAGEM DO WHATSAPP
===================================================== */

function createWhatsAppMessage(form) {
    const formData =
        new FormData(form);

    const name =
        sanitizeMessageValue(
            formData.get("name")
        );

    const company =
        sanitizeMessageValue(
            formData.get("company")
        );

    const phone =
        sanitizeMessageValue(
            formData.get("phone")
        );

    const email =
        sanitizeMessageValue(
            formData.get("email")
        );

    const city =
        sanitizeMessageValue(
            formData.get("city")
        );

    const currentSite =
        sanitizeMessageValue(
            formData.get("current_site")
        );

    const instagram =
        sanitizeMessageValue(
            formData.get("instagram")
        );

    const message =
        String(
            formData.get("message") || ""
        ).trim();

    const segment =
        getSelectedOptionText(
            form.querySelector(
                '[name="segment"]'
            )
        );

    const goal =
        getSelectedOptionText(
            form.querySelector(
                '[name="goal"]'
            )
        );

    const deadline =
        getSelectedOptionText(
            form.querySelector(
                '[name="deadline"]'
            )
        );

    const budget =
        getSelectedOptionText(
            form.querySelector(
                '[name="budget"]'
            )
        );

    const features =
        getCheckedValues(
            form,
            "features"
        );

    const lines = [
        "Olá! Gostaria de solicitar um orçamento para uma landing page.",
        "",
        "*DADOS DO CONTATO*",
        `Nome: ${name}`,
        `Empresa: ${company}`,
        `WhatsApp: ${phone}`,
        `E-mail: ${email}`
    ];

    if (city) {
        lines.push(
            `Cidade/estado: ${city}`
        );
    }

    if (segment) {
        lines.push(
            `Segmento: ${segment}`
        );
    }

    if (currentSite) {
        lines.push(
            `Site atual: ${currentSite}`
        );
    }

    if (instagram) {
        lines.push(
            `Instagram: ${instagram}`
        );
    }

    lines.push(
        "",
        "*INFORMAÇÕES DO PROJETO*"
    );

    if (goal) {
        lines.push(
            `Objetivo: ${goal}`
        );
    }

    if (features.length > 0) {
        lines.push(
            `Recursos desejados: ${features.join(
                ", "
            )}`
        );
    }

    if (deadline) {
        lines.push(
            `Prazo desejado: ${deadline}`
        );
    }

    if (budget) {
        lines.push(
            `Investimento previsto: ${budget}`
        );
    }

    lines.push(
        "",
        "*DETALHES DO PROJETO*",
        message
    );

    return lines.join("\n");
}

/* =====================================================
   ESTADO DO BOTÃO DE ENVIO
===================================================== */

function setSubmittingState(
    button,
    textElement,
    isSubmitting
) {
    if (!button) {
        return;
    }

    button.disabled =
        isSubmitting;

    button.classList.toggle(
        "is-loading",
        isSubmitting
    );

    button.setAttribute(
        "aria-busy",
        String(isSubmitting)
    );

    if (textElement) {
        textElement.textContent =
            isSubmitting
                ? "Preparando mensagem..."
                : "Enviar solicitação";
    }
}

/* =====================================================
   STATUS DO FORMULÁRIO
===================================================== */

function getOrCreateFormStatus(form) {
    let status = form.querySelector(
        "[data-form-status]"
    );

    if (status) {
        return status;
    }

    status =
        document.createElement("div");

    status.className =
        "quote-form__status";

    status.dataset.formStatus = "";

    status.setAttribute(
        "role",
        "status"
    );

    status.setAttribute(
        "aria-live",
        "polite"
    );

    form.appendChild(status);

    return status;
}

function showFormStatus(
    form,
    type,
    message
) {
    const status =
        getOrCreateFormStatus(form);

    status.className =
        `quote-form__status ` +
        `quote-form__status--${type} ` +
        "is-visible";

    status.textContent =
        message;
}

function clearFormStatus(form) {
    const status =
        form.querySelector(
            "[data-form-status]"
        );

    if (!status) {
        return;
    }

    status.className =
        "quote-form__status";

    status.textContent = "";
}

/* =====================================================
   ANIMAÇÕES AO ENTRAR NA TELA
===================================================== */

function initRevealAnimations() {
    const elements =
        document.querySelectorAll(
            "[data-reveal]"
        );

    if (elements.length === 0) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        elements.forEach((element) => {
            element.classList.add(
                "is-visible"
            );
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (
                entries,
                currentObserver
            ) => {
                entries.forEach((entry) => {
                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "is-visible"
                    );

                    currentObserver.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.14,
                rootMargin:
                    "0px 0px -60px 0px"
            }
        );

    elements.forEach((element) => {
        observer.observe(element);
    });
}

/* =====================================================
   ANO AUTOMÁTICO NO FOOTER
===================================================== */

function initCurrentYear() {
    const yearElements =
        getElements(
            "[data-current-year]",
            ".current-year"
        );

    if (yearElements.length === 0) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent =
            currentYear;
    });
}