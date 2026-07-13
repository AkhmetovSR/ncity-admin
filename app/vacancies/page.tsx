'use client';

import { useState, useEffect } from 'react';
import s from './page.module.css';

// ============================================
// ИНТЕРФЕЙСЫ (ТИПЫ ДАННЫХ)
// ============================================
interface Vacancy {
  id: number;
  title: string;
  salary: number | null;
  company_name: string;
  schedule: string;
  region: string;
  address: string | null;
  experience: string | null;
  education: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_website: string | null;
  description: string;
  requirements: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VacancyFormData {
  title: string;
  salary: string; 
  company_name: string;
  schedule: string;
  region: string;
  address: string;
  experience: string;
  education: string;
  contact_phone: string;
  contact_email: string;
  contact_website: string;
  description: string;
  requirements: string;
}

// ============================================
// ГЛАВНАЯ СТРАНИЦА АДМИНКИ
// ============================================
export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Vacancy | null>(null);

  // Загрузка списка вакансий
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vacancies?search=${search}&limit=100`);
      const data = await res.json();
      setVacancies(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  // Удаление вакансии
  const del = async (id: number) => {
    if (!confirm('Удалить эту вакансию?')) return;
    await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
    load();
  };

  // Сохранение / Изменение вакансии
  const save = async (data: VacancyFormData) => {
    const url = editing ? `/api/vacancies/${editing.id}` : '/api/vacancies';
    const method = editing ? 'PUT' : 'POST';

    // Форматируем строковую зарплату в число перед отправкой в БД
    const payload = {
      ...data,
      salary: data.salary ? parseInt(data.salary, 10) : null
    };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setShowModal(false);
    setEditing(null);
    load();
  };

  return (
    <div className={s.page}>
      {/* Шапка */}
      <div className={s.header}>
        <h1>Управление вакансиями</h1>
        <button
          className={s.btnAdd}
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          + Добавить вакансию
        </button>
      </div>

      {/* Поиск */}
      <input
        className={s.search}
        placeholder="Поиск по названию или организации..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Список вакансий */}
      {loading ? (
        <div className={s.loading}>Загрузка данных из БД...</div>
      ) : vacancies.length === 0 ? (
        <div className={s.empty}>Список вакансий пуст</div>
      ) : (
        <div className={s.grid}>
          {vacancies.map((v) => (
            <Card
              key={v.id}
              data={v}
              onEdit={() => {
                setEditing(v);
                setShowModal(true);
              }}
              onDelete={() => del(v.id)}
            />
          ))}
        </div>
      )}

      {/* Модальное окно создания/редактирования */}
      {showModal && (
        <Modal
          data={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

// ============================================
// КОМПОНЕНТ: КАРТОЧКА ВАКАНСИИ В СПИСКЕ
// ============================================
function Card({
  data,
  onEdit,
  onDelete,
}: {
  data: Vacancy;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={s.card}>
      <div className={s.cardActions}>
        <button className={s.btnEdit} onClick={onEdit} title="Редактировать">
          ✏️
        </button>
        <button className={s.btnDelete} onClick={onDelete} title="Удалить">
          🗑️
        </button>
      </div>

      <div className={s.cardTitle}>{data.title}</div>
      <div className={s.cardOrg}>{data.company_name}</div>
      <div className={s.cardSalary}>
        {data.salary ? `${data.salary.toLocaleString('ru-RU')} ₽` : 'Зарплата не указана'}
      </div>
      <div className={s.cardMeta}>
        <span>📍 {data.region}</span>
        <span>⏱️ {data.schedule}</span>
      </div>
      <div className={s.cardDesc}>{data.description}</div>
      <div className={s.cardDate}>
        Обновлено: {new Date(data.updated_at).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}

// ============================================
// КОМПОНЕНТ: МОДАЛЬНОЕ ОКНО С ФОРМОЙ
// ============================================
function Modal({
  data,
  onClose,
  onSave,
}: {
  data: Vacancy | null;
  onClose: () => void;
  onSave: (data: VacancyFormData) => void;
}) {
  const [form, setForm] = useState<VacancyFormData>({
    title: '',
    salary: '',
    company_name: '',
    schedule: '',
    region: '',
    address: '',
    experience: '',
    education: '',
    contact_phone: '',
    contact_email: '',
    contact_website: '',
    description: '',
    requirements: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || '',
        salary: data.salary ? String(data.salary) : '',
        company_name: data.company_name || '',
        schedule: data.schedule || '',
        region: data.region || '',
        address: data.address || '',
        experience: data.experience || '',
        education: data.education || '',
        contact_phone: data.contact_phone || '',
        contact_email: data.contact_email || '',
        contact_website: data.contact_website || '',
        description: data.description || '',
        requirements: data.requirements || '',
      });
    }
  }, [data]);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company_name || !form.region || !form.schedule || !form.description) {
      alert('Пожалуйста, заполните все обязательные поля со звездочкой (*)');
      return;
    }
    onSave(form);
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>{data ? 'Редактировать вакансию' : 'Добавить новую вакансию'}</h2>
          <button className={s.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '6px' }}>
          {/* Блок: Основная информация */}
          <input className={s.input} name="title" placeholder="Название вакансии *" value={form.title} onChange={change} required />
          <input className={s.input} name="company_name" placeholder="Название организации *" value={form.company_name} onChange={change} required />
          <input className={s.input} name="salary" placeholder="Зарплата (только число, например: 150000)" type="number" value={form.salary} onChange={change} />
          <input className={s.input} name="region" placeholder="Регион / Город *" value={form.region} onChange={change} required />
          <input className={s.input} name="address" placeholder="Точный адрес (улица, офис)" value={form.address} onChange={change} />
          
          {/* Блок: Условия и требования */}
          <input className={s.input} name="schedule" placeholder="График работы (например: Полный день, Удаленка) *" value={form.schedule} onChange={change} required />
          <input className={s.input} name="experience" placeholder="Опыт работы / стаж (например: от 1 до 3 лет)" value={form.experience} onChange={change} />
          <input className={s.input} name="education" placeholder="Образование (например: Высшее, Среднее)" value={form.education} onChange={change} />
          
          {/* Блок: Контакты */}
          <input className={s.input} name="contact_phone" placeholder="Контактный телефон" value={form.contact_phone} onChange={change} />
          <input className={s.input} name="contact_email" placeholder="Контактный Email" type="email" value={form.contact_email} onChange={change} />
          <input className={s.input} name="contact_website" placeholder="Ссылка на сайт компании" value={form.contact_website} onChange={change} />
          
          {/* Блок: Большие тексты */}
          <textarea className={s.textarea} name="description" placeholder="Подробное описание вакансии *" rows={4} value={form.description} onChange={change} required />
          <textarea className={s.textarea} name="requirements" placeholder="Требования к кандидату" rows={3} value={form.requirements} onChange={change} />

          <div className={s.modalFooter}>
            <button type="button" className={s.btnCancel} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={s.btnSave}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
