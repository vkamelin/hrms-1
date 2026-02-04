// Интерфейс для любого источника данных
export interface DataSource<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  search(query: any): Promise<T[]>;
}

// Локальная реализация
export class LocalDataSource<T> implements DataSource<T> {
  private storageKey: string;
  
  constructor(entityName: string) {
    this.storageKey = `hrms_${entityName}`;
  }
  
  async getAll(): Promise<T[]> {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item: any) => item.id === id) || null;
  }
  
  async create(item: T): Promise<T> {
    const items = await this.getAll();
    
    // Add timestamps if the item supports them
    const newItem: any = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    
    return newItem;
  }
  
  async update(id: string, item: Partial<T>): Promise<T> {
    const items = await this.getAll();
    const index = items.findIndex((existingItem: any) => existingItem.id === id);
    
    if (index !== -1) {
      // Preserve original timestamps and merge with updates
      const updatedItem = {
        ...items[index],
        ...item,
        updatedAt: new Date()
      };
      
      items[index] = updatedItem;
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      
      return updatedItem;
    }
    
    throw new Error(`Item with id ${id} not found`);
  }
  
  async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filteredItems = items.filter((item: any) => item.id !== id);
    
    if (filteredItems.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
  }
  
  async search(query: any): Promise<T[]> {
    const items = await this.getAll();
    
    // Simple filter implementation - in a real app this could be more sophisticated
    return items.filter((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key] && !(typeof item[key] === 'string' && item[key].toLowerCase().includes(query[key].toLowerCase()))) {
          return false;
        }
      }
      return true;
    });
  }
}

// Заглушка для серверного API (реализация будет добавлена позже)
export class RemoteDataSource<T> implements DataSource<T> {
  private _baseUrl: string;
  private _entityName: string;
  
  constructor(baseUrl: string, entityName: string) {
    this._baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this._entityName = entityName;
  }
  
  async getAll(): Promise<T[]> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
    return [];
  }
  
  async getById(_id: string): Promise<T | null> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
    return null;
  }
  
  async create(item: T): Promise<T> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
    return item;
  }
  
  async update(_id: string, item: Partial<T>): Promise<T> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
    return item as T;
  }
  
  async delete(_id: string): Promise<void> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
  }
  
  async search(_query: any): Promise<T[]> {
    // This would make an HTTP request in a real implementation
    console.warn('RemoteDataSource is not fully implemented yet');
    return [];
  }
  
  // Добавляем геттеры для доступа к приватным полям
  get baseUrl(): string {
    return this._baseUrl;
  }
  
  get entityName(): string {
    return this._entityName;
  }
}

// Сервис для выбора источника данных
export class DataServiceFactory {
  static create<T>(type: 'local' | 'remote', config?: { baseUrl?: string, entityName: string }): DataSource<T> {
    switch (type) {
      case 'local':
        if (!config || !config.entityName) {
          throw new Error('Entity name is required for local data source');
        }
        return new LocalDataSource<T>(config.entityName);
      case 'remote':
        if (!config || !config.baseUrl || !config.entityName) {
          throw new Error('Base URL and entity name are required for remote data source');
        }
        return new RemoteDataSource<T>(config.baseUrl, config.entityName);
      default:
        throw new Error('Unknown data source type');
    }
  }
}

// Абстрактный сервис данных с возможностью переключения между источниками
export class UniversalDataService<T> {
  private dataSource: DataSource<T>;
  
  constructor(type: 'local' | 'remote' = 'local', config?: { baseUrl?: string, entityName: string }) {
    this.dataSource = DataServiceFactory.create<T>(type, config);
  }
  
  async getAll(): Promise<T[]> {
    return await this.dataSource.getAll();
  }
  
  async getById(id: string): Promise<T | null> {
    return await this.dataSource.getById(id);
  }
  
  async create(item: T): Promise<T> {
    return await this.dataSource.create(item);
  }
  
  async update(id: string, item: Partial<T>): Promise<T> {
    return await this.dataSource.update(id, item);
  }
  
  async delete(id: string): Promise<void> {
    await this.dataSource.delete(id);
  }
  
  async search(query: any): Promise<T[]> {
    return await this.dataSource.search(query);
  }
  
  // Метод для переключения источника данных
  switchDataSource(type: 'local' | 'remote', config?: { baseUrl?: string, entityName: string }) {
    this.dataSource = DataServiceFactory.create<T>(type, config);
  }
}