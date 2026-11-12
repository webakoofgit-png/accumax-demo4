import { FIELD_IMAGES, FIELD_SERVICE_IMAGES } from './field-images';
import { Heading } from './components/Heading';
import { ClientLogoCarousel } from './components/ClientLogoCarousel';
import { CompanyStats } from './components/CompanyStats';
import { ProjectPerspectivesGrid } from './components/ProjectPerspectivesGrid';
import logoMark from './assets/images/logo-mark.svg';
import { Careers } from './components/Careers';
import { VideoGallery } from './components/VideoGallery';
import aboutPerspective from "./assets/home page img/_A CONNECTED PERSPECTIVE.png";
import homeBanner from "./assets/home banners/banner1.png";
import { OpeningFilm } from "./components/OpeningFilm";
import { useHomepageMotion } from "./motion/useHomepageMotion";
import { ProjectManagementProcess } from "./components/ProjectManagementProcess";
import { IndustryWindows } from "./components/IndustryWindows";
import { useEnquiry } from "./components/EnquiryPopup";
import { EngineeringPath } from "./components/EngineeringPath";
import { CustomCursor } from "./components/CustomCursor";
import { ABOUT_CONTENT, COMPANY_PROFILE, PAGE_DESCRIPTIONS } from "./company-content";
import "./components/project-perspectives.css";
import "./components/story-colors.css";
import "./components/engineering-step-thumbnails.css";
import "./projects-page.css";
import { useWeb3Form } from './forms/useWeb3Form';
import { PhoneInput } from './forms/PhoneInput';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Menu,
  X,
  Plus,
  Minus,
  Check,
  Download,
  Mail,
  Phone,
  MapPin,
  Zap,
  ShieldCheck,
  Settings2,
  Globe,
  Search,
  UserRound,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  COMPANY,
  SERVICES,
  SERVICE_OPTIONS,
  INDUSTRIES,
  PROJECTS,
  GALLERY,
  GALLERY_CAPTIONS,
  QUALITY_POINTS,
  CLIENT_LOGOS,
  EXPERTISE_CATEGORIES,
} from "./data";
gsap.registerPlugin(ScrollTrigger);
const IMAGE_ASSETS = import.meta.glob(
  "/src/assets/**/*.{jpg,jpeg,png,webp,svg}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;
const PERSPECTIVE_IMAGES: Record<string, string> = {
  "epc-projects": "/home page img/04  PROJECT PERSPECTIVES/EPC Projects.png",
  "scada-relay-testing":
    "/home page img/04  PROJECT PERSPECTIVES/Scada & Relay Testing.png",
  export: "/home page img/04  PROJECT PERSPECTIVES/Export.png",
  "substation-testing-commissioning":
    "/home page img/04  PROJECT PERSPECTIVES/Substation - T&C.png",
  "fabrication-civil-work":
    "/home page img/04  PROJECT PERSPECTIVES/Fabrication & Civil Work.png",
  "gis-erection-supervision":
    "/home page img/04  PROJECT PERSPECTIVES/GIS Erection & Supervision.png",
  "solar-ev-station":
    "/home page img/04  PROJECT PERSPECTIVES/Solar & EV Station.png",
  trading: "/home page img/04  PROJECT PERSPECTIVES/Trading.png",
  ...FIELD_SERVICE_IMAGES,
};
const PERSPECTIVE_CAPTIONS: Record<string, string> = {
  "epc-projects": "Power infrastructure, end to end.",
  "scada-relay-testing": "Automation, protection and relay testing.",
  export: "Substation equipment, delivered worldwide.",
  "substation-testing-commissioning": "Testing and commissioning across voltage levels.",
  "fabrication-civil-work": "Civil works and structural fabrication.",
  "gis-erection-supervision": "GIS installation and site supervision.",
  "solar-ev-station": "Solar power and EV charging infrastructure.",
  trading: "Equipment and materials for your project.",
};
const Img = ({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) => (
  <img
    src={IMAGE_ASSETS["/src/assets" + src] ?? src}
    alt={alt}
    className={className}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
  />
);
const Button = ({
  to,
  children,
  light = false,
}: {
  to: string;
  children: React.ReactNode;
  light?: boolean;
}) => (
  <Link className={`button ${light ? "light" : ""}`} to={to}>
    {children}
  </Link>
);
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
const HEADER_LINKS = [
  ['About Us', '/about'],
  ['Expertise', '/services'],
  ['Industry Solutions', '/industries'],
  ['Featured Works', '/featured-works'],
  ['Ideas & Insights', '/gallery'],
  ['Projects', '/projects'],
  ['Careers', '/careers'],
] as const;
function Header() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [small, setSmall] = useState(false);
  const path = useLocation();
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [path.pathname]);
  useEffect(() => {
    const f = () => setSmall(window.scrollY > 60);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
      if (e.key === "Tab") {
        const items = document.querySelectorAll<HTMLElement>(
          ".mobile-menu a,.mobile-menu button",
        );
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [open]);
  return (
    <>
      <header className={`header ${small ? "compact" : ""}`}>
        <Link to="/" aria-label="Accumax Controls home">
          <Img src={COMPANY.logo} alt="Accumax Controls Pvt. Ltd." eager />
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          {HEADER_LINKS.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="header-right">
          <span className="header-socials" aria-label="Social media">
            <a
              href="https://www.instagram.com/accumax_controls?stkn=dW12a2xrdTV5MW13"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={23} />
            </a>
            <a
              href="https://www.facebook.com/share/19o5XUanBS/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={23} />
            </a>
            <a
              href="https://www.linkedin.com/company/accumaxcontrols/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={23} />
            </a>
          </span>
          <button
            className="mobile-toggle"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : .25 }}
          >
            <button
              ref={close}
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
            <span className="eyebrow mobile-menu-label">EXPLORE ACCUMAX</span>
            {[["Home", "/"], ...HEADER_LINKS].map(([n, to], i) => (
              <motion.div
                key={to}
                initial={reduced ? false : { y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: reduced ? 0 : i * 0.055, duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] }}
              >
                <Link to={to} onClick={() => setOpen(false)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b>{n}</b>
                  <ArrowUpRight />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
function Footer() {
  return (
    <>
      <section className="contact-band section">
        <span className="eyebrow">LET'S ENGINEER WHAT'S NEXT</span>
        <div>
          <Heading as="h2">Have an engineering challenge?</Heading>
        </div>
        <p>From a first brief to a defined scope, let&apos;s plan the engineering, site work and equipment your project needs.</p>
        <div className="contact-band-actions">
          <a className="site-cta light" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
            <span className="whatsapp-cta-label">Enquire on WhatsApp</span>
          </a>
        </div>
      </section>
      <footer className="section">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Img src={COMPANY.logo} alt="Accumax Controls" />
            <p className="footer-tagline">
              <span className="footer-tagline-main">{COMPANY.tagline} Pune, India.</span>
              <span className="footer-tagline-connection">Connected to the world.</span>
            </p>
            <iframe className="office-map footer-logo-map" title="Accumax Controls office location in Kothrud, Pune" src={COMPANY.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            {[
              ["About", "/about"],
              ["Services", "/services"],
              ["Featured Works", "/featured-works"],
              ["Projects", "/projects"],
              ["Industry Solutions", "/industries"],
              ["Quality & Safety", "/quality-safety"],
            ].map(([n, to]) => (
              <Link key={to} to={to}>
                {n}
              </Link>
            ))}
          </div>
          <div>
            <span className="eyebrow">RESOURCES</span>
            {[
              ["Ideas & Insights", "/gallery"],
              ["Videos", "/videos"],
              ["Catalogue", "/catalogue"],
              ["Careers", "/careers"],
              ["Get in Touch", "/contact"],
            ].map(([n, to]) => (
              <Link key={to} to={to}>
                {n}
              </Link>
            ))}
          </div>
          <div>
            <span className="eyebrow">GET IN TOUCH</span>
            <a href={"mailto:" + COMPANY.emails[0]}>{COMPANY.emails[0]}</a>
            <a href="tel:+919920177441">{COMPANY.phones[0]}</a>
            <p className="footer-address">{COMPANY.address}</p>
            <a href={COMPANY.mapsUrl} target="_blank" rel="noreferrer">View on Google Maps <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <div className="footer-word">
          ACCUMAX<span>&reg;</span>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 All Rights Reserved By{" "}
            <strong>Accumax Controls Private Limited</strong> | Designed By{" "}
            <a href="https://webakoof.com/" target="_blank" rel="noreferrer">
              <strong>Webakoof</strong>
            </a>
          </span>
          <span>{COMPANY.tagline}</span>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            Back to top <ArrowUp size={15} />
          </button>
        </div>
      </footer>
    </>
  );
}
function ServicesList() {
  const [active, setActive] = useState(0);
  return (
    <div className="services-layout">
      <div className="service-preview">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Img
              src={EXPERTISE_CATEGORIES[Math.max(0, active)].image}
              alt={EXPERTISE_CATEGORIES[Math.max(0, active)].title}
            />
          </motion.div>
        </AnimatePresence>
        <span className="image-caption">
          {EXPERTISE_CATEGORIES[Math.max(0, active)].num} / ENGINEERED FOR YOUR REQUIREMENTS
        </span>
        <p>{EXPERTISE_CATEGORIES[Math.max(0, active)].short}</p>
      </div>
      <div className="service-list">
        {EXPERTISE_CATEGORIES.map((s, i) => (
          <div
            className={active === i ? "selected" : ""}
            key={s.slug}
            onMouseEnter={() => {
              if (matchMedia("(min-width: 641px)").matches) setActive(i);
            }}
            onFocus={() => {
              if (matchMedia("(min-width: 641px)").matches) setActive(i);
            }}
          >
            <Link to={"/services/" + s.slug}>
              <span>{s.num}</span>
              <Heading as="h3">{s.title}</Heading>
              <ArrowUpRight />
            </Link>
            {s.relatedSlug && <Link className="text-link site-cta" to={'/services/' + s.relatedSlug}>Explore Trading <ArrowUpRight size={16} /></Link>}
            <div className="service-mobile">
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                aria-expanded={active === i}
              >
                {active === i ? <Minus /> : <Plus />}
                <span>Explore service</span>
              </button>
              {active === i && (
                <>
                  <Img src={s.image} alt={s.title} />
                  <p>{s.short}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Story() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const photos = [
    ['/images/gallery/3.jpg', 'Substation engineering and project planning'],
    ['/images/hero-testing.jpg', 'Electrical protection and relay testing'],
    ['/images/gallery/13.jpg', 'Substation protection and control systems'],
    ['/images/products/solar-and-ev-station.jpg', 'Solar power and EV charging infrastructure'],
  ];
  const choose = (index: number) => setActive((index + 4) % 4);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const context = gsap.context(() => {
      const panels = Array.from(ref.current!.querySelectorAll('.story-panel'));
      gsap.set(panels, { autoAlpha: 0, y: 0 });
      gsap.set(panels[active], { autoAlpha: 1 });
      if (!reduced) gsap.fromTo(panels[active], { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'power2.out' });
    }, ref);
    return () => context.revert();
  }, [active, reduced]);
  return (
    <section className="story story--animated story--carousel" ref={ref} data-active={active} aria-label="The principles behind every connection" onPointerDown={event => { swipe.current = { x: event.clientX, y: event.clientY }; }} onPointerCancel={() => { swipe.current = null; }} onPointerUp={event => {
      const start = swipe.current; swipe.current = null;
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) choose(active + (dx < 0 ? 1 : -1));
    }}>
      <div className="story-photo">
        <Img
          src={photos[active][0]}
          alt={photos[active][1]}
        />
      </div>
      <div className="story-label eyebrow">
        THE PRINCIPLES BEHIND EVERY CONNECTION
      </div>
      {["Engineering", "Precision", "Reliability", "Progress,\nby design."].map(
        (t, i) => (
          <div className="story-panel" key={t} aria-hidden={active !== i}>
            <span className="eyebrow">0{i + 1} / OUR APPROACH</span>
            <Heading as="h2">{t}</Heading>
            <p>
              {
                [
                  "From design intent to site execution.",
                  "Protection, control and testing, considered together.",
                  "Infrastructure designed around the work it must do.",
                  "Accumax brings engineering, equipment and execution together for the energy sector.",
                ][i]
              }
            </p>
          </div>
        ),
      )}
      <div className="story-bottom story-controls"><button type="button" aria-label="Previous approach" onClick={() => choose(active - 1)}><ArrowLeft size={20} /></button><button type="button" aria-label="Next approach" onClick={() => choose(active + 1)}><ArrowRight size={20} /></button><span aria-live="polite" aria-atomic="true">0{active + 1} / 04</span></div>
    </section>
  );
}
function ProjectsPage() {
  const [category, setCategory] = useState('All projects');
  const scopeImages: Record<string, string> = {
    'GIS Substation': FIELD_IMAGES.gisHall,
    'AIS Substation': FIELD_IMAGES.outdoorSubstation,
    'Solar': '/images/products/solar-and-ev-station.jpg',
    'Protection': FIELD_IMAGES.relayTestKit,
    'E-House': '/images/products/substation-t-and-c.jpg',
    'EV Infrastructure': '/images/products/solar-and-ev-station.jpg',
  };
  const categories = ['All projects', ...new Set(PROJECTS.map(project => project.category))];
  const projects = category === 'All projects' ? PROJECTS : PROJECTS.filter(project => project.category === category);
  return <section className="section projects-page" aria-labelledby="project-portfolio-title">
    <header className="projects-page-heading">
      <span className="eyebrow">PROJECTS</span>
      <Heading as="h1" id="project-portfolio-title">Engineering in action.</Heading>
      <p>Explore project scopes across substations, protection systems, solar power and EV charging. See how engineering, equipment and site execution come together.</p>
    </header>
    <div className="projects-page-filters" role="group" aria-label="Filter projects by category">
      {categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <p className="projects-page-count" role="status" aria-live="polite" aria-atomic="true">{projects.length} project {projects.length === 1 ? 'profile' : 'profiles'}{category === 'All projects' ? '' : ` / ${category}`}</p>
    <div className="projects-page-grid">
      {projects.map(project => <article className="projects-page-card" key={project.slug}>
        <Link className="projects-page-image" to={'/projects/' + project.slug} aria-label={`View ${project.title}`}>
          <Img src={scopeImages[project.category] ?? project.image} alt={project.title} />
          <span>{project.num} / {project.category}</span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
        <div className="projects-page-copy">
          <span className="eyebrow">PROJECT SCOPE</span>
          <Heading as="h2">{project.title}</Heading>
          <ul>{project.scope.map(scope => <li key={scope}><Check size={15} aria-hidden="true" /><span>{scope}</span></li>)}</ul>
          <Link className="site-cta text-link" to={'/projects/' + project.slug}>Explore project <ArrowUpRight size={17} /></Link>
        </div>
      </article>)}
    </div>
    <p className="projects-page-note">{PROJECTS[0].note}</p>
  </section>;
}
function ProjectCards({ all = false }: { all?: boolean }) {
  return (
    <div className={all ? "project-grid" : "project-track"}>
      {PROJECTS.slice(0, all ? 6 : 4).map((p) => (
        <Link className="project-card" key={p.slug} to={"/projects/" + p.slug}>
          <div className="project-image">
            <Img src={p.image} alt={p.title} />
            <span className="sample">SAMPLE PROJECT</span>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </div>
          <div className="project-meta">
            <span>
              {p.num} / {p.category}
            </span>
            <span>LOCATION · TO BE VERIFIED</span>
          </div>
          <Heading as="h3">{p.title}</Heading>
          <span className="text-link site-cta">
            View project <ArrowUpRight size={15} />
          </span>
        </Link>
      ))}
    </div>
  );
}
function CounterItem({
  value,
  label,
  delay = 0,
  suffix = "+",
}: {
  value: number;
  label: string;
  delay?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const startedAt = performance.now();
        const kickoff = startedAt + delay;
        const tick = (now: number) => {
          if (now < kickoff) {
            frame = requestAnimationFrame(tick);
            return;
          }
          const progress = Math.min((now - kickoff) / 1900, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, delay]);
  return (
    <div className="counter-item" aria-label={`${value}${suffix} ${label}`}>
      <span className="counter-stat">
        <span className="counter-number" aria-hidden="true">
          <span ref={ref}>{count.toLocaleString("en-IN")}</span>
          <span className="counter-plus">{suffix}</span>
        </span>
      </span>
      <span className="counter-label">{label}</span>
    </div>
  );
}
function CounterBar() {
  return (
    <section className="counter-bar" aria-label="Accumax at a glance">
      {[
        { value: 501, label: "Projects Done" },
        { value: 1381, label: "Happy Clients" },
        {
          value: 99,
          label: "Experienced Staff",
          suffix: "%",
        },
        { value: 11, label: "Awards Won" },
      ].map((item, index) => (
        <CounterItem
          key={item.label}
          value={item.value}
          label={item.label}
          delay={index * 140}
          suffix={item.suffix}
        />
      ))}
    </section>
  );
}
function ProjectsSection() {
  const track = useRef<HTMLDivElement>(null);
  const resumeAt = useRef(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const element = track.current;
    if (!element || reducedMotion) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= .25; }, { threshold: .25 });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden || Date.now() < resumeAt.current || document.querySelector('dialog[open]')) return;
      if (element.closest('.projects-section')?.contains(document.activeElement)) return;
      if (matchMedia('(hover: hover)').matches && element.matches(':hover')) return;
      const card = element.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0);
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
      element.scrollTo({ left: atEnd ? 0 : element.scrollLeft + step, behavior: 'smooth' });
    }, 3500);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [reducedMotion]);
  return (
    <section className="section projects-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / PROJECT PERSPECTIVES</span>
          <Heading as="h2" className="section-title">Expertise <em>in action</em></Heading>
        </div>
      </div>
      <div className="perspective-card-grid" id="perspective-cards" ref={track} role="region" aria-label="Engineering expertise cards" tabIndex={0}
        onPointerDown={() => { resumeAt.current = Date.now() + 6500; }}
        onPointerUp={() => { resumeAt.current = Date.now() + 6500; }}
        onPointerCancel={() => { resumeAt.current = Date.now() + 6500; }}>
        {SERVICES.filter(service => service.slug !== 'trading').map(service => service.slug === 'gis-erection-supervision' ? { ...service, title: 'GIS & Trading' } : service).map((s) => (
          <Link
            className="perspective-service-card"
            key={s.slug}
            to={"/services/" + s.slug}
          >
            <div className="perspective-service-media">
              <Img src={PERSPECTIVE_IMAGES[s.slug] ?? s.image} alt={s.title} />
              <div className="perspective-image-overlay" aria-hidden="true">
                <div className="perspective-overlay-copy"><strong>{s.title}</strong><p>{s.short}</p></div>
              </div>
              <span className="perspective-service-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
            </div>
            <div className="perspective-service-body">
              <Heading as="h3">{s.title}</Heading>
              <p>{PERSPECTIVE_CAPTIONS[s.slug] ?? s.short}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="perspective-bottom"><Button to="/projects">Explore all projects</Button></div>
    </section>
  );
}
function Industries({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState(-1);
  return (
    <div className="industry-matrix">
      {INDUSTRIES.slice(0, full ? 16 : 6).map((v, i) => (
        <Link
          key={v.name}
          to={"/contact?industry=" + encodeURIComponent(v.name)}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(-1)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(-1)}
        >
          <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <Heading as="h3">{v.name}</Heading>
          <p>{v.applications}</p>
          <ArrowUpRight />
          {active === i && <Img src={v.image} alt="" />}
        </Link>
      ))}
    </div>
  );
}
function AboutBlock() {
  return (
    <section className="section about-block">
      <div className="about-photo">
        <Img src={aboutPerspective} alt="Accumax engineering operations" />
        <span>ENGINEERING WITH PURPOSE, SINCE DAY ONE.</span>
      </div>
      <div className="about-copy">
        <span className="eyebrow">01 / A CONNECTED PERSPECTIVE</span>
        <Heading as="h2" className="section-title">
          <span className="motion-line"><span>Big-picture thinking</span></span>
          <em className="motion-line"><span>Ground-level expertise</span></em>
        </Heading>
        <p>{COMPANY_PROFILE.introduction}</p>
        <p>{COMPANY_PROFILE.capabilities}</p>
        <p>{COMPANY_PROFILE.supply}</p>
        <Link className="button about-story-button" to="/about">
          Discover our story
        </Link>
        <span className="about-brand-watermark" aria-hidden="true">
          <img src={logoMark} alt="" />
        </span>
      </div>
    </section>
  );
}
function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  useHomepageMotion(homeRef);
  return (
    <div className="home-page" ref={homeRef}>
      <section className="hero hero-banner">
        <OpeningFilm poster={homeBanner} />
        <div className="hero-banner-shade" />
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> ENGINEERING · INFRASTRUCTURE ·
            INNOVATION
          </span>
          <Heading as="h1" className="hero-single-line" aria-label={COMPANY.tagline}>
            <span className="hero-line"><span>{COMPANY.tagline}</span></span>
          </Heading>
          <p>
            From substations to solar and EV charging, connect your next project with the engineering behind it.
          </p>
          <div className="hero-actions">
            <Link className="button hero-action hero-action-primary" to="/services">
              Explore expertise
            </Link>
            <Link className="button hero-action hero-action-secondary" to="/contact">
              Start a project
            </Link>
          </div>
        </div>
      </section>
      <AboutBlock />
      <Story />
      <ProjectManagementProcess />
      <ProjectPerspectivesGrid />
      <CompanyStats />
      <div className="engineering-scroll-scene">
        <EngineeringPath />
      </div>
      <section className="section industries-home">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / INDUSTRIES WE SERVE</span>
            <Heading as="h2" className="section-title">Different industries <em>One ambition</em></Heading>
          </div>
        </div>
        <IndustryWindows />
      </section>
      <section className="image-break">
        <Img
          src="/images/transmission-wide.jpg"
          alt="Power transmission infrastructure"
        />
        <div>
          <span className="eyebrow">06 / THE CONNECTION THAT MATTERS</span>
          <Heading as="h2" className="section-title">
            Where technical expertise
            <br />
            <em>meets execution</em>
          </Heading>
          <Link className="text-link site-cta" to="/services">
            See what we do <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="section why">
        <span className="eyebrow">07 / WHY ACCUMAX</span>
        <Heading as="h2" className="section-title">
          Built for complexity
          {" "}
          <em>Focused on reliability</em>
        </Heading>
        <div className="strengths">
          {[
            [
              "01",
              "One connected project view",
              "Bring substation equipment, automation and site work into the same plan, with clear interfaces between each discipline.",
            ],
            [
              "02",
              "Protection with a purpose",
              "Relay programming, setting calculations and system audits help teams assess how their electrical protection responds.",
            ],
            [
              "03",
              "Equipment meets engineering",
              "Discuss product specifications alongside installation needs, so sourcing decisions support the work ahead.",
            ],
          ].map((s) => (
            <Reveal key={s[0]}>
              <span className="eyebrow">{s[0]}</span>
              <Heading as="h3">{s[1]}</Heading>
              <p>{s[2]}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="clients section">
        <div className="clients-heading">
          <span className="eyebrow">08 / CONNECTIONS BUILT ON TRUST</span>
          <Heading as="h2" className="section-title">Trusted by <em>industry leaders</em></Heading>
        </div>
        <ClientLogoCarousel />
      </section>
      <section className="home-contact section">
        <div className="home-contact-heading">
          <div>
            <span className="eyebrow">09 / LET&apos;S CONNECT</span>
            <Heading as="h2" className="section-title">Let&apos;s discuss <em>your next project</em></Heading>
          </div>
        </div>
        <div className="home-contact-grid">
          <Link className="home-contact-card" to="/contact">
            <div className="home-contact-image">
              <Img
                src={FIELD_IMAGES.testing}
                alt="Engineer testing electrical protection equipment"
              />
            </div>
            <Heading as="h3"><span className="motion-line"><span>Engineering</span></span>{' '}<span className="motion-line"><span>enquiries</span></span></Heading>
            <p>Planning a new installation or upgrading an existing system? Share your scope, site and schedule.</p>
            <span className="home-contact-link site-cta">
              Submit your enquiry <ArrowRight size={18} />
            </span>
          </Link>
          <Link className="home-contact-card" to="/services/export">
            <div className="home-contact-image">
              <Img
                src="/images/products/export-projects.jpg"
                alt="Equipment prepared for export"
              />
            </div>
            <Heading as="h3"><span className="motion-line"><span>Equipment &amp;</span></span>{' '}<span className="motion-line"><span>export support</span></span></Heading>
            <p>
              Send your equipment list, specifications and destination to discuss the right supply scope.
            </p>
            <span className="home-contact-link site-cta">
              Explore export services <ArrowRight size={18} />
            </span>
          </Link>
          <Link className="home-contact-card" to="/contact">
            <div className="home-contact-image">
              <Img src={FIELD_IMAGES.team} alt="Accumax Controls team" />
            </div>
            <Heading as="h3"><span className="motion-line"><span>Let’s work</span></span>{' '}<span className="motion-line"><span>together</span></span></Heading>
            <p>Bring your project brief. We will help define the engineering, site or supply support you need.</p>
            <span className="home-contact-link site-cta">
              Get in touch <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
function PageTop({
  label,
  title,
  description,
  image,
}: {
  label: string;
  title: string;
  description: string;
  image?: string;
}) {
  return (
    <section className={"page-top section " + (image ? "has-image" : "")}>
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        {label}
      </div>
      <div>
        <span className="eyebrow">ACCUMAX / {label.toUpperCase()}</span>
        <Heading as="h1">{title}</Heading>
        <p>{description}</p>
      </div>
      {image && <Img src={image} alt={label} eager />}
    </section>
  );
}
function PerspectiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const copy = section?.querySelector<HTMLElement>(".perspective-copy");
    if (!section || !copy) return;
    const panels = Array.from(copy.children) as HTMLElement[];
    const resize = new ResizeObserver(() => {
      const height = Math.ceil(
        Math.max(
          ...panels.map(
            (panel) =>
              Array.from(panel.children).reduce(
                (total, child) => total + (child as HTMLElement).offsetHeight,
                0,
              ) + 48,
          ),
        ),
      );
      copy.style.setProperty("--perspective-panel-height", `${height}px`);
    });
    panels.forEach((panel) =>
      Array.from(panel.children).forEach((child) => resize.observe(child)),
    );
    let transitioning = false;
    let transition: ReturnType<typeof gsap.to> | undefined;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    const isActive = () => {
      const bounds = copy.getBoundingClientRect();
      const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 68;
      return bounds.top >= headerBottom && bounds.bottom <= window.innerHeight - 12;
    };
    const advance = (direction: number) => {
      if (transitioning) return true;
      const max = copy.scrollHeight - copy.clientHeight;
      if ((direction > 0 && copy.scrollTop >= max - 1) || (direction < 0 && copy.scrollTop <= 1)) return false;
      const index = Math.round(copy.scrollTop / copy.clientHeight);
      const target = Math.max(0, Math.min(max, (index + direction) * copy.clientHeight));
      transitioning = true;
      transition = gsap.to(copy, {
        scrollTop: target,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .4,
        ease: 'power2.out',
        onComplete: () => {
          releaseTimer = setTimeout(() => { transitioning = false; }, 140);
        },
      });
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !isActive()) return;
      if (advance(Math.sign(event.deltaY))) event.preventDefault();
    };
    let touchStart: { x: number; y: number } | undefined;
    let gestureConsumed = false;
    const onTouchStart = (event: TouchEvent) => {
      gestureConsumed = false;
      touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touchStart || event.touches.length !== 1) return;
      if (gestureConsumed) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      const dy = touchStart.y - event.touches[0].clientY;
      const dx = touchStart.x - event.touches[0].clientX;
      if (Math.abs(dy) < 8 || Math.abs(dx) > Math.abs(dy) || !isActive()) return;
      if (advance(Math.sign(dy))) {
        gestureConsumed = true;
        if (event.cancelable) event.preventDefault();
      }
    };
    const onTouchEnd = () => {
      touchStart = undefined;
      gestureConsumed = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || !isActive()) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      const forward = ['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
      const backward = ['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      if ((forward || backward) && advance(forward ? 1 : -1)) event.preventDefault();
    };
    let previousPageY = window.scrollY;
    const onPageScroll = () => {
      const pageY = window.scrollY;
      const movingDown = pageY > previousPageY;
      previousPageY = pageY;
      const max = copy.scrollHeight - copy.clientHeight;
      if (!movingDown || max < 1 || (!transitioning && !gestureConsumed && copy.scrollTop >= max - 1)) return;
      const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 68;
      const bounds = copy.getBoundingClientRect();
      const sectionBounds = section.getBoundingClientRect();
      const desiredTop = Math.max(headerBottom + 12, Math.min(
        headerBottom + 12 + bounds.top - sectionBounds.top,
        window.innerHeight - copy.clientHeight - 20,
      ));
      const stopAt = Math.max(0, pageY + bounds.top - desiredTop);
      // Catch a swipe or its momentum even when it began above this section.
      if (pageY > stopAt + 1) {
        previousPageY = stopAt;
        window.scrollTo({ top: stopAt, behavior: 'instant' });
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener('scroll', onPageScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      resize.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener('scroll', onPageScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      transition?.kill();
      if (releaseTimer) clearTimeout(releaseTimer);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="section perspective-simple"
      aria-labelledby="perspective-title"
    >
      <div className="perspective-intro">
        <span className="eyebrow">OUR PERSPECTIVE</span>
        <Heading as="h2" id="perspective-title">
          Understand the system.
          <br />
          <em>Respect every detail.</em>
        </Heading>
      </div>
      <div
        className="perspective-copy"
        tabIndex={0}
        role="region"
        aria-label="Scroll through engineering, exports and values"
      >
        <div>
          <Heading as="h3">Engineering</Heading>
          <p>
            Accumax Controls works across substation infrastructure, GIS, AIS,
            SAS, AMC, E-House solutions and testing and commissioning.
          </p>
        </div>
        <div>
          <Heading as="h3">Export &amp; supply</Heading>
          <p>
            Alongside engineering services, the company exports testing kits,
            substation equipment, tools, building materials and electrical
            goods.
          </p>
        </div>
        <div>
          <Heading as="h3">Our Values</Heading>
          <p>{COMPANY_PROFILE.values.join(' · ')}.</p>
        </div>
      </div>
    </section>
  );
}
function About() {
  return (
    <>
      <section
        className="section about-editorial"
        aria-labelledby="about-title"
      >
        <Heading as="h1" id="about-title">
          About <span className="about-title-muted">Accumax</span>
        </Heading>
        <div className="about-editorial-layout">
          <div className="about-editorial-copy">
            <span className="eyebrow">A CONNECTED PERSPECTIVE</span>
            <Heading as="h2">
              Big-picture thinking.
              <br />
              <span className="about-heading-muted">Ground-level expertise.</span>
            </Heading>
            <p>{ABOUT_CONTENT.introduction}</p>
            <p>{ABOUT_CONTENT.delivery}</p>
            <p>{ABOUT_CONTENT.partnership}</p>
            <Link className="perspective-simple-link site-cta" to="/services">
              Our capabilities <ArrowUpRight size={18} />
            </Link>
          </div>
          <figure className="about-editorial-image">
            <Img
              src="/images/about-01.jpg"
              alt="Electrical substation infrastructure supported by Accumax"
              eager
            />
            {/* <figcaption>ENGINEERING WITH PURPOSE, SINCE DAY ONE.</figcaption> */}
          </figure>
        </div>
      </section>
      <section className="section about-purpose" aria-label="Our mission and vision">
        <div className="about-purpose-grid">
          <article className="about-purpose-card" aria-labelledby="about-mission-title">
            <Heading as="h2" id="about-mission-title">Our Mission</Heading>
            <p>{COMPANY_PROFILE.mission}</p>
          </article>
          <article className="about-purpose-card" aria-labelledby="about-vision-title">
            <Heading as="h2" id="about-vision-title">Our Vision</Heading>
            <p>{COMPANY_PROFILE.vision}</p>
          </article>
        </div>
      </section>
      <section className="section about-capabilities" aria-labelledby="about-capabilities-title">
        <div className="about-capabilities-heading">
          <span className="eyebrow">KEY CAPABILITIES</span>
          <Heading as="h2" id="about-capabilities-title">The expertise behind your power infrastructure.</Heading>
        </div>
        <div className="about-capabilities-grid">
          {ABOUT_CONTENT.capabilities.map(capability => (
            <article className="about-capability-card" key={capability.title}>
              <Heading as="h3">{capability.title}</Heading>
              <p>{capability.text}</p>
              <Link className="site-cta" to={capability.to} aria-label={`${capability.to.startsWith('/contact') ? 'Discuss requirements' : 'Explore service'}: ${capability.title}`}>
                {capability.to.startsWith('/contact') ? 'Discuss requirements' : 'Explore service'}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <PerspectiveSection />
    </>
  );
}
function ExpertiseList({ animated = false }: { animated?: boolean }) {
  return (
    <div className={`expertise-list${animated ? ' expertise-motion' : ''}`}>
      {EXPERTISE_CATEGORIES.map((item) => (
        <details className="expertise-entry" key={item.num}>
          <summary>
            <span className="eyebrow">{item.num}</span>
            <Heading as="h3">{item.title}</Heading>
            {animated && <span className="expertise-peek" aria-hidden="true"><Img src={item.image} alt=""/></span>}
            <ArrowUpRight />
          </summary>
          <div className="expertise-detail">
            <div>
              <p>{item.short}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {animated && <Link className="text-link site-cta expertise-service-link" to={'/services/' + item.slug}>Discuss this expertise <ArrowUpRight size={16}/></Link>}
            </div>
            <Img src={item.image} alt={item.title} />
          </div>
        </details>
      ))}
    </div>
  );
}
function ServiceDetail() {
  const { slug } = useParams();
  const openEnquiry = useEnquiry();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <NotFound />;
  return (
    <>
      <PageTop
        label="Services"
        title={s.title}
        description={s.short}
        image={s.image}
      />
      <section className="section two-col service-overview">
        <div>
          <span className="eyebrow">{s.num} / EXPERTISE</span>
          <Heading as="h2">{s.slug === 'epc-projects' ? <>One project.<br/><em>Every stage<br/>connected.</em></> : s.headline}</Heading>
        </div>
        <div className="service-overview-intro">
          <p>{s.intro}</p>
          {s.slug === 'panel-cleaning' ? <button type="button" className="button" onClick={() => openEnquiry(s.title)}>Enquire about {s.title}</button> : <Button to={"/contact?service=" + encodeURIComponent(s.title)}>Discuss this service</Button>}
        </div>
        <div className="service-overview-scope">
          <Heading as="h3" className="service-scope-heading">What we cover</Heading>
          <ul className="capabilities">
            {s.capabilities.map((c) => (
              <li key={c}>
                <Check size={17} />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="service-overview-details">
          <div className="service-detail-copy">
            {s.details.map(detail => <div key={detail.title}><Heading as="h3">{detail.title}</Heading><p>{detail.text}</p></div>)}
            <div><Heading as="h3">Where it fits</Heading><p>{s.applications}</p></div>
          </div>
        </div>
          <aside className="service-enquiry-brief" aria-labelledby="service-brief-title">
            <span className="eyebrow">LET&apos;S DEFINE YOUR SCOPE</span>
            <Heading as="h3" id="service-brief-title">A useful first conversation starts here.</Heading>
            <p>Share what you have available:</p>
            <ul>{s.enquiryItems.map(item => <li key={item}>{item}</li>)}</ul>
            {s.slug === 'panel-cleaning' ? <button type="button" className="text-link site-cta" onClick={() => openEnquiry(s.title)}>Tell us about your panels <ArrowUpRight size={18} /></button> : <Link className="text-link site-cta" to={"/contact?service=" + encodeURIComponent(s.title)}>Tell us about your project <ArrowUpRight size={18} /></Link>}
          </aside>
      </section>
      <section className="section service-explore-more">
        <span className="eyebrow">EXPLORE MORE</span>
        <ServicesList />
      </section>
    </>
  );
}
function ProjectDetail() {
  const { slug } = useParams();
  const p = PROJECTS.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <PageTop
        label="Projects"
        title={p.title}
        description={p.note}
        image={p.image}
      />
      <section className="section two-col">
        <div>
          <span className="sample inline">
            SAMPLE PROFILE · NOT A COMPLETION CLAIM
          </span>
          <Heading as="h2">{p.category}</Heading>
          <p>
            Location: awaiting verification.
            <br />
            Client and completion date: awaiting verification.
          </p>
        </div>
        <div>
          <Heading as="h3">Illustrative scope</Heading>
          <ul className="capabilities">
            {p.scope.map((s) => (
              <li key={s}>
                <Check />
                {s}
              </li>
            ))}
          </ul>
          <Button to="/contact">Discuss a similar requirement</Button>
        </div>
      </section>
    </>
  );
}
function Gallery() {
  const [filter, setFilter] = useState<'Photos' | 'Videos'>('Photos');
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  return (
    <>
      <PageTop
        label="Gallery"
        title="A closer look at the work."
        description="Equipment, engineering environments and infrastructure from the company image archive."
      />
      <section className="section gallery-section">
        <header className="gallery-heading">
          <span className="eyebrow">IDEAS &amp; INSIGHTS</span>
          <Heading as="h2">A closer look at the work.</Heading>
        </header>
        <div className="filters" role="group" aria-label="Gallery media filters">
          {(['Photos', 'Videos'] as const).map((f) => (
            <button
              type="button"
              className={filter === f ? "active" : ""}
              aria-pressed={filter === f}
              key={f}
              onClick={() => { setSelected(null); setFilter(f); }}
            >
              {f}
            </button>
          ))}
        </div>
        {filter === 'Photos' ? <div className="gallery-grid">
          {GALLERY.map((s, i) => (
            <button
              key={s}
              onClick={() => setSelected(i)}
              aria-label={"Enlarge engineering photograph " + (GALLERY.indexOf(s) + 1)}
            >
              <Img src={s} alt={GALLERY_CAPTIONS[s] ?? ("Accumax engineering archive " + (GALLERY.indexOf(s) + 1))} />
            </button>
          ))}
        </div> : <VideoGallery />}
      </section>
      {selected !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Engineering photograph"
          onClick={() => setSelected(null)}
        >
          <button
            autoFocus
            aria-label="Close photograph"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <Img
            src={GALLERY[selected]}
            alt={GALLERY_CAPTIONS[GALLERY[selected]] ?? "Enlarged company archive photograph"}
          />
        </div>
      )}
    </>
  );
}
function Contact({ career = false }: { career?: boolean }) {
  const submission = useWeb3Form();
  const query = new URLSearchParams(useLocation().search);
  const requestedInterest = query.get("service") || query.get("industry") || "";
  return (
    <>
      <PageTop
        label={career ? "Careers" : "Contact"}
        title={
          career
            ? "Bring your perspective."
            : "Great projects start with a conversation."
        }
        description={
          career
            ? "Interested in engineering, testing or project execution? Introduce yourself to the team."
            : "Tell us what you are building. Let’s explore the engineering behind it."
        }
      />
      <section className="section contact-layout">
        <div>
          <span className="eyebrow">
            {career ? "WORK WITH ACCUMAX" : "DIRECT CONNECTIONS"}
          </span>
          <Heading as="h2">{career ? "Build what matters." : "Let’s connect."}</Heading>
          <a className="contact-line" href={"mailto:" + COMPANY.emails[0]}>
            <Mail />
            {COMPANY.emails[0]}
            <ArrowUpRight />
          </a>
          <div className="contact-line contact-phone-line">
            <Phone />
            <span className="contact-phone-numbers">
              <a href="tel:+919920177441">{COMPANY.phones[0]}</a>
              <span aria-hidden="true">/</span>
              <a href="tel:+917350200025">{COMPANY.phones[1]}</a>
            </span>
          </div>
          <div className="contact-line">
            <MapPin />
            <p>{COMPANY.address}</p>
          </div>
          <a className="text-link site-cta office-directions" href={COMPANY.mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={18} /></a>
          <iframe className="office-map" title="Find the Accumax Controls office" src={COMPANY.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          {career && (
            <p className="fine">
              Share your CV, engineering discipline and site experience with our
              team. Include your preferred role and availability in your message.
            </p>
          )}
        </div>
        <form
          className="enquiry-form"
          aria-labelledby="enquiry-heading"
          aria-busy={submission.busy}
          onChange={submission.clear}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            void submission.send(data, career ? 'Career expression of interest' : 'Engineering project enquiry', 'Contact page');
          }}
        >
          <input type="checkbox" name="botcheck" hidden tabIndex={-1} aria-hidden="true" />
          <div className="enquiry-form-heading">
            <span className="eyebrow">
              {career ? "YOUR INTRODUCTION" : "YOUR PROJECT BRIEF"}
            </span>
            <Heading as="h3" id="enquiry-heading">
              {career ? "Introduce yourself" : "Tell us about your project"}
            </Heading>
            <p>
              {career
                ? "Share your experience and the role you are interested in."
                : "Share a few details so our team can understand your requirements."}
            </p>
          </div>
          <div className="form-row">
            <label>
              <span>
                Full name{" "}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </span>
              <input
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                required
                maxLength={100}
              />
            </label>
            <label>
              <span>
                Work email{" "}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </span>
              <input
                name="email"
                autoComplete="email"
                type="email"
                placeholder="you@company.com"
                required
                maxLength={254}
              />
            </label>
          </div>
          <div className={career ? "" : "form-row"}>
            <label>
              <span>
                Phone number{" "}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </span>
              <PhoneInput
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. 9876543210"
                required
              />
            </label>
            {!career && (
              <label>
                <span>
                  Company name <span className="optional-note">(optional)</span>
                </span>
                <input
                  name="company"
                  autoComplete="organization"
                  placeholder="Your organisation"
                  maxLength={150}
                />
              </label>
            )}
          </div>
          <label>
            <span>
              {career ? "Area of interest" : "Service of interest"}{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <select
              name="interest"
              required
              defaultValue={requestedInterest}
            >
              <option value="" disabled>
                Select a service
              </option>
              {requestedInterest && !SERVICE_OPTIONS.includes(requestedInterest) && <option value={requestedInterest}>{requestedInterest}</option>}
              {SERVICE_OPTIONS.map(title => <option key={title}>{title}</option>)}
            </select>
          </label>
          <label>
            <span>
              {career
                ? "Tell us about your experience"
                : "Tell us about your requirements"}{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
            <textarea
              name="message"
              rows={5}
              required
              maxLength={5000}
              aria-describedby="enquiry-message-hint"
              placeholder={
                career
                  ? "Describe your experience, key skills and preferred role."
                  : "Describe your project, location, scope and expected timeline."
              }
            />
            <span className="field-hint" id="enquiry-message-hint">
              {career
                ? "Include your key skills, experience and preferred role."
                : "Include any technical specifications that will help us understand the scope."}
            </span>
          </label>
          <label className="consent">
            <input name="consent" type="checkbox" required />
            <span>
              I agree to share these details with Accumax for this enquiry.{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </span>
          </label>
          <button className="button" type="submit" disabled={submission.busy || submission.sent}>
            {submission.busy ? 'Sending enquiry…' : submission.sent ? 'Enquiry sent' : 'Send enquiry'} <ArrowUpRight size={18} />
          </button>
          {submission.error && <div className="form-feedback" role="alert">{submission.error}</div>}
          {submission.sent && <div className="form-feedback" role="status">Your enquiry has been sent successfully. Our team will get in touch with you.</div>}
        </form>
      </section>
    </>
  );
}
function Quality() {
  return (
    <>
      <PageTop
        label="Quality & Safety"
        title="Standards that shape the work."
        description="Clear specifications. Consistent checks. Safer working practices. Quality starts with how the work is planned."
        image="/images/hero-testing.jpg"
      />
      <section className="section policy-list">
        {QUALITY_POINTS.map((p, i) => (
          <Reveal key={p}>
            <span className="eyebrow">0{i + 1}</span>
            <ShieldCheck />
            <Heading as="h3">{p}</Heading>
          </Reveal>
        ))}
      </section>
      <section className="section two-col">
        <Heading as="h2">
          Before work starts.
          <br />
          Until handover.
        </Heading>
        <div>
          <p>
            Accumax's quality commitments include continuous improvement,
            customer specifications, applicable codes and field quality plans
            for electrical, firefighting, MEP and instrumentation works.
          </p>
          <p>
            The company promotes safe working conditions, teamwork, employee
            empowerment and supplier development. Share the standards and EHS
            requirements applicable to your project when discussing the scope.
          </p>
          <Button to="/contact">Discuss project standards</Button>
        </div>
      </section>
    </>
  );
}
function Catalogue() {
  return (
    <>
      <PageTop
        label="Catalogue"
        title="The capability index."
        description="A concise overview of the disciplines available from Accumax Controls."
      />
      <section className="section catalogue">
        <div className="catalogue-cover">
          <Img src={COMPANY.logo} alt="Accumax Controls" />
          <span className="eyebrow">ACCUMAX / SERVICE OVERVIEW</span>
          <Heading as="h2">
            Engineering
            <br />
            connections.
          </Heading>
          <div className="cover-lines" />
          <p>ENGINEERING · EQUIPMENT · EXECUTION</p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE OUR SCOPE</span>
          <Heading as="h2">
            Start with the
            <br />
            right information.
          </Heading>
          <p>
            Download a printable service index, or contact the team for the
            latest official company catalogue and project-specific technical
            information.
          </p>
          <a className="button" href="/capability-index.txt" download>
            Download service index <Download size={18} />
          </a>
          <p className="fine">
            Service summary based on the company's published information.
            Request product-specific documents and the current catalogue from the team.
          </p>
          <Button to="/contact">Request official catalogue</Button>
        </div>
      </section>
    </>
  );
}
function Videos() {
  return (
    <>
      <PageTop
        label="Videos"
        title="Engineering, in motion."
        description="Explore substation engineering, testing, renewable energy and equipment supply with the Accumax team."
      />
      <section className="section gallery-section">
        <header className="gallery-heading">
          <span className="eyebrow">VIDEO LIBRARY</span>
          <Heading as="h2">Engineering, in motion.</Heading>
        </header>
        <VideoGallery />
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="section not-found">
      <span className="eyebrow">404 / CONNECTION NOT FOUND</span>
      <Heading as="h1">
        Let’s get you
        <br />
        back on track.
      </Heading>
      <Button to="/">Return home</Button>
    </section>
  );
}
const titles: Record<string, string> = {
  "/": "Powering Progress",
  "/about": "About Us",
  "/services": "Engineering Expertise",
  "/industries": "Industries We Serve",
  "/projects": "Projects",
  "/featured-works": "Featured Works",
  "/quality-safety": "Quality & Safety",
  "/gallery": "Engineering Gallery",
  "/videos": "Videos",
  "/catalogue": "Catalogue",
  "/careers": "Careers",
  "/contact": "Contact Us",
};
function Seo() {
  const { pathname } = useLocation();
  const s = SERVICES.find((s) => pathname === "/services/" + s.slug);
  const p = PROJECTS.find((p) => pathname === "/projects/" + p.slug);
  const title = s?.title || p?.title || titles[pathname] || "Page Not Found";
  const description =
    s?.short ||
    p?.note ||
    PAGE_DESCRIPTIONS[pathname] ||
    `Explore ${title.toLowerCase()} at Accumax Controls, Pune. Engineering services, energy infrastructure, testing and equipment exports.`;
  const base = import.meta.env.VITE_SITE_URL;
  return (
    <Helmet>
      <title>{title} | Accumax Controls</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={base ? "index,follow" : "noindex,nofollow"}
      />
      {base && (
        <link rel="canonical" href={base.replace(/\/$/, "") + pathname} />
      )}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: COMPANY.name,
          email: COMPANY.emails[0],
          telephone: COMPANY.phones[0],
          ...(base ? { url: base } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: COMPANY.address,
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "411 038",
            addressCountry: "IN",
          },
        })}
      </script>
    </Helmet>
  );
}
function SitePreloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [finished, setFinished] = useState(false);
  useLayoutEffect(() => {
    if (finished) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const startedAt = performance.now();
    let scheduled = false;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (scheduled) return;
      scheduled = true;
      holdTimer = setTimeout(() => setVisible(false), Math.max(0, (reduced ? 200 : 1000) - (performance.now() - startedAt)));
    };
    const fallbackTimer = setTimeout(finish, 2800);
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    return () => {
      clearTimeout(fallbackTimer);
      if (holdTimer) clearTimeout(holdTimer);
      window.removeEventListener('load', finish);
      document.body.style.overflow = previousOverflow;
    };
  }, [finished, reduced]);
  if (finished) return null;
  return <AnimatePresence onExitComplete={() => {
    setFinished(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event('accumax:ready'));
    });
  }}>
    {visible && <motion.div className="site-preloader" role="status" aria-label="Loading Accumax Controls" initial={false} exit={reduced ? { opacity: 0 } : { y: '100%' }} transition={{ duration: reduced ? .15 : .7, ease: [.76, 0, .24, 1] }}>
      <motion.div className="site-preloader-content" initial={reduced ? false : { opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: 'easeOut' }}>
        <Img src={COMPANY.logo} alt="Accumax Controls" eager />
        <p>{COMPANY.tagline}</p>
        <div className="site-preloader-track" aria-hidden="true"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? .15 : 1, ease: 'easeInOut' }}/></div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}
export default function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);
    return () => clearTimeout(id);
  }, [location.key]);
  return (
    <>
      <Seo />
      <SitePreloader />
      <CustomCursor />
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <motion.main
        id="main"
        data-route={location.pathname}
        key={location.pathname}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/services"
            element={
              <>
                <PageTop
                  label="Services"
                  title="Expertise, connected."
                  description="Build, connect, test and maintain your power infrastructure. Explore services for new projects, existing installations and equipment supply."
                />
                <section className="section">
                  <ServicesList />
                </section>
              </>
            }
          />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route
            path="/industries"
            element={
              <>
                <PageTop
                  label="Industries"
                  title="Powering different worlds."
                  description="Power-sector engineering for utilities, data centres, manufacturing, transport, process industries and institutional facilities."
                  image="/images/portfolio/i7.jpg"
                />
                <section className="section">
                  <Industries full />
                </section>
              </>
            }
          />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/featured-works"
            element={
              <>
                <PageTop
                  label="Projects"
                  title="The shape of possibility."
                  description="Illustrative scope profiles using company archive photographs. Project names, locations and completion details require company verification."
                />
                <section className="section project-listing" aria-labelledby="projects-title">
                  <header className="project-listing-heading">
                    <span className="eyebrow">FEATURED WORKS</span>
                    <Heading as="h1" id="projects-title">The shape of possibility.</Heading>
                  </header>
                  <ProjectCards all />
                </section>
              </>
            }
          />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/quality-safety" element={<Quality />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
      <a className="floating-whatsapp" href={COMPANY.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Accumax Controls on WhatsApp" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
