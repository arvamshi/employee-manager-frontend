import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  filters={
    keyword: '',
    sortBy: ''
  }

  
  
  constructor(private employeeService: EmployeeService){}


  ngOnInit() {
    this.getEmployees();
  }

   // ----- searching method. only for name search-----Start--------

   public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = this.searchEmployee1(response);
        console.log(response);
      });
  }

  searchEmployee1(response: Employee[]){
    // console.log(this.filters);
    return response.filter((e) => {
      return e.name.toLocaleLowerCase().includes(this.filters.keyword.toLocaleLowerCase());
    }).sort((a,b) => {
      var boo=this.filters.sortBy;
      console.log(boo);
      if(this.filters.sortBy === 'Id'){
        return a.id < b.id? -1:1;
      }
      else if(this.filters.sortBy === 'Job'){
        return a.jobTitle.toLocaleLowerCase() < b.jobTitle.toLocaleLowerCase()? -1:1;
      }
      else if(this.filters.sortBy === 'Name'){
        return a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()? -1:1;
      }
    });
  }

  //-----------end-------------

  // other searching method(original)-------start--------
  // public getEmployees(): void {
  //   this.employeeService.getEmployees().subscribe(
  //     (response: Employee[]) => {
  //       this.employees = response;
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   );
  // }

  // public searchEmployees(key: string): void {
  //   console.log(key);
  //   const results: Employee[] = [];
  //   for (const employee of this.employees) {
  //     if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
  //     || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
  //     || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
  //     || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
  //       results.push(employee);
  //     }
  //   }
  //   this.employees = results;
  //   if (results.length === 0 || !key) {
  //     this.getEmployees();
  //   }
  // }
  //-----------end-----------

  public onAddEmloyee(addForm: NgForm): void {
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmloyee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }


  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }



}