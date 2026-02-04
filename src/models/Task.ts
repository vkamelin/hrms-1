export interface TaskCard {
  id: string;
  title: string;
  description?: string;
  status: string; // ID колонки
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  assigneeId?: string; // ID сотрудника-исполнитель
  departmentId?: string; // ID отдела
  projectId?: string; // ID проекта (будущее развитие)
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  history: TaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string; // ID пользователя-владельца
  sharedWith: string[]; // ID пользователей с доступом
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  color?: string;
  limit?: number; // ограничение количества задач
  tasks: string[]; // IDs задач в колонке
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  parentId?: string; // для вложенных комментариев
  attachments: Attachment[];
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'moved' | 'assigned' | 'completed';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}