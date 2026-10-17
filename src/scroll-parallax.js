// Cinematic Multi-Plane Parallax Engine (Native Hardware Accelerated Scroll)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  // Enable GSAP smooth lag recovery for buttery 60fps parallax without hijacking native wheel
  gsap.ticker.lagSmoothing(500, 33);

  // 2. Multi-Plane Hero Scroll Scrub
  const heroSection = document.getElementById('top');
  const heroVideoWrap = document.getElementById('hero-video-container');
  const heroCharBg = document.getElementById('hero-char-bg');
  const heroLeftCol = heroSection?.querySelector('.lg\\:col-span-7');
  const heroRightCol = heroSection?.querySelector('.lg\\:col-span-5');

  if (heroSection) {
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      }
    });

    if (heroVideoWrap) {
      heroTimeline.to(heroVideoWrap, {
        y: 160,
        scale: 1.02,
        ease: 'none'
      }, 0);
    }

    if (heroCharBg) {
      heroTimeline.to(heroCharBg, {
        y: 180,
        scale: 1.15,
        opacity: 0.3,
        ease: 'none'
      }, 0);
    }

    if (heroLeftCol) {
      heroTimeline.to(heroLeftCol, {
        y: -100,
        opacity: 0,
        ease: 'power1.in'
      }, 0);
    }

    if (heroRightCol) {
      heroTimeline.to(heroRightCol, {
        y: -140,
        scale: 0.95,
        opacity: 0,
        ease: 'power1.in'
      }, 0);
    }
  }

  // 3. Sequence 02 ("Explore / History is Our Playground") Background Scrub
  const exploreSection = document.getElementById('explore');
  if (exploreSection) {
    const exploreBg = exploreSection.querySelector('.absolute.inset-0.z-0');
    if (exploreBg) {
      gsap.fromTo(exploreBg, 
        { yPercent: -12, scale: 1.08 },
        {
          yPercent: 12,
          scale: 1.01,
          ease: 'none',
          scrollTrigger: {
            trigger: exploreSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          }
        }
      );
    }
  }

  // 4. Interactive Timeline Scrubbing
  const timelineSection = document.getElementById('timeline');
  if (timelineSection) {
    const timelineTrack = document.getElementById('timeline-track');
    if (timelineTrack) {
      // Add glowing vertical Animus sync beam
      const beam = document.createElement('div');
      beam.className = 'absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 bg-gradient-to-b from-secondary via-secondary/70 to-transparent pointer-events-none transform -translate-x-1/2 z-0 origin-top';
      timelineTrack.parentElement?.appendChild(beam);

      gsap.fromTo(beam, 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineSection,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5,
          }
        }
      );
    }

    // Timeline nodes 3D reveal
    const timelineItems = timelineSection.querySelectorAll('.timeline-node');
    timelineItems.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      gsap.from(item, {
        opacity: 0,
        x: isLeft ? -40 : 40,
        scale: 0.96,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true,
        }
      });
    });
  }

  // 5. Section Headers Parallax Reveal
  const sectionHeaders = document.querySelectorAll('section h2, section .ac-chapter');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      opacity: 0,
      y: 28,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // 6. Animus Dynamic HUD Coordinate Scramble on Scroll
  const hudBracket = document.querySelector('.ac-hud__bracket--tl');
  if (hudBracket) {
    let lastLoggedScroll = 0;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (Math.abs(scroll - lastLoggedScroll) > 50) {
        lastLoggedScroll = scroll;
        hudBracket.setAttribute('data-sync', `0x${Math.floor(scroll * 1.618).toString(16).toUpperCase()}`);
      }
    }, { passive: true });
  }

  return true;
}
