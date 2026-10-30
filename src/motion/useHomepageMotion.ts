import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Native scrolling throughout; only the short desktop industry reel is pinned. */
export function useHomepageMotion(rootRef: RefObject<HTMLDivElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let disposed = false;
    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };
    const imageListeners: HTMLImageElement[] = [];
    root.querySelectorAll('img').forEach(image => {
      if (!image.complete) {
        image.addEventListener('load', refresh, { once: true });
        imageListeners.push(image);
      }
    });
    document.fonts.ready.then(refresh);

    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1100px) and (min-height: 740px)',
      finePointer: '(hover: hover) and (pointer: fine)',
    }, match => {
      if (!match.conditions?.motion) return;
      const { desktop, finePointer } = match.conditions;
      const cleanups: Array<() => void> = [];
      const context = gsap.context(() => {
        const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
        const enter = (elements: gsap.TweenTarget, trigger: Element, stagger = .08) => gsap.fromTo(elements,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: .8, stagger, ease: 'power3.out', scrollTrigger: { trigger, start: 'top 90%', once: true } });

        const hero = root.querySelector<HTMLElement>('.hero-banner');
        const heroImage = hero?.querySelector('img');
        if (hero && heroImage) {
          const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
          entrance.fromTo(heroImage, { clipPath: 'inset(0 0 100% 0)', scale: 1.12 },
            { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.5 })
            .fromTo(all('.hero-line>span'), { yPercent: 110, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: .9, stagger: .1 }, .25)
            .fromTo(all('.hero-copy>.eyebrow'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .7 }, .1)
            .fromTo(all('.hero-copy>p'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .8 }, .75)
            .fromTo(all('.hero-actions>a'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: .12, duration: .75 }, .95);
          const play = () => entrance.play();
          if (document.querySelector('.site-preloader')) window.addEventListener('accumax:ready', play, { once: true });
          else play();
          cleanups.push(() => window.removeEventListener('accumax:ready', play));
          gsap.to(heroImage, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        }

        const about = root.querySelector('.about-block');
        if (about) {
          // Different edge slopes during the reveal create the diagonal opening.
          const photo = about.querySelector('.about-photo');
          if (photo) gsap.fromTo(photo, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            { keyframes: [{ clipPath: 'polygon(0 0, 70% 0, 35% 100%, 0 100%)', duration: .65 }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: .65 }], ease: 'power2.inOut', scrollTrigger: { trigger: about, start: 'top 82%', once: true } });
          gsap.fromTo(all('.about-photo>img'), { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: true } });
          const intro = gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 78%', once: true } });
          intro.fromTo(all('.about-copy .motion-line>span'), { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .12, ease: 'power3.out' })
            .fromTo(all('.about-copy>p,.about-copy>.text-link'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .75, stagger: .12, ease: 'power3.out' }, .3);
        }

        all('.section-heading,.clients-heading,.home-contact-heading').forEach(heading => {
          gsap.fromTo(heading, { '--divider-progress': 0 }, { '--divider-progress': 1, duration: 1, ease: 'power2.inOut', scrollTrigger: { trigger: heading, start: 'top 90%', once: true } });
        });
        const expertise = root.querySelector('.expertise-motion');
        if (expertise) {
          all('.expertise-motion .expertise-entry').forEach((entry, i) => {
            gsap.fromTo(entry, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, delay: (i % 3) * .07, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: entry, start: 'top 94%', once: true } });
            const open = () => {
              refresh();
              if (!(entry as HTMLDetailsElement).open) return;
              context.add(() => gsap.fromTo(entry.querySelector('.expertise-detail'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }));
            };
            entry.addEventListener('toggle', open);
            cleanups.push(() => entry.removeEventListener('toggle', open));
          });
        }

        const projects = all('.project-showcase-card');
        projects.forEach((card, i) => {
          enter(card.querySelectorAll('.project-showcase-category,.project-showcase-copy>*'), card, .08);
          if (desktop && projects[i + 1]) gsap.to(card, {
            scale: .965, transformOrigin: '50% 0%', ease: 'none',
            scrollTrigger: { trigger: projects[i + 1], start: 'top 78%', end: 'top 120px', scrub: true, invalidateOnRefresh: true },
          });
        });

        const industries = root.querySelector<HTMLElement>('.industries-home');
        const viewport = industries?.querySelector<HTMLElement>('.industry-viewport');
        const track = industries?.querySelector<HTMLElement>('.industry-track');
        if (industries && viewport && track && desktop) {
          const slides = Array.from(track.querySelectorAll<HTMLElement>('.industry-slide'));
          const number = industries.querySelector('.industry-current-number');
          const title = industries.querySelector('.industry-current-title');
          const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          const reel = gsap.timeline({ scrollTrigger: {
            trigger: industries, start: 'top 80px', end: () => '+=' + Math.min(travel(), window.innerHeight * .95),
            pin: true, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => {
              const index = Math.min(slides.length - 1, Math.round(self.progress * (slides.length - 1)));
              if (number) number.textContent = String(index + 1).padStart(2, '0');
              if (title) title.textContent = slides[index].dataset.industryTitle ?? '';
            },
          } });
          reel.to(track, { x: () => -travel(), duration: 1, ease: 'none' }, 0)
            .fromTo(track.querySelectorAll('img'), { xPercent: -3 }, { xPercent: 3, duration: 1, ease: 'none' }, 0)
            .fromTo(industries.querySelector('.industry-progress>span'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
          slides.forEach((slide, i) => {
            const focus = () => {
              const trigger = reel.scrollTrigger;
              if (!trigger) return;
              window.scrollTo({ top: trigger.start + (i / Math.max(1, slides.length - 1)) * (trigger.end - trigger.start), behavior: 'smooth' });
              requestAnimationFrame(() => { viewport.scrollLeft = 0; });
            };
            slide.addEventListener('focus', focus);
            cleanups.push(() => slide.removeEventListener('focus', focus));
          });
          cleanups.push(() => {
            if (number) number.textContent = '01';
            if (title) title.textContent = slides[0].dataset.industryTitle ?? '';
          });
        } else if (industries) {
          all('.industry-slide').forEach(slide => enter(slide, slide));
        }

        all('.home-contact-card').forEach((card, i) => {
          const timeline = gsap.timeline({ delay: i * .06, scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
          timeline.fromTo(card.querySelector('.home-contact-image'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut' })
            .fromTo(card.querySelectorAll('.motion-line>span'), { yPercent: 110 }, { yPercent: 0, duration: .75, stagger: .08, ease: 'power3.out' }, .25)
            .fromTo(card.querySelectorAll('p,.home-contact-link'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .65, stagger: .08 }, .45);
        });

        const cta = document.querySelector<HTMLElement>('.contact-band');
        if (cta) {
          cta.classList.add('motion-cta');
          gsap.fromTo(cta, { '--cta-reveal': .2 }, { '--cta-reveal': 1, ease: 'none', scrollTrigger: { trigger: cta, start: 'top bottom', end: 'center 65%', scrub: true } });
          enter(cta.querySelectorAll('.eyebrow,h2,.button,p'), cta, .12);
          cleanups.push(() => cta.classList.remove('motion-cta'));
        }

        if (finePointer) {
          const buttons = [...all('.button'), ...Array.from(cta?.querySelectorAll<HTMLElement>('.button') ?? [])];
          buttons.forEach(button => {
            const xTo = gsap.quickTo(button, 'x', { duration: .45, ease: 'power3.out' });
            const yTo = gsap.quickTo(button, 'y', { duration: .45, ease: 'power3.out' });
            let bounds: DOMRect | undefined;
            const move = (event: PointerEvent) => {
              if (event.pointerType !== 'mouse') return;
              bounds ??= button.getBoundingClientRect();
              xTo(gsap.utils.clamp(-7, 7, (event.clientX - bounds.left - bounds.width / 2) * .08));
              yTo(gsap.utils.clamp(-5, 5, (event.clientY - bounds.top - bounds.height / 2) * .12));
            };
            const reset = () => { bounds = undefined; xTo(0); yTo(0); };
            button.addEventListener('pointermove', move);
            button.addEventListener('pointerleave', reset);
            button.addEventListener('blur', reset);
            cleanups.push(() => {
              button.removeEventListener('pointermove', move);
              button.removeEventListener('pointerleave', reset);
              button.removeEventListener('blur', reset);
              xTo.tween.kill(); yTo.tween.kill();
            });
          });
        }
      }, root);
      refresh();
      return () => { cleanups.forEach(cleanup => cleanup()); context.revert(); };
    });

    return () => {
      disposed = true;
      media.revert();
      cancelAnimationFrame(refreshFrame);
      imageListeners.forEach(image => image.removeEventListener('load', refresh));
    };
  }, [rootRef]);
}
