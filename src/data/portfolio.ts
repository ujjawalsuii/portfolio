import { BrainCircuit, Code2, Database, LayoutTemplate, Server, ShieldCheck } from 'lucide-react'

export const projects = [
    {
        name: 'Kritanshi Boutique',
        subtitle: 'Freelance · Production E-Commerce',
        desc: 'Storefront and admin CMS shipped solo for an Abu Dhabi retail client. WhatsApp ordering, RLS-enforced writes, 99/100 Lighthouse.',
        tags: ['Next.js 16', 'TypeScript', 'Supabase'],
        link: 'https://kritanshiboutique.com/'
    },
    {
        name: 'Leo the Lion',
        subtitle: 'AI & Healthcare · TELUS Top 6',
        desc: 'Pediatric health companion grounding Gemma 3 in medical protocols through a Python RAG engine.',
        tags: ['React 18', 'FastAPI', 'RAG'],
        link: 'https://github.com/Gfewq/Team'
    },
    {
        name: 'WebAble',
        subtitle: 'Accessibility & On-Device ML',
        desc: 'All-in-one accessibility extension: ASL-to-text, live captions, TTS, dyslexia and epilepsy-safe modes. 60 FPS gesture classification from a hand-written MLP in vanilla JS, fully on-device.',
        tags: ['JavaScript', 'MediaPipe', 'Chrome APIs'],
        link: 'https://github.com/ujjawalsuii/popowich-WebAble'
    },
    {
        name: 'Social Distribution',
        subtitle: 'Backend & Federation',
        desc: 'Federated social network with inbox-based node-to-node delivery and a three-tier visibility model.',
        tags: ['Django', 'DRF', 'PostgreSQL'],
        link: 'https://github.com/uofa-cmput404/w26-socialdistribution-project-fuchsia'
    },
    {
        name: 'C-Ray Engine',
        subtitle: 'Graphics & Physics',
        desc: 'Physics-based ray tracer built from scratch in C with BVH acceleration and global illumination.',
        tags: ['C', 'Linux', 'Graphics'],
        link: 'https://github.com/ujjawalsuii/c-ray-engine'
    },
    {
        name: 'RISC-V Translator',
        subtitle: 'Systems & Compilers',
        desc: 'Binary translator mapping RISC-V branching to WebAssembly structured control flow.',
        tags: ['C', 'WASM', 'Assembly'],
        link: 'https://github.com/ujjawalsuii/rv-to-wasm'
    },
    {
        name: 'Aurora',
        subtitle: 'Mobile Engineering',
        desc: 'Event lottery system for Android with unbiased waitlist selection and Firestore real-time sync.',
        tags: ['Java', 'Android', 'Firebase'],
        link: 'https://github.com/CMPUT301F25aurora/aurora-borealis'
    }
]

export const experiences = [
    {
        date: 'Jul - Aug 2026',
        kind: 'work',
        title: 'Kritanshi Boutique',
        subtitle: 'Freelance Web Developer · Abu Dhabi, UAE (Remote)',
        desc: "Shipped a production storefront as sole developer for an Abu Dhabi retail client, translating non-technical requirements into a live site. Scoped a WhatsApp ordering flow that met the client's needs without payment-processor integration, keeping the build out of PCI scope entirely. Built an admin dashboard with product CRUD, drag-and-drop image upload to object storage, category filtering, and recoverable soft deletes, so the owner publishes changes with zero developer involvement. Enforced admin-only writes at the database layer with Postgres Row Level Security behind a SECURITY DEFINER predicate, verified by an automated security probe (6/6 checks passing). Scored 99/100 Lighthouse performance with 100/100 across accessibility, SEO, and best practices.",
        status: 'completed',
        tags: ['Next.js 16', 'TypeScript', 'Supabase', 'Row Level Security', 'Vercel']
    },
    {
        date: 'Jan - Apr 2026',
        kind: 'project',
        title: 'Social Distribution',
        subtitle: 'Federated Social Network · CMPUT 404',
        desc: 'Django-based federated social network where independently deployed nodes exchange entries, likes, comments, and follow requests through an inbox API secured by a custom DRF authentication backend. Designed a three-tier visibility model (public, unlisted, friends-only) with bidirectional follow detection, enforced at both the view and serializer layers. Ingested GitHub Events API activity as markdown sanitized through markdown-it-py and bleach. Deployed on Heroku with PostgreSQL, Gunicorn, WhiteNoise, and Cloudinary.',
        status: 'completed',
        tags: ['Django', 'DRF', 'PostgreSQL', 'Heroku', 'Cloudinary']
    },
    {
        date: 'Feb 2026',
        kind: 'project',
        title: 'WebAble',
        subtitle: 'On-Device ASL Recognition Extension · Hackathon',
        desc: 'All-in-one accessibility Chrome extension making the web safer and easier to read in real time: ASL-to-text, live captions, text-to-speech, epilepsy-safe protections, dyslexia-friendly reading, voice commands, and color modes. Wrote a zero-dependency Multi-Layer Perceptron inference engine in vanilla JavaScript, running forward propagation and softmax classification over 63-dimensional MediaPipe hand-landmark vectors with no ML runtime. Held 60 FPS classification through optimized webcam and screen-share capture loops with spatial normalization, and kept every inference step on-device so no camera or gesture data leaves the browser. Injected accessibility layers past strict Content Security Policies via isolated iframes.',
        status: 'completed',
        tags: ['JavaScript', 'MediaPipe', 'Neural Networks', 'Chrome Extension APIs']
    },
    {
        date: 'Jan - Feb 2026',
        kind: 'project',
        title: 'Leo the Lion',
        subtitle: 'AI Pediatric Health Platform · TELUS Hackathon, Top 6',
        desc: 'Dual-interface health companion serving separate child and parent clients from one FastAPI service, placing top 6 in the field at the TELUS hackathon. Cut perceived latency 40% with a bi-directional Server-Sent Events streaming layer for instant voice and text interaction. Grounded model responses in medical protocols through a Python RAG engine built on Hugging Face Sentence Transformers and Google Gemma 3, and shipped in-browser object detection with TensorFlow.js (Coco-SSD) plus a Web Speech API voice persona.',
        status: 'completed',
        tags: ['React 18', 'FastAPI', 'RAG', 'Gemma 3', 'TensorFlow.js', 'SSE']
    },
    {
        date: 'Sep - Dec 2025',
        kind: 'project',
        title: 'Aurora',
        subtitle: 'Event Lottery System · Android Application',
        desc: 'Native Android app resolving oversubscribed event registration with a custom randomization algorithm that selects entrants from waitlists without bias. Handled concurrent sign-ups and shared profile state with Firebase Firestore real-time sync, role-based access control across Entrants, Organizers, and Admins, QR scanning for waitlist joins and check-ins, and an asynchronous notification system that promotes waitlisted users automatically when a spot opens.',
        status: 'completed',
        tags: ['Java', 'Android SDK', 'Firebase Firestore', 'MVC', 'RBAC']
    },
    {
        date: 'Sep - Dec 2025',
        kind: 'project',
        title: 'RISC-V to WebAssembly Translator',
        subtitle: 'Systems & Compilers',
        desc: 'Cross-architecture binary translator mapping RISC-V branching to WebAssembly structured control flow. Implemented LEB128 compression and a modular decoder for register-to-stack translation.',
        status: 'completed',
        tags: ['C', 'RISC-V', 'WASM', 'Assembly']
    },
    {
        date: 'Dec 2025',
        kind: 'project',
        title: 'C-Ray Engine Update',
        subtitle: 'Major Patch Release',
        desc: 'Significant performance improvements and new features for the physics-based ray tracer.',
        status: 'completed',
        tags: ['C', 'Graphics', 'Linux']
    },
    {
        date: 'Fall 2025',
        kind: 'project',
        title: 'Reinforcement Learning Library',
        subtitle: 'Machine Learning Research',
        desc: 'Custom RL library with Actor-Critic and Dyna-Q+ agents. Implemented Deep TD-Learning with neural networks and tile coding for continuous state spaces, with Average Reward Softmax optimization.',
        status: 'completed',
        tags: ['Python', 'NumPy', 'Neural Networks', 'RL']
    },
    {
        date: 'Jan - Sep 2025',
        kind: 'leadership',
        title: 'Indian Students Association (INDSA)',
        subtitle: 'VP Media',
        desc: 'Integrated generative AI workflows (LLMs, image generation) into the content pipeline, cutting drafting and design time while holding brand consistency across channels. Analyzed audience engagement metrics to identify posting trends and optimize scheduling, contributing directly to a sold-out major cultural event.',
        status: 'completed',
        tags: ['Generative AI', 'Content Strategy', 'Analytics']
    },
    {
        date: 'Jan 2025',
        kind: 'project',
        title: 'MongoDB Project',
        subtitle: 'Database Engineering',
        desc: 'Database architecture and optimization project focusing on query performance and data pipelines.',
        status: 'completed',
        tags: ['MongoDB', 'Node.js', 'API']
    },
    {
        date: 'Sep 2024',
        kind: 'project',
        title: 'C-Ray Engine',
        subtitle: 'Initial Release',
        desc: 'Physics-based ray tracer built from scratch in C. Implements BVH acceleration, Monte Carlo integration, and global illumination.',
        status: 'completed',
        tags: ['C', 'Linux', 'Graphics']
    }
]

export const skillCategories = [
    { title: 'Languages', skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'C / C99', 'Bash', 'RISC-V'], icon: Code2 },
    { title: 'AI & Machine Learning', skills: ['RAG', 'LLM Orchestration', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'TensorFlow.js', 'Sentence Transformers', 'Google Gemma & Gemini', 'MediaPipe', 'Neural Networks', 'Reinforcement Learning', 'Prompt Engineering'], icon: BrainCircuit },
    { title: 'Web & Frontend', skills: ['React', 'Next.js 16', 'TailwindCSS', 'React Three Fiber', 'Chrome Extension APIs', 'HTML / CSS', 'Web Speech API'], icon: LayoutTemplate },
    { title: 'Backend & APIs', skills: ['FastAPI', 'Django', 'Django REST Framework', 'Node.js', 'REST APIs', 'Server-Sent Events', 'Server Actions', 'Gunicorn'], icon: Server },
    { title: 'Data & Storage', skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'SQLite', 'Firebase Firestore', 'Cloudinary', 'Pandas', 'NumPy', 'Query Optimization', 'Data Pipelines'], icon: Database },
    { title: 'Cloud, DevOps & Security', skills: ['Vercel', 'Docker', 'Heroku', 'Firebase / GCP', 'GitHub Actions', 'CI/CD', 'Git', 'Linux/Unix', 'Row Level Security', 'RBAC', 'Session Auth'], icon: ShieldCheck }
]

export const adventuresMedia = [
    { type: 'image', src: 'Adventures/IMG_2246.JPEG' },
    { type: 'image', src: 'Adventures/IMG_2333.JPEG' },
    { type: 'image', src: 'Adventures/IMG_2883.JPEG' },
    { type: 'image', src: 'Adventures/IMG_7832.JPEG' },
    { type: 'image', src: 'Adventures/e765ea3a-2abd-41e5-a015-90f8b7c51ba5.JPEG' },
    { type: 'image', src: 'Adventures/FullSizeRender.JPEG' },
    { type: 'video', src: 'Adventures/3C7194DA-4599-47E6-B3EB-E994421027D3.MP4' },
    { type: 'video', src: 'Adventures/IMG_2918.MP4' },
]

export const momentsMedia = [
    { type: 'image', src: 'Moments/IMG_7652.JPEG' },
    { type: 'image', src: 'Moments/IMG_8816.JPEG' },
    { type: 'video', src: 'Moments/copy_02F64FF5-6B85-46EB-9C0D-A54C0FF1E6FE.MOV' },
    { type: 'video', src: 'Moments/banff.mp4' },
]

export const familyStories = [
    {
        id: 'mom',
        title: 'My Mom',
        image: 'Family/My-mom.JPEG',
        story: `My mom is my biggest supporter. She has always guided me to do the right thing and taught me that no dream is ever too far if you just believe in Krishna.

She always took amazing care of me. Even when she was tired or sick, she would still make sure I felt comfortable and had something to eat. Even when she insisted that she was fine and that the burn she got from holding a hot pan was nothing, she would still make sure I was always smiling.

No amount of words can describe how grateful I am to have such an incredible mother. I made it my dream that one day I will buy her a whole jewelry store and take her to the Alps, where she has always wanted to go.`
    }
]

export const familyMedia = [
    { type: 'image', src: 'Family/FullSizeRender.JPEG' },
    { type: 'image', src: 'Family/cecf81fd-ad55-4074-8375-08a4d5e6cabd.JPEG' },
    { type: 'image', src: 'Family/d648969d-60b5-4176-9acf-9212bc744c74.JPEG' },
]

export const galleryCategories = [
    {
        id: 'family',
        title: 'Family',
        cover: 'Family/FullSizeRender.JPEG',
        hasContent: true,
        isStoryType: true
    },
    {
        id: 'adventures',
        title: 'Adventures',
        cover: 'Adventures/IMG_2246.JPEG',
        hasContent: true,
        media: adventuresMedia
    },
    {
        id: 'moments',
        title: 'Moments',
        cover: 'Moments/IMG_7652.JPEG',
        hasContent: true,
        media: momentsMedia
    },
]
