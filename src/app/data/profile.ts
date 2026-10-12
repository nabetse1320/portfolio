export type Lang = 'es' | 'en';

export interface NavItem {
  id: string;
  label: string;
}

export interface Role {
  id: string;
  period: string;
  title: string;
  org: string;
  current: boolean;
  /** Logo cuadrado; si falta se muestra `mark` como monograma. */
  logo?: string;
  mark: string;
  points: string[];
  tags: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'web' | 'store' | 'code';
}

export interface Project {
  id: string;
  name: string;
  kicker: string;
  period: string;
  summary: string;
  points: string[];
  tags: string[];
  tone: 'ink' | 'warm' | 'sea' | 'gold' | 'violet';
  featured: boolean;
  badge?: string;
  /** Video de YouTube (id) con su miniatura local. */
  video?: { youtube: string; poster: string };
  /** Capturas verticales de app móvil. */
  screens?: string[];
  links: ProjectLink[];
}

/** Una pieza de galería: imagen, o video de YouTube con su póster. */
export interface GalleryItem {
  src: string;
  youtube?: string;
}

export interface CreativeItem {
  id: string;
  title: string;
  cover: string;
  href: string;
  /** Sin galería, la tarjeta abre Behance directamente. */
  gallery?: GalleryItem[];
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: Skill[];
}

export interface EducationItem {
  id: string;
  title: string;
  school: string;
  period: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Content {
  meta: { title: string; description: string };
  nav: NavItem[];
  ui: {
    skip: string;
    sections: string;
    openMenu: string;
    closeMenu: string;
    status: string;
    switchLang: string;
    switchLangLabel: string;
    themeToLight: string;
    themeToDark: string;
    write: string;
    seeWork: string;
    downloadCv: string;
    current: string;
    technologies: string;
    play: string;
    screensOf: string;
    screen: string;
    code: string;
    copyEmail: string;
    copied: string;
    whatsapp: string;
    backToTop: string;
    close: string;
    previous: string;
    next: string;
    viewOnBehance: string;
    of: string;
    portraitAlt: string;
  };
  hero: { focus: string; lead: string; interest: string; chips: string[] };
  about: { title: string; story: string[]; stats: Stat[] };
  experience: { title: string; lede: string; roles: Role[] };
  work: { title: string; lede: string; projects: Project[] };
  creative: { title: string; lede: string; ledeLink: string; items: CreativeItem[] };
  skills: {
    title: string;
    lede: string;
    groups: SkillGroup[];
    educationTitle: string;
    education: EducationItem[];
    languagesTitle: string;
    languages: string[];
  };
  contact: {
    title: [string, string];
    lede: string;
    phone: string;
    location: string;
    locationValue: string;
  };
  role: string;
  place: string;
  cv: string;
}

/** Datos que no cambian con el idioma. */
export const profile = {
  name: 'Esteban Josué Guevara Hernández',
  given: 'Esteban Josué',
  family: 'Guevara Hernández',
  phone: '+57 304 5585293',
  phoneHref: 'tel:+573045585293',
  whatsapp: 'https://wa.me/573045585293',
  email: 'esteban.guevara1323@gmail.com',
  emailHref: 'mailto:esteban.guevara1323@gmail.com',
  linkedin: 'https://www.linkedin.com/in/esteban-guevara-428153285',
  linkedinLabel: 'esteban-guevara',
  github: 'https://github.com/nabetse1320',
  githubLabel: 'nabetse1320',
  behance: 'https://www.behance.net/gust132efrfrtg',
  behanceLabel: 'Esteban Guevara',
  portrait: 'portrait.jpg',
};

const icon = (name: string) => `icons/${name}.svg`;

const skills = {
  mobile: [
    { name: 'Kotlin', icon: icon('kotlin') },
    { name: 'Jetpack Compose', icon: icon('jetpackcompose') },
    { name: 'Flutter', icon: icon('flutter') },
    { name: 'Dart', icon: icon('dart') },
    { name: 'Laravel', icon: icon('laravel') },
    { name: 'PHP', icon: icon('php') },
    { name: 'SQL', icon: icon('mysql') },
    { name: 'HTML/CSS', icon: icon('html5') },
  ],
  games: [
    { name: 'Unity', icon: icon('unity') },
    { name: 'C#', icon: icon('csharp') },
    { name: 'Git', icon: icon('git') },
  ],
  design: [
    { name: 'Photoshop', icon: icon('adobephotoshop') },
    { name: 'Illustrator', icon: icon('adobeillustrator') },
    { name: 'DaVinci Resolve', icon: icon('davinciresolve') },
    { name: 'Blender', icon: icon('blender') },
  ],
} satisfies Record<string, Skill[]>;

const media = {
  famii: {
    screens: [1, 2, 3, 4, 5].map((n) => `projects/famii/screen-${n}.webp`),
    store: 'https://play.google.com/store/apps/details?id=famiiapp.project',
    web: 'https://famii.co',
  },
  tesoro: {
    video: { youtube: 'WM1ZsX8HacA', poster: 'projects/games/tesoro.webp' },
    repo: 'https://github.com/nabetse1320/El-tesoro-del-prejuicio',
  },
  questionQuest: {
    video: { youtube: '3JIhg3XARcM', poster: 'projects/games/question-quest.webp' },
    repo: 'https://github.com/nabetse1320/Question-Quest',
  },
  liquidMaze: {
    video: { youtube: 'f8pw25xTm6w', poster: 'projects/games/liquid-maze.webp' },
    repo: 'https://github.com/nabetse1320/Liquid-Maze',
  },
};

const gallery = (folder: string, count: number): GalleryItem[] =>
  Array.from({ length: count }, (_, i) => ({ src: `creative/${folder}/${i + 1}.webp` }));

const creative = {
  '3d': {
    cover: 'creative/3d.webp',
    href: 'https://www.behance.net/gallery/199884139/Modelado-y-animacion-3D',
    gallery: gallery('3d', 3),
  },
  videos: {
    cover: 'creative/videos.webp',
    href: 'https://www.behance.net/gallery/176701489/Videos-varios',
  },
  youtube: {
    cover: 'creative/youtube.webp',
    href: 'https://www.behance.net/gallery/176095433/Videos-para-youtube',
    gallery: ['Af8Px2ja7l8', '8MjO8UhfMdo', 'MlICveoFDwk', 'KTYAaOMWInI'].map((youtube, i) => ({
      youtube,
      src: `creative/youtube/${i + 1}.webp`,
    })),
  },
  fotografia: {
    cover: 'creative/fotografia.webp',
    href: 'https://www.behance.net/gallery/176167755/Fotografia',
    gallery: gallery('fotografia', 6),
  },
  dibujos: {
    cover: 'creative/dibujos.webp',
    href: 'https://www.behance.net/gallery/176166277/Dibujos',
    gallery: gallery('dibujos', 4),
  },
};

const sectionIds = ['perfil', 'experiencia', 'trabajo', 'creativo', 'habilidades', 'contacto'];

const nav = (labels: string[]): NavItem[] => sectionIds.map((id, i) => ({ id, label: labels[i] }));

const es: Content = {
  meta: {
    title: 'Esteban Guevara — Ingeniero Multimedia',
    description:
      'Portafolio de Esteban Josué Guevara Hernández, ingeniero multimedia enfocado en desarrollo móvil y web: Kotlin, Jetpack Compose, Flutter y Laravel.',
  },
  nav: nav(['Perfil', 'Experiencia', 'Trabajo', 'Creativo', 'Habilidades', 'Contacto']),
  ui: {
    skip: 'Saltar al contenido',
    sections: 'Secciones',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    status: 'Abierto a roles',
    switchLang: 'EN',
    switchLangLabel: 'View in English',
    themeToLight: 'Cambiar a modo claro',
    themeToDark: 'Cambiar a modo oscuro',
    write: 'Escríbeme',
    seeWork: 'Ver trabajo',
    downloadCv: 'Descargar CV',
    current: 'Actual',
    technologies: 'Tecnologías',
    play: 'Reproducir video de',
    screensOf: 'Capturas de',
    screen: 'Captura',
    code: 'Código',
    copyEmail: 'Copiar correo',
    copied: 'Copiado',
    whatsapp: 'WhatsApp',
    backToTop: 'Volver arriba',
    close: 'Cerrar',
    previous: 'Anterior',
    next: 'Siguiente',
    viewOnBehance: 'Ver galería en Behance',
    of: 'de',
    portraitAlt: 'Retrato de Esteban Josué Guevara Hernández',
  },
  hero: {
    focus: 'Desarrollo móvil y web',
    lead: 'Aplicaciones Android con Kotlin y Jetpack Compose, backends con Laravel y productos multiplataforma con Flutter.',
    interest: 'Medellín, Rionegro o remoto',
    chips: ['Kotlin · Compose', 'Laravel', 'App en Google Play'],
  },
  about: {
    title: 'Perfil',
    story: [
      'Empecé en la universidad haciendo videojuegos y piezas audiovisuales. Hoy construyo producto: la app Android de Famii, su backend en Laravel y el sitio web que la acompaña.',
      'Esa mezcla me hace cuidar las dos caras de un proyecto: que el código sea sólido y que usarlo se sienta bien.',
    ],
    stats: [
      { value: '1', label: 'App Android publicada en Google Play' },
      { value: '4', label: 'Videojuegos desarrollados en equipo' },
      { value: 'Top 6', label: 'Convocatoria nacional Vertical-i / Minciencias' },
      { value: '2', label: 'Categorías ganadas en GameJam Caribe 2023' },
    ],
  },
  experience: {
    title: 'Experiencia',
    lede: 'Producto, audiovisual y videojuegos. Del desarrollo al despliegue.',
    roles: [
      {
        id: 'famii',
        period: '2025 — Actual',
        title: 'Desarrollador Móvil y Web',
        org: 'Famii',
        current: true,
        logo: 'projects/famii/icon.webp',
        mark: 'F',
        points: [
          'Desarrollo de la aplicación móvil Android con Kotlin y Jetpack Compose.',
          'Implementación y mantenimiento del backend con Laravel (API, lógica de negocio y base de datos).',
          'Administración y mantenimiento del sitio web corporativo famii.co (contenido, estabilidad y soporte técnico).',
          'Colaboración en el ciclo completo del producto: desarrollo, pruebas y despliegue de funcionalidades.',
        ],
        tags: ['Kotlin', 'Jetpack Compose', 'Laravel', 'PHP', 'Web'],
      },
      {
        id: 'bienestar',
        period: '2024',
        title: 'Auxiliar de producción audiovisual',
        org: 'Bienestar Universitario — Universidad Simón Bolívar',
        current: false,
        mark: 'US',
        points: [
          'Apoyo en producción de contenido audiovisual para redes sociales del área de Bienestar Universitario.',
          'Participación en captura, edición y entrega de piezas comunicativas institucionales.',
        ],
        tags: ['Audiovisual', 'Edición', 'Piezas institucionales'],
      },
      {
        id: 'juegos',
        period: '2021 — 2024',
        title: 'Desarrollador de videojuegos',
        org: 'Proyectos universitarios y convocatorias',
        current: false,
        logo: 'projects/games/tesoro-thumb.webp',
        mark: 'VJ',
        points: [
          'Vertical-i / Minciencias (2023–2024): programación y game design en «El Tesoro del Prejuicio»; equipo ganador de la convocatoria nacional y cofinanciado tras incubación.',
          'GameJam Caribe 2023: integrante del equipo ganador en las categorías Arte visual y Narrativa.',
          'Question Quest (2021–2022) y Liquid Maze (2024): programación y game design en Unity/C# como proyectos universitarios (Unisimón).',
        ],
        tags: ['Unity', 'C#', 'Game design'],
      },
    ],
  },
  work: {
    title: 'Trabajo seleccionado',
    lede: 'Productos y juegos en los que programé, diseñé o recorrí el ciclo completo.',
    projects: [
      {
        id: 'famii',
        name: 'Famii',
        kicker: 'Producto en curso',
        period: '2025 — Actual',
        summary:
          'Aplicación Android, backend y sitio corporativo. Participación en el ciclo completo: desarrollo, pruebas y despliegue.',
        points: [
          'App Android con Kotlin y Jetpack Compose.',
          'Backend Laravel: API, lógica de negocio y base de datos.',
          'famii.co: contenido, estabilidad y soporte técnico.',
        ],
        tags: ['Kotlin', 'Compose', 'Laravel', 'PHP'],
        tone: 'ink',
        featured: true,
        screens: media.famii.screens,
        links: [
          { label: 'Google Play', href: media.famii.store, kind: 'store' },
          { label: 'famii.co', href: media.famii.web, kind: 'web' },
        ],
      },
      {
        id: 'tesoro',
        name: 'El Tesoro del Prejuicio',
        kicker: 'Vertical-i / Minciencias',
        period: '2023 — 2024',
        summary:
          'Programación y game design. El equipo ganó la convocatoria nacional y recibió cofinanciación tras la incubación.',
        points: [],
        tags: ['Unity', 'C#', 'Game design'],
        tone: 'warm',
        featured: false,
        badge: 'Convocatoria nacional',
        video: media.tesoro.video,
        links: [{ label: 'Código', href: media.tesoro.repo, kind: 'code' }],
      },
      {
        id: 'question-quest',
        name: 'Question Quest',
        kicker: 'Proyecto universitario · Unisimón',
        period: '2021 — 2022',
        summary: 'Programación y game design en Unity y C#.',
        points: [],
        tags: ['Unity', 'C#'],
        tone: 'violet',
        featured: false,
        video: media.questionQuest.video,
        links: [{ label: 'Código', href: media.questionQuest.repo, kind: 'code' }],
      },
      {
        id: 'liquid-maze',
        name: 'Liquid Maze',
        kicker: 'Proyecto universitario · Unisimón',
        period: '2024',
        summary: 'Programación, game design y modelado 3D en Unity y C#.',
        points: [],
        tags: ['Unity', 'C#', '3D'],
        tone: 'gold',
        featured: false,
        video: media.liquidMaze.video,
        links: [{ label: 'Código', href: media.liquidMaze.repo, kind: 'code' }],
      },
      {
        id: 'gamejam',
        name: 'GameJam Caribe',
        kicker: 'Competencia',
        period: '2023',
        summary: 'Integrante del equipo ganador en las categorías Arte visual y Narrativa.',
        points: [],
        tags: ['Narrativa', 'Arte visual'],
        tone: 'sea',
        featured: false,
        badge: 'Equipo ganador',
        links: [],
      },
    ],
  },
  creative: {
    title: 'Trabajo creativo',
    lede: 'Modelado 3D, video, fotografía e ilustración. La galería completa vive en',
    ledeLink: 'Behance',
    items: [
      { id: '3d', title: 'Modelado y animación 3D', ...creative['3d'] },
      { id: 'videos', title: 'Videos varios', ...creative.videos },
      { id: 'youtube', title: 'Videos para YouTube', ...creative.youtube },
      { id: 'fotografia', title: 'Fotografía', ...creative.fotografia },
      { id: 'dibujos', title: 'Dibujos', ...creative.dibujos },
    ],
  },
  skills: {
    title: 'Habilidades y formación',
    lede: 'Herramientas con las que construyo producto, juego y pieza.',
    groups: [
      { id: 'movil', title: 'Desarrollo móvil / web', items: skills.mobile },
      { id: 'juegos', title: 'Videojuegos', items: skills.games },
      { id: 'diseno', title: 'Diseño y multimedia', items: skills.design },
    ],
    educationTitle: 'Formación',
    education: [
      {
        id: 'pregrado',
        title: 'Ingeniería Multimedia',
        school: 'Universidad Simón Bolívar',
        period: '2020 — 2025',
      },
      {
        id: 'minor',
        title: 'Minor en Gerencia de Industrias Creativas',
        school: 'Universidad Simón Bolívar',
        period: '2024',
      },
    ],
    languagesTitle: 'Idiomas',
    languages: ['Español (nativo)', 'Inglés (intermedio)'],
  },
  contact: {
    title: ['Medellín, Rionegro', 'o remoto.'],
    lede: 'Interés en roles de desarrollo móvil y web. Referencias disponibles a solicitud.',
    phone: 'Teléfono',
    location: 'Ubicación',
    locationValue: 'Rionegro / Valle de Aburrá, Antioquia',
  },
  role: 'Ingeniero Multimedia',
  place: 'Rionegro, Antioquia',
  cv: 'cv/CV-Esteban-Guevara-ES.pdf',
};

const en: Content = {
  meta: {
    title: 'Esteban Guevara — Multimedia Engineer',
    description:
      'Portfolio of Esteban Josué Guevara Hernández, a multimedia engineer focused on mobile and web development: Kotlin, Jetpack Compose, Flutter and Laravel.',
  },
  nav: nav(['Profile', 'Experience', 'Work', 'Creative', 'Skills', 'Contact']),
  ui: {
    skip: 'Skip to content',
    sections: 'Sections',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    status: 'Open to roles',
    switchLang: 'ES',
    switchLangLabel: 'Ver en español',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    write: 'Get in touch',
    seeWork: 'See work',
    downloadCv: 'Download CV',
    current: 'Current',
    technologies: 'Technologies',
    play: 'Play video of',
    screensOf: 'Screenshots of',
    screen: 'Screenshot',
    code: 'Code',
    copyEmail: 'Copy email',
    copied: 'Copied',
    whatsapp: 'WhatsApp',
    backToTop: 'Back to top',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    viewOnBehance: 'View gallery on Behance',
    of: 'of',
    portraitAlt: 'Portrait of Esteban Josué Guevara Hernández',
  },
  hero: {
    focus: 'Mobile & web development',
    lead: 'Android apps with Kotlin and Jetpack Compose, Laravel backends and cross-platform products with Flutter.',
    interest: 'Medellín, Rionegro or remote',
    chips: ['Kotlin · Compose', 'Laravel', 'App on Google Play'],
  },
  about: {
    title: 'Profile',
    story: [
      'I started out at university making video games and audiovisual pieces. Today I build product: the Famii Android app, its Laravel backend and the website around it.',
      'That mix makes me care about both sides of a project: solid code, and something that feels good to use.',
    ],
    stats: [
      { value: '1', label: 'Android app published on Google Play' },
      { value: '4', label: 'Video games built as part of a team' },
      { value: 'Top 6', label: 'Vertical-i / Minciencias national call' },
      { value: '2', label: 'Categories won at GameJam Caribe 2023' },
    ],
  },
  experience: {
    title: 'Experience',
    lede: 'Product, audiovisual and video games. From development to deployment.',
    roles: [
      {
        id: 'famii',
        period: '2025 — Present',
        title: 'Mobile & Web Developer',
        org: 'Famii',
        current: true,
        logo: 'projects/famii/icon.webp',
        mark: 'F',
        points: [
          'Developed the Android mobile app with Kotlin and Jetpack Compose.',
          'Built and maintained the Laravel backend (API, business logic and database).',
          'Managed and maintained the corporate website famii.co (content, stability and technical support).',
          'Worked across the full product cycle: development, testing and feature deployment.',
        ],
        tags: ['Kotlin', 'Jetpack Compose', 'Laravel', 'PHP', 'Web'],
      },
      {
        id: 'bienestar',
        period: '2024',
        title: 'Audiovisual Production Assistant',
        org: 'Student Wellbeing Office — Universidad Simón Bolívar',
        current: false,
        mark: 'US',
        points: [
          'Supported audiovisual content production for the Student Wellbeing Office’s social media.',
          'Took part in shooting, editing and delivering institutional communication pieces.',
        ],
        tags: ['Audiovisual', 'Editing', 'Institutional content'],
      },
      {
        id: 'juegos',
        period: '2021 — 2024',
        title: 'Game Developer',
        org: 'University projects and national calls',
        current: false,
        logo: 'projects/games/tesoro-thumb.webp',
        mark: 'GD',
        points: [
          'Vertical-i / Minciencias (2023–2024): programming and game design for “El Tesoro del Prejuicio”; the team won the national call and received co-funding after incubation.',
          'GameJam Caribe 2023: member of the team that won the Visual Art and Narrative categories.',
          'Question Quest (2021–2022) and Liquid Maze (2024): programming and game design in Unity/C# as university projects (Unisimón).',
        ],
        tags: ['Unity', 'C#', 'Game design'],
      },
    ],
  },
  work: {
    title: 'Selected work',
    lede: 'Products and games where I programmed, designed or went through the full cycle.',
    projects: [
      {
        id: 'famii',
        name: 'Famii',
        kicker: 'Ongoing product',
        period: '2025 — Present',
        summary:
          'Android app, backend and corporate website. Involved in the full cycle: development, testing and deployment.',
        points: [
          'Android app with Kotlin and Jetpack Compose.',
          'Laravel backend: API, business logic and database.',
          'famii.co: content, stability and technical support.',
        ],
        tags: ['Kotlin', 'Compose', 'Laravel', 'PHP'],
        tone: 'ink',
        featured: true,
        screens: media.famii.screens,
        links: [
          { label: 'Google Play', href: media.famii.store, kind: 'store' },
          { label: 'famii.co', href: media.famii.web, kind: 'web' },
        ],
      },
      {
        id: 'tesoro',
        name: 'El Tesoro del Prejuicio',
        kicker: 'Vertical-i / Minciencias',
        period: '2023 — 2024',
        summary:
          'Programming and game design. The team won the national call and received co-funding after incubation.',
        points: [],
        tags: ['Unity', 'C#', 'Game design'],
        tone: 'warm',
        featured: false,
        badge: 'National call',
        video: media.tesoro.video,
        links: [{ label: 'Code', href: media.tesoro.repo, kind: 'code' }],
      },
      {
        id: 'question-quest',
        name: 'Question Quest',
        kicker: 'University project · Unisimón',
        period: '2021 — 2022',
        summary: 'Programming and game design in Unity and C#.',
        points: [],
        tags: ['Unity', 'C#'],
        tone: 'violet',
        featured: false,
        video: media.questionQuest.video,
        links: [{ label: 'Code', href: media.questionQuest.repo, kind: 'code' }],
      },
      {
        id: 'liquid-maze',
        name: 'Liquid Maze',
        kicker: 'University project · Unisimón',
        period: '2024',
        summary: 'Programming, game design and 3D modeling in Unity and C#.',
        points: [],
        tags: ['Unity', 'C#', '3D'],
        tone: 'gold',
        featured: false,
        video: media.liquidMaze.video,
        links: [{ label: 'Code', href: media.liquidMaze.repo, kind: 'code' }],
      },
      {
        id: 'gamejam',
        name: 'GameJam Caribe',
        kicker: 'Competition',
        period: '2023',
        summary: 'Member of the team that won the Visual Art and Narrative categories.',
        points: [],
        tags: ['Narrative', 'Visual art'],
        tone: 'sea',
        featured: false,
        badge: 'Winning team',
        links: [],
      },
    ],
  },
  creative: {
    title: 'Creative work',
    lede: '3D modeling, video, photography and illustration. The full gallery lives on',
    ledeLink: 'Behance',
    items: [
      { id: '3d', title: '3D modeling & animation', ...creative['3d'] },
      { id: 'videos', title: 'Assorted videos', ...creative.videos },
      { id: 'youtube', title: 'YouTube videos', ...creative.youtube },
      { id: 'fotografia', title: 'Photography', ...creative.fotografia },
      { id: 'dibujos', title: 'Drawings', ...creative.dibujos },
    ],
  },
  skills: {
    title: 'Skills & education',
    lede: 'The tools I use to build products, games and visual pieces.',
    groups: [
      { id: 'movil', title: 'Mobile / web development', items: skills.mobile },
      { id: 'juegos', title: 'Game development', items: skills.games },
      { id: 'diseno', title: 'Design & multimedia', items: skills.design },
    ],
    educationTitle: 'Education',
    education: [
      {
        id: 'pregrado',
        title: 'Multimedia Engineering',
        school: 'Universidad Simón Bolívar',
        period: '2020 — 2025',
      },
      {
        id: 'minor',
        title: 'Minor in Creative Industries Management',
        school: 'Universidad Simón Bolívar',
        period: '2024',
      },
    ],
    languagesTitle: 'Languages',
    languages: ['Spanish (native)', 'English (intermediate)'],
  },
  contact: {
    title: ['Medellín, Rionegro', 'or remote.'],
    lede: 'Interested in mobile and web development roles. References available upon request.',
    phone: 'Phone',
    location: 'Location',
    locationValue: 'Rionegro / Valle de Aburrá, Antioquia, Colombia',
  },
  role: 'Multimedia Engineer',
  place: 'Rionegro, Colombia',
  cv: 'cv/CV-Esteban-Guevara-EN.pdf',
};

export const content: Record<Lang, Content> = { es, en };
