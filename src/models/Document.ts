export interface Document {
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

export interface Note {
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