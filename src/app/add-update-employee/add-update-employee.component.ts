import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { db } from '../../db';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-employee',
  templateUrl: './add-update-employee.component.html',
  styleUrls: ['./add-update-employee.component.scss']
})
export class AddUpdateEmployeeComponent implements OnInit {
  form!: FormGroup;
  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  empId = signal('');
  startDate = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: '',
      role: '',
      startDate: '',
      endDate: ''
    })
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data['id']) {
        this.empId.set(data['id']);
        this.getAndSetEmployee();
      }
    })
  }

  getAndSetEmployee() {
    db.employees
    .get(+this.empId())
    .then((data: any) => {
      if (!data) {
        this.router.navigate(['/']);
      } else {
        this.form.patchValue(data);
      }
    })
    .catch((err) => {
      this.openErrorSnackBar(err);
      this.router.navigate(['/'])
    })
  }

  onDateSelect() {
    this.startDate.set(this.form.value.startDate);
  }

  onCancel() {
    this.router.navigate(['/'])
  }

  onSave() {
    db.employees.add(this.form.value)
    .then(() => {
      this.snackBar.open('Employee added successfully', 'close', {
        duration: 3000,
        panelClass: ['blue-snackbar'],
      })
      this.form.reset();
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

}
