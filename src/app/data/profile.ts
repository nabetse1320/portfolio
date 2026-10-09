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
  points: string[];
  tags: string[];
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
  href?: string;
  linkLabel?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface EducationItem {
  id: string;
  title: string;
  school: string;
  period: string;
}

export const navigation: NavItem[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'trabajo', label: 'Trabajo' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'formacion', label: 'Formación' },
  { id: 'contacto', label: 'Contacto' },
];

export const profile = {
  name: 'Esteban Josué Guevara Hernández',
  given: 'Esteban Josué',
  family: 'Guevara Hernández',
  role: 'Ingeniero Multimedia',
  focus: 'Desarrollo móvil y web',
  location: 'Rionegro / Valle de Aburrá, Antioquia',
  placeShort: 'Rionegro, Antioquia',
  interest: 'Medellín, Rionegro o remoto en Colombia',
  phone: '(+57) 304 5585293',
  phoneHref: 'tel:+573045585293',
  email: 'esteban.guevara1323@gmail.com',
  emailHref: 'mailto:esteban.guevara1323@gmail.com',
  linkedin: 'https://www.linkedin.com/in/esteban-guevara-428153285',
  linkedinLabel: 'esteban-guevara',
  github: 'https://github.com/nabetse1320',
  githubLabel: 'nabetse1320',
  portrait: 'portrait.jpg',
  lead: 'Aplicaciones Android con Kotlin y Jetpack Compose, backends con Laravel y productos multiplataforma con Flutter.',
  summary:
    'Ingeniero Multimedia con enfoque en desarrollo móvil y web. Experiencia práctica construyendo aplicaciones Android con Kotlin y Jetpack Compose, backends con Laravel/PHP y soluciones multiplataforma con Flutter. Interés en roles de desarrollo móvil/web en Medellín, Rionegro o remoto en Colombia. Combina sólida base técnica con criterio de diseño y experiencia en proyectos de videojuegos reconocidos a nivel nacional.',
  marquee: [
    'Kotlin',
    'Jetpack Compose',
    'Flutter',
    'Dart',
    'Laravel',
    'PHP',
    'SQL',
    'Unity',
    'C#',
    'Blender',
    'DaVinci Resolve',
  ],
  facts: [
    { label: 'Enfoque', value: 'Móvil y web' },
    { label: 'Formación', value: 'Ing. Multimedia' },
    { label: 'Base', value: 'Valle de Aburrá' },
    { label: 'Juegos', value: 'Convocatoria nacional' },
  ],
  roles: [
    {
      id: 'famii',
      period: '2025 — Actual',
      title: 'Desarrollador Móvil y Web',
      org: 'Famii',
      current: true,
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
      points: [
        'Vertical-i / Minciencias (2023–2024): programación y game design en «El Tesoro del Prejuicio»; equipo ganador de la convocatoria nacional y cofinanciado tras incubación.',
        'GameJam Caribe 2023: integrante del equipo ganador en las categorías Arte visual y Narrativa.',
        'Question Quest (2021–2022) y Liquid Maze (2024): programación y game design en Unity/C# como proyectos universitarios (Unisimón).',
      ],
      tags: ['Unity', 'C#', 'Game design'],
    },
  ] satisfies Role[],
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
      href: 'https://famii.co',
      linkLabel: 'famii.co',
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
    },
    {
      id: 'gamejam',
      name: 'GameJam Caribe',
      kicker: 'Competencia',
      period: '2023',
      summary:
        'Integrante del equipo ganador en las categorías Arte visual y Narrativa.',
      points: [],
      tags: ['Narrativa', 'Arte visual'],
      tone: 'sea',
      featured: false,
      badge: 'Equipo ganador',
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
    },
    {
      id: 'liquid-maze',
      name: 'Liquid Maze',
      kicker: 'Proyecto universitario · Unisimón',
      period: '2024',
      summary: 'Programación y game design en Unity y C#.',
      points: [],
      tags: ['Unity', 'C#'],
      tone: 'gold',
      featured: false,
    },
  ] satisfies Project[],
  skills: [
    {
      id: 'movil',
      title: 'Desarrollo móvil / web',
      items: [
        'Kotlin',
        'Jetpack Compose',
        'Flutter',
        'Dart',
        'Laravel',
        'PHP',
        'SQL',
        'HTML/CSS',
      ],
    },
    {
      id: 'juegos',
      title: 'Videojuegos',
      items: ['Unity', 'C#', 'Git'],
    },
    {
      id: 'diseno',
      title: 'Diseño y multimedia',
      items: ['Photoshop', 'Illustrator', 'DaVinci Resolve', 'Blender'],
    },
    {
      id: 'idiomas',
      title: 'Idiomas',
      items: ['Español (nativo)', 'Inglés (intermedio)'],
    },
  ] satisfies SkillGroup[],
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
  ] satisfies EducationItem[],
};
