'use client';

import { useState, useEffect } from 'react';
import s from './page.module.css';

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Загрузка
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

  // Удаление
  const del = async (id) => {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
    load();
  };

  // Сохранение
  const save = async (data) => {
    const url = editing ? `/api/vacancies/${editing.id}` : '/api/vacancies';
    const method = editing ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setShowModal(false);
    setEditing(null);
    load();
  };

  return (
    <div className={s.page}>
      {/* Шапка */}
      <div className={s.header}>
        <h1>Вакансии</h1>
        <button className={s.btnAdd} onClick={() => { setEditing(null); setShowModal(true); }}>
          + Добавить
        </button>
      </div>

      {/* Поиск */}
      <input
        className={s.search}
        placeholder="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Список */}
      {loading ? (
        <div className={s.loading}>Загрузка...</div>
      ) : vacancies.length === 0 ? (
        <div className={s.empty}>Нет вакансий</div>
      ) : (
        <div className={s.grid}>
          {vacancies.map(v => (
            <Card
              key={v.id}
              data={v}
              onEdit={() => { setEditing(v); setShowModal(true); }}
              onDelete={() => del(v.id)}
            />
          ))}
        </div>
      )}

      {/* Модалка */}
      {showModal && (
        <Modal
          data={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={save}
        />
      )}
    </div>
  );
}

// ============================================
// КАРТОЧКА
// ============================================
function Card({ data, onEdit, onDelete }) {
  return (
    <div className={s.card}>
      <div className={s.cardActions}>
        <button className={s.btnEdit} onClick={onEdit}>✏️</button>
        <button className={s.btnDelete} onClick={onDelete}>🗑️</button>
      </div>
      
      <div className={s.cardTitle}>{data.title}</div>
      <div className={s.cardOrg}>{data.organization}</div>
      <div className={s.cardSalary}>{data.salaryText || 'Зарплата не указана'}</div>
      <div className={s.cardMeta}>
        <span>{data.region}</span>
        <span>{data.workSchedule}</span>
      </div>
      <div className={s.cardDesc}>{data.description}</div>
      <div className={s.cardDate}>
        {new Date(data.updatedAt).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}

// ============================================
// МОДАЛКА
// ============================================
function Modal({ data, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryText: '',
    organization: '',
    region: '',
    workSchedule: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || '',
        description: data.description || '',
        requirements: data.requirements || '',
        salaryText: data.salaryText || '',
        organization: data.organization || '',
        region: data.region || '',
        workSchedule: data.workSchedule || '',
        phone: data.phone || '',
        email: data.email || '',
      });
    }
  }, [data]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.organization || !form.region) {
      alert('Заполните обязательные поля');
      return;
    }
    onSave(form);
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>{data ? 'Редактировать' : 'Добавить'}</h2>
          <button className={s.modalClose} onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit}>
          <input
            className={s.input}
            name="title"
            placeholder="Название *"
            value={form.title}
            onChange={change}
            required
          />
          <input
            className={s.input}
            name="organization"
            placeholder="Организация *"
            value={form.organization}
            onChange={change}
            required
          />
          <input
            className={s.input}
            name="region"
            placeholder="Регион *"
            value={form.region}
            onChange={change}
            required
          />
          <input
            className={s.input}
            name="salaryText"
            placeholder="Зарплата (например: от 100 000 ₽)"
            value={form.salaryText}
            onChange={change}
          />
          <input
            className={s.input}
            name="workSchedule"
            placeholder="График работы"
            value={form.workSchedule}
            onChange={change}
          />
          <input
            className={s.input}
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={change}
          />
          <input
            className={s.input}
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={change}
          />
          <textarea
            className={s.textarea}
            name="description"
            placeholder="Описание *"
            rows={4}
            value={form.description}
            onChange={change}
            required
          />
          <textarea
            className={s.textarea}
            name="requirements"
            placeholder="Требования"
            rows={3}
            value={form.requirements}
            onChange={change}
          />

          <div className={s.modalFooter}>
            <button type="button" className={s.btnCancel} onClick={onClose}>Отмена</button>
            <button type="submit" className={s.btnSave}>Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
}