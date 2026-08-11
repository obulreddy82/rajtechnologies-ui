import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';
import { ContactUs } from './contact-us/contact-us';
import { EmployeeList } from './employee-list/employee-list';
import { SignUp } from './sign-up/sign-up';

export const routes: Routes = [
  //Define basic routes
  {
    path: 'about-us',
    // loadComponent:() => import('./about-us/about-us').then(m=> m.AboutUs),
    component: AboutUs,
    title: 'AboutUs',
  },
  {
    path: 'contact-us',
    title: 'ContactUs',
    component: ContactUs,
    //loadComponent:() => import('./contact-us/contact-us').then(m=>m.ContactUs)
  },
  {
    path: 'employee-list',
    title: 'EmployeeList',
    component: EmployeeList,
  },
  {
    path: 'sign-up',
    title: 'Sign Up',
    component: SignUp,
  },
];
