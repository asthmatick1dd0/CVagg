// TODO: перенести на бэкенд + добавить уровень владения
export const PREDEFINED_SKILLS = [
  // Frontend
  { id: 1, name: "JavaScript", category: "Frontend" },
  { id: 2, name: "TypeScript", category: "Frontend" },
  { id: 3, name: "React", category: "Frontend" },
  { id: 4, name: "Vue.js", category: "Frontend" },
  { id: 5, name: "Angular", category: "Frontend" },
  { id: 6, name: "HTML/CSS", category: "Frontend" },
  { id: 7, name: "Svelte", category: "Frontend" },
  { id: 8, name: "Next.js", category: "Frontend" },
  { id: 9, name: "Nuxt.js", category: "Frontend" },
  { id: 10, name: "Tailwind CSS", category: "Frontend" },
  { id: 11, name: "SASS/SCSS", category: "Frontend" },
  { id: 12, name: "Redux", category: "Frontend" },

  // Backend
  { id: 13, name: "Node.js", category: "Backend" },
  { id: 14, name: "Python", category: "Backend" },
  { id: 15, name: "Go", category: "Backend" },
  { id: 16, name: "Java", category: "Backend" },
  { id: 17, name: "C#", category: "Backend" },
  { id: 18, name: "Ruby", category: "Backend" },
  { id: 19, name: "PHP", category: "Backend" },
  { id: 20, name: "REST API", category: "Backend" },
  { id: 21, name: "GraphQL", category: "Backend" },
  { id: 22, name: "Express.js", category: "Backend" },
  { id: 23, name: "Django", category: "Backend" },
  { id: 24, name: "FastAPI", category: "Backend" },
  { id: 25, name: "Spring Boot", category: "Backend" },

  // Базы данных
  { id: 26, name: "PostgreSQL", category: "Базы данных" },
  { id: 27, name: "MongoDB", category: "Базы данных" },
  { id: 28, name: "Redis", category: "Базы данных" },
  { id: 29, name: "MySQL", category: "Базы данных" },
  { id: 30, name: "SQLite", category: "Базы данных" },
  { id: 31, name: "Elasticsearch", category: "Базы данных" },

  // DevOps
  { id: 32, name: "Docker", category: "DevOps" },
  { id: 33, name: "Kubernetes", category: "DevOps" },
  { id: 34, name: "Terraform", category: "DevOps" },
  { id: 35, name: "Ansible", category: "DevOps" },
  { id: 36, name: "Jenkins", category: "DevOps" },
  { id: 37, name: "GitHub Actions", category: "DevOps" },

  // Облачные технологии
  { id: 38, name: "AWS", category: "Облако" },
  { id: 39, name: "Google Cloud Platform", category: "Облако" },
  { id: 40, name: "Microsoft Azure", category: "Облако" },
  { id: 41, name: "AWS Lambda", category: "Облако" },
  { id: 42, name: "AWS S3", category: "Облако" },

  // Мобильная разработка
  { id: 43, name: "React Native", category: "Мобильная разработка" },
  { id: 44, name: "Flutter", category: "Мобильная разработка" },
  { id: 45, name: "Swift", category: "Мобильная разработка" },
  { id: 46, name: "Kotlin (Android)", category: "Мобильная разработка" },

  // Искусственный интеллект
  { id: 47, name: "TensorFlow", category: "ИИ/ML" },
  { id: 48, name: "PyTorch", category: "ИИ/ML" },
  { id: 49, name: "Scikit-learn", category: "ИИ/ML" },
  { id: 50, name: "Компьютерное зрение", category: "ИИ/ML" },
  { id: 51, name: "Обработка естественного языка", category: "ИИ/ML" },

  // Дата-инженерия
  { id: 52, name: "Apache Spark", category: "Дата-инженерия" },
  { id: 53, name: "Apache Kafka", category: "Дата-инженерия" },
  { id: 54, name: "ETL пайплайны", category: "Дата-инженерия" },
  { id: 55, name: "BigQuery", category: "Дата-инженерия" },

  // Безопасность
  { id: 56, name: "OAuth/OIDC", category: "Безопасность" },
  { id: 57, name: "JWT", category: "Безопасность" },
  { id: 58, name: "Шифрование", category: "Безопасность" },
  { id: 59, name: "SSL/TLS", category: "Безопасность" },

  // Тестирование
  { id: 60, name: "Jest", category: "Тестирование" },
  { id: 61, name: "Cypress", category: "Тестирование" },
  { id: 62, name: "Selenium", category: "Тестирование" },
  { id: 63, name: "Модульное тестирование", category: "Тестирование" },
  { id: 64, name: "E2E тестирование", category: "Тестирование" },

  // Инструменты
  { id: 65, name: "Git", category: "Инструменты" },
  { id: 66, name: "Linux", category: "Инструменты" },
  { id: 67, name: "VS Code", category: "Инструменты" },
  { id: 68, name: "Postman", category: "Инструменты" },
  { id: 69, name: "Jira", category: "Инструменты" },

  // Архитектура
  { id: 70, name: "Микросервисы", category: "Архитектура" },
  { id: 71, name: "Serverless", category: "Архитектура" },
  { id: 72, name: "Domain-Driven Design", category: "Архитектура" },
  { id: 73, name: "Проектирование систем", category: "Архитектура" },

  // Дизайн
  { id: 74, name: "UI дизайн", category: "Дизайн" },
  { id: 75, name: "UX дизайн", category: "Дизайн" },
  { id: 76, name: "Адаптивный дизайн", category: "Дизайн" },
  { id: 77, name: "Доступность (a11y)", category: "Дизайн" },

  // Софт-скиллы
  { id: 78, name: "Техническое лидерство", category: "Софт-скиллы" },
  { id: 79, name: "Agile/Scrum", category: "Софт-скиллы" },
  { id: 80, name: "Коммуникация", category: "Софт-скиллы" },
  { id: 81, name: "Решение проблем", category: "Софт-скиллы" },
  { id: 82, name: "Работа в команде", category: "Софт-скиллы" },

  // Сети
  { id: 83, name: "TCP/IP", category: "Сети" },
  { id: 84, name: "HTTP/HTTPS", category: "Сети" },
  { id: 85, name: "DNS", category: "Сети" },
  { id: 86, name: "Nginx", category: "Сети" },

  // Системное программирование
  { id: 87, name: "C", category: "Системное программирование" },
  { id: 88, name: "Операционные системы", category: "Системное программирование" },
  { id: 89, name: "Многопоточность", category: "Системное программирование" },
] as const;
export type SkillId = typeof PREDEFINED_SKILLS[number]['id'];

export const getSkillName = (skillId: number): string => {
  return PREDEFINED_SKILLS.find(s => s.id === skillId)?.name || `Skill #${skillId}`;
};

export const getSkillsByCategory = () => {
  const categories = [...new Set(PREDEFINED_SKILLS.map(s => s.category))];
  return categories.map(category => ({
    category,
    skills: PREDEFINED_SKILLS.filter(s => s.category === category)
  }));
};