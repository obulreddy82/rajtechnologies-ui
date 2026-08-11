import { Routes } from '@angular/router';
import { AboutUs } from './about-us/about-us';
import { ContactUs } from './contact-us/contact-us';
import { EmployeeList } from './employee-list/employee-list';
import { SignUp } from './sign-up/sign-up';
import { SignIn } from './sign-in/sign-in';
import { Profile } from './profile/profile';
import { SignOut } from './sign-out/sign-out';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUs,
    title: 'AboutUs',
  },
  {
    path: 'contact-us',
    title: 'ContactUs',
    component: ContactUs,
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
    canActivate: [guestGuard],
  },
  {
    path: 'sign-in',
    title: 'Sign In',
    component: SignIn,
    canActivate: [guestGuard],
  },
  {
    path: 'profile',
    title: 'Personal Information',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'sign-out',
    title: 'Sign Out',
    component: SignOut,
  },
];
