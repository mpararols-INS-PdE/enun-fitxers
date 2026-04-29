const phaseAccordions = document.querySelectorAll('details[data-accordion-group]');
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleLabel = themeToggle?.querySelector('.theme-toggle-label');
const themeToggleIcon = themeToggle?.querySelector('.theme-toggle-icon');
const mermaidBlocks = document.querySelectorAll('.mermaid');
const codeBlocks = document.querySelectorAll('pre code:not(.mermaid)');
const highlightTheme = document.getElementById('hljs-theme');
const storageKey = 'preferred-theme';
const highlightThemeUrls = {
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css',
    light: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css'
};

function getMermaidTheme(theme) {
    return theme === 'light' ? 'default' : 'dark';
}

function updateThemeButton(theme) {
    if (!themeToggle || !themeToggleLabel || !themeToggleIcon) {
        return;
    }

    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Canvia al tema fosc' : 'Canvia al tema clar');
    themeToggleLabel.textContent = isLight ? 'Tema fosc' : 'Tema clar';
    themeToggleIcon.textContent = isLight ? '🌙' : '☀️';
}

function updateHighlightTheme(theme) {
    if (!highlightTheme) {
        return;
    }

    highlightTheme.href = highlightThemeUrls[theme] || highlightThemeUrls.dark;
}

function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
    updateHighlightTheme(theme);
    updateThemeButton(theme);
}

function highlightCodeBlocks() {
    if (!window.hljs || !codeBlocks.length) {
        return;
    }

    codeBlocks.forEach(block => {
        window.hljs.highlightElement(block);
    });
}

async function renderMermaidDiagrams(theme) {
    if (!window.mermaid || !mermaidBlocks.length) {
        return;
    }

    window.mermaid.initialize({
        startOnLoad: false,
        theme: getMermaidTheme(theme),
        securityLevel: 'loose'
    });

    mermaidBlocks.forEach(block => {
        if (!block.dataset.source) {
            block.dataset.source = block.textContent.trim();
        }

        block.removeAttribute('data-processed');
        block.textContent = block.dataset.source;
    });

    await window.mermaid.run({
        nodes: Array.from(mermaidBlocks)
    });
}

function animateClose(accordion) {
    return new Promise(resolve => {
        const content = accordion.querySelector('.phase-content');
        if (!accordion.open) {
            resolve();
            return;
        }

        accordion.classList.remove('is-open');
        content.style.overflow = 'hidden';
        content.style.height = content.scrollHeight + 'px';
        content.offsetHeight;
        content.style.transition = 'height 0.3s ease';
        content.style.height = '0';

        content.addEventListener('transitionend', () => {
            accordion.open = false;
            content.style.height = '';
            content.style.overflow = '';
            content.style.transition = '';
            resolve();
        }, { once: true });
    });
}

function animateOpen(accordion) {
    accordion.open = true;
    accordion.classList.add('is-open');

    const content = accordion.querySelector('.phase-content');
    const targetHeight = content.scrollHeight;
    content.style.overflow = 'hidden';
    content.style.height = '0';
    content.offsetHeight;
    content.style.transition = 'height 0.3s ease';
    content.style.height = targetHeight + 'px';

    content.addEventListener('transitionend', () => {
        content.style.height = '';
        content.style.overflow = '';
        content.style.transition = '';
    }, { once: true });
}

phaseAccordions.forEach(accordion => {
    if (accordion.open) {
        accordion.classList.add('is-open');
    }

    accordion.querySelector('.phase-summary').addEventListener('click', e => {
        e.preventDefault();

        if (accordion.open) {
            animateClose(accordion);
            return;
        }

        const group = accordion.dataset.accordionGroup;
        const toClose = [...phaseAccordions].filter(
            a => a !== accordion && a.dataset.accordionGroup === group && a.open
        );

        Promise.all(toClose.map(animateClose)).then(() => {
            accordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            animateOpen(accordion);
        });
    });
});

const savedTheme = localStorage.getItem(storageKey);
const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';

applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', async () => {
        const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        await renderMermaidDiagrams(nextTheme);
    });
}

renderMermaidDiagrams(initialTheme);
highlightCodeBlocks();
