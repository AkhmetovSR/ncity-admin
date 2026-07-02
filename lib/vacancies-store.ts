// lib/vacancies-store.ts

// ============================================
// ТИПЫ
// ============================================
export interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryText?: string;
  organization: string;
  region: string;
  workSchedule: string;
  education?: string;
  experience?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VacancyFormData {
  title: string;
  description: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryText?: string;
  organization: string;
  region: string;
  workSchedule: string;
  education?: string;
  experience?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface VacancyResponse {
  data: Vacancy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// ХРАНИЛИЩЕ
// ============================================
let vacancies: Vacancy[] = [];
let nextId = 1;

const initialVacancies: Vacancy[] = [
  {
    id: 1,
    title: 'Senior Fullstack Developer',
    description: 'Разработка высоконагруженных веб-приложений в сфере финтех.',
    requirements: 'React, Node.js, TypeScript, PostgreSQL. Опыт от 5 лет.',
    salaryMin: 250000,
    salaryMax: 350000,
    salaryText: 'от 250 000 до 350 000 ₽',
    organization: 'ООО "ТехноПро"',
    region: 'Москва',
    workSchedule: 'Полный день',
    education: 'Высшее',
    experience: 'От 3 до 6 лет',
    phone: '+7 (495) 123-45-67',
    email: 'hr@technopro.ru',
    website: 'https://technopro.ru',
    isActive: true,
    viewsCount: 0,
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
  },
  {
    id: 2,
    title: 'Frontend Developer (React)',
    description: 'Создание интерфейсов для платформы электронной коммерции.',
    requirements: 'React, Next.js, TypeScript, Tailwind CSS. Опыт от 3 лет.',
    salaryMin: 180000,
    salaryMax: 250000,
    salaryText: 'от 180 000 до 250 000 ₽',
    organization: 'ООО "ЭкоМаркет"',
    region: 'Санкт-Петербург',
    workSchedule: 'Гибкий график',
    education: 'Высшее',
    experience: 'От 1 года до 3 лет',
    phone: '+7 (812) 987-65-43',
    email: 'job@ecomarket.ru',
    website: 'https://ecomarket.ru',
    isActive: true,
    viewsCount: 0,
    createdAt: new Date('2025-01-18T14:30:00'),
    updatedAt: new Date('2025-01-18T14:30:00'),
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    description: 'Настройка и поддержка CI/CD, мониторинг, управление инфраструктурой.',
    requirements: 'Docker, Kubernetes, Terraform. Опыт от 3 лет.',
    salaryMin: 200000,
    salaryMax: 300000,
    salaryText: 'от 200 000 до 300 000 ₽',
    organization: 'ООО "КлаудТех"',
    region: 'Москва',
    workSchedule: 'Удаленная работа',
    education: 'Высшее',
    experience: 'От 3 до 6 лет',
    phone: '+7 (495) 555-12-34',
    email: 'devops@cloudtech.ru',
    website: 'https://cloudtech.ru',
    isActive: true,
    viewsCount: 0,
    createdAt: new Date('2025-01-20T09:15:00'),
    updatedAt: new Date('2025-01-20T09:15:00'),
  },
];

if (vacancies.length === 0) {
  vacancies = initialVacancies;
  nextId = initialVacancies.length + 1;
}

// ============================================
// CRUD ОПЕРАЦИИ
// ============================================

export function getVacancies({
  page = 1,
  limit = 20,
  search = '',
  status = 'active',
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}): VacancyResponse {
  let filtered = [...vacancies];

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        v.organization.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
    );
  }

  if (status === 'active') {
    filtered = filtered.filter((v) => v.isActive === true);
  } else if (status === 'archived') {
    filtered = filtered.filter((v) => v.isActive === false);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getVacancyById(id: number): Vacancy | null {
  return vacancies.find((v) => v.id === id) || null;
}

export function createVacancy(data: VacancyFormData): Vacancy {
  const now = new Date();

  const newVacancy: Vacancy = {
    id: nextId++,
    title: data.title,
    description: data.description,
    requirements: data.requirements || '',
    salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
    salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
    salaryText: data.salaryText || '',
    organization: data.organization,
    region: data.region,
    workSchedule: data.workSchedule,
    education: data.education || '',
    experience: data.experience || '',
    phone: data.phone || '',
    email: data.email || '',
    website: data.website || '',
    isActive: true,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  vacancies.push(newVacancy);
  return newVacancy;
}

export function updateVacancy(id: number, data: Partial<VacancyFormData>): Vacancy | null {
  const index = vacancies.findIndex((v) => v.id === id);

  if (index === -1) {
    return null;
  }

  const updated: Vacancy = {
    ...vacancies[index],
    ...data,
    id: vacancies[index].id,
    createdAt: vacancies[index].createdAt,
    updatedAt: new Date(),
  };

  vacancies[index] = updated;
  return updated;
}

export function deleteVacancy(id: number): { id: number } | null {
  const index = vacancies.findIndex((v) => v.id === id);

  if (index === -1) {
    return null;
  }

  vacancies[index] = {
    ...vacancies[index],
    isActive: false,
    updatedAt: new Date(),
  };

  return { id };
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

export function getRegions(): string[] {
  const unique = new Set(vacancies.map((v) => v.region).filter(Boolean));
  return Array.from(unique).sort();
}

export function getOrganizations(): string[] {
  const unique = new Set(vacancies.map((v) => v.organization).filter(Boolean));
  return Array.from(unique).sort();
}

export function getReferenceData() {
  return {
    regions: getRegions().map((name) => ({ id: name, name })),
    organizations: getOrganizations().map((name) => ({ id: name, name })),
    workSchedules: [
      { id: 'Полный день', name: 'Полный день' },
      { id: 'Гибкий график', name: 'Гибкий график' },
      { id: 'Удаленная работа', name: 'Удаленная работа' },
      { id: 'Сменный график', name: 'Сменный график' },
      { id: 'Частичная занятость', name: 'Частичная занятость' },
    ],
    education: [
      { id: 'Не требуется', name: 'Не требуется' },
      { id: 'Среднее', name: 'Среднее' },
      { id: 'Высшее', name: 'Высшее' },
    ],
    experience: [
      { id: 'Без опыта', name: 'Без опыта' },
      { id: 'От 1 года до 3 лет', name: 'От 1 года до 3 лет' },
      { id: 'От 3 до 6 лет', name: 'От 3 до 6 лет' },
      { id: 'Более 6 лет', name: 'Более 6 лет' },
    ],
  };
}