import { useState, useEffect, useRef } from "react";

const SKILLS = [
  { category: "Coding", items: ["React", "JavaScript", "Tailwind CSS", "NodeJS", "MongoDB", "MySQL", "Docker", "Git/Github"] },
  { category: "Cloud & Infra", items: ["AWS S3", "CloudFront", "Route 53", "Lambda", "API Gateway", "DynamoDB", "Cognito", "ELB", "IAM"] },
  { category: "DevOps & IaC", items: ["Terraform", "GitHub Actions", "CI/CD", "Docker"] },
  { category: "Observabilidad", items: ["CloudWatch", "Logs & Metrics", "Alerting", "Anomaly Detection"] },
];

const PROJECTS = [
  {
    id: 1,
    status: "in-progress",
    label: "En desarrollo",
    title: "Scently",
    subtitle: "Fullstack Serverless App",
    description: "App de perfumes con arquitectura serverless en AWS. Catálogo interactivo, favoritos, comparador y recomendaciones personalizadas.",
    stack: ["React", "Lambda", "API Gateway", "DynamoDB", "S3", "Cognito"],
    tags: ["Serverless", "Full-Stack", "AWS"],
    color: "#C9A84C",
    accent: "#F5D78B",
    icon: "◈",
    github: "#",
    demo: "#",
    highlights: ["Arquitectura serverless end-to-end", "Auth con Cognito + IAM", "CI/CD con GitHub Actions + Terraform"],
  },
  {
    id: 2,
    status: "planned",
    label: "Esta Web",
    title: "Portfolio Cloud",
    subtitle: "Static Site + CDN",
    description: "Web personal desplegada sobre infraestructura AWS real. S3 + CloudFront + Route 53 + HTTPS con certificado gestionado.",
    stack: ["React", "S3", "CloudFront", "Route 53", "ACM", "Terraform"],
    tags: ["CDN", "DNS", "HTTPS", "IaC"],
    color: "#3B7A57",
    accent: "#7ECBA1",
    icon: "◇",
    github: "#",
    demo: "#",
    highlights: ["Hosting cloud con CDN global", "DNS + HTTPS automatizados", "Infra gestionada con Terraform"],
  },
  {
    id: 3,
    status: "planned",
    label: "Planificado",
    title: "ELB Anomaly Detector",
    subtitle: "Observabilidad & Monitoring",
    description: "Sistema de detección de tráfico anómalo sobre Elastic Load Balancing. Logs, métricas en tiempo real y alertas automáticas.",
    stack: ["ELB", "CloudWatch", "Lambda", "SNS", "Terraform"],
    tags: ["Monitoring", "DevOps", "Alerting"],
    color: "#2B5797",
    accent: "#6BA3E0",
    icon: "◉",
    github: "#",
    demo: "#",
    highlights: ["Detección de patrones anómalos", "Alertas en tiempo real", "Dashboard de métricas"],
  },
];

const ROADMAP = [
  { phase: "01", title: "Portfolio en AWS", status: "next", desc: "S3 · CloudFront · Route 53 · ACM · Terraform" },
  { phase: "02", title: "Scently App", status: "active", desc: "React · Lambda · DynamoDB · Cognito · CI/CD" },
  { phase: "03", title: "ELB Anomaly Detection", status: "future", desc: "CloudWatch · ELB · Alertas · Observabilidad" },
  { phase: "04", title: "Terraform en todo", status: "future", desc: "IaC completo en todos los proyectos" },
  { phase: "05", title: "AWS Solutions Architect", status: "future", desc: "Certificación Associate" },
];

const CERT = {
  name: "AWS Certified Solutions Architect",
  level: "Associate",
  status: "En preparación",
  progress: 3,
};

function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timer;
    if (!deleting && charIdx < word.length) {
      timer = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,100,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180,160,100,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6, pointerEvents: "none",
      }}
    />
  );
}

function Badge({ children, color = "#C9A84C" }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: "'JetBrains Mono', 'Fira Mono', monospace", letterSpacing: "0.08em",
      padding: "3px 10px", borderRadius: 4, border: `1px solid ${color}44`,
      color, background: `${color}18`, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#161410" : "#0F0E0C",
        border: `1px solid ${hovered ? project.color + "55" : "#2A2820"}`,
        borderRadius: 12, padding: "28px 28px 24px",
        transition: "all 0.3s ease", cursor: "default",
        position: "relative", overflow: "hidden",
        boxShadow: hovered ? `0 0 40px ${project.color}18` : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: 180, height: 180,
        background: `radial-gradient(circle at top right, ${project.color}12, transparent 70%)`,
        pointerEvents: "none", transition: "opacity 0.3s",
        opacity: hovered ? 1 : 0,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {project.emoji} {project.label}
          </span>
          <h3 style={{ fontSize: 22, fontFamily: "'Playfair Display', Georgia, serif", color: "#F0E8D5", margin: "4px 0 2px", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {project.title}
          </h3>
          <p style={{ fontSize: 12, color: project.accent, fontFamily: "monospace", letterSpacing: "0.08em", margin: 0 }}>
            {project.subtitle}
          </p>
        </div>
        <span style={{ fontSize: 32, color: project.color, opacity: 0.6, lineHeight: 1 }}>{project.icon}</span>
      </div>

      <p style={{ fontSize: 14, color: "#9A9080", lineHeight: 1.7, margin: "0 0 20px" }}>
        {project.description}
      </p>

      <div style={{ marginBottom: 20 }}>
        {project.highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ color: project.color, fontSize: 12 }}>→</span>
            <span style={{ fontSize: 13, color: "#B0A890" }}>{h}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {project.stack.map((s) => (
          <Badge key={s} color={project.color}>{s}</Badge>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, borderTop: "1px solid #1E1C18", paddingTop: 16 }}>
        {project.tags.map((t) => (
          <span key={t} style={{ fontSize: 11, color: "#5A5545", fontFamily: "monospace" }}>#{t}</span>
        ))}
      </div>
    </div>
  );
}

function RoadmapItem({ item, index }) {
  const colors = { active: "#C9A84C", next: "#3B7A57", future: "#2A2820" };
  const textColors = { active: "#F5D78B", next: "#7ECBA1", future: "#4A4535" };
  const isActive = item.status === "active";
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", opacity: item.status === "future" ? 0.5 : 1, transition: "opacity 0.2s" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: `2px solid ${colors[item.status]}`,
          background: isActive ? colors[item.status] + "22" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontFamily: "monospace", color: textColors[item.status],
          fontWeight: 700, letterSpacing: "0.05em",
        }}>
          {item.phase}
        </div>
        {index < ROADMAP.length - 1 && (
          <div style={{ width: 1, height: 40, background: "#2A2820", marginTop: 4 }} />
        )}
      </div>
      <div style={{ paddingTop: 6 }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, color: textColors[item.status], margin: "0 0 4px", fontWeight: 600 }}>
          {item.title}
        </p>
        <p style={{ fontSize: 12, color: "#4A4535", fontFamily: "monospace", margin: 0 }}>{item.desc}</p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const typed = useTypewriter(["Cloud Engineer", "AWS Developer", "DevOps Builder", "IaC Practitioner"], 70, 2200);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#080705", minHeight: "100vh", color: "#F0E8D5",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      lineHeight: 1.6,
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080705; }
        ::-webkit-scrollbar-thumb { background: #3A3525; border-radius: 2px; }
        a { text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px",
        background: scrolled ? "rgba(8,7,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid #1E1C18" : "none",
        transition: "all 0.3s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#C9A84C", letterSpacing: "-0.01em" }}>
          AtomLab<span style={{ color: "#4A4535" }}>.cloud</span>
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {["PROYECTOS", "HABILIDADES", "ROADMAP"].map((s) => (
            <a key={s} href={`#${s}`} style={{
              fontSize: 13, color: "#7A7060", fontFamily: "JetBrains Mono",
              letterSpacing: "0.06em", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.target.style.color = "#C9A84C"}
              onMouseLeave={(e) => e.target.style.color = "#7A7060"}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 48px", overflow: "hidden",
      }}>
        <ParticleCanvas />

        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(#1A180E18 1px, transparent 1px), linear-gradient(90deg, #1A180E18 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Glow */}
        <div style={{
          position: "absolute", top: "20%", left: "60%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, #C9A84C0A, transparent 70%)",
          transform: "translate(-50%, -50%)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 760 }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: 24, opacity: 0.8,
          }}>
            ◈ Cloud Portfolio — Amin Bakkouh
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(44px, 7vw, 82px)",
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.02em", marginBottom: 20,
            color: "#F0E8D5",
          }}>
            Cloud Engineer
            <br />
            <span style={{ color: "#C9A84C" }}>AWS</span>
            <br />
            Amin Bakkouh
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, height: 28 }}>
            <span style={{ fontSize: 16, color: "#6A6050", fontFamily: "monospace" }}>→</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 15,
              color: "#9A9080", letterSpacing: "0.04em",
            }}>
              {typed}<span style={{ opacity: Math.sin(Date.now() / 500) > 0 ? 1 : 0, color: "#C9A84C" }}>|</span>
            </span>
          </div>

          <p style={{
            fontSize: 16, color: "#706050", lineHeight: 1.8,
            maxWidth: 520, marginBottom: 48,
          }}>
            Desarrollador construyendo un portfolio de ingeniería cloud con proyectos reales sobre AWS. Serverless, IaC, CI/CD y observabilidad.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#proyectos" style={{
              padding: "12px 28px", background: "#C9A84C", color: "#080705",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              letterSpacing: "0.08em", fontWeight: 700, borderRadius: 6,
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => { e.target.style.background = "#F5D78B"; }}
              onMouseLeave={(e) => { e.target.style.background = "#C9A84C"; }}
            >
              Ver proyectos →
            </a>
            <a href="mailto:tu@email.com" style={{
              padding: "12px 28px", background: "transparent",
              border: "1px solid #2A2820", color: "#9A9080",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              letterSpacing: "0.08em", borderRadius: 6,
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#C9A84C55"; e.target.style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#2A2820"; e.target.style.color = "#9A9080"; }}
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4,
        }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #C9A84C)" }} />
        
        </div>
      </section>

      {/* Projects */}
      <section id="proyectos" style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            // 01 — proyectos
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#F0E8D5", letterSpacing: "-0.01em" }}>
            Portfolio en construcción.
          </h2>
          <p style={{ fontSize: 15, color: "#6A6050", marginTop: 12, maxWidth: 480 }}>
            Proyectos reales con arquitectura cloud en AWS
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Skills */}
      <section id="habilidades" style={{ padding: "80px 48px", borderTop: "1px solid #141210" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            // 02 — stack
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0E8D5", fontWeight: 700, marginBottom: 48 }}>
            Tecnologías.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {SKILLS.map((group) => (
              <div key={group.category} style={{ padding: "20px 24px", border: "1px solid #1E1C18", borderRadius: 10, background: "#0C0B08" }}>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                  {group.category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item) => (
                    <span key={item} style={{
                      fontSize: 12, padding: "4px 10px", borderRadius: 4,
                      border: "1px solid #2A2820", color: "#8A8070", fontFamily: "monospace",
                      background: "#0F0E0C",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="roadmap" style={{ padding: "80px 48px", borderTop: "1px solid #141210" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              // 03 — roadmap
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0E8D5", fontWeight: 700, marginBottom: 40 }}>
              Plan de ruta.
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {ROADMAP.map((item, i) => <RoadmapItem key={item.phase} item={item} index={i} />)}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              // certificación
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0E8D5", fontWeight: 700, marginBottom: 40 }}>
              AWS Certified.
            </h2>

            <div style={{
              background: "#0C0B08", border: "1px solid #2A2820", borderRadius: 12,
              padding: "32px 28px", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0, width: 200, height: 200,
                background: "radial-gradient(circle at top right, #FF990012, transparent 70%)",
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: "#FF990018", border: "1px solid #FF990033",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>
                  ☁
                </div>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#F0E8D5", fontWeight: 700, marginBottom: 4 }}>
                    {CERT.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#FF9900", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                    {CERT.level}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#6A6050", fontFamily: "monospace" }}>progreso</span>
                  <span style={{ fontSize: 12, color: "#FF9900", fontFamily: "monospace" }}>{CERT.progress}%</span>
                </div>
                <div style={{ height: 4, background: "#1E1C18", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${CERT.progress}%`,
                    background: "linear-gradient(90deg, #C9A84C, #FF9900)",
                    borderRadius: 2, transition: "width 1s ease",
                  }} />
                </div>
              </div>

              <Badge color="#FF9900">{CERT.status}</Badge>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1E1C18" }}>
                {["Arquitectura cloud", "Diseño de sistemas distribuidos", "Servicios AWS core + avanzados", "Decisiones técnicas en producción"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: "#FF9900", fontSize: 11 }}>◈</span>
                    <span style={{ fontSize: 13, color: "#7A7060" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "80px 48px 0", borderTop: "1px solid #141210" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                // sobre mí
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#F0E8D5", fontWeight: 700, marginBottom: 24, lineHeight: 1.1 }}>
                No solo un<br />portfolio de frontend.
              </h2>
              <p style={{ fontSize: 15, color: "#706050", lineHeight: 1.9, marginBottom: 24 }}>
                Construyendo proyectos con arquitectura cloud real en AWS. Cada proyecto es una pieza de infraestructura funcional — serverless, CI/CD, IaC, observabilidad.
              </p>
              <p style={{ fontSize: 15, color: "#706050", lineHeight: 1.9 }}>
                El objetivo: demostrar mentalidad de <span style={{ color: "#C9A84C" }}>ingeniero cloud junior</span>, no de desarrollador frontend con curiosidad por la nube.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { val: "3", label: "Proyectos cloud", color: "#C9A84C" },
                { val: "8+", label: "Servicios AWS", color: "#3B7A57" },
                { val: "IaC", label: "Todo con Terraform", color: "#2B5797" },
                { val: "SAA", label: "Cert en progreso", color: "#FF9900" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "#0C0B08", border: "1px solid #1E1C18",
                  borderRadius: 10, padding: "20px 20px 16px",
                  borderLeft: `3px solid ${stat.color}44`,
                }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: stat.color, fontWeight: 700, marginBottom: 4 }}>
                    {stat.val}
                  </p>
                  <p style={{ fontSize: 12, color: "#4A4535", fontFamily: "monospace" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer style={{
        marginTop: 100, padding: "60px 48px",
        borderTop: "1px solid #141210", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400, height: 200,
          background: "radial-gradient(circle, #C9A84C08, transparent 70%)",
          pointerEvents: "none",
        }} />
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
          ◈ disponible para oportunidades
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 52px)", color: "#F0E8D5", fontWeight: 700, marginBottom: 32, letterSpacing: "-0.01em" }}>
          ¿Hablamos?
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <a href="mailto:selterkrey@gmail.com" style={{
            padding: "14px 32px", background: "#C9A84C", color: "#080705",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: "0.08em",
            fontWeight: 700, borderRadius: 6, transition: "all 0.2s",
          }}>
            Enviar email →
          </a>
          <a href="https://www.linkedin.com/in/amin-bakkouh-5ba1493aa/" style={{
            padding: "14px 32px", border: "1px solid #2A2820", color: "#7A7060",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: "0.08em",
            borderRadius: 6, transition: "all 0.2s",
          }}>
            LinkedIn
          </a>
          <a href="https://github.com/AtomGlab" style={{
            padding: "14px 32px", border: "1px solid #2A2820", color: "#7A7060",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: "0.08em",
            borderRadius: 6, transition: "all 0.2s",
          }}>
            GitHub
          </a>
        </div>
        <p style={{ marginTop: 60, fontSize: 11, color: "#2A2820", fontFamily: "monospace" }}>
          Construido con React · Desplegado en AWS S3 + CloudFront · IaC con Terraform 
        </p>
      </footer>
    </div>
  );
}