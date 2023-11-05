import Dexie, { Table } from 'dexie';
import { Employee } from './shared/interfaces';

export class AppDB extends Dexie {
  employees!: Table<Employee, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      employees: '++id'
    });
  }
}

export const db = new AppDB();