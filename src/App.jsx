import { useEffect, useRef } from "react";
import {
  FiArrowRight,
  FiCloud,
  FiCode,
  FiGithub,
  FiLayers,
  FiLinkedin,
  FiMail,
  FiSettings,
} from "react-icons/fi";
import "./App.css";

const LINKS = {
  github: "https://github.com/AtomGlab",
  linkedin: "https://www.linkedin.com/in/amin-bakkouh-5ba1493aa/",
  email: "mailto:selterkrey@gmail.com",
};

const NAV = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Contact", "#contact"],
];

const SKILLS = [
  {
    category: "Cloud",
    icon: FiCloud,
    items: ["AWS", "S3", "CloudFront", "Route 53", "Lambda", "API Gateway", "DynamoDB", "Cognito", "IAM"],
  },
  {
    category: "Infrastructure & DevOps",
    icon: FiSettings,
    items: ["Terraform", "Docker", "Git", "GitHub Actions", "CI/CD", "Linux"],
  },
  {
    category: "Development",
    icon: FiCode,
    items: ["Python", "JavaScript", "React", "Node.js", "REST APIs", "SQL"],
  },
  {
    category: "Engineering",
    icon: FiLayers,
    items: ["Infrastructure as Code", "Serverless", "Observability", "Cloud Security", "Distributed Systems"],
  },
];

const FOCUS = ["AWS", "Cloud Engineering", "Terraform", "DevOps", "Infrastructure", "Cloud Security"];

/* ---------- Globe: dotted rotating sphere with orbits (canvas) ---------- */

function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let size = 0;
    let dpr = 1;

    // Points spread evenly over the sphere (Fibonacci lattice)
    const N = 2600;
    const points = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const lat = Math.asin(y);
      const lon = (i * golden) % (Math.PI * 2);
      points.push({ lat, lon, land: isLand(lat, lon) });
    }

    // Procedural "continents": smooth blobs, not a real map
    function isLand(lat, lon) {
      const v =
        Math.sin(lon * 1.7 + 0.5) * Math.cos(lat * 2.1) +
        0.6 * Math.sin(lon * 3.3 - lat * 2.7 + 1.2) +
        0.4 * Math.cos(lon * 5.1 + lat * 4.3);
      return v > 0.45 && Math.abs(lat) < 1.25;
    }

    const orbits = [
      { rx: 1.45, ry: 0.42, tilt: -0.35, speed: 0.00022, phase: 0.4 },
      { rx: 1.3, ry: 0.62, tilt: 0.28, speed: -0.00016, phase: 2.1 },
      { rx: 1.6, ry: 0.3, tilt: 0.05, speed: 0.00012, phase: 4.2 },
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.min(rect.width, 560);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    }

    function draw(t) {
      const w = canvas.width;
      const cx = w / 2;
      const cy = w / 2;
      const R = w * 0.33;
      const rot = reduceMotion ? 0.8 : t * 0.00006;
      const tilt = 0.35;

      ctx.clearRect(0, 0, w, w);

      // Soft glow behind the sphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25);
      glow.addColorStop(0, "rgba(90,120,170,0.10)");
      glow.addColorStop(1, "rgba(90,120,170,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, w);

      // Sphere body and rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14,18,24,0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(160,180,210,0.18)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // Dots
      for (const p of points) {
        const lon = p.lon + rot;
        let x = Math.cos(p.lat) * Math.sin(lon);
        let y = Math.sin(p.lat);
        let z = Math.cos(p.lat) * Math.cos(lon);
        // tilt around the x axis
        const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
        const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
        y = y2;
        z = z2;
        if (z <= 0) continue;

        const px = cx + x * R;
        const py = cy - y * R;
        if (p.land) {
          ctx.fillStyle = `rgba(200,212,230,${0.15 + 0.7 * z})`;
          ctx.fillRect(px, py, 1.4 * dpr, 1.4 * dpr);
        } else {
          ctx.fillStyle = `rgba(160,175,200,${0.05 * z})`;
          ctx.fillRect(px, py, 1 * dpr, 1 * dpr);
        }
      }

      // Orbits with a travelling node each
      orbits.forEach((o) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(o.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * o.rx, R * o.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(170,185,210,0.14)";
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();

        const a = o.phase + (reduceMotion ? 0 : t * o.speed);
        const nx = Math.cos(a) * R * o.rx;
        const ny = Math.sin(a) * R * o.ry;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,236,245,0.9)";
        ctx.fill();
        ctx.restore();
      });

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="globe" aria-hidden="true" />;
}

/* ---------- Small building blocks ---------- */

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function SectionLabel({ number, children }) {
  return (
    <p className="section-label">
      <span>{number}</span>
      <span className="section-label__dash">—</span>
      <span>{children}</span>
    </p>
  );
}

function TimelineItem({ date, title, org, children }) {
  return (
    <div className="tl">
      <p className="tl__date">{date}</p>
      <h3 className="tl__title">{title}</h3>
      <p className="tl__org">{org}</p>
      {children}
    </div>
  );
}

/* ---------- Page ---------- */

export default function App() {
  return (
    <div className="page">
      <nav className="nav">
        <div className="container nav__inner">
          <a href="#home" className="nav__brand">
            Amin Bakkouh
          </a>
          <div className="nav__links">
            {NAV.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="home" className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Software Engineer</p>
            <h1 className="hero__title">
              Building reliable
              <br />
              software &amp; cloud
              <br />
              infrastructure.
            </h1>
            <p className="hero__lead">
              Software Engineering student focused on cloud computing, infrastructure and backend
              development, with a particular interest in AWS and modern DevOps practices.
            </p>
            <div className="btn-row">
              <a href="#contact" className="btn btn--primary">
                Get in touch <FiArrowRight />
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="btn">
                <FiGithub /> GitHub
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="btn">
                <FiLinkedin /> LinkedIn
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <Globe />
          </div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="section">
        <div className="container split">
          <div>
            <SectionLabel number="01">About</SectionLabel>
            <h2 className="section-title">About me</h2>
          </div>
          <div className="split__body split__body--rule">
            <p>
              I am a Software Engineering student at the University of Winchester, currently
              developing my skills in cloud engineering, backend development and infrastructure.
            </p>
            <p>
              My main technical focus is AWS, with an emphasis on serverless architectures,
              Infrastructure as Code, automation, security and observability.
            </p>
            <p>
              I am continuously building practical experience across software engineering and
              cloud infrastructure, with the goal of developing into a Cloud Engineer.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <SectionLabel number="02">Technical Skills</SectionLabel>
          <h2 className="section-title section-title--spaced">Technologies</h2>
          <div className="skills">
            {SKILLS.map(({ category, icon: Icon, items }) => (
              <div key={category} className="card">
                <Icon className="card__icon" aria-hidden="true" />
                <p className="card__title">{category}</p>
                <div className="badges">
                  {items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <div className="container split">
          <div>
            <SectionLabel number="03">Experience</SectionLabel>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="split__body">
            <TimelineItem date="2026" title="ABAP Developer Intern" org="Deloitte">
              <p>
                Software development experience in a professional enterprise environment, working
                with SAP ABAP and development workflows.
              </p>
            </TimelineItem>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="section">
        <div className="container split">
          <div>
            <SectionLabel number="04">Education</SectionLabel>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="split__body">
            <TimelineItem
              date="2026 – 2027"
              title="BSc (Hons) Software Engineering"
              org="University of Winchester"
            >
              <p>
                Software Engineering top-up degree with a focus on software development, systems
                engineering and modern computing technologies.
              </p>
              <div className="focus">
                <p className="focus__label">Current professional focus</p>
                <div className="badges">
                  {FOCUS.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            </TimelineItem>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container split">
          <div>
            <SectionLabel number="05">Contact</SectionLabel>
            <h2 className="section-title">Let’s connect.</h2>
          </div>
          <div className="split__body split__body--rule">
            <p>
              For professional opportunities, collaborations or technical discussions,
              <br className="br-desktop" /> feel free to get in touch.
            </p>
            <div className="btn-row">
              <a href={LINKS.email} className="btn btn--primary">
                <FiMail /> Email
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="btn">
                <FiLinkedin /> LinkedIn
              </a>
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="btn">
                <FiGithub /> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <p>© {new Date().getFullYear()} Amin Bakkouh</p>
          <p>Software Engineering · Cloud · AWS</p>
        </div>
      </footer>
    </div>
  );
}