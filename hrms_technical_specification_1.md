# Техническое задание на разработку HRMS с модулем управления задачами и Kanban-доской

## 1. Общая концепция системы

### 1.1 Назначение
Веб-приложение для комплексного управления персоналом, включающее функции кадрового учета, управления задачами и проектной деятельностью через интегрированную Kanban-систему.

### 1.2 Целевые роли пользователей

| Роль | Описание | Основные права |
|------|----------|----------------|
| Администратор | Полный контроль над системой | Управление пользователями, настройками, доступ ко всем модулям |
| HR-менеджер | Управление кадровыми процессами | Кадровый учет, онбординг, отпуска, оценка эффективности |
| Менеджер | Управление командой и проектами | Распределение задач, контроль выполнения, оценка сотрудников |
| Сотрудник | Исполнитель задач | Личный профиль, задачи, отпуска, документы |

### 1.3 Основные бизнес-процессы

| Процесс | Описание | Участвующие модули |
|---------|----------|-------------------|
| Найм | Создание вакансии, прием резюме, собеседование, прием на работу | Пользователи, Сотрудники, Документы |
| Онбординг | Вводная информация, назначение наставника, первые задачи | Сотрудники, Задачи, Документы |
| Управление сотрудниками | Карточка сотрудника, история изменений, переводы, увольнения | Сотрудники, Оргструктура |
| Управление задачами | Создание, назначение, контроль выполнения задач | Задачи, Kanban, Сотрудники |
| Оценка эффективности | KPI, performance review, обратная связь | Оценка, Сотрудники |
| Увольнение | Процесс увольнения, передача задач, архивация | Сотрудники, Задачи, Документы |

## 2. Функциональные модули

### 2.1 Пользователи и роли

**Назначение:** Управление учетными записями и правами доступа

**Основные сценарии:**
- Регистрация нового пользователя
- Настройка ролей и прав
- Смена пароля
- Блокировка/разблокировка учетной записи

**CRUD-операции:**
- Create: Создание пользователя с ролью
- Read: Просмотр списка пользователей, фильтрация по ролям
- Update: Редактирование профиля, смена роли
- Delete: Удаление/блокировка пользователя

**Связи:** Сотрудники (один-к-одному), Задачи (назначение), Оценка (автор)

### 2.2 Сотрудники

**Назначение:** Хранение и управление информацией о персонале

**Основные сценарии:**
- Создание карточки сотрудника при приеме на работу
- Редактирование личной информации
- Отслеживание истории изменений
- Перевод между отделами
- Увольнение сотрудника

**CRUD-операции:**
- Create: Добавление нового сотрудника
- Read: Просмотр карточки, поиск по ФИО, отделу
- Update: Редактирование данных, изменение статуса
- Delete: Архивация при увольнении

**Связи:** Пользователи (один-к-одному), Оргструктура (отдел, должность), Задачи (исполнитель), Оценка (объект оценки)

### 2.3 Организационная структура

**Назначение:** Моделирование иерархии компании

**Основные сценарии:**
- Создание отделов и подразделений
- Назначение руководителей отделов
- Установление подчиненности
- Визуализация оргструктуры

**CRUD-операции:**
- Create: Создание отдела, должности
- Read: Просмотр структуры, поиск по названию
- Update: Редактирование, изменение иерархии
- Delete: Удаление отдела (с переносом сотрудников)

**Связи:** Сотрудники (отдел, должность), Задачи (отдел-исполнитель)

### 2.4 Задачи и Kanban-доска

**Назначение:** Управление рабочими задачами и проектами

**Основные сценарии:**
- Создание задачи
- Назначение исполнителя
- Перемещение по статусам (Kanban)
- Установка дедлайнов и приоритетов
- Отслеживание прогресса

**CRUD-операции:**
- Create: Создание задачи с параметрами
- Read: Просмотр списка, фильтрация, поиск
- Update: Изменение статуса, исполнителя, параметров
- Delete: Удаление/архивация задачи

**Связи:** Сотрудники (исполнитель, автор), Оргструктура (отдел), Доски (привязка)

### 2.5 Отпуска и отсутствие

**Назначение:** Управление временем отсутствия сотрудников

**Основные сценарии:**
- Подача заявки на отпуск
- Согласование отпуска менеджером
- Отслеживание остатка дней
- Календарь отсутствия

**CRUD-операции:**
- Create: Создание заявки на отпуск
- Read: Просмотр календаря, история отпусков
- Update: Изменение статуса заявки
- Delete: Отмена заявки

**Связи:** Сотрудники (владелец), Задачи (блокировка при отсутствии)

### 2.6 Оценка эффективности

**Назначение:** Система оценки производительности сотрудников

**Основные сценарии:**
- Установка KPI
- Проведение регулярных оценок
- Сбор обратной связи
- Формирование отчетов

**CRUD-операции:**
- Create: Создание оценки, установка метрик
- Read: Просмотр истории оценок, сравнение
- Update: Редактирование оценки
- Delete: Удаление оценки

**Связи:** Сотрудники (объект оценки), Пользователи (автор оценки)

### 2.7 Документы и заметки

**Назначение:** Хранение и управление документацией

**Основные сценарии:**
- Загрузка документов
- Создание заметок
- Категоризация и тегирование
- Поиск по содержимому

**CRUD-операции:**
- Create: Загрузка файла, создание заметки
- Read: Просмотр, поиск, фильтрация
- Update: Редактирование, переименование
- Delete: Удаление документа/заметки

**Связи:** Сотрудники (привязка к карточке), Задачи (прикрепленные файлы)

### 2.8 Настройки системы

**Назначение:** Конфигурация параметров приложения

**Основные сценарии:**
- Настройка рабочих дней
- Управление шаблонами
- Конфигурация уведомлений
- Языковые настройки

**CRUD-операции:**
- Create: Создание шаблонов
- Read: Просмотр текущих настроек
- Update: Изменение параметров
- Delete: Удаление шаблонов

## 3. Kanban-доска

### 3.1 Архитектура доски

```typescript
interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string; // ID пользователя-владельца
  sharedWith: string[]; // ID пользователей с доступом
}

interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  color?: string;
  limit?: number; // ограничение количества задач
  tasks: string[]; // IDs задач в колонке
}

interface TaskCard {
  id: string;
  title: string;
  description?: string;
  status: string; // ID колонки
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  assigneeId?: string; // ID сотрудника-исполнителя
  departmentId?: string; // ID отдела
  projectId?: string; // ID проекта (будущее развитие)
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  history: TaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Функциональные требования

**Поддержка нескольких досок:**
- Создание персональных и командных досок
- Переключение между досками
- Экспорт/импорт досок

**Настраиваемые колонки:**
- Добавление/удаление колонок
- Изменение порядка колонок
- Настройка цветов и лимитов
- Предустановленные шаблоны (To Do, In Progress, Done)

**Drag & Drop:**
- Перемещение задач между колонками
- Изменение порядка задач в колонке
- Визуальная индикация при перетаскивании
- Отмена действий (undo/redo)

**Привязки:**
- К сотрудникам (один или несколько)
- К отделам (для командных задач)
- К проектам (будущее развитие)

**История изменений:**
- Фиксация всех изменений статуса
- Логирование назначений и дедлайнов
- Возможность просмотра полной истории задачи

## 4. Модель данных

### 4.1 Основные сущности

```typescript
// Пользователь
interface User {
  id: string;
  email: string;
  password: string; // хэш
  role: 'admin' | 'hr' | 'manager' | 'employee';
  employeeId?: string; // связь с сотрудником
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Сотрудник
interface Employee {
  id: string;
  userId?: string; // связь с пользователем
  firstName: string;
  lastName: string;
  middleName?: string;
  positionId: string; // ID должности
  departmentId: string; // ID отдела
  managerId?: string; // ID руководителя
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: Date;
  terminationDate?: Date;
  phone?: string;
  email: string;
  photo?: string; // URL или base64
  bio?: string;
  skills: string[];
  history: EmployeeHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Отдел
interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // для иерархии
  headId?: string; // ID руководителя отдела
  employees: string[]; // IDs сотрудников
  createdAt: Date;
  updatedAt: Date;
}

// Должность
interface Position {
  id: string;
  name: string;
  description?: string;
  level: number; // уровень в иерархии
  createdAt: Date;
  updatedAt: Date;
}

// Отпуск
interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'unpaid' | 'maternity';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  approverId?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Оценка эффективности
interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  periodStart: Date;
  periodEnd: Date;
  rating: number; // 1-5
  comments: string;
  goals: PerformanceGoal[];
  kpis: KPI[];
  status: 'draft' | 'submitted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
}

interface KPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
}

// Документ
interface Document {
  id: string;
  name: string;
  type: string; // mime type
  size: number; // bytes
  content: string; // base64 или URL
  employeeId?: string; // привязка к сотруднику
  taskId?: string; // привязка к задаче
  category: 'personal' | 'contract' | 'certificate' | 'other';
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
}

// Заметка
interface Note {
  id: string;
  title: string;
  content: string;
  employeeId?: string;
  taskId?: string;
  authorId: string;
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// История изменений сотрудника
interface EmployeeHistory {
  id: string;
  employeeId: string;
  type: 'hire' | 'transfer' | 'promotion' | 'termination' | 'update';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}

// История задачи
interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'moved' | 'assigned' | 'completed';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}

// Комментарий
interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  parentId?: string; // для вложенных комментариев
  attachments: Attachment[];
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface SystemSettings {
  id: string;
  workingDays: number[]; // 0-6 (воскресенье-суббота)
  vacationDaysPerYear: number;
  sickLeaveDaysPerYear: number;
  notificationSettings: NotificationSettings;
  language: string;
  timezone: string;
}

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  taskAssigned: boolean;
  taskDeadline: boolean;
  leaveRequest: boolean;
  performanceReview: boolean;
}
```

### 4.2 Связи между сущностями

```typescript
// Пример связей для задачи
interface TaskRelations {
  assignee: Employee | null; // сотрудник-исполнитель
  department: Department | null; // отдел
  board: KanbanBoard; // доска
  column: KanbanColumn; // колонка
  comments: Comment[]; // комментарии
  attachments: Attachment[]; // вложения
  history: TaskHistory[]; // история
}
```

### 4.3 Примеры данных

```typescript
// Пример сотрудника
const sampleEmployee: Employee = {
  id: 'emp-001',
  firstName: 'Иван',
  lastName: 'Иванов',
  positionId: 'pos-001',
  departmentId: 'dept-001',
  status: 'active',
  hireDate: new Date('2024-01-15'),
  email: 'ivanov@example.com',
  skills: ['typescript', 'vue', 'backend'],
  history: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Пример задачи
const sampleTask: TaskCard = {
  id: 'task-001',
  title: 'Разработать модуль авторизации',
  description: 'Необходимо реализовать систему аутентификации...',
  status: 'col-001',
  priority: 'high',
  deadline: new Date('2024-03-01'),
  assigneeId: 'emp-001',
  tags: ['backend', 'security'],
  attachments: [],
  comments: [],
  history: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 4.4 Версионирование схемы хранения

```typescript
interface StorageSchema {
  version: string; // '1.0.0'
  entities: {
    users: User[];
    employees: Employee[];
    departments: Department[];
    positions: Position[];
    tasks: TaskCard[];
    boards: KanbanBoard[];
    leaveRequests: LeaveRequest[];
    performanceReviews: PerformanceReview[];
    documents: Document[];
    notes: Note[];
    settings: SystemSettings;
  };
  metadata: {
    lastSync?: Date;
    lastBackup?: Date;
    checksum?: string;
  };
}
```

## 5. Хранилище данных

### 5.1 Распределение данных

| Данные | Хранилище | Причина |
|--------|-----------|---------|
| Текущий пользователь, токен | sessionStorage | Очищается при закрытии вкладки |
| Настройки UI, фильтры | localStorage | Персистентные настройки |
| Все бизнес-данные | indexedDB | Большой объем, структурированные данные |
| Кэш запросов | localStorage | Быстрый доступ к часто используемым данным |

### 5.2 Абстракция storage-слоя

```typescript
// Базовый интерфейс хранилища
interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<Map<string, T>>;
}

// Реализация для indexedDB
class IndexedDBStorage<T> implements StorageAdapter<T> {
  private db: IDBDatabase | null = null;
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
    this.initDB();
  }

  private async initDB(): Promise<void> {
    // Инициализация базы данных
  }

  async get(key: string): Promise<T | null> {
    // Реализация получения данных
  }

  async set(key: string, value: T): Promise<void> {
    // Реализация сохранения данных
  }

  // ... остальные методы
}

// Реализация для localStorage
class LocalStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ... остальные методы
}

// Фабрика хранилищ
class StorageFactory {
  static create<T>(type: 'indexeddb' | 'localstorage', storeName: string): StorageAdapter<T> {
    switch (type) {
      case 'indexeddb':
        return new IndexedDBStorage<T>(storeName);
      case 'localstorage':
        return new LocalStorageAdapter<T>();
      default:
        throw new Error('Unknown storage type');
    }
  }
}

// Сервис данных с возможностью замены
class DataService {
  private storage: StorageAdapter<any>;
  private cache: Map<string, any> = new Map();

  constructor(storageType: 'indexeddb' | 'localstorage' = 'indexeddb') {
    this.storage = StorageFactory.create(storageType, 'hrms-data');
  }

  // Методы CRUD с кэшированием
  async get<T>(key: string): Promise<T | null> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = await this.storage.get(key);
    if (data) {
      this.cache.set(key, data);
    }
    return data;
  }

  async save<T>(key: string, data: T): Promise<void> {
    await this.storage.set(key, data);
    this.cache.set(key, data);
  }

  // ... остальные методы
}
```

### 5.3 Подготовка к миграции на API

```typescript
// Интерфейс для любого источника данных
interface DataSource<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  search(query: any): Promise<T[]>;
}

// Локальная реализация
class LocalDataSource<T> implements DataSource<T> {
  private storage: DataService;

  constructor(entityName: string) {
    this.storage = new DataService();
  }

  async getAll(): Promise<T[]> {
    // Получение всех записей из локального хранилища
  }

  // ... реализация остальных методов
}

// Будущая API реализация
class ApiDataSource<T> implements DataSource<T> {
  private baseUrl: string;
  private entityName: string;

  constructor(baseUrl: string, entityName: string) {
    this.baseUrl = baseUrl;
    this.entityName = entityName;
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}/${this.entityName}`);
    return response.json();
  }

  // ... реализация остальных методов
}

// Фабрика источников данных
class DataSourceFactory {
  static create<T>(type: 'local' | 'api', config: any): DataSource<T> {
    switch (type) {
      case 'local':
        return new LocalDataSource<T>(config.entityName);
      case 'api':
        return new ApiDataSource<T>(config.baseUrl, config.entityName);
      default:
        throw new Error('Unknown data source type');
    }
  }
}
```

## 6. Архитектура фронтенда

### 6.1 Структура каталогов

```
src/
├── assets/                 # Статические ресурсы
│   ├── images/
│   ├── styles/
│   └── icons/
├── components/             # Переиспользуемые компоненты
│   ├── common/            # Базовые компоненты
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   └── Table.vue
│   ├── layout/            # Компоненты макета
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   └── modules/           # Компоненты модулей
│       ├── kanban/
│       ├── employees/
│       └── tasks/
├── composables/           # Vue Composition API composables
│   ├── useAuth.ts
│   ├── useStorage.ts
│   ├── useDragDrop.ts
│   └── useNotifications.ts
├── domain/                # Бизнес-логика и модели
│   ├── models/            # TypeScript интерфейсы
│   ├── services/          # Бизнес-сервисы
│   │   ├── employee.service.ts
│   │   ├── task.service.ts
│   │   └── kanban.service.ts
│   └── validators/        # Валидаторы
│       └── employee.validator.ts
├── router/                # Маршрутизация
│   ├── index.ts
│   ├── routes.ts
│   └── guards.ts
├── stores/                # Pinia stores
│   ├── auth.store.ts
│   ├── employee.store.ts
│   ├── task.store.ts
│   ├── kanban.store.ts
│   └── ui.store.ts
├── views/                 # Страницы приложения
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   ├── employees/
│   │   ├── EmployeeListView.vue
│   │   ├── EmployeeDetailView.vue
│   │   └── EmployeeFormView.vue
│   ├── tasks/
│   │   ├── TaskBoardView.vue
│   │   ├── TaskListView.vue
│   │   └── TaskFormView.vue
│   ├── departments/
│   ├── leaves/
│   ├── performance/
│   └── settings/
├── utils/                 # Вспомогательные утилиты
│   ├── date.utils.ts
│   ├── string.utils.ts
│   └── validation.utils.ts
├── App.vue
└── main.ts
```

### 6.2 Pinia stores

```typescript
// stores/employee.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Employee, Department, Position } from '@/domain/models';
import { EmployeeService } from '@/domain/services/employee.service';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([]);
  const departments = ref<Department[]>([]);
  const positions = ref<Position[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeEmployees = computed(() => 
    employees.value.filter(e => e.status === 'active')
  );

  const getEmployeeById = (id: string) => 
    employees.value.find(e => e.id === id);

  const loadEmployees = async () => {
    try {
      loading.value = true;
      employees.value = await EmployeeService.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const createEmployee = async (employee: Partial<Employee>) => {
    try {
      const newEmployee = await EmployeeService.create(employee);
      employees.value.push(newEmployee);
      return newEmployee;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await EmployeeService.update(id, updates);
      const index = employees.value.findIndex(e => e.id === id);
      if (index !== -1) {
        employees.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await EmployeeService.delete(id);
      employees.value = employees.value.filter(e => e.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  return {
    employees,
    departments,
    positions,
    loading,
    error,
    activeEmployees,
    getEmployeeById,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
});

// stores/task.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TaskCard, KanbanBoard, KanbanColumn } from '@/domain/models';
import { TaskService } from '@/domain/services/task.service';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<TaskCard[]>([]);
  const boards = ref<KanbanBoard[]>([]);
  const currentBoardId = ref<string | null>(null);
  const loading = ref(false);

  const currentBoard = computed(() => 
    currentBoardId.value ? boards.value.find(b => b.id === currentBoardId.value) : null
  );

  const tasksByBoard = computed(() => (boardId: string) => 
    tasks.value.filter(t => t.boardId === boardId)
  );

  const tasksByColumn = computed(() => (columnId: string) => 
    tasks.value.filter(t => t.status === columnId).sort((a, b) => 
      a.priority.localeCompare(b.priority)
    )
  );

  const loadBoards = async () => {
    loading.value = true;
    try {
      boards.value = await TaskService.getBoards();
    } finally {
      loading.value = false;
    }
  };

  const loadTasks = async (boardId: string) => {
    loading.value = true;
    try {
      tasks.value = await TaskService.getTasksByBoard(boardId);
    } finally {
      loading.value = false;
    }
  };

  const moveTask = async (taskId: string, newColumnId: string, newIndex: number) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = newColumnId;
      await TaskService.update(taskId, { status: newColumnId });
      // Обновление порядка в колонке
    }
  };

  return {
    tasks,
    boards,
    currentBoardId,
    loading,
    currentBoard,
    tasksByBoard,
    tasksByColumn,
    loadBoards,
    loadTasks,
    moveTask
  };
});

// stores/auth.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/domain/models';
import { AuthService } from '@/domain/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      currentUser.value = await AuthService.login(email, password);
      isAuthenticated.value = true;
      // Сохранение в sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser.value));
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    sessionStorage.removeItem('currentUser');
  };

  const initAuth = () => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      currentUser.value = JSON.parse(stored);
      isAuthenticated.value = true;
    }
  };

  return {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    initAuth
  };
});
```

### 6.3 Router

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('@/views/employees/EmployeeListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('@/views/employees/EmployeeDetailView.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/tasks/TaskBoardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('@/views/departments/DepartmentListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr'] }
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('@/views/leaves/LeaveListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('@/views/performance/PerformanceListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

// router/guards.ts
import { type NavigationGuard } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export const authGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else if (to.meta.roles && authStore.currentUser) {
    if (to.meta.roles.includes(authStore.currentUser.role)) {
      next();
    } else {
      next({ name: 'Dashboard' });
    }
  } else {
    next();
  }
};
```

### 6.4 Reusable components

```vue
<!-- components/common/Table.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="column in columns" :key="column.key" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="row in data" :key="row.id" class="hover:bg-gray-50">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            <slot :name="column.key" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="!data.length" class="text-center py-8 text-gray-500">
      {{ emptyMessage || 'Нет данных' }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
}

interface Props {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

defineProps<Props>();
</script>

<!-- components/modules/kanban/KanbanBoard.vue -->
<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn 
      v-for="column in board.columns" 
      :key="column.id"
      :column="column"
      :tasks="tasksByColumn(column.id)"
      @task-moved="handleTaskMove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KanbanBoard, KanbanColumn, TaskCard } from '@/domain/models';
import KanbanColumn from './KanbanColumn.vue';

interface Props {
  board: KanbanBoard;
  tasks: TaskCard[];
}

const props = defineProps<Props>();

const tasksByColumn = computed(() => (columnId: string) => {
  return props.tasks
    .filter(task => task.status === columnId)
    .sort((a, b) => a.priority.localeCompare(b.priority));
});

const emit = defineEmits<{
  taskMoved: [taskId: string, newColumnId: string, newIndex: number];
}>();

const handleTaskMove = (taskId: string, newColumnId: string, newIndex: number) => {
  emit('taskMoved', taskId, newColumnId, newIndex);
};
</script>
```

## 7. UX/UI требования

### 7.1 Основные экраны

| Экран | Описание | Компоненты |
|-------|----------|------------|
| Логин | Аутентификация пользователя | LoginForm, ForgotPasswordLink |
| Дашборд | Главная страница с виджетами | StatsCards, RecentTasks, TeamOverview |
| Список сотрудников | Таблица сотрудников с фильтрами | EmployeeTable, EmployeeFilters, EmployeeActions |
| Карточка сотрудника | Детальная информация о сотруднике | EmployeeProfile, EmployeeHistory, RelatedTasks |
| Kanban доска | Визуальное управление задачами | KanbanBoard, KanbanColumn, TaskCard |
| Список задач | Табличное представление задач | TaskTable, TaskFilters, BulkActions |
| Отпуска | Календарь и заявки на отпуск | LeaveCalendar, LeaveRequests, LeaveForm |
| Оценка | Формы оценки и отчеты | ReviewForm, KPIChart, GoalsList |
| Настройки | Конфигурация системы | SettingsForm, Templates, Integrations |

### 7.2 Навигация

```typescript
// Основная навигация (боковое меню)
const mainNavigation = [
  { name: 'Dashboard', icon: 'home', path: '/' },
  { name: 'Сотрудники', icon: 'users', path: '/employees' },
  { name: 'Задачи', icon: 'tasks', path: '/tasks', badge: unreadTasksCount },
  { name: 'Отделы', icon: 'building', path: '/departments' },
  { name: 'Отпуска', icon: 'calendar', path: '/leaves' },
  { name: 'Оценка', icon: 'chart', path: '/performance' },
  { name: 'Настройки', icon: 'settings', path: '/settings' }
];

// Контекстная навигация (хлебные крошки)
const breadcrumbs = [
  { name: 'Сотрудники', path: '/employees' },
  { name: 'Иван Иванов', path: '/employees/emp-001' },
  { name: 'Карточка сотрудника' }
];
```

### 7.3 Состояния компонентов

```vue
<!-- Пример обработки состояний -->
<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!data.length" class="text-center py-12">
      <div class="mx-auto flex items-center justify-center h-12
# Техническое задание на разработку HRMS с модулем управления задачами и Kanban-доской

## 1. Общая концепция системы

### 1.1 Назначение
Веб-приложение для комплексного управления персоналом, включающее функции кадрового учета, управления задачами и проектной деятельностью через интегрированную Kanban-систему.

### 1.2 Целевые роли пользователей

| Роль | Описание | Основные права |
|------|----------|----------------|
| Администратор | Полный контроль над системой | Управление пользователями, настройками, доступ ко всем модулям |
| HR-менеджер | Управление кадровыми процессами | Кадровый учет, онбординг, отпуска, оценка эффективности |
| Менеджер | Управление командой и проектами | Распределение задач, контроль выполнения, оценка сотрудников |
| Сотрудник | Исполнитель задач | Личный профиль, задачи, отпуска, документы |

### 1.3 Основные бизнес-процессы

| Процесс | Описание | Участвующие модули |
|---------|----------|-------------------|
| Найм | Создание вакансии, прием резюме, собеседование, прием на работу | Пользователи, Сотрудники, Документы |
| Онбординг | Вводная информация, назначение наставника, первые задачи | Сотрудники, Задачи, Документы |
| Управление сотрудниками | Карточка сотрудника, история изменений, переводы, увольнения | Сотрудники, Оргструктура |
| Управление задачами | Создание, назначение, контроль выполнения задач | Задачи, Kanban, Сотрудники |
| Оценка эффективности | KPI, performance review, обратная связь | Оценка, Сотрудники |
| Увольнение | Процесс увольнения, передача задач, архивация | Сотрудники, Задачи, Документы |

## 2. Функциональные модули

### 2.1 Пользователи и роли

**Назначение:** Управление учетными записями и правами доступа

**Основные сценарии:**
- Регистрация нового пользователя
- Настройка ролей и прав
- Смена пароля
- Блокировка/разблокировка учетной записи

**CRUD-операции:**
- Create: Создание пользователя с ролью
- Read: Просмотр списка пользователей, фильтрация по ролям
- Update: Редактирование профиля, смена роли
- Delete: Удаление/блокировка пользователя

**Связи:** Сотрудники (один-к-одному), Задачи (назначение), Оценка (автор)

### 2.2 Сотрудники

**Назначение:** Хранение и управление информацией о персонале

**Основные сценарии:**
- Создание карточки сотрудника при приеме на работу
- Редактирование личной информации
- Отслеживание истории изменений
- Перевод между отделами
- Увольнение сотрудника

**CRUD-операции:**
- Create: Добавление нового сотрудника
- Read: Просмотр карточки, поиск по ФИО, отделу
- Update: Редактирование данных, изменение статуса
- Delete: Архивация при увольнении

**Связи:** Пользователи (один-к-одному), Оргструктура (отдел, должность), Задачи (исполнитель), Оценка (объект оценки)

### 2.3 Организационная структура

**Назначение:** Моделирование иерархии компании

**Основные сценарии:**
- Создание отделов и подразделений
- Назначение руководителей отделов
- Установление подчиненности
- Визуализация оргструктуры

**CRUD-операции:**
- Create: Создание отдела, должности
- Read: Просмотр структуры, поиск по названию
- Update: Редактирование, изменение иерархии
- Delete: Удаление отдела (с переносом сотрудников)

**Связи:** Сотрудники (отдел, должность), Задачи (отдел-исполнитель)

### 2.4 Задачи и Kanban-доска

**Назначение:** Управление рабочими задачами и проектами

**Основные сценарии:**
- Создание задачи
- Назначение исполнителя
- Перемещение по статусам (Kanban)
- Установка дедлайнов и приоритетов
- Отслеживание прогресса

**CRUD-операции:**
- Create: Создание задачи с параметрами
- Read: Просмотр списка, фильтрация, поиск
- Update: Изменение статуса, исполнителя, параметров
- Delete: Удаление/архивация задачи

**Связи:** Сотрудники (исполнитель, автор), Оргструктура (отдел), Доски (привязка)

### 2.5 Отпуска и отсутствие

**Назначение:** Управление временем отсутствия сотрудников

**Основные сценарии:**
- Подача заявки на отпуск
- Согласование отпуска менеджером
- Отслеживание остатка дней
- Календарь отсутствия

**CRUD-операции:**
- Create: Создание заявки на отпуск
- Read: Просмотр календаря, история отпусков
- Update: Изменение статуса заявки
- Delete: Отмена заявки

**Связи:** Сотрудники (владелец), Задачи (блокировка при отсутствии)

### 2.6 Оценка эффективности

**Назначение:** Система оценки производительности сотрудников

**Основные сценарии:**
- Установка KPI
- Проведение регулярных оценок
- Сбор обратной связи
- Формирование отчетов

**CRUD-операции:**
- Create: Создание оценки, установка метрик
- Read: Просмотр истории оценок, сравнение
- Update: Редактирование оценки
- Delete: Удаление оценки

**Связи:** Сотрудники (объект оценки), Пользователи (автор оценки)

### 2.7 Документы и заметки

**Назначение:** Хранение и управление документацией

**Основные сценарии:**
- Загрузка документов
- Создание заметок
- Категоризация и тегирование
- Поиск по содержимому

**CRUD-операции:**
- Create: Загрузка файла, создание заметки
- Read: Просмотр, поиск, фильтрация
- Update: Редактирование, переименование
- Delete: Удаление документа/заметки

**Связи:** Сотрудники (привязка к карточке), Задачи (прикрепленные файлы)

### 2.8 Настройки системы

**Назначение:** Конфигурация параметров приложения

**Основные сценарии:**
- Настройка рабочих дней
- Управление шаблонами
- Конфигурация уведомлений
- Языковые настройки

**CRUD-операции:**
- Create: Создание шаблонов
- Read: Просмотр текущих настроек
- Update: Изменение параметров
- Delete: Удаление шаблонов

## 3. Kanban-доска

### 3.1 Архитектура доски

```typescript
interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string; // ID пользователя-владельца
  sharedWith: string[]; // ID пользователей с доступом
}

interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  color?: string;
  limit?: number; // ограничение количества задач
  tasks: string[]; // IDs задач в колонке
}

interface TaskCard {
  id: string;
  title: string;
  description?: string;
  status: string; // ID колонки
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  assigneeId?: string; // ID сотрудника-исполнителя
  departmentId?: string; // ID отдела
  projectId?: string; // ID проекта (будущее развитие)
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  history: TaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Функциональные требования

**Поддержка нескольких досок:**
- Создание персональных и командных досок
- Переключение между досками
- Экспорт/импорт досок

**Настраиваемые колонки:**
- Добавление/удаление колонок
- Изменение порядка колонок
- Настройка цветов и лимитов
- Предустановленные шаблоны (To Do, In Progress, Done)

**Drag & Drop:**
- Перемещение задач между колонками
- Изменение порядка задач в колонке
- Визуальная индикация при перетаскивании
- Отмена действий (undo/redo)

**Привязки:**
- К сотрудникам (один или несколько)
- К отделам (для командных задач)
- К проектам (будущее развитие)

**История изменений:**
- Фиксация всех изменений статуса
- Логирование назначений и дедлайнов
- Возможность просмотра полной истории задачи

## 4. Модель данных

### 4.1 Основные сущности

```typescript
// Пользователь
interface User {
  id: string;
  email: string;
  password: string; // хэш
  role: 'admin' | 'hr' | 'manager' | 'employee';
  employeeId?: string; // связь с сотрудником
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Сотрудник
interface Employee {
  id: string;
  userId?: string; // связь с пользователем
  firstName: string;
  lastName: string;
  middleName?: string;
  positionId: string; // ID должности
  departmentId: string; // ID отдела
  managerId?: string; // ID руководителя
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: Date;
  terminationDate?: Date;
  phone?: string;
  email: string;
  photo?: string; // URL или base64
  bio?: string;
  skills: string[];
  history: EmployeeHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Отдел
interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // для иерархии
  headId?: string; // ID руководителя отдела
  employees: string[]; // IDs сотрудников
  createdAt: Date;
  updatedAt: Date;
}

// Должность
interface Position {
  id: string;
  name: string;
  description?: string;
  level: number; // уровень в иерархии
  createdAt: Date;
  updatedAt: Date;
}

// Отпуск
interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'unpaid' | 'maternity';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  approverId?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Оценка эффективности
interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  periodStart: Date;
  periodEnd: Date;
  rating: number; // 1-5
  comments: string;
  goals: PerformanceGoal[];
  kpis: KPI[];
  status: 'draft' | 'submitted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
}

interface KPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
}

// Документ
interface Document {
  id: string;
  name: string;
  type: string; // mime type
  size: number; // bytes
  content: string; // base64 или URL
  employeeId?: string; // привязка к сотруднику
  taskId?: string; // привязка к задаче
  category: 'personal' | 'contract' | 'certificate' | 'other';
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
}

// Заметка
interface Note {
  id: string;
  title: string;
  content: string;
  employeeId?: string;
  taskId?: string;
  authorId: string;
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// История изменений сотрудника
interface EmployeeHistory {
  id: string;
  employeeId: string;
  type: 'hire' | 'transfer' | 'promotion' | 'termination' | 'update';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}

// История задачи
interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'moved' | 'assigned' | 'completed';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}

// Комментарий
interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  parentId?: string; // для вложенных комментариев
  attachments: Attachment[];
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface SystemSettings {
  id: string;
  workingDays: number[]; // 0-6 (воскресенье-суббота)
  vacationDaysPerYear: number;
  sickLeaveDaysPerYear: number;
  notificationSettings: NotificationSettings;
  language: string;
  timezone: string;
}

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  taskAssigned: boolean;
  taskDeadline: boolean;
  leaveRequest: boolean;
  performanceReview: boolean;
}
```

### 4.2 Связи между сущностями

```typescript
// Пример связей для задачи
interface TaskRelations {
  assignee: Employee | null; // сотрудник-исполнитель
  department: Department | null; // отдел
  board: KanbanBoard; // доска
  column: KanbanColumn; // колонка
  comments: Comment[]; // комментарии
  attachments: Attachment[]; // вложения
  history: TaskHistory[]; // история
}
```

### 4.3 Примеры данных

```typescript
// Пример сотрудника
const sampleEmployee: Employee = {
  id: 'emp-001',
  firstName: 'Иван',
  lastName: 'Иванов',
  positionId: 'pos-001',
  departmentId: 'dept-001',
  status: 'active',
  hireDate: new Date('2024-01-15'),
  email: 'ivanov@example.com',
  skills: ['typescript', 'vue', 'backend'],
  history: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Пример задачи
const sampleTask: TaskCard = {
  id: 'task-001',
  title: 'Разработать модуль авторизации',
  description: 'Необходимо реализовать систему аутентификации...',
  status: 'col-001',
  priority: 'high',
  deadline: new Date('2024-03-01'),
  assigneeId: 'emp-001',
  tags: ['backend', 'security'],
  attachments: [],
  comments: [],
  history: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 4.4 Версионирование схемы хранения

```typescript
interface StorageSchema {
  version: string; // '1.0.0'
  entities: {
    users: User[];
    employees: Employee[];
    departments: Department[];
    positions: Position[];
    tasks: TaskCard[];
    boards: KanbanBoard[];
    leaveRequests: LeaveRequest[];
    performanceReviews: PerformanceReview[];
    documents: Document[];
    notes: Note[];
    settings: SystemSettings;
  };
  metadata: {
    lastSync?: Date;
    lastBackup?: Date;
    checksum?: string;
  };
}
```

## 5. Хранилище данных

### 5.1 Распределение данных

| Данные | Хранилище | Причина |
|--------|-----------|---------|
| Текущий пользователь, токен | sessionStorage | Очищается при закрытии вкладки |
| Настройки UI, фильтры | localStorage | Персистентные настройки |
| Все бизнес-данные | indexedDB | Большой объем, структурированные данные |
| Кэш запросов | localStorage | Быстрый доступ к часто используемым данным |

### 5.2 Абстракция storage-слоя

```typescript
// Базовый интерфейс хранилища
interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<Map<string, T>>;
}

// Реализация для indexedDB
class IndexedDBStorage<T> implements StorageAdapter<T> {
  private db: IDBDatabase | null = null;
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
    this.initDB();
  }

  private async initDB(): Promise<void> {
    // Инициализация базы данных
  }

  async get(key: string): Promise<T | null> {
    // Реализация получения данных
  }

  async set(key: string, value: T): Promise<void> {
    // Реализация сохранения данных
  }

  // ... остальные методы
}

// Реализация для localStorage
class LocalStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ... остальные методы
}

// Фабрика хранилищ
class StorageFactory {
  static create<T>(type: 'indexeddb' | 'localstorage', storeName: string): StorageAdapter<T> {
    switch (type) {
      case 'indexeddb':
        return new IndexedDBStorage<T>(storeName);
      case 'localstorage':
        return new LocalStorageAdapter<T>();
      default:
        throw new Error('Unknown storage type');
    }
  }
}

// Сервис данных с возможностью замены
class DataService {
  private storage: StorageAdapter<any>;
  private cache: Map<string, any> = new Map();

  constructor(storageType: 'indexeddb' | 'localstorage' = 'indexeddb') {
    this.storage = StorageFactory.create(storageType, 'hrms-data');
  }

  // Методы CRUD с кэшированием
  async get<T>(key: string): Promise<T | null> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = await this.storage.get(key);
    if (data) {
      this.cache.set(key, data);
    }
    return data;
  }

  async save<T>(key: string, data: T): Promise<void> {
    await this.storage.set(key, data);
    this.cache.set(key, data);
  }

  // ... остальные методы
}
```

### 5.3 Подготовка к миграции на API

```typescript
// Интерфейс для любого источника данных
interface DataSource<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  search(query: any): Promise<T[]>;
}

// Локальная реализация
class LocalDataSource<T> implements DataSource<T> {
  private storage: DataService;

  constructor(entityName: string) {
    this.storage = new DataService();
  }

  async getAll(): Promise<T[]> {
    // Получение всех записей из локального хранилища
  }

  // ... реализация остальных методов
}

// Будущая API реализация
class ApiDataSource<T> implements DataSource<T> {
  private baseUrl: string;
  private entityName: string;

  constructor(baseUrl: string, entityName: string) {
    this.baseUrl = baseUrl;
    this.entityName = entityName;
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}/${this.entityName}`);
    return response.json();
  }

  // ... реализация остальных методов
}

// Фабрика источников данных
class DataSourceFactory {
  static create<T>(type: 'local' | 'api', config: any): DataSource<T> {
    switch (type) {
      case 'local':
        return new LocalDataSource<T>(config.entityName);
      case 'api':
        return new ApiDataSource<T>(config.baseUrl, config.entityName);
      default:
        throw new Error('Unknown data source type');
    }
  }
}
```

## 6. Архитектура фронтенда

### 6.1 Структура каталогов

```
src/
├── assets/                 # Статические ресурсы
│   ├── images/
│   ├── styles/
│   └── icons/
├── components/             # Переиспользуемые компоненты
│   ├── common/            # Базовые компоненты
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   └── Table.vue
│   ├── layout/            # Компоненты макета
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   └── modules/           # Компоненты модулей
│       ├── kanban/
│       ├── employees/
│       └── tasks/
├── composables/           # Vue Composition API composables
│   ├── useAuth.ts
│   ├── useStorage.ts
│   ├── useDragDrop.ts
│   └── useNotifications.ts
├── domain/                # Бизнес-логика и модели
│   ├── models/            # TypeScript интерфейсы
│   ├── services/          # Бизнес-сервисы
│   │   ├── employee.service.ts
│   │   ├── task.service.ts
│   │   └── kanban.service.ts
│   └── validators/        # Валидаторы
│       └── employee.validator.ts
├── router/                # Маршрутизация
│   ├── index.ts
│   ├── routes.ts
│   └── guards.ts
├── stores/                # Pinia stores
│   ├── auth.store.ts
│   ├── employee.store.ts
│   ├── task.store.ts
│   ├── kanban.store.ts
│   └── ui.store.ts
├── views/                 # Страницы приложения
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   ├── employees/
│   │   ├── EmployeeListView.vue
│   │   ├── EmployeeDetailView.vue
│   │   └── EmployeeFormView.vue
│   ├── tasks/
│   │   ├── TaskBoardView.vue
│   │   ├── TaskListView.vue
│   │   └── TaskFormView.vue
│   ├── departments/
│   ├── leaves/
│   ├── performance/
│   └── settings/
├── utils/                 # Вспомогательные утилиты
│   ├── date.utils.ts
│   ├── string.utils.ts
│   └── validation.utils.ts
├── App.vue
└── main.ts
```

### 6.2 Pinia stores

```typescript
// stores/employee.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Employee, Department, Position } from '@/domain/models';
import { EmployeeService } from '@/domain/services/employee.service';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([]);
  const departments = ref<Department[]>([]);
  const positions = ref<Position[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeEmployees = computed(() => 
    employees.value.filter(e => e.status === 'active')
  );

  const getEmployeeById = (id: string) => 
    employees.value.find(e => e.id === id);

  const loadEmployees = async () => {
    try {
      loading.value = true;
      employees.value = await EmployeeService.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const createEmployee = async (employee: Partial<Employee>) => {
    try {
      const newEmployee = await EmployeeService.create(employee);
      employees.value.push(newEmployee);
      return newEmployee;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await EmployeeService.update(id, updates);
      const index = employees.value.findIndex(e => e.id === id);
      if (index !== -1) {
        employees.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await EmployeeService.delete(id);
      employees.value = employees.value.filter(e => e.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    }
  };

  return {
    employees,
    departments,
    positions,
    loading,
    error,
    activeEmployees,
    getEmployeeById,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
});

// stores/task.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TaskCard, KanbanBoard, KanbanColumn } from '@/domain/models';
import { TaskService } from '@/domain/services/task.service';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<TaskCard[]>([]);
  const boards = ref<KanbanBoard[]>([]);
  const currentBoardId = ref<string | null>(null);
  const loading = ref(false);

  const currentBoard = computed(() => 
    currentBoardId.value ? boards.value.find(b => b.id === currentBoardId.value) : null
  );

  const tasksByBoard = computed(() => (boardId: string) => 
    tasks.value.filter(t => t.boardId === boardId)
  );

  const tasksByColumn = computed(() => (columnId: string) => 
    tasks.value.filter(t => t.status === columnId).sort((a, b) => 
      a.priority.localeCompare(b.priority)
    )
  );

  const loadBoards = async () => {
    loading.value = true;
    try {
      boards.value = await TaskService.getBoards();
    } finally {
      loading.value = false;
    }
  };

  const loadTasks = async (boardId: string) => {
    loading.value = true;
    try {
      tasks.value = await TaskService.getTasksByBoard(boardId);
    } finally {
      loading.value = false;
    }
  };

  const moveTask = async (taskId: string, newColumnId: string, newIndex: number) => {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = newColumnId;
      await TaskService.update(taskId, { status: newColumnId });
      // Обновление порядка в колонке
    }
  };

  return {
    tasks,
    boards,
    currentBoardId,
    loading,
    currentBoard,
    tasksByBoard,
    tasksByColumn,
    loadBoards,
    loadTasks,
    moveTask
  };
});

// stores/auth.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/domain/models';
import { AuthService } from '@/domain/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      currentUser.value = await AuthService.login(email, password);
      isAuthenticated.value = true;
      // Сохранение в sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser.value));
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    sessionStorage.removeItem('currentUser');
  };

  const initAuth = () => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      currentUser.value = JSON.parse(stored);
      isAuthenticated.value = true;
    }
  };

  return {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    initAuth
  };
});
```

### 6.3 Router

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('@/views/employees/EmployeeListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('@/views/employees/EmployeeDetailView.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/tasks/TaskBoardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('@/views/departments/DepartmentListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr'] }
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('@/views/leaves/LeaveListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('@/views/performance/PerformanceListView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'hr', 'manager'] }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

// router/guards.ts
import { type NavigationGuard } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export const authGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else if (to.meta.roles && authStore.currentUser) {
    if (to.meta.roles.includes(authStore.currentUser.role)) {
      next();
    } else {
      next({ name: 'Dashboard' });
    }
  } else {
    next();
  }
};
```

### 6.4 Reusable components

```vue
<!-- components/common/Table.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="column in columns" :key="column.key" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="row in data" :key="row.id" class="hover:bg-gray-50">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            <slot :name="column.key" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="!data.length" class="text-center py-8 text-gray-500">
      {{ emptyMessage || 'Нет данных' }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
}

interface Props {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

defineProps<Props>();
</script>

<!-- components/modules/kanban/KanbanBoard.vue -->
<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn 
      v-for="column in board.columns" 
      :key="column.id"
      :column="column"
      :tasks="tasksByColumn(column.id)"
      @task-moved="handleTaskMove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { KanbanBoard, KanbanColumn, TaskCard } from '@/domain/models';
import KanbanColumn from './KanbanColumn.vue';

interface Props {
  board: KanbanBoard;
  tasks: TaskCard[];
}

const props = defineProps<Props>();

const tasksByColumn = computed(() => (columnId: string) => {
  return props.tasks
    .filter(task => task.status === columnId)
    .sort((a, b) => a.priority.localeCompare(b.priority));
});

const emit = defineEmits<{
  taskMoved: [taskId: string, newColumnId: string, newIndex: number];
}>();

const handleTaskMove = (taskId: string, newColumnId: string, newIndex: number) => {
  emit('taskMoved', taskId, newColumnId, newIndex);
};
</script>
```

## 7. UX/UI требования

### 7.1 Основные экраны

| Экран | Описание | Компоненты |
|-------|----------|------------|
| Логин | Аутентификация пользователя | LoginForm, ForgotPasswordLink |
| Дашборд | Главная страница с виджетами | StatsCards, RecentTasks, TeamOverview |
| Список сотрудников | Таблица сотрудников с фильтрами | EmployeeTable, EmployeeFilters, EmployeeActions |
| Карточка сотрудника | Детальная информация о сотруднике | EmployeeProfile, EmployeeHistory, RelatedTasks |
| Kanban доска | Визуальное управление задачами | KanbanBoard, KanbanColumn, TaskCard |
| Список задач | Табличное представление задач | TaskTable, TaskFilters, BulkActions |
| Отпуска | Календарь и заявки на отпуск | LeaveCalendar, LeaveRequests, LeaveForm |
| Оценка | Формы оценки и отчеты | ReviewForm, KPIChart, GoalsList |
| Настройки | Конфигурация системы | SettingsForm, Templates, Integrations |

### 7.2 Навигация

```typescript
// Основная навигация (боковое меню)
const mainNavigation = [
  { name: 'Dashboard', icon: 'home', path: '/' },
  { name: 'Сотрудники', icon: 'users', path: '/employees' },
  { name: 'Задачи', icon: 'tasks', path: '/tasks', badge: unreadTasksCount },
  { name: 'Отделы', icon: 'building', path: '/departments' },
  { name: 'Отпуска', icon: 'calendar', path: '/leaves' },
  { name: 'Оценка', icon: 'chart', path: '/performance' },
  { name: 'Настройки', icon: 'settings', path: '/settings' }
];

// Контекстная навигация (хлебные крошки)
const breadcrumbs = [
  { name: 'Сотрудники', path: '/employees' },
  { name: 'Иван Иванов', path: '/employees/emp-001' },
  { name: 'Карточка сотрудника' }
];
```

### 7.3 Состояния компонентов

```vue
<!-- Пример обработки состояний -->
<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!data.length" class="text-center py-12">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Нет данных</h3>
      <p class="mt-1 text-sm text-gray-500">Создайте первый элемент, чтобы начать</p>
      <div class="mt-6">
        <button @click="createNew" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Создать
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Ошибка загрузки данных</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success state -->
    <div v-else>
      <!-- Основной контент -->
      <slot :data="data"></slot>
    </div>
  </div>
</template>
```

### 7.4 Адаптивность

```css
/* Tailwind CSS адаптивные классы */
.container {
  @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6;
}

.table-responsive {
  @apply overflow-x-auto;
}

/* Breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 7.5 Accessibility

```vue
<!-- Пример доступного компонента -->
<template>
  <button 
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <span v-if="loading" class="sr-only">Загрузка...</span>
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
});

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
});

const ariaLabel = computed(() => {
  if (props.loading) return `${props.label} (загрузка)`;
  return props.label;
});
</script>
```

## 8. Нефункциональные требования

### 8.1 Масштабируемость

- **Модульная архитектура:** Каждый модуль независим и может быть расширен отдельно
- **Ленивая загрузка:** Использование dynamic imports для кода модулей
- **Оптимизация рендеринга:** Виртуализация списков для больших таблиц
- **Кэширование:** Реализация стратегий кэширования для часто используемых данных

### 8.2 Поддерживаемость

- **TypeScript:** Полная типизация всех сущностей и компонентов
- **ESLint + Prettier:** Единый стиль кода и автоматическое форматирование
- **JSDoc:** Документация публичных методов и интерфейсов
- **Тестирование:** Подготовка структуры для unit и e2e тестов

### 8.3 Расширяемость

- **Плагинная архитектура:** Возможность добавления кастомных модулей
- **Хуки и события:** Система событий для межмодульного взаимодействия
- **Конфигурация:** Вынесение настроек в конфигурационные файлы
- **API-адаптеры:** Готовность к подключению внешних сервисов

### 8.4 Ограничения текущей реализации

| Ограничение | Влияние | Решение при переходе на backend |
|-------------|---------|--------------------------------|
| Локальное хранилище | Ограниченный объем данных (~50MB) | База данных на сервере |
| Отсутствие синхронизации | Данные только на одном устройстве | REST API с синхронизацией |
| Нет авторизации | Все пользователи равны | JWT/OAuth2 аутентификация |
| Нет валидации на сервере | Возможны некорректные данные | Backend валидация |
| Нет резервного копирования | Риск потери данных | Автоматические бэкапы |

## 9. Будущее развитие

### 9.1 Подключение backend

```typescript
// Конфигурация API
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

// API клиент
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: typeof API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

// Замена LocalDataSource на ApiDataSource
const employeeDataSource = import.meta.env.VITE_API_ENABLED 
  ? new ApiDataSource<Employee>(API_CONFIG.baseUrl, 'employees')
  : new LocalDataSource<Employee>('employees');
```

### 9.2 Аутентификация и авторизация

```typescript
// JWT токен структура
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number; // issued at
  exp: number; // expiration
}

// Auth сервис с поддержкой JWT
class AuthService {
  async login(email: string, password: string): Promise<User> {
    if (import.meta.env.VITE_API_ENABLED) {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('auth_token', response.token);
      return response.user;
    } else {
      // Локальная реализация
      const user = await LocalAuth.login(email, password);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
  }

  async logout(): Promise<void> {
    if (import.meta.env.VITE_API_ENABLED) {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('auth_token');
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    if (import.meta.env.VITE_API_ENABLED) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = this.decodeToken(token);
        return payload as unknown as User;
      }
    } else {
      const stored = sessionStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  private decodeToken(token: string): JWTPayload {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }
}
```

### 9.3 Синхронизация данных

```typescript
// Стратегия синхронизации
class SyncManager {
  private lastSync: Date | null = null;
  private syncInterval: number = 60000; // 1 минута

  async syncAll(): Promise<void> {
    try {
      await Promise.all([
        this.syncEmployees(),
        this.syncTasks(),
        this.syncDepartments(),
        this.syncLeaves()
      ]);
      this.lastSync = new Date();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  private async syncEmployees(): Promise<void> {
    if (import.meta.env.VITE_API_ENABLED) {
      const localEmployees = await localDataSource.getAll();
      const serverEmployees = await apiDataSource.getAll();
      
      // Слияние конфликтов
      const merged = this.mergeData(localEmployees, serverEmployees);
      await localDataSource.saveAll(merged);
    }
  }

  private mergeData<T extends { id: string, updatedAt: Date }>(
    local: T[], 
    server: T[]
  ): T[] {
    const merged = new Map<string, T>();
    
    // Добавляем все серверные данные
    server.forEach(item => merged.set(item.id, item));
    
    // Обновляем из локальных, если они новее
    local.forEach(item => {
      const existing = merged.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        merged.set(item.id, item);
      }
    });
    
    return Array.from(merged.values());
  }
}
```

### 9.4 Мультикомандная разработка

```typescript
// Фича-флаги для постепенного внедрения
const FEATURE_FLAGS = {
  newKanban: true,
  advancedReporting: false,
  mobileApp: false,
  notifications: true
};

// Конфигурация окружения
interface EnvironmentConfig {
  apiEnabled: boolean;
  apiUrl: string;
  debugMode: boolean;
  featureFlags: typeof FEATURE_FLAGS;
}

const envConfig: EnvironmentConfig = {
  apiEnabled: import.meta.env.VITE_API_ENABLED === 'true',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  debugMode: import.meta.env.VITE_DEBUG === 'true',
  featureFlags: FEATURE_FLAGS
};

// Использование в компонентах
<template>
  <div v-if="config.featureFlags.newKanban">
    <NewKanbanBoard />
  </div>
  <div v-else>
    <LegacyKanbanBoard />
  </div>
</template>

<script setup lang="ts">
import { envConfig as config } from '@/config';
</script>
```