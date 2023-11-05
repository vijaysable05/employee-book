import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'dexie';
import { db } from '../db';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = signal('Employee List')
  showdelete = signal(false);
  subscription!: Subscription;
  empId = signal('');

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe((data) => {
      if (data instanceof NavigationStart) {
        if (data.url === '/emp') {
          this.title.set('Add Employee Details')
          this.showdelete.set(false);
        } else if (data.url.includes('/emp?id=')) {
          this.title.set('Edit Employee Details')
          this.empId.set(data.url.split('?id=')[1])
          this.showdelete.set(true);
        } else {
          this.title.set('Employee List')
          this.showdelete.set(false);
        }
      }
    })
  }

  onDelete() {
    db.employees
      .delete(+this.empId())
      .then(() => {
        this.snackBar.open('Employee deleted successfully', 'close', {
          duration: 3000,
          panelClass: ['blue-snackbar'],
        })
        this.router.navigate(['/'])
      })
      .catch((err) => {
        this.openErrorSnackBar(err);
      })
  }

  openErrorSnackBar(err: any) {
    this.snackBar.open(typeof err === 'string' ? err :
      err.error && err.error.message ? err.error.message :
        err.error.error ? err.error.error.message :
          err.message ? err.message : 'Something went wrong', 'Dismiss',
      { duration: 3000, panelClass: ['blue-snackbar'] }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
