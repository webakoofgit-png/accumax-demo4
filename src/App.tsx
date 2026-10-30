import aboutPerspective from "./assets/home page img/_A CONNECTED PERSPECTIVE.png";
import homeBanner from "./assets/home banners/banner1.png";
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
  Play,
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
  INDUSTRIES,
  PROJECTS,
  GALLERY,
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
    <ArrowUpRight size={18} />
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
function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState(0);
  const [small, setSmall] = useState(false);
  const path = useLocation();
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setMega(false);
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
        setMega(false);
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
        <div className="header-right">
          <button
            className="explore-toggle"
            aria-expanded={mega}
            onClick={() => setMega(!mega)}
          >
            <span>Explore Accumax</span>
            <Menu size={17} />
          </button>
          <span className="header-socials" aria-label="Social media">
            <a
              href="https://www.instagram.com/accumax_controls?stkn=dW12a2xrdTV5MW13"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/share/19o5XUanBS/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/accumaxcontrols/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={18} />
            </a>
          </span>
          <button
            className="mobile-toggle"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
        {mega && (
          <div className="mega site-mega">
            <div>
              <span className="eyebrow">EXPLORE ACCUMAX</span>
              {[
                ["About Us", "/about"],
                ["Expertise", "/services"],
                ["Industry Solutions", "/industries"],
                ["Featured Works", "/projects"],
                ["Ideas & Insights", "/gallery"],
                ["Get in Touch", "/contact"],
              ].map(([n, to], i) => (
                <Link key={to} to={to} onFocus={() => setActive(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {n}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              ref={close}
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
            <span className="eyebrow mobile-menu-label">EXPLORE ACCUMAX</span>
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Services", "/services"],
              ["Industry Solutions", "/industries"],
              ["Featured Works", "/projects"],
              ["Ideas & Insights", "/gallery"],
              ["Get in Touch", "/contact"],
            ].map(([n, to], i) => (
              <motion.div
                key={to}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.035 }}
              >
                <Link to={to}>
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
          <h2>
            Have an engineering
            <br />
            challenge?
          </h2>
          <Button to="/contact" light>
            Start a conversation
          </Button>
        </div>
        <p>Connect with our team to discuss your project requirements.</p>
        <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
          Enquire on WhatsApp ?
        </a>
      </section>
      <footer className="section">
        <div className="footer-grid">
          <div>
            <Img src={COMPANY.logo} alt="Accumax Controls" />
            <p>
              Engineering. Infrastructure. Innovation.
              <br />
              Pune, India. Connected to the world.
            </p>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            {[
              ["About", "/about"],
              ["Services", "/services"],
              ["Featured Works", "/projects"],
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
            <p>{COMPANY.address}</p>
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
          <span>DEMO 04 · INDUSTRIAL MOTION STUDIO</span>
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
              src={SERVICES[Math.max(0, active)].image}
              alt={SERVICES[Math.max(0, active)].title}
            />
          </motion.div>
        </AnimatePresence>
        <span className="image-caption">
          {SERVICES[Math.max(0, active)].num} / ENGINEERED FOR YOUR REQUIREMENTS
        </span>
        <p>{SERVICES[Math.max(0, active)].short}</p>
      </div>
      <div className="service-list">
        {SERVICES.map((s, i) => (
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
              <h3>{s.title}</h3>
              <ArrowUpRight />
            </Link>
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
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1000px)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".story-panel");
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 35 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=1700",
            scrub: 1,
            pin: true,
          },
        });
        panels.forEach((p, i) => {
          if (i)
            tl.to(panels[i - 1], { autoAlpha: 0, y: -35 }).to(p, {
              autoAlpha: 1,
              y: 0,
            });
          tl.to({}, { duration: 0.6 });
        });
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [reduced]);
  return (
    <section className="story" ref={ref}>
      <div className="story-photo">
        <Img
          src="/images/hero-testing.jpg"
          alt="Electrical infrastructure testing"
        />
      </div>
      <div className="story-label eyebrow">
        THE PRINCIPLES BEHIND EVERY CONNECTION
      </div>
      {["Engineering", "Precision", "Reliability", "Progress,\nby design."].map(
        (t, i) => (
          <div className="story-panel" key={t}>
            <span className="eyebrow">0{i + 1} / OUR APPROACH</span>
            <h2>{t}</h2>
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
      <span className="story-bottom">
        SCROLL TO EXPLORE <ArrowRight size={15} />
      </span>
    </section>
  );
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
          <h3>{p.title}</h3>
          <span className="text-link">
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
  icon,
  delay = 0,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
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
    <div className="counter-item" aria-label={`${value}+ ${label}`}>
      <span className="counter-stat">
        <span className="counter-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="counter-number" aria-hidden="true">
          <span ref={ref}>{count.toLocaleString("en-IN")}</span>
          <span className="counter-plus">+</span>
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
        { value: 500, label: "Projects Done", icon: <Settings2 size={19} /> },
        { value: 1380, label: "Happy Clients", icon: <Globe size={19} /> },
        {
          value: 100,
          label: "Experienced Staff",
          icon: <UserRound size={19} />,
        },
        { value: 10, label: "Win Awards", icon: <ShieldCheck size={19} /> },
      ].map((item, index) => (
        <CounterItem
          key={item.label}
          value={item.value}
          label={item.label}
          icon={item.icon}
          delay={index * 140}
        />
      ))}
    </section>
  );
}
function ProjectsSection() {
  return (
    <section className="section projects-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">04 / PROJECT PERSPECTIVES</span>
          <h2>Expertise in action.</h2>
        </div>
        <Button to="/projects">Explore projects</Button>
      </div>
      <div className="project-showcase">
        {SERVICES.map((s) => (
          <Link
            className="project-showcase-card"
            key={s.slug}
            to={"/services/" + s.slug}
          >
            <Img src={PERSPECTIVE_IMAGES[s.slug] ?? s.image} alt={s.title} />
            <span className="project-showcase-watermark" aria-hidden="true">
              <Img src={COMPANY.logo} alt="" />
            </span>
            <span className="project-showcase-category">{s.num} / SERVICE</span>
            <span className="project-showcase-arrow">
              <ArrowUpRight size={20} />
            </span>
            <span className="project-showcase-copy">
              <strong>{s.title}</strong>
              <span>{s.short}</span>
            </span>
          </Link>
        ))}
      </div>
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
          <h3>{v.name}</h3>
          <p>{v.applications}</p>
          <ArrowUpRight />
          {active === i && <Img src={v.image} alt="" />}
        </Link>
      ))}
    </div>
  );
}
const stages = ["Understand", "Plan", "Engineer", "Execute", "Test", "Deliver"];
function Process() {
  const descriptions = [
    "Define scope, interfaces and operating requirements.",
    "Coordinate resources, procurement and site activities.",
    "Develop the engineering approach and protection requirements.",
    "Bring equipment, civil works and electrical systems together.",
    "Check installation, control logic and system performance.",
    "Review documentation and prepare the handover.",
  ];
  const renderStep = (s: string, i: number) => (
    <Reveal className="process-feature" key={s}>
      <div className="process-feature-heading">
        <span className="process-feature-icon" aria-hidden="true">
          {i + 1}
        </span>
        <h3>{s}</h3>
      </div>
      <p>{descriptions[i]}</p>
    </Reveal>
  );
  return (
    <section className="process section process-brand">
      <div className="process-brand-heading">
        <span className="eyebrow">06 / FROM INTENT TO INFRASTRUCTURE</span>
        <h2>Every connection. Considered.</h2>
        <p>
          A coordinated path from requirements to handover. Engineering
          expertise at every step of your project.
        </p>
      </div>
      <div className="process-brand-layout">
        <div className="process-feature-column">
          {stages.slice(0, 3).map((s, i) => renderStep(s, i))}
        </div>
        <div className="process-brand-logo">
          <Img src={COMPANY.logo} alt="Accumax Controls" />
          <span>ENGINEERING. INFRASTRUCTURE. INNOVATION.</span>
        </div>
        <div className="process-feature-column">
          {stages.slice(3).map((s, i) => renderStep(s, i + 3))}
        </div>
      </div>
    </section>
  );
}
function AboutBlock() {
  return (
    <section className="section about-block">
      {/* <Reveal className="about-photo">
        <Img src={aboutPerspective} alt="Accumax engineering operations" />
        <span>ENGINEERING WITH PURPOSE, SINCE DAY ONE.</span>
      </Reveal> */}
      <Reveal className="about-copy">
        <span className="eyebrow">A CONNECTED PERSPECTIVE</span>
        <h2>
          Big-picture thinking.
          <br />
          <em>Ground-level expertise.</em>
        </h2>
        <p>
          Accumax Controls is a Pune-based engineering, technology and export
          company working in the energy sector.
        </p>
        <p>
          Our work connects GIS and AIS infrastructure, substation civil and
          electrical works, automation, testing and commissioning, solar and EV
          stations.
        </p>
        <Link className="text-link" to="/about">
          Discover our story <ArrowUpRight size={18} />
        </Link>
        <span className="outline-word" aria-hidden="true">
          AC
        </span>
      </Reveal>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="hero hero-banner">
        <Img
          className="hero-banner-image"
          src={homeBanner}
          alt="Electrical substation and power transmission lines at sunset"
          eager
        />
        <div className="hero-banner-shade" />
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> ENGINEERING · INFRASTRUCTURE ·
            INNOVATION
          </span>
          <h1>
            {["Powering", "Progress."].map((w, i) => (
              <motion.span
                key={w}
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 * i, duration: 0.65 }}
              >
                {w}{" "}
              </motion.span>
            ))}
            <span className="hero-outline">
              Engineering
              <br />
              Possibilities.
            </span>
          </h1>
          <p>
            Precision in every connection.
            <br />
            Engineering expertise for a world that never stops.
          </p>
          <div className="hero-actions">
            <Button to="/services">Explore expertise</Button>
            <Link className="text-link" to="/contact">
              Start a project <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <Story />
      <AboutBlock />
      <section className="section expertise-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / OUR EXPERTISE</span>
            <h2>
              One partner.
              <br />
              <em>Many possibilities.</em>
            </h2>
          </div>
          <p>
            Integrated Engineering, EPC, Renewable Energy &amp; Electrical Asset
            Management Solutions
          </p>
        </div>
        <ExpertiseList />
      </section>
      <section className="section bento-section">
        <span className="eyebrow">03 / THE WAY WE WORK</span>
        <div className="bento">
          <Reveal className="bento-quality">
            <ShieldCheck />
            <h3>
              Quality is
              <br />a process.
            </h3>
            <p>
              Customer specifications, documented checks and a focus on safe
              working conditions.
            </p>
            <Link to="/quality-safety">
              Quality & safety <ArrowUpRight />
            </Link>
          </Reveal>
          <Reveal className="bento-number">
            <span className="eyebrow">FROM DRAWING TO DELIVERY</span>
            <Settings2 size={42} />
            <h3>
              Execution.
              <br />
              With intention.
            </h3>
            <p>
              Civil, electrical and testing disciplines working toward one
              handover.
            </p>
          </Reveal>
          <Reveal className="bento-small">
            <Globe />
            <h3>
              Local understanding.
              <br />
              Global connections.
            </h3>
            <Link to="/services/export">
              Explore exports <ArrowUpRight size={15} />
            </Link>
          </Reveal>
          <Reveal className="bento-wide">
            <span className="eyebrow">PROTECTION & CONTROL</span>
            <h3>
              Small details.
              <br />
              System-wide confidence.
            </h3>
            <p>
              Relay programming. Protection setting calculations. System audits.
            </p>
            <ArrowUpRight />
          </Reveal>
          <Reveal className="bento-clients">
            <h3>Better together.</h3>
            <p>
              Clear communication, coordinated interfaces and long-term client
              relationships.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="image-break">
        <Img
          src="/images/transmission-wide.jpg"
          alt="Power transmission infrastructure"
        />
        <div>
          <span className="eyebrow">THE CONNECTION THAT MATTERS</span>
          <h2>
            Where technical expertise
            <br />
            meets execution.
          </h2>
          <Link className="text-link" to="/services">
            See what we do <ArrowUpRight />
          </Link>
        </div>
      </section>
      <ProjectsSection />
      <CounterBar />
      <section className="section industries-home">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / INDUSTRIES WE SERVE</span>
            <h2>
              Different industries.
              <br />
              Shared ambition.
            </h2>
          </div>
          <Button to="/industries">All industries</Button>
        </div>
        <Industries />
      </section>
      <Process />
      <section className="section why">
        <span className="eyebrow">07 / WHY ACCUMAX</span>
        <h2>
          Built for complexity.
          <br />
          <em>Focused on reliability.</em>
        </h2>
        <div className="strengths">
          {[
            [
              "01",
              "An integrated perspective",
              "GIS, AIS, SAS and E-House solutions connect equipment, controls and site execution.",
            ],
            [
              "02",
              "Protection expertise",
              "Relay programming, setting calculations and system audits support the protection scope.",
            ],
            [
              "03",
              "Beyond supply",
              "Equipment exports and engineering services bring material and technical needs together.",
            ],
          ].map((s) => (
            <Reveal key={s[0]}>
              <span className="eyebrow">{s[0]}</span>
              <h3>{s[1]}</h3>
              <p>{s[2]}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="clients section">
        <div className="clients-heading">
          <span className="eyebrow">08 / CONNECTIONS BUILT ON TRUST</span>
          <h2>Trusted by industry leaders</h2>
        </div>
        <div className="marquee">
          <div>
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((s, i) => (
              <Img
                key={i}
                src={s}
                className={
                  /^c(?:[1-9]|1[0-9]|2[0-4])(?:-[^.]*)?\.jpg(?:$|\?)/i.test(
                    decodeURIComponent(s.split("/").pop() ?? ""),
                  )
                    ? "framed-logo"
                    : ""
                }
                alt={`Company client logo ${(i % CLIENT_LOGOS.length) + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="home-contact section">
        <div className="home-contact-heading">
          <div>
            <span className="eyebrow">09 / LET&apos;S CONNECT</span>
            <h2>Let&apos;s discuss your next project.</h2>
          </div>
          <p>
            From engineering requirements to equipment supply, connect with the
            right team to move your project forward.
          </p>
        </div>
        <div className="home-contact-grid">
          <Link className="home-contact-card" to="/contact">
            <div className="home-contact-image">
              <Img
                src="/images/hero-testing.jpg"
                alt="Engineer testing electrical protection equipment"
              />
            </div>
            <h3>Engineering enquiries</h3>
            <p>Share your requirements with our engineering team.</p>
            <span className="home-contact-link">
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
            <h3>Equipment &amp; export support</h3>
            <p>
              Explore testing kits, substation equipment and supply options.
            </p>
            <span className="home-contact-link">
              Explore export services <ArrowRight size={18} />
            </span>
          </Link>
          <Link className="home-contact-card" to="/contact">
            <div className="home-contact-image">
              <Img src="/images/team1.jpg" alt="Accumax Controls team" />
            </div>
            <h3>Let’s work together</h3>
            <p>Connect with Accumax about your next project.</p>
            <span className="home-contact-link">
              Get in touch <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </section>
    </>
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
        <h1>{title}</h1>
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
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      resize.disconnect();
      window.removeEventListener("wheel", onWheel);
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
        <h2 id="perspective-title">
          Understand the system.
          <br />
          <em>Respect every detail.</em>
        </h2>
      </div>
      <div
        className="perspective-copy"
        tabIndex={0}
        role="region"
        aria-label="Scroll through engineering, export and our mission"
      >
        <div>
          <h3>Engineering</h3>
          <p>
            Accumax Controls works across substation infrastructure, GIS, AIS,
            SAS, AMC, E-House solutions and testing and commissioning.
          </p>
        </div>
        <div>
          <h3>Export &amp; supply</h3>
          <p>
            Alongside engineering services, the company exports testing kits,
            substation equipment, tools, building materials and electrical
            goods.
          </p>
        </div>
        <div>
          <h3>Our Mission</h3>
          <p>
            To deliver reliable, sustainable and efficient solutions for the
            power industry through engineering expertise, innovation and a
            commitment to safety and customer satisfaction.
          </p>
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
        <h1 id="about-title">
          About <span className="about-title-muted">Accumax</span>
        </h1>
        <div className="about-editorial-layout">
          <div className="about-editorial-copy">
            <span className="eyebrow">A CONNECTED PERSPECTIVE</span>
            <h2>
              Big-picture thinking.
              <br />
              Ground-level expertise.
            </h2>
            <p>
              Accumax Controls Pvt. Ltd. delivers engineering, technology and
              export solutions for the power sector. Our expertise spans GIS and
              AIS substations, solar projects, EV charging infrastructure,
              substation civil and electrical works, SAS, AMC and E-House
              solutions.
            </p>
            <p>
              We support testing and commissioning across voltage levels, system
              audits, protective relay programming and protection setting
              calculations. Our export and import offering includes PPE,
              substation components, tools, building materials and FRP products.
            </p>
            <Link className="perspective-simple-link" to="/services">
              Our capabilities <ArrowUpRight size={18} />
            </Link>
          </div>
          <figure className="about-editorial-image">
            <Img
              src={aboutPerspective}
              alt="Accumax engineering operations"
              eager
            />
            {/* <figcaption>ENGINEERING WITH PURPOSE, SINCE DAY ONE.</figcaption> */}
          </figure>
        </div>
      </section>
      <PerspectiveSection />
    </>
  );
}
function ExpertiseList() {
  return (
    <div className="expertise-list">
      {EXPERTISE_CATEGORIES.map((item) => (
        <details className="expertise-entry" key={item.num}>
          <summary>
            <span className="eyebrow">{item.num}</span>
            <h3>{item.title}</h3>
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
      <section className="section two-col">
        <div>
          <span className="eyebrow">{s.num} / EXPERTISE</span>
          <h2>
            Scope built around
            <br />
            your requirements.
          </h2>
          <Button to={"/contact?service=" + encodeURIComponent(s.title)}>
            Discuss this service
          </Button>
        </div>
        <div>
          <p>{s.intro}</p>
          <ul className="capabilities">
            {s.capabilities.map((c) => (
              <li key={c}>
                <Check size={17} />
                {c}
              </li>
            ))}
          </ul>
          <p className="fine">
            Indicative scope. Final technical requirements, equipment
            suitability and deliverables are agreed for each enquiry.
          </p>
        </div>
      </section>
      <section className="section">
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
          <h2>{p.category}</h2>
          <p>
            Location: awaiting verification.
            <br />
            Client and completion date: awaiting verification.
          </p>
        </div>
        <div>
          <h3>Illustrative scope</h3>
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
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const items = GALLERY.filter(
    (_, i) =>
      filter === "All" ||
      (filter === "Infrastructure" ? i % 2 === 0 : i % 2 !== 0),
  );
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
      <section className="section">
        <div className="filters">
          {["All", "Infrastructure", "Equipment"].map((f) => (
            <button
              className={filter === f ? "active" : ""}
              key={f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {items.map((s, i) => (
            <button
              key={s}
              onClick={() => setSelected(i)}
              aria-label={"Enlarge engineering photograph " + (i + 1)}
            >
              <Img src={s} alt={"Accumax engineering archive " + (i + 1)} />
              <span>
                FIELD NOTES / {String(i + 1).padStart(2, "0")} <Plus />
              </span>
            </button>
          ))}
        </div>
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
            src={items[selected]}
            alt="Enlarged company archive photograph"
          />
        </div>
      )}
    </>
  );
}
function Contact({ career = false }: { career?: boolean }) {
  const [prepared, setPrepared] = useState(false);
  const [draft, setDraft] = useState("");
  const query = new URLSearchParams(useLocation().search);
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
          <h2>{career ? "Build what matters." : "Let’s connect."}</h2>
          <a className="contact-line" href={"mailto:" + COMPANY.emails[0]}>
            <Mail />
            {COMPANY.emails[0]}
            <ArrowUpRight />
          </a>
          <a className="contact-line" href="tel:+919920177441">
            <Phone />
            {COMPANY.phones[0]}
          </a>
          <a className="contact-line" href="tel:+917350200025">
            <Phone />
            {COMPANY.phones[1]}
          </a>
          <div className="contact-line">
            <MapPin />
            <p>{COMPANY.address}</p>
          </div>
          <a
            className="text-link"
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp enquiry <ArrowUpRight size={18} />
          </a>
          {career && (
            <p className="fine">
              No vacancies are currently published in this demo. Email your CV
              for the company to review; this is an expression of interest.
            </p>
          )}
        </div>
        <form
          className="enquiry-form"
          aria-labelledby="enquiry-heading"
          onChange={() => setPrepared(false)}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const text = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}${career ? "" : `\nCompany: ${data.get("company") || "Not provided"}`}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`;
            setDraft(
              `mailto:${COMPANY.emails[0]}?subject=${encodeURIComponent(career ? "Career expression of interest" : "Engineering project enquiry")}&body=${encodeURIComponent(text)}`,
            );
            setPrepared(true);
          }}
        >
          <div className="enquiry-form-heading">
            <span className="eyebrow">
              {career ? "YOUR INTRODUCTION" : "YOUR PROJECT BRIEF"}
            </span>
            <h3 id="enquiry-heading">
              {career ? "Introduce yourself" : "Tell us about your project"}
            </h3>
            <p>
              {career
                ? "Share your experience and the role you are interested in."
                : "Share a few details so our team can understand your requirements."}
            </p>
            <span className="required-note">
              <span aria-hidden="true">*</span> Required fields
            </span>
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
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +91 98765 43210"
                required
                minLength={7}
                maxLength={25}
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
              defaultValue={query.get("service") || query.get("industry") || ""}
            >
              <option value="" disabled>
                {career ? "Select an area" : "Select a service or industry"}
              </option>
              {(career
                ? [
                    "Engineering",
                    "Testing & Commissioning",
                    "Site Execution",
                    "Procurement & Export",
                  ]
                : SERVICES.map((s) => s.title).concat(
                    INDUSTRIES.map((i) => i.name),
                  )
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
              {!career && (
                <option value="General enquiry">
                  General enquiry / help me choose
                </option>
              )}
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
                ? "You can attach your CV to the email draft."
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
          <button className="button" type="submit">
            Prepare email enquiry <ArrowUpRight size={18} />
          </button>
          {prepared && (
            <div className="draft" role="status">
              <b>Your email draft is ready.</b>
              <p>
                Review your details and send the enquiry from your email app.
              </p>
              <a className="text-link" href={draft}>
                Open email draft <ArrowUpRight size={17} />
              </a>
            </div>
          )}
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
        description="Quality, customer requirements and safe working conditions form the basis of the company’s published policy."
        image="/images/hero-testing.jpg"
      />
      <section className="section policy-list">
        {QUALITY_POINTS.map((p, i) => (
          <Reveal key={p}>
            <span className="eyebrow">0{i + 1}</span>
            <ShieldCheck />
            <h3>{p}</h3>
          </Reveal>
        ))}
      </section>
      <section className="section two-col">
        <h2>
          Before work starts.
          <br />
          Until handover.
        </h2>
        <div>
          <p>
            Project-specific quality plans, applicable codes and customer
            specifications define the inspection and testing requirements.
          </p>
          <p>
            Discuss your EHS requirements and documentation expectations with
            the team before mobilising.
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
          <span className="eyebrow">CAPABILITY OVERVIEW / DEMO EDITION</span>
          <h2>
            Engineering
            <br />
            connections.
          </h2>
          <div className="cover-lines" />
          <p>ENGINEERING · EQUIPMENT · EXECUTION</p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE OUR SCOPE</span>
          <h2>
            Start with the
            <br />
            right information.
          </h2>
          <p>
            Download a printable service index, or contact the team for the
            latest official company catalogue and project-specific technical
            information.
          </p>
          <a className="button" href="/capability-index.txt" download>
            Download service index <Download size={18} />
          </a>
          <p className="fine">
            Plain-text demo overview. It is not an official technical datasheet.
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
        description="A space for verified company films and project walkthroughs."
      />
      <section className="section video-section">
        <div className="video-cover">
          <Img
            src="/images/gallery/4.jpg"
            alt="Electrical substation installation"
          />
          <Play size={54} />
          <span>COMPANY FILMS · PUBLISHING PENDING</span>
        </div>
        <div>
          <span className="eyebrow">VIDEO LIBRARY</span>
          <h2>
            See the detail.
            <br />
            Understand the process.
          </h2>
          <p>
            No verified public video files were available for this demo. Request
            a technical walkthrough or company presentation directly from the
            team.
          </p>
          <Button to="/contact">Request a presentation</Button>
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="section not-found">
      <span className="eyebrow">404 / CONNECTION NOT FOUND</span>
      <h1>
        Let’s get you
        <br />
        back on track.
      </h1>
      <Button to="/">Return home</Button>
    </section>
  );
}
const titles: Record<string, string> = {
  "/": "Powering Progress",
  "/about": "About Us",
  "/services": "Engineering Expertise",
  "/industries": "Industries We Serve",
  "/projects": "Project Perspectives",
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
                  description="Eight disciplines. One coordinated engineering perspective."
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
                  description="Engineering applications across the industries featured on the Accumax company website."
                  image="/images/portfolio/i7.jpg"
                />
                <section className="section">
                  <Industries full />
                </section>
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <PageTop
                  label="Projects"
                  title="The shape of possibility."
                  description="Illustrative scope profiles using company archive photographs. Project names, locations and completion details require company verification."
                />
                <section className="section">
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
          <Route path="/careers" element={<Contact career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
    </>
  );
}
