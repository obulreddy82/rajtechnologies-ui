import { Component, computed, signal } from '@angular/core';
import { Employee } from '../models/employee-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of,from,fromEvent } from 'rxjs';
import { distinctUntilChanged,debounceTime, filter,map } from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [AsyncPipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList {
  // Fixed: The variable name matches exactly in both places
private numbers$ = of(1, 2, 3);


  //Signal examples
  count=signal(0);

  employees!: Observable<Employee[]>;
  constructor(public hc: HttpClient) {
    console.log(`count value ${this.count()}`)
    this.employees = this.hc.get<Employee[]>('https://jsonplaceholder.typicode.com/users');
  }
  increment(){
    console.log("updating count");
    //write the signal
    this.count.set(this.count()+1);
    const derivedCounter = computed(() => {return this.count() *10});
    console.log("derived count value",derivedCounter());

    //this.count.update(counter => counter + 1);
    console.log("updated count value",this.count());
  }







ngOnInit(){
  //Creation Operators Observable
  //Creation operators are functions used to initialize a new Observable stream from data structures, events, or timers
  //of: Converts a sequence of values into an Observable.
  this.numbers$.subscribe({
    next: val => console.log('value',val),
    complete: () => console.log("Done!")
  })

  //from: Converts an array, Promise, or iterable into an Observable stream.
  const fruits=['banana','strawberry','pears'];
  from(fruits)
  .subscribe(fruit => console.log('Fruite', fruit))


//Common Pipeable Operators
//Pipeable operators allow you to chain operations using the .pipe() method to modify stream items.
//map & filter: Transforms and restricts the values in the stream.

const numbers1$ = of(1, 2, 3, 4, 5);
numbers1$.pipe(
  filter(n => n % 2 !== 0), // Keeps only odd numbers (1, 3, 5)
  map(n => n * n)         // Squares them (1, 9, 25)
).subscribe(val => console.log('Processed:', val));
  const searchInput = document.getElementById('search') as HTMLInputElement;
console.log('search input', searchInput);
  //convert input events into an observable stream
  fromEvent(searchInput,'input').
  pipe(
    map((event:any) => event.target.value),
    debounceTime(400),
    distinctUntilChanged()
  ).subscribe(searchText=>{
    console.log('searching for:',searchText)
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    this.hc.get<Employee[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(map((employees: Employee[]) => employees.filter(
        employee => employee.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.email?.toLowerCase().includes(searchText.toLowerCase())
      ))).subscribe(filteredEmployees => {
        console.log('filtered employees:', filteredEmployees);
        this.employees=of(filteredEmployees)});
})
  }


}
