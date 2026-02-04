import { defineStore } from 'pinia';
import { TaskCard, KanbanBoard, KanbanColumn, Comment, Attachment, TaskHistory } from '../models/Task';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as TaskCard[],
    boards: [] as KanbanBoard[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allTasks: (state) => state.tasks,
    getTaskById: (state) => (id: string) => {
      return state.tasks.find(task => task.id === id);
    },
    getTasksByAssignee: (state) => (assigneeId: string) => {
      return state.tasks.filter(task => task.assigneeId === assigneeId);
    },
    getTasksByStatus: (state) => (status: string) => {
      return state.tasks.filter(task => task.status === status);
    },
    getTasksByPriority: (state) => (priority: string) => {
      return state.tasks.filter(task => task.priority === priority);
    },
    allBoards: (state) => state.boards,
    getBoardById: (state) => (id: string) => {
      return state.boards.find(board => board.id === id);
    },
    getBoardColumns: (state) => (boardId: string) => {
      const board = state.boards.find(b => b.id === boardId);
      return board ? board.columns : [];
    },
    getTasksForBoard: (state) => (boardId: string) => {
      const board = state.boards.find(b => b.id === boardId);
      if (!board) return [];
      
      // Get all task IDs from all columns in the board
      const taskIdsInBoard = board.columns.flatMap(col => col.tasks);
      return state.tasks.filter(task => taskIdsInBoard.includes(task.id));
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true;
      try {
        const storedTasks = localStorage.getItem('hrms_tasks');
        const storedBoards = localStorage.getItem('hrms_boards');
        
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks);
        } else {
          // Initialize with some sample data
          this.tasks = [
            {
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
            }
          ];
          localStorage.setItem('hrms_tasks', JSON.stringify(this.tasks));
        }
        
        if (storedBoards) {
          this.boards = JSON.parse(storedBoards);
        } else {
          // Initialize with a default board
          const defaultBoard: KanbanBoard = {
            id: 'board-001',
            name: 'Проект по разработке системы',
            description: 'Основная доска для проекта',
            columns: [
              {
                id: 'col-001',
                title: 'To Do',
                order: 1,
                tasks: ['task-001']
              },
              {
                id: 'col-002',
                title: 'In Progress',
                order: 2,
                tasks: []
              },
              {
                id: 'col-003',
                title: 'Done',
                order: 3,
                tasks: []
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            ownerId: 'user-001',
            sharedWith: []
          };
          this.boards = [defaultBoard];
          localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching tasks';
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: Omit<TaskCard, 'id' | 'history' | 'attachments' | 'comments' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newTask: TaskCard = {
          ...taskData,
          id: `task-${Date.now()}`,
          history: [],
          attachments: [],
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add creation event to history
        const creationEvent: TaskHistory = {
          id: `hist-${Date.now()}`,
          taskId: newTask.id,
          action: 'created',
          changes: { ...taskData },
          authorId: newTask.assigneeId || '',
          timestamp: new Date()
        };
        newTask.history.push(creationEvent);
        
        this.tasks.push(newTask);
        localStorage.setItem('hrms_tasks', JSON.stringify(this.tasks));
        
        // Add task to the appropriate column in the board
        const board = this.boards.find(b => 
          b.columns.some(col => col.id === newTask.status)
        );
        
        if (board) {
          const columnIndex = board.columns.findIndex(col => col.id === newTask.status);
          if (columnIndex !== -1) {
            board.columns[columnIndex].tasks.push(newTask.id);
            localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
          }
        }
        
        this.error = null;
        return newTask;
      } catch (error: any) {
        this.error = error.message || 'Error creating task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(id: string, taskData: Partial<TaskCard>) {
      this.loading = true;
      try {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          // Track changes for history
          const oldTask = { ...this.tasks[index] };
          const changes: Record<string, any> = {};
          
          for (const key in taskData) {
            if ((oldTask as any)[key] !== (taskData as any)[key]) {
              changes[key] = {
                from: (oldTask as any)[key],
                to: (taskData as any)[key]
              };
            }
          }
          
          // Update task
          this.tasks[index] = { 
            ...this.tasks[index], 
            ...taskData, 
            updatedAt: new Date() 
          };
          
          // Handle status change (moving between columns)
          if (taskData.status && oldTask.status !== taskData.status) {
            // Remove from old column
            for (const board of this.boards) {
              for (const column of board.columns) {
                column.tasks = column.tasks.filter(taskId => taskId !== id);
              }
            }
            
            // Add to new column
            const targetBoard = this.boards.find(b => 
              b.columns.some(col => col.id === taskData.status)
            );
            
            if (targetBoard) {
              const targetColumn = targetBoard.columns.find(col => col.id === taskData.status);
              if (targetColumn) {
                targetColumn.tasks.push(id);
              }
            }
            
            localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
          }
          
          // Add to history if there were changes
          if (Object.keys(changes).length > 0) {
            const updateEvent: TaskHistory = {
              id: `hist-${Date.now()}`,
              taskId: id,
              action: 'updated',
              changes,
              authorId: this.tasks[index].assigneeId || '',
              timestamp: new Date()
            };
            
            this.tasks[index].history.push(updateEvent);
          }
          
          localStorage.setItem('hrms_tasks', JSON.stringify(this.tasks));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async moveTaskToColumn(taskId: string, newColumnId: string, newPosition?: number) {
      this.loading = true;
      try {
        // Find the task
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        const oldStatus = this.tasks[taskIndex].status;
        
        // Update task status
        this.tasks[taskIndex].status = newColumnId;
        this.tasks[taskIndex].updatedAt = new Date();
        
        // Move task between columns
        for (const board of this.boards) {
          for (const column of board.columns) {
            // Remove task from its current column
            column.tasks = column.tasks.filter(id => id !== taskId);
          }
        }
        
        // Add task to the new column
        const targetBoard = this.boards.find(b => 
          b.columns.some(col => col.id === newColumnId)
        );
        
        if (targetBoard) {
          const targetColumn = targetBoard.columns.find(col => col.id === newColumnId);
          if (targetColumn) {
            if (newPosition !== undefined) {
              targetColumn.tasks.splice(newPosition, 0, taskId);
            } else {
              targetColumn.tasks.push(taskId);
            }
          }
        }
        
        // Add movement event to history
        const moveEvent: TaskHistory = {
          id: `hist-${Date.now()}`,
          taskId,
          action: 'moved',
          changes: {
            from: oldStatus,
            to: newColumnId
          },
          authorId: this.tasks[taskIndex].assigneeId || '',
          timestamp: new Date()
        };
        
        this.tasks[taskIndex].history.push(moveEvent);
        
        localStorage.setItem('hrms_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error moving task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(id: string) {
      this.loading = true;
      try {
        // Remove task from columns
        for (const board of this.boards) {
          for (const column of board.columns) {
            column.tasks = column.tasks.filter(taskId => taskId !== id);
          }
        }
        
        localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
        
        // Remove task from tasks array
        this.tasks = this.tasks.filter(task => task.id !== id);
        localStorage.setItem('hrms_tasks', JSON.stringify(this.tasks));
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error deleting task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createBoard(boardData: Omit<KanbanBoard, 'id' | 'columns' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newBoard: KanbanBoard = {
          ...boardData,
          id: `board-${Date.now()}`,
          columns: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.boards.push(newBoard);
        localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
        
        this.error = null;
        return newBoard;
      } catch (error: any) {
        this.error = error.message || 'Error creating board';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addColumnToBoard(boardId: string, columnData: Omit<KanbanColumn, 'id' | 'tasks'>) {
      this.loading = true;
      try {
        const boardIndex = this.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1) {
          const newColumn: KanbanColumn = {
            ...columnData,
            id: `col-${Date.now()}`,
            tasks: []
          };
          
          this.boards[boardIndex].columns.push(newColumn);
          this.boards[boardIndex].updatedAt = new Date();
          
          localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
          this.error = null;
          
          return newColumn;
        }
      } catch (error: any) {
        this.error = error.message || 'Error adding column to board';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateColumnOrder(boardId: string, newColumnOrder: KanbanColumn[]) {
      this.loading = true;
      try {
        const boardIndex = this.boards.findIndex(board => board.id === boardId);
        if (boardIndex !== -1) {
          // Update the columns with the new order and preserve tasks
          this.boards[boardIndex].columns = newColumnOrder.map((col, index) => ({
            ...col,
            order: index + 1
          }));
          
          this.boards[boardIndex].updatedAt = new Date();
          localStorage.setItem('hrms_boards', JSON.stringify(this.boards));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating column order';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});