# -*- coding: utf-8 -*-
"""Builds Ujjawal's all-round resume PDF (single source of truth for portfolio/public/CV.pdf)."""
import sys
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle, HRFlowable, KeepTogether)
from reportlab.lib import colors

OUT = sys.argv[1]
LM = RM = 0.5 * inch
TM = 0.4 * inch
BM = 0.3 * inch
AVAIL = LETTER[0] - LM - RM
INK = colors.HexColor("#111111")
GREY = colors.HexColor("#3d3d3d")

name_s = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=16, leading=18,
                        alignment=TA_CENTER, textColor=INK, spaceAfter=3)
contact_s = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.6, leading=10.5,
                           alignment=TA_CENTER, textColor=GREY)
sec_s = ParagraphStyle("sec", fontName="Helvetica-Bold", fontSize=9.6, leading=11, textColor=INK)
role_s = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=9.6, leading=11.5, textColor=INK)
date_s = ParagraphStyle("date", fontName="Helvetica-Bold", fontSize=9.0, leading=11.5,
                        alignment=TA_RIGHT, textColor=INK)
sub_s = ParagraphStyle("sub", fontName="Helvetica-Oblique", fontSize=8.8, leading=10.5, textColor=GREY)
bul_s = ParagraphStyle("bul", fontName="Helvetica", fontSize=8.6, leading=9.7, textColor=INK,
                       leftIndent=11, bulletIndent=1.5, alignment=TA_JUSTIFY, spaceAfter=0.3)
tech_s = ParagraphStyle("tech", fontName="Helvetica", fontSize=8.4, leading=10.0, textColor=GREY,
                        spaceBefore=1.2)
skill_s = ParagraphStyle("skill", fontName="Helvetica", fontSize=8.4, leading=9.8, textColor=INK,
                         spaceAfter=0.6)

F = []


def section(title):
    F.append(Spacer(1, 3))
    F.append(Paragraph(title.upper(), sec_s))
    F.append(HRFlowable(width="100%", thickness=0.8, color=INK, spaceBefore=1.5, spaceAfter=3.2))


def headed(left, right):
    t = Table([[Paragraph(left, role_s), Paragraph(right, date_s)]],
              colWidths=[AVAIL - 1.85 * inch, 1.85 * inch])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, -1), 0),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t


def entry(left, right, sub=None, bullets=(), tech=None, gap=3):
    block = [headed(left, right)]
    if sub:
        block.append(Paragraph(sub, sub_s))
    block.append(Spacer(1, 2))
    for b in bullets:
        block.append(Paragraph(b, bul_s, bulletText="•"))
    if tech:
        block.append(Paragraph("<b>Tech:</b> " + tech, tech_s))
    F.append(KeepTogether(block))
    if gap:
        F.append(Spacer(1, gap))


# ---------------- HEADER ----------------
F.append(Paragraph("UJJAWAL PRATAP SINGH", name_s))
F.append(Paragraph(
    "(780) 709 4350 &nbsp;|&nbsp; ujjawalpratap1234@gmail.com &nbsp;|&nbsp; "
    "linkedin.com/in/ujjawalps2006 &nbsp;|&nbsp; github.com/ujjawalsuii", contact_s))

# ---------------- EDUCATION ----------------
section("Education")
F.append(headed("University of Alberta, Faculty of Science", "Edmonton, AB"))
F.append(headed("<font name='Helvetica'>B.Sc. Computing Specialization</font>", "Expected December 2026"))
F.append(Spacer(1, 2))
F.append(Paragraph("<b>Awards:</b> University of Alberta Regional Excellence Scholarship ($10,000)", tech_s))
F.append(Paragraph("<b>Coursework:</b> Web Applications &amp; Architecture, File and Database Management, Data "
                   "Structures &amp; Algorithms, Machine Learning, Reinforcement Learning, Search &amp; Planning in AI", tech_s))

# ---------------- EXPERIENCE ----------------
section("Experience")
entry("Freelance Web Developer, Kritanshi Boutique", "Jul 2026 &ndash; Aug 2026",
      sub="Abu Dhabi, UAE (Remote) &nbsp;&middot;&nbsp; kritanshiboutique.com",
      bullets=[
          "Shipped a production storefront as sole developer for an Abu Dhabi retail client, translating non-technical "
          "requirements into a live e-commerce site on Next.js 16 and TypeScript.",
          "Scoped a WhatsApp-based ordering flow that met the client&rsquo;s needs without payment-processor "
          "integration, removing PCI exposure from the build entirely.",
          "Enforced admin-only writes with Postgres Row Level Security behind a SECURITY DEFINER "
          "predicate, verified by an automated security probe (6/6 checks passing), and built an admin dashboard with "
          "product CRUD, object-storage uploads, and recoverable soft deletes that the owner runs unaided.",
          "Scored 99/100 Lighthouse performance on desktop with 100/100 across accessibility, SEO, and best practices, "
          "resolving WCAG contrast and ARIA violations surfaced in the audit.",
      ],
      tech="Next.js 16, TypeScript, Supabase (Postgres/Auth/Storage), Row Level Security, Tailwind, Vercel")

# ---------------- PROJECTS ----------------
section("Projects")
entry("Leo the Lion, AI Pediatric Health Platform", "TELUS Hackathon, Top 5",
      bullets=[
          "Architected a dual-interface health companion serving separate child and parent clients from a single "
          "FastAPI service, placing top 5 out of the field at the TELUS hackathon.",
          "Grounded model output in medical protocols with a Python RAG pipeline over an embedded vector index built "
          "on Hugging Face Sentence Transformers, serving Google Gemma 3; cut perceived latency 40% with a "
          "bi-directional Server-Sent Events layer, plus TensorFlow.js (Coco-SSD) detection and a Web Speech persona.",
      ],
      tech="Python, FastAPI, Sentence Transformers, Google Gemma 3, TensorFlow.js, React 18, SSE")

entry("Social Distribution, Federated Social Network", "Jan 2026 &ndash; Apr 2026",
      bullets=[
          "Engineered a node-to-node federation layer delivering entries, likes, comments, and follow requests across "
          "independently deployed nodes through an inbox API secured by a custom DRF authentication backend.",
          "Designed a three-tier visibility model (public, unlisted, friends-only) with bidirectional follow detection "
          "enforced at both the view and serializer layers, and shipped to Heroku with PostgreSQL, Gunicorn, and "
          "Cloudinary.",
      ],
      tech="Django, Django REST Framework, PostgreSQL, Heroku, Gunicorn, Cloudinary")

entry("WebAble, On-Device Accessibility Extension", "Feb 2026",
      bullets=[
          "Wrote a zero-dependency Multi-Layer Perceptron inference engine in vanilla JavaScript, running forward "
          "propagation and softmax classification over 63-dimensional landmark vectors with no ML runtime.",
          "Held 60 FPS ASL classification via MediaPipe Hands landmark extraction, and shipped live captions, "
          "text-to-speech, dyslexia-friendly reading, and epilepsy-safe modes &mdash; every inference step on-device, so "
          "no camera or gesture data leaves the browser.",
      ],
      tech="JavaScript, MediaPipe Hands, Neural Network Inference, Chrome Extension APIs")

entry("Aurora, Event Lottery System (Android)", "Sep 2025 &ndash; Dec 2025",
      bullets=[
          "Built a native Android app resolving oversubscribed event registration with an unbiased waitlist "
          "randomization algorithm, role-based access control across Entrants, Organizers, and Admins over Firebase "
          "Firestore real-time sync, QR check-ins, and async notifications that auto-promote waitlisted users.",
      ],
      tech="Java, Android SDK, Firebase Firestore, MVC")

entry("Systems Programming &mdash; RISC-V to WASM Translator, C-Ray Engine", "2024 &ndash; 2025",
      bullets=[
          "Built a cross-architecture binary translator mapping RISC-V branching semantics onto WebAssembly structured "
          "control flow, with LEB128 compression and a modular decoder for register-to-stack translation.",
          "Built a physics-based ray tracer from scratch in C with a custom linear algebra library and manual memory "
          "management, implementing BVH acceleration, Monte Carlo integration, and global illumination.",
      ],
      tech="C, RISC-V, WebAssembly, Python, Linear Algebra, Makefiles", gap=0)

# ---------------- LEADERSHIP ----------------
section("Leadership")
entry("Indian Students Association (INDSA), VP Media", "Jan 2025 &ndash; Sep 2025",
      bullets=[
          "Integrated generative AI workflows (LLMs, image generation) into the content pipeline, cutting drafting and "
          "design time while holding brand consistency; analyzed engagement metrics to optimize scheduling, "
          "contributing directly to a sold-out major cultural event.",
      ], gap=0)

# ---------------- SKILLS ----------------
section("Technical Skills")
for label, items in [
    ("Languages", "Python, Java, JavaScript, TypeScript, SQL, C / C99, Bash, RISC-V"),
    ("AI &amp; Machine Learning", "RAG, LLM Orchestration, NLP, Computer Vision, PyTorch, TensorFlow / TensorFlow.js, "
     "Sentence Transformers, Gemma, MediaPipe, Reinforcement Learning, NumPy, Pandas"),
    ("Web &amp; Backend", "React, Next.js, FastAPI, Django REST Framework, Node.js, REST APIs, Server-Sent Events, "
     "Server Actions, Tailwind, Chrome Extension APIs"),
    ("Data, Cloud &amp; DevOps", "PostgreSQL, Supabase, MongoDB, Firestore, Docker, Vercel, Heroku, GCP, Git, "
     "GitHub Actions, Linux, RLS/RBAC"),
]:
    F.append(Paragraph("<b>%s:</b> %s" % (label, items), skill_s))

doc = BaseDocTemplate(OUT, pagesize=LETTER,
                      leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM,
                      title="Ujjawal Pratap Singh - Resume", author="Ujjawal Pratap Singh",
                      subject="Resume", creator="Ujjawal Pratap Singh")
frame = Frame(LM, BM, AVAIL, LETTER[1] - TM - BM, id="f",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="p", frames=[frame])])
doc.build(F)
print("built ->", OUT)
