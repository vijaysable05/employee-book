import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { db } from '../../db';
import { liveQuery } from 'dexie';
import { Employee } from 'src/shared/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  previousEmployees$ = liveQuery(
    () => this.getPreviousEmployees()
  );
  prevEmps = toSignal<Employee[]>(this.previousEmployees$);
  currentEmployees$ = liveQuery(
    () => this.getCurrentEmployees()
  );
  currentEmps = toSignal<Employee[]>(this.currentEmployees$);

  constructor(
    private router: Router
  ) {}

  async getPreviousEmployees() {
    return db.employees
    .filter((item: Employee) => Boolean(item.startDate && item.endDate))
    .toArray();
  }

  async getCurrentEmployees() {
    return db.employees
    .filter((item: Employee) => item.startDate === '' || item.endDate === '')
    .toArray();
  }

  onAddClick() {
    this.router.navigate(['emp'])
  }

  onEmpClick(id: number) {
    this.router.navigate(['emp'], {
      queryParams: {
        id
      }
    })
  }
}
