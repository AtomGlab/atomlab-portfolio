import { useEffect, useRef } from "react";
import {
  FiArrowRight,
  FiAward,
  FiCloud,
  FiCode,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiLinkedin,
  FiMail,
  FiSettings,
} from "react-icons/fi";
import "./App.css";

/* =========================================================
   CONTENT — edit your data here, the page builds itself
   ========================================================= */

const LINKS = {
  github: "https://github.com/AtomGlab",
  linkedin: "https://www.linkedin.com/in/amin-bakkouh-5ba1493aa/",
  email: "mailto:selterkrey@gmail.com",
};

const NAV = [
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Certifications", "#certifications"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

const EXPERIENCE = [
  {
    role: "ABAP Developer Intern",
    company: "Deloitte",
    dates: "2026",
    description:
      "Software development experience in a professional enterprise environment, working with SAP ABAP and development workflows.",
    tags: ["SAP", "ABAP"],
  },
];

const EDUCATION = [
  {
    title: "BSc (Hons) Software Engineering (Top-Up Degree)",
    school: "University of Winchester",
    dates: "2026 – 2027",
    description:
      "Top-up degree focused on software development, systems engineering and modern computing technologies.",
  },
  {
    title: "Higher Technician Diploma in Web Application Development (DAW)",
    school: "", // TODO: add your school
    dates: "", // TODO: add the dates
    description:
      "Two-year higher vocational qualification covering front-end and back-end web development, databases and application deployment.",
  },
];

const PROJECTS = [
  {
    title: "CloudSecure Photos",
    status: "In progress · Final-year project",
    description:
      "Serverless photo platform on AWS with its own security layer: a detection engine that flags brute-force logins, mass downloads and path scanning in near real time, evaluated against AWS GuardDuty and WAF.",
    stack: ["Route 53", "CloudFront", "S3", "Cognito", "API Gateway", "Lambda", "DynamoDB", "CloudWatch", "SNS", "Terraform", "GitHub Actions"],
    repo: "", // TODO: repository URL
    demo: "", // TODO: live demo URL
  },
  {
    title: "Cloud Portfolio",
    status: "This site",
    description:
      "Personal website hosted on AWS: S3 for storage, CloudFront for global delivery, Route 53 for the domain and HTTPS via ACM. Infrastructure managed with Terraform and deployed with GitHub Actions on every push.",
    stack: ["React", "S3", "CloudFront", "Route 53", "ACM", "Terraform", "GitHub Actions"],
    repo: "",
    demo: "",
  },
];

const CERTIFICATIONS = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    status: "In preparation",
    description:
      "Validates the ability to design distributed systems and architectures on AWS following best practices.",
    credential: "", // add the credential URL once earned
  },
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

/* =========================================================
   Globe: dotted rotating sphere with orbits (canvas)
   ========================================================= */

function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let dpr = 1;

    // Procedural "continents": smooth blobs, not a real map
    const isLand = (lat, lon) => {
      const v =
        Math.sin(lon * 1.7 + 0.5) * Math.cos(lat * 2.1) +
        0.6 * Math.sin(lon * 3.3 - lat * 2.7 + 1.2) +
        0.4 * Math.cos(lon * 5.1 + lat * 4.3);
      return v > 0.45 && Math.abs(lat) < 1.25;
    };

    // Points spread evenly over the sphere (Fibonacci lattice)
    const N = 2600;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: N }, (_, i) => {
      const lat = Math.asin(1 - (i / (N - 1)) * 2);
      const lon = (i * golden) % (Math.PI * 2);
      return { lat, lon, land: isLand(lat, lon) };
    });

    const orbits = [
      { rx: 1.45, ry: 0.42, tilt: -0.35, speed: 0.00022, phase: 0.4 },
      { rx: 1.3, ry: 0.62, tilt: 0.28, speed: -0.00016, phase: 2.1 },
      { rx: 1.6, ry: 0.3, tilt: 0.05, speed: 0.00012, phase: 4.2 },
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.min(rect.width, 520);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    }

    function draw(t) {
      const w = canvas.width;
      const c = w / 2;
      const R = w * 0.33;
      const rot = reduceMotion ? 0.8 : t * 0.00006;
      const tilt = 0.35;

      ctx.clearRect(0, 0, w, w);

      const glow = ctx.createRadialGradient(c, c, R * 0.2, c, c, R * 1.25);
      glow.addColorStop(0, "rgba(90,120,170,0.10)");
      glow.addColorStop(1, "rgba(90,120,170,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, w);

      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14,18,24,0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(160,180,210,0.18)";
      ctx.lineWidth = dpr;
      ctx.stroke();

      for (const p of points) {
        const lon = p.lon + rot;
        const x = Math.cos(p.lat) * Math.sin(lon);
        const y0 = Math.sin(p.lat);
        const z0 = Math.cos(p.lat) * Math.cos(lon);
        const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
        const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
        if (z <= 0) continue;

        const px = c + x * R;
        const py = c - y * R;
        if (p.land) {
          ctx.fillStyle = `rgba(200,212,230,${0.15 + 0.7 * z})`;
          ctx.fillRect(px, py, 1.4 * dpr, 1.4 * dpr);
        } else {
          ctx.fillStyle = `rgba(160,175,200,${0.05 * z})`;
          ctx.fillRect(px, py, dpr, dpr);
        }
      }

      orbits.forEach((o) => {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(o.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * o.rx, R * o.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(170,185,210,0.14)";
        ctx.lineWidth = dpr;
        ctx.stroke();

        const a = o.phase + (reduceMotion ? 0 : t * o.speed);
        ctx.beginPath();
        ctx.arc(Math.cos(a) * R * o.rx, Math.sin(a) * R * o.ry, 2.2 * dpr, 0, Math.PI * 2);
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

/* =========================================================
   Building blocks
   ========================================================= */

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Badges({ items }) {
  if (!items?.length) return null;
  return (
    <div className="badges">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

function SectionHeader({ number, label, title }) {
  return (
    <div className="section-header">
      <p className="section-label">
        <span>{number}</span>
        <span className="section-label__dash">—</span>
        <span>{label}</span>
      </p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function Entry({ title, subtitle, dates, description, tags }) {
  return (
    <article className="entry">
      <div className="entry__head">
        <div>
          <h4 className="entry__title">{title}</h4>
          {subtitle && <p className="entry__subtitle">{subtitle}</p>}
        </div>
        {dates && <p className="entry__date">{dates}</p>}
      </div>
      <p className="entry__text">{description}</p>
      <Badges items={tags} />
    </article>
  );
}

function ProjectCard({ project }) {
  const { title, status, description, stack, repo, demo } = project;
  return (
    <article className="project">
      <p className="status">
        <span className="status__dot" />
        {status}
      </p>
      <h3 className="project__title">{title}</h3>
      <p className="project__text">{description}</p>
      <Badges items={stack} />
      {(demo || repo) && (
        <div className="card-actions">
          {demo && (
            <a href={demo} target="_blank" rel="noreferrer" className="btn btn--small btn--primary">
              <FiExternalLink /> View demo
            </a>
          )}
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer" className="btn btn--small">
              <FiGithub /> View repository
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function CertCard({ cert }) {
  const { name, issuer, status, description, credential } = cert;
  return (
    <article className="cert">
      <div className="cert__head">
        <FiAward className="cert__icon" aria-hidden="true" />
        <div>
          <h3 className="cert__title">{name}</h3>
          <p className="cert__issuer">{issuer}</p>
        </div>
      </div>
      <p className="cert__text">{description}</p>
      <div className="cert__foot">
        {status && <Badge>{status}</Badge>}
        {credential && (
          <a href={credential} target="_blank" rel="noreferrer" className="btn btn--small">
            <FiExternalLink /> View credential
          </a>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   Page
   ========================================================= */

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
            <p className="eyebrow">Cloud Portfolio</p>
            <h1 className="hero__title">Hi, I'm Amin</h1>
            <p className="hero__role">Software Engineer · Cloud &amp; DevOps</p>
            <p className="hero__lead">
              Software Engineering student at the University of Winchester, focused on cloud
              computing, infrastructure and backend development. My main focus is AWS: serverless
              architectures, Infrastructure as Code, automation, security and observability, with
              the goal of developing into a Cloud Engineer.
            </p>
            <div className="btn-row">
              <a href="#projects" className="btn btn--primary">
                View projects <FiArrowRight />
              </a>
              <a href="#experience" className="btn">
                Experience &amp; education
              </a>
              <a href="#certifications" className="btn">
                Certifications
              </a>
            </div>
            <div className="btn-row btn-row--links">
              <a href={LINKS.github} target="_blank" rel="noreferrer" className="link-icon">
                <FiGithub /> GitHub
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="link-icon">
                <FiLinkedin /> LinkedIn
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <Globe />
          </div>
        </div>
      </header>

      {/* Experience & Education */}
      <section id="experience" className="section">
        <div className="container">
          <SectionHeader number="01" label="Background" title="Experience & Education" />

          <h3 className="subhead">Professional experience</h3>
          <div className="stack">
            {EXPERIENCE.map((e) => (
              <Entry
                key={e.role + e.company}
                title={e.role}
                subtitle={e.company}
                dates={e.dates}
                description={e.description}
                tags={e.tags}
              />
            ))}
          </div>

          <h3 className="subhead">Education</h3>
          <div className="stack">
            {EDUCATION.map((e) => (
              <Entry
                key={e.title}
                title={e.title}
                subtitle={e.school}
                dates={e.dates}
                description={e.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <SectionHeader number="02" label="Projects" title="My projects" />
          <div className="projects">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="section">
        <div className="container">
          <SectionHeader number="03" label="Certifications" title="Certifications" />
          <div className="certs">
            {CERTIFICATIONS.map((c) => (
              <CertCard key={c.name} cert={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <SectionHeader number="04" label="Technical skills" title="Technologies" />
          <div className="skills">
            {SKILLS.map(({ category, icon: Icon, items }) => (
              <div key={category} className="card">
                <Icon className="card__icon" aria-hidden="true" />
                <p className="card__title">{category}</p>
                <Badges items={items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container split">
          <SectionHeader number="05" label="Contact" title="Let’s connect." />
          <div className="split__body split__body--rule">
            <p>
              For professional opportunities, collaborations or technical discussions, feel free
              to get in touch.
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