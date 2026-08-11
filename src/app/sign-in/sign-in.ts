import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  signInForm: FormGroup;
  showPassword = false;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.signInForm.markAllAsTouched();
    this.submitted = true;
    this.errorMessage = '';

    if (this.signInForm.invalid) {
      return;
    }

    const { email, password } = this.signInForm.value;
    this.loading = true;

    this.auth.signIn({ email, password }).subscribe({
      next: (user) => {
        this.loading = false;
        this.submitted = false;

        if (!user) {
          this.errorMessage = 'Invalid email or password. Please try again.';
          return;
        }

        this.signInForm.reset({ rememberMe: false });
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Sign-in failed:', error);
        const backendError = error?.error?.error ?? error?.error?.message;
        this.errorMessage = backendError
          ?? 'Unable to sign in. Please check your credentials and try again.';
      }
    });
  }

  get email()    { return this.signInForm.get('email'); }
  get password() { return this.signInForm.get('password'); }
}
