export type SkillGroup = {
  title: string;
  items: string[];
};

export type TimelineItem = {
  title: string;
  place: string;
  period: string;
  description: string;
};

export type Project = {
  name: string;
  title: string;
  stack: string;
  description: string;
};

export type ResumeContent = {
  meta: {
    name: string;
    role: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    githubUrl: string;
    linkedin: string;
    linkedinUrl: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    summary: string;
    primaryCta: string;
    secondaryCta: string;
    availability: string;
  };
  sections: {
    skills: string;
    experience: string;
    education: string;
    projects: string;
    contact: string;
  };
  skillGroups: SkillGroup[];
  experience: TimelineItem[];
  education: TimelineItem[];
  projects: Project[];
  languages: string[];
  contact: {
    title: string;
    body: string;
  };
  footer: string;
};

export type Locale = "en-US" | "pt-BR" | "es-AR";
