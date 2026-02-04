// Базовый интерфейс хранилища
export interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<Map<string, T>>;
}

// Реализация для localStorage
export class LocalStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    // We won't clear all localStorage since it might contain other app data
    // Instead, we could implement a prefixed approach
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('hrms_')) {
        localStorage.removeItem(key);
      }
    });
  }

  async getAll(): Promise<Map<string, T>> {
    const map = new Map<string, T>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hrms_')) {
        const value = localStorage.getItem(key);
        if (value) {
          map.set(key, JSON.parse(value) as T);
        }
      }
    }
    return map;
  }
}

// Реализация для sessionStorage
export class SessionStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, value: T): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    // Only clear HRMS related items from sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('hrms_')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  async getAll(): Promise<Map<string, T>> {
    const map = new Map<string, T>();
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('hrms_')) {
        const value = sessionStorage.getItem(key);
        if (value) {
          map.set(key, JSON.parse(value) as T);
        }
      }
    }
    return map;
  }
}

// Фабрика хранилищ
export class StorageFactory {
  static create<T>(
    type: 'localStorage' | 'sessionStorage', 
    prefix: string = ''
  ): StorageAdapter<T> {
    let adapter: StorageAdapter<T>;
    
    switch (type) {
      case 'localStorage':
        adapter = new LocalStorageAdapter<T>();
        break;
      case 'sessionStorage':
        adapter = new SessionStorageAdapter<T>();
        break;
      default:
        throw new Error('Unknown storage type');
    }
    
    // If we want to add prefixing functionality, we'd need to wrap the adapter
    // For now, we'll just return the basic adapter
    return adapter;
  }
}

// Сервис данных с возможностью замены
export class DataService {
  private storage: StorageAdapter<any>;
  private cache: Map<string, any> = new Map();

  constructor(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
    this.storage = StorageFactory.create(storageType, 'hrms');
  }

  // Методы CRUD с кэшированием
  async get<T>(key: string): Promise<T | null> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Otherwise get from storage
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

  async remove(key: string): Promise<void> {
    await this.storage.remove(key);
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
    this.cache.clear();
  }

  async getAll(): Promise<Map<string, any>> {
    // Return cached items if they exist, otherwise fetch from storage
    if (this.cache.size === 0) {
      this.cache = await this.storage.getAll();
    }
    return this.cache;
  }
}

// Service worker для фоновой синхронизации (заглушка)
export class SyncService {
  private syncQueue: Array<() => Promise<void>> = [];

  async addToSyncQueue(operation: () => Promise<void>): Promise<void> {
    this.syncQueue.push(operation);
    
    // Process queue asynchronously
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      // Register service worker and perform background sync
      // This is a simplified implementation
      console.log('Added operation to sync queue');
    } else {
      // Fallback: execute immediately
      await operation();
    }
  }

  async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Sync operation failed:', error);
          // Re-add to queue or handle error appropriately
          this.syncQueue.unshift(operation);
          break; // Stop processing on error
        }
      }
    }
  }
}