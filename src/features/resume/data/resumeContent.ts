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
  email: "sidnei.deolive@example.com",
  phone: "+55 51 99682-8258",
  github: "GitHub",
  linkedin: "LinkedIn",
};

export const resumeContent: Record<Locale, ResumeContent> = {
  "en-US": {
    meta: baseMeta,
    hero: {
      eyebrow: "Operations-minded engineer",
      headline:
        "I build systems that keep field work, fleets, and internal teams moving.",
      summary:
        "Computer Engineering graduate focused on Vue, Node, Go, mobile apps, and infrastructure. I combine public-sector operations experience with software delivery for practical tools that teams can adopt without friction.",
      primaryCta: "Contact",
      secondaryCta: "View projects",
      availability:
        "Based in Rio Grande do Sul. Open to remote and hybrid software roles.",
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
          "Manages digital administrative processes, municipal fleet maintenance records, and internal documentation workflows.",
      },
      {
        title: "Support Technician",
        place: "ITEK Soluções em TI",
        period: "May 2021 - Oct 2022",
        description:
          "Handled remote and on-site support, computer and network maintenance, server administration, corporate email setup, legacy systems, web hosting, SSH/SFTP/FTP access, and Windows/Linux troubleshooting.",
      },
    ],
    education: [
      {
        title: "Bachelor's degree in Computer Engineering",
        place: "Universidade de Marília",
        period: "Aug 2020 - Dec 2025",
        description:
          "Focused on embedded systems, IoT, hardware development, electronics, microcontrollers, automation, and connected software solutions.",
      },
      {
        title: "Technologist in Chemistry",
        place: "Escola Técnica Estadual",
        period: "Jan 2017 - May 2020",
        description:
          "Studied chemical analysis, quality control, process management, product development, materials treatment, and technical compliance.",
      },
    ],
    projects: [
      {
        name: "quiCheck",
        title: "Asset verification scanner",
        stack: "Expo Go + React Native",
        description:
          "Mobile app for public and private organizations to scan asset labels, consult registered item data in real time, and speed up inventory control.",
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
      body: "Send a message for roles or projects involving Vue, Go, Node, mobile tools, fleet systems, internal platforms, or infrastructure.",
    },
    footer:
      "Portfolio built with Vue 3, Vite, typed content, and responsive theme tokens.",
  },
  "pt-BR": {
    meta: {
      ...baseMeta,
      role: "Engenheiro de Computação",
      location: "Parobé, Rio Grande do Sul",
    },
    hero: {
      eyebrow: "Engenharia com visão operacional",
      headline:
        "Construo sistemas para equipes internas, frotas e trabalho de campo continuarem fluindo.",
      summary:
        "Engenheiro de Computação com foco em Vue, Node, Go, apps mobile e infraestrutura. Uno vivência operacional no setor público com entrega de software prático, adotável e direto ao ponto.",
      primaryCta: "Contato",
      secondaryCta: "Ver projetos",
      availability:
        "Base no Rio Grande do Sul. Aberto a vagas remotas e híbridas em software.",
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
          "Gerencia processos digitais administrativos, controles de manutenção da frota municipal e fluxos de documentos internos.",
      },
      {
        title: "Técnico de Suporte",
        place: "ITEK Soluções em TI",
        period: "Mai 2021 - Out 2022",
        description:
          "Atuou com suporte remoto e presencial, manutenção de computadores e redes, servidores, e-mails corporativos, sistemas legados, hospedagem, SSH/SFTP/FTP e ambientes Windows/Linux.",
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
        stack: "Expo Go + React Native",
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
      title: "Precisa de software que encaixe na operação?",
      body: "Envie uma mensagem para vagas ou projetos com Vue, Go, Node, ferramentas mobile, frotas, plataformas internas ou infraestrutura.",
    },
    footer:
      "Portfólio feito com Vue 3, Vite, conteúdo tipado e tokens responsivos de tema.",
  },
  "es-AR": {
    meta: {
      ...baseMeta,
      role: "Ingeniero en Computación",
      location: "Parobé, Rio Grande do Sul",
    },
    hero: {
      eyebrow: "Ingeniería con mirada operativa",
      headline:
        "Creo sistemas para que equipos internos, flotas y trabajo de campo sigan en marcha.",
      summary:
        "Ingeniero en Computación enfocado en Vue, Node, Go, apps móviles e infraestructura. Combino experiencia operativa en sector público con software práctico para equipos reales.",
      primaryCta: "Contacto",
      secondaryCta: "Ver proyectos",
      availability:
        "Base en Río Grande do Sul. Abierto a roles remotos e híbridos en software.",
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
          "Gestiona procesos administrativos digitales, registros de mantenimiento de flota municipal y documentación interna.",
      },
      {
        title: "Técnico de Soporte",
        place: "ITEK Soluções em TI",
        period: "May 2021 - Oct 2022",
        description:
          "Trabajo con soporte remoto y presencial, mantenimiento de computadoras y redes, servidores, e-mail corporativo, sistemas legados, hosting, SSH/SFTP/FTP y Windows/Linux.",
      },
    ],
    education: [
      {
        title: "Licenciatura en Ingeniería en Computación",
        place: "Universidade de Marília",
        period: "Ago 2020 - Dic 2025",
        description:
          "Formación en sistemas embebidos, IoT, hardware, electrónica, microcontroladores, automatización y soluciones conectadas.",
      },
      {
        title: "Tecnólogo en Química",
        place: "Escola Técnica Estadual",
        period: "Ene 2017 - May 2020",
        description:
          "Estudios en análisis químicos, control de calidad, gestión de procesos, desarrollo de productos, tratamiento de materiales y normas técnicas.",
      },
    ],
    projects: [
      {
        name: "quiCheck",
        title: "Scanner para control patrimonial",
        stack: "Expo Go + React Native",
        description:
          "App móvil para consultar bienes por etiquetas en tiempo real y acelerar inventario en organizaciones públicas y privadas.",
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
      title: "¿Necesitás software que encaje con la operación?",
      body: "Escribime por roles o proyectos con Vue, Go, Node, herramientas móviles, flotas, plataformas internas o infraestructura.",
    },
    footer:
      "Portfolio hecho con Vue 3, Vite, contenido tipado y tokens responsivos de tema.",
  },
};
