import { Subject } from '../types';

export const ALL_13_SUBJECTS: Subject[] = [
  {
    slug: 'python',
    name: 'Python',
    menu_label: 'Python',
    icon: 'Code',
    accent_color: '#13a5bd',
    seo_intro: 'Complete Python handwritten notes from basics to OOP, regex, exceptions, and advanced scripting.',
    sort_order: 1,
    is_active: true
  },
  {
    slug: 'java',
    name: 'Java',
    menu_label: 'Java',
    icon: 'Coffee',
    accent_color: '#092f55',
    seo_intro: 'Core Java, Collections framework, Multithreading, Exception handling, and JVM memory layout diagrams.',
    sort_order: 2,
    is_active: true
  },
  {
    slug: 'c',
    name: 'C Programming',
    menu_label: 'C',
    icon: 'Terminal',
    accent_color: '#3C5D81',
    seo_intro: 'Low-level pointers, dynamic memory allocation (malloc/free), structures, and bitwise operations.',
    sort_order: 3,
    is_active: true
  },
  {
    slug: 'c-plus-plus',
    name: 'C++',
    menu_label: 'C++',
    icon: 'Cpu',
    accent_color: '#13a5bd',
    seo_intro: 'C++ STL, object-oriented concepts, references, templates, and interview coding shortcuts.',
    sort_order: 4,
    is_active: true
  },
  {
    slug: 'dsa-with-java',
    name: 'DSA with Java',
    menu_label: 'DSA with Java',
    parent: 'dsa',
    icon: 'Layers',
    accent_color: '#092f55',
    seo_intro: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming with dry-run trace diagrams in Java.',
    sort_order: 5,
    is_active: true
  },
  {
    slug: 'dsa-with-python',
    name: 'DSA with Python',
    menu_label: 'DSA with Python',
    parent: 'dsa',
    icon: 'GitBranch',
    accent_color: '#13a5bd',
    seo_intro: 'Core algorithmic patterns, recursion trees, memoization grids, and Big-O derivations in Python.',
    sort_order: 6,
    is_active: true
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    menu_label: 'JavaScript',
    icon: 'FileText',
    accent_color: '#f3ad19',
    seo_intro: 'Event loop, prototypes, closures, promises, async/await, DOM APIs, and modern ES6+ features.',
    sort_order: 7,
    is_active: true
  },
  {
    slug: 'html',
    name: 'HTML',
    menu_label: 'HTML',
    icon: 'Layout',
    accent_color: '#13a5bd',
    seo_intro: 'Semantic HTML5 tags, accessible web structures, forms, audio/video elements, and SEO meta setups.',
    sort_order: 8,
    is_active: true
  },
  {
    slug: 'css',
    name: 'CSS',
    menu_label: 'CSS',
    icon: 'Palette',
    accent_color: '#3C5D81',
    seo_intro: 'Flexbox, CSS Grid, media queries, keyframe animations, pseudo-classes, and responsive layouts.',
    sort_order: 9,
    is_active: true
  },
  {
    slug: 'sql',
    name: 'SQL',
    menu_label: 'SQL',
    icon: 'Database',
    accent_color: '#092f55',
    seo_intro: 'SELECT queries, INNER/OUTER JOINs, Subqueries, Aggregate functions, Views, and Indexing optimizations.',
    sort_order: 10,
    is_active: true
  },
  {
    slug: 'dbms',
    name: 'DBMS',
    menu_label: 'DBMS',
    icon: 'Server',
    accent_color: '#13a5bd',
    seo_intro: 'Relational model, ER Diagrams, Normalization (1NF to BCNF), ACID properties, and Concurrency control.',
    sort_order: 11,
    is_active: true
  },
  {
    slug: 'operating-system',
    name: 'Operating System',
    menu_label: 'Operating System',
    icon: 'HardDrive',
    accent_color: '#092f55',
    seo_intro: 'Process management, CPU scheduling, Semaphores, Deadlocks, Paging, Virtual Memory, and Disk algorithms.',
    sort_order: 12,
    is_active: true
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    menu_label: 'Data Science',
    icon: 'BarChart2',
    accent_color: '#13a5bd',
    seo_intro: 'NumPy multidimensional arrays, Pandas dataframes, Matplotlib plots, and Machine Learning pipelines.',
    sort_order: 13,
    is_active: true
  }
];
