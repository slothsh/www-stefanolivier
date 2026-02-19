import { animate, stagger } from 'animejs';

const OVERLAY_DURATION = 2000;
const FADE_DURATION = 500;
const STAGGER_DELAY = 40;
const OVERLAY_BG_COLOR = '#252b25';
const CIRCLE_MAX_RADIUS = '150%';

let storedOrigin = { x: 0, y: 0 };

export function animateFormOpen(
    originX: number,
    originY: number,
    overlayEl: HTMLElement,
    formEl: HTMLElement
): void {
    storedOrigin = { x: originX, y: originY };

    overlayEl.style.clipPath = `circle(0% at ${originX}px ${originY}px)`;
    overlayEl.style.backgroundColor = OVERLAY_BG_COLOR;

    formEl.style.clipPath = `circle(0% at ${originX}px ${originY}px)`;

    const formElements = formEl.querySelectorAll<HTMLElement>(
        'label, input, textarea, button, .form-group, .form-field'
    );

    formElements.forEach((el) => {
        el.style.opacity = '0';
    });

    animate(overlayEl, {
        clipPath: `circle(${CIRCLE_MAX_RADIUS} at ${originX}px ${originY}px)`,
        duration: OVERLAY_DURATION,
        ease: 'outExpo',
    });

    animate(formEl, {
        clipPath: `circle(${CIRCLE_MAX_RADIUS} at ${originX}px ${originY}px)`,
        duration: OVERLAY_DURATION,
        ease: 'outExpo',
    });

    animate(formElements, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: FADE_DURATION,
        delay: stagger(STAGGER_DELAY, { start: Math.round(OVERLAY_DURATION / 4) }),
        ease: 'outQuad',
    });
}

export function animateFormClose(
    overlayEl: HTMLElement,
    formEl: HTMLElement,
    onComplete: () => void
): void {
    const { x: originX, y: originY } = storedOrigin;

    const formElements = formEl.querySelectorAll<HTMLElement>(
        'label, input, textarea, button, .form-group, .form-field'
    );

    animate(formElements, {
        opacity: 0,
        translateY: -10,
        duration: FADE_DURATION,
        ease: 'inQuad',
    });

    animate(overlayEl, {
        clipPath: `circle(0% at ${originX}px ${originY}px)`,
        duration: OVERLAY_DURATION / 4,
        delay: FADE_DURATION,
        ease: 'inOutQuad',
    });

    animate(formEl, {
        clipPath: `circle(0% at ${originX}px ${originY}px)`,
        duration: OVERLAY_DURATION / 4,
        delay: FADE_DURATION,
        ease: 'inOutQuad',
        onComplete,
    });
}
