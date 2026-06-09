import type { Locale, ResumeContent } from "@/features/resume/types";

export const localeLabels: Record<Locale, string> = {
  "en-US": "EN",
  "pt-BR": "PT",
  "es-AR": "ES",
};

const baseMeta = {
  name: "Sidnei William de Oliveira",
  role: "Computer Engineer",
  location: "Parobé, Rio Grande do Sul",
  email: "sidnei.deolive@gmail.com",
  phone: "+55 51 99682-8258",
  github: "GitHub",
  githubUrl: "https://github.com/sidneiwill",
  linkedin: "LinkedIn",
  linkedinUrl:
    "https://br.linkedin.com/in/sidnei-william-de-oliveira-215b8022b",
};

export const resumeContent: Record<Locale, ResumeContent> = {
  "en-US": {
    meta: baseMeta,
    hero: {
      eyebrow: "Practical solutions for operational challenges",
      headline:
        "I build systems that keep field work, fleets, and internal teams moving.",
      summary:
        "Computer Engineer focused on web, mobile, and desktop application development using Vue.js, Node.js, and Go, with experience in embedded systems, IoT, and hardware-software integration. Public-sector background developing practical and efficient solutions for process automation and management.",
      primaryCta: "Contact",
      secondaryCta: "View projects",
      availability:
        "Resident of Rio Grande do Sul. Open to new work experiences.",
    },
    sections: {
      skills: "Stack",
      experience: "Experience",
      education: "Education",
      projects: "Selected projects",
      contact: "Contact",
    },
    skillGroups: [
      {
        title: "Backend",
        items: [
          "TypeScript",
          "Node.js",
          "Go",
          "JavaScript",
          "REST APIs",
          "Lua",
        ],
      },
      { title: "Frontend", items: ["Vue 3", "React", "Quasar", "Electron"] },
      { title: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
      { title: "Mobile", items: ["React Native", "Expo Go"] },
      { title: "DevOps", items: ["Docker", "Git", "GitHub Actions", "Linux"] },
      {
        title: "Practice",
        items: ["Clean Code", "OOP", "Agentic Coding", "Codex", "Cursor"],
      },
    ],
    experience: [
      {
        title: "Administrative Agent",
        place: "Sapiranga City Hall",
        period: "Apr 2023 - Present",
        description:
          "Management of digital administrative processes, municipal fleet maintenance control, and internal document workflows.",
      },
      {
        title: "Support Technician",
        place: "ITEK Soluções em TI",
        period: "May 2021 - Oct 2022",
        description:
          "Remote and on-site support, computer and network maintenance, servers, corporate email, legacy systems, hosting, SSH/SFTP/FTP, and Windows/Linux environments.",
      },
    ],
    education: [
      {
        title: "Bachelor's degree in Computer Engineering",
        place: "Universidade de Marília",
        period: "Aug 2020 - Dec 2025",
        description:
          "Program focused on embedded systems, IoT, hardware, electronics, microcontrollers, automation, and connected solutions.",
      },
      {
        title: "Technologist in Chemistry",
        place: "Escola Técnica Estadual",
        period: "Jan 2017 - May 2020",
        description:
          "Training in chemical analysis, quality control, process management, product development, materials treatment, and technical standards.",
      },
    ],
    projects: [
      {
        name: "quiCheck",
        title: "Asset verification scanner",
        stack: "Expo Go + React Native + Google Sheets API",
        description:
          "Mobile app for public and private companies to consult assets in real time through labels, accelerating inventory and asset control.",
      },
      {
        name: "Aylon",
        title: "Fleet maintenance management",
        stack: "Vue 3 + Go + Wails",
        description:
          "Native desktop system for public and private fleets, covering vehicles, maintenance, invoices, balances, and service payment tracking.",
      },
    ],
    languages: [
      "Portuguese: fluent",
      "English: intermediate",
      "Spanish: basic",
    ],
    contact: {
      title: "Need software that fits real operations?",
      body: "Send a message for opportunities or projects involving Vue, Go, Node, mobile tools, management systems, internal platforms, or infrastructure.",
    },
    footer: "Portfolio built with Vue 3",
  },
  "pt-BR": {
    meta: {
      ...baseMeta,
      role: "Engenheiro de Computação",
      location: "Parobé, Rio Grande do Sul",
    },
    hero: {
      eyebrow: "Soluções práticas para desafios operacionais",
      headline:
        "Construo sistemas para que equipes internas, frotas e trabalho de campo continuem fluindo.",
      summary:
        "Engenheiro de Computação com foco em desenvolvimento de aplicações web, mobile e desktop utilizando Vue.js, Node.js e Go, além de experiência em sistemas embarcados, IoT e integração hardware-software. Vivência no setor público, desenvolvendo soluções práticas e eficientes para automação e gestão de processos.",
      primaryCta: "Contato",
      secondaryCta: "Ver projetos",
      availability:
        "Residente do estado do Rio Grande do Sul. Aberto a novas experiências de trabalho.",
    },
    sections: {
      skills: "Stack",
      experience: "Experiência",
      education: "Formação",
      projects: "Projetos selecionados",
      contact: "Contato",
    },
    skillGroups: [
      {
        title: "Backend",
        items: [
          "TypeScript",
          "Node.js",
          "Go",
          "JavaScript",
          "REST APIs",
          "Lua",
        ],
      },
      { title: "Frontend", items: ["Vue 3", "React", "Quasar", "Electron"] },
      { title: "Dados", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
      { title: "Mobile", items: ["React Native", "Expo Go"] },
      { title: "DevOps", items: ["Docker", "Git", "GitHub Actions", "Linux"] },
      {
        title: "Prática",
        items: ["Clean Code", "POO", "Agentic Coding", "Codex", "Cursor"],
      },
    ],
    experience: [
      {
        title: "Agente Administrativo",
        place: "Prefeitura de Sapiranga",
        period: "Abr 2023 - Atual",
        description:
          "Gerenciamento de processos digitais administrativos, controle de manutenção da frota municipal e fluxos de documentos internos.",
      },
      {
        title: "Técnico de Suporte",
        place: "ITEK Soluções em TI",
        period: "Mai 2021 - Out 2022",
        description:
          "Atuação no suporte remoto e presencial, manutenção de computadores e redes, servidores, e-mails corporativos, sistemas legados, hospedagem, SSH/SFTP/FTP e ambientes Windows/Linux.",
      },
    ],
    education: [
      {
        title: "Bacharelado em Engenharia da Computação",
        place: "Universidade de Marília",
        period: "Ago 2020 - Dez 2025",
        description:
          "Curso com foco em sistemas embarcados, IoT, hardware, eletrônica, microcontroladores, automação e soluções conectadas.",
      },
      {
        title: "Tecnólogo em Química",
        place: "Escola Técnica Estadual",
        period: "Jan 2017 - Mai 2020",
        description:
          "Formação em análises químicas, controle de qualidade, gestão de processos, desenvolvimento de produtos, tratamento de materiais e normas técnicas.",
      },
    ],
    projects: [
      {
        name: "quiCheck",
        title: "Scanner para conferência patrimonial",
        stack: "Expo Go + React Native + Google Sheets API",
        description:
          "App mobile para empresas públicas e privadas consultarem bens em tempo real por etiquetas, acelerando inventário e controle patrimonial.",
      },
      {
        name: "Aylon",
        title: "Gestão de manutenção de frotas",
        stack: "Vue 3 + Go + Wails",
        description:
          "Sistema desktop nativo para frotas públicas e privadas, com veículos, manutenções, notas fiscais, saldos e pagamentos de serviços.",
      },
    ],
    languages: [
      "Português: fluente",
      "Inglês: intermediário",
      "Espanhol: básico",
    ],
    contact: {
      title: "Precisa de um software que encaixe às suas necessidades?",
      body: "Envie uma mensagem para oportunidades ou projetos envolvendo Vue, Go, Node, ferramentas móveis, sistemas de gestão, plataformas internas ou infraestrutura.",
    },
    footer: "Portfólio feito com Vue 3",
  },
  "es-AR": {
    meta: {
      ...baseMeta,
      role: "Ingeniero en Computación",
      location: "Parobé, Rio Grande do Sul",
    },
    hero: {
      eyebrow: "Soluciones prácticas para desafíos operativos",
      headline:
        "Creo sistemas para que equipos internos, flotas y trabajo de campo sigan en marcha.",
      summary:
        "Ingeniero en Computación enfocado en el desarrollo de aplicaciones web, móviles y desktop con Vue.js, Node.js y Go, además de experiencia en sistemas embebidos, IoT e integración hardware-software. Experiencia en el sector público, desarrollando soluciones prácticas y eficientes para automatización y gestión de procesos.",
      primaryCta: "Contacto",
      secondaryCta: "Ver proyectos",
      availability:
        "Residente del estado de Rio Grande do Sul. Abierto a nuevas experiencias laborales.",
    },
    sections: {
      skills: "Stack",
      experience: "Experiencia",
      education: "Formación",
      projects: "Proyectos seleccionados",
      contact: "Contacto",
    },
    skillGroups: [
      {
        title: "Backend",
        items: [
          "TypeScript",
          "Node.js",
          "Go",
          "JavaScript",
          "REST APIs",
          "Lua",
        ],
      },
      { title: "Frontend", items: ["Vue 3", "React", "Quasar", "Electron"] },
      { title: "Datos", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
      { title: "Mobile", items: ["React Native", "Expo Go"] },
      { title: "DevOps", items: ["Docker", "Git", "GitHub Actions", "Linux"] },
      {
        title: "Práctica",
        items: ["Clean Code", "POO", "Agentic Coding", "Codex", "Cursor"],
      },
    ],
    experience: [
      {
        title: "Agente Administrativo",
        place: "Municipalidad de Sapiranga",
        period: "Abr 2023 - Actualidad",
        description:
          "Gestión de procesos administrativos digitales, control de mantenimiento de la flota municipal y flujos de documentos internos.",
      },
      {
        title: "Técnico de Soporte",
        place: "ITEK Soluções em TI",
        period: "May 2021 - Oct 2022",
        description:
          "Actuación en soporte remoto y presencial, mantenimiento de computadoras y redes, servidores, e-mails corporativos, sistemas legados, hosting, SSH/SFTP/FTP y entornos Windows/Linux.",
      },
    ],
    education: [
      {
        title: "Licenciatura en Ingeniería en Computación",
        place: "Universidade de Marília",
        period: "Ago 2020 - Dic 2025",
        description:
          "Carrera con foco en sistemas embebidos, IoT, hardware, electrónica, microcontroladores, automatización y soluciones conectadas.",
      },
      {
        title: "Tecnólogo en Química",
        place: "Escola Técnica Estadual",
        period: "Ene 2017 - May 2020",
        description:
          "Formación en análisis químicos, control de calidad, gestión de procesos, desarrollo de productos, tratamiento de materiales y normas técnicas.",
      },
    ],
    projects: [
      {
        name: "quiCheck",
        title: "Scanner para control patrimonial",
        stack: "Expo Go + React Native + Google Sheets API",
        description:
          "App móvil para que empresas públicas y privadas consulten bienes en tiempo real mediante etiquetas, acelerando inventario y control patrimonial.",
      },
      {
        name: "Aylon",
        title: "Gestión de mantenimiento de flotas",
        stack: "Vue 3 + Go + Wails",
        description:
          "Sistema desktop nativo para flotas públicas y privadas con vehículos, mantenimientos, facturas, saldos y pagos de servicios.",
      },
    ],
    languages: ["Portugués: fluido", "Inglés: intermedio", "Español: básico"],
    contact: {
      title: "¿Necesitas un software que encaje con tus necesidades?",
      body: "Envía un mensaje para oportunidades o proyectos relacionados con Vue, Go, Node, herramientas móviles, sistemas de gestión, plataformas internas o infraestructura.",
    },
    footer: "Portfolio hecho con Vue 3",
  },
};
