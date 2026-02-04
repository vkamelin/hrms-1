import { defineStore } from 'pinia';
import { Document, Note } from '../models/Document';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documents: [] as Document[],
    notes: [] as Note[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allDocuments: (state) => state.documents,
    getDocumentById: (state) => (id: string) => {
      return state.documents.find(doc => doc.id === id);
    },
    getDocumentsByEmployee: (state) => (employeeId: string) => {
      return state.documents.filter(doc => doc.employeeId === employeeId);
    },
    getDocumentsByTask: (state) => (taskId: string) => {
      return state.documents.filter(doc => doc.taskId === taskId);
    },
    getDocumentsByCategory: (state) => (category: string) => {
      return state.documents.filter(doc => doc.category === category);
    },
    allNotes: (state) => state.notes,
    getNoteById: (state) => (id: string) => {
      return state.notes.find(note => note.id === id);
    },
    getNotesByEmployee: (state) => (employeeId: string) => {
      return state.notes.filter(note => note.employeeId === employeeId);
    },
    getNotesByTask: (state) => (taskId: string) => {
      return state.notes.filter(note => note.taskId === taskId);
    },
    getPinnedNotes: (state) => state.notes.filter(note => note.pinned)
  },

  actions: {
    async fetchDocuments() {
      this.loading = true;
      try {
        const storedDocs = localStorage.getItem('hrms_documents');
        const storedNotes = localStorage.getItem('hrms_notes');
        
        if (storedDocs) {
          this.documents = JSON.parse(storedDocs);
        } else {
          // Initialize with some sample data
          this.documents = [
            {
              id: 'doc-001',
              name: 'Трудовой договор Иванова И.И.',
              type: 'application/pdf',
              size: 102400,
              content: 'JVBERi0xLjQKJcOkw7zDtsO4w6wgcmVwb3J0CiUlRU9GCg==', // Base64 encoded sample PDF
              employeeId: 'emp-001',
              category: 'contract',
              tags: ['трудовой договор', 'Иванов'],
              uploadedBy: 'user-001',
              uploadedAt: new Date(),
            }
          ];
          localStorage.setItem('hrms_documents', JSON.stringify(this.documents));
        }
        
        if (storedNotes) {
          this.notes = JSON.parse(storedNotes);
        } else {
          // Initialize with some sample data
          this.notes = [
            {
              id: 'note-001',
              title: 'Заметки по онбордингу',
              content: 'Необходимо провести онбординг нового сотрудника',
              employeeId: 'emp-001',
              authorId: 'user-001',
              tags: ['онбординг', 'новый сотрудник'],
              pinned: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching documents';
      } finally {
        this.loading = false;
      }
    },

    async createDocument(documentData: Omit<Document, 'id' | 'uploadedAt'>) {
      this.loading = true;
      try {
        const newDocument: Document = {
          ...documentData,
          id: `doc-${Date.now()}`,
          uploadedAt: new Date()
        };
        
        this.documents.push(newDocument);
        localStorage.setItem('hrms_documents', JSON.stringify(this.documents));
        
        this.error = null;
        return newDocument;
      } catch (error: any) {
        this.error = error.message || 'Error creating document';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDocument(id: string, documentData: Partial<Document>) {
      this.loading = true;
      try {
        const index = this.documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
          this.documents[index] = { 
            ...this.documents[index], 
            ...documentData 
          };
          
          localStorage.setItem('hrms_documents', JSON.stringify(this.documents));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating document';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDocument(id: string) {
      this.loading = true;
      try {
        this.documents = this.documents.filter(doc => doc.id !== id);
        localStorage.setItem('hrms_documents', JSON.stringify(this.documents));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error deleting document';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newNote: Note = {
          ...noteData,
          id: `note-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.notes.push(newNote);
        localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
        
        this.error = null;
        return newNote;
      } catch (error: any) {
        this.error = error.message || 'Error creating note';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateNote(id: string, noteData: Partial<Note>) {
      this.loading = true;
      try {
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
          this.notes[index] = { 
            ...this.notes[index], 
            ...noteData, 
            updatedAt: new Date() 
          };
          
          localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating note';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteNote(id: string) {
      this.loading = true;
      try {
        this.notes = this.notes.filter(note => note.id !== id);
        localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error deleting note';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async pinNote(id: string) {
      this.loading = true;
      try {
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
          this.notes[index].pinned = true;
          this.notes[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error pinning note';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async unpinNote(id: string) {
      this.loading = true;
      try {
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
          this.notes[index].pinned = false;
          this.notes[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_notes', JSON.stringify(this.notes));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error unpinning note';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});