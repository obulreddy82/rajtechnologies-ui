import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  signUpForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  readonly roleOptions = [
    { value: '', label: 'Select your role' },
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'solution-architect', label: 'Solution Architect' },
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'business-analyst', label: 'Business Analyst' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'data-engineer', label: 'Data Engineer' },
    { value: 'cybersecurity-specialist', label: 'Cybersecurity Specialist' },
    { value: 'client', label: 'Client / Business Owner' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern(/^[+]?[0-9\s()\-]{8,20}$/)]],
        role: ['', Validators.required],
        company: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue]
      },
      { validators: this.passwordsMatch }
    );
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.signUpForm.markAllAsTouched();
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }

    const { confirmPassword, terms, ...payload } = this.signUpForm.value;

    this.http.post('http://localhost:8070/api/v1/signup', payload, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Sign-up successful:', response);
        this.signUpForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Sign-up failed:', error);
      }
    });
  }

  get firstName()       { return this.signUpForm.get('firstName'); }
  get lastName()        { return this.signUpForm.get('lastName'); }
  get email()           { return this.signUpForm.get('email'); }
  get phone()           { return this.signUpForm.get('phone'); }
  get role()            { return this.signUpForm.get('role'); }
  get company()         { return this.signUpForm.get('company'); }
  get password()        { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
  get terms()           { return this.signUpForm.get('terms'); }

  get pwLengthMet():    boolean { const v = this.password?.value ?? ''; return v.length >= 8; }
  get pwUpperMet():     boolean { return /[A-Z]/.test(this.password?.value ?? ''); }
  get pwLowerMet():     boolean { return /[a-z]/.test(this.password?.value ?? ''); }
  get pwNumberMet():    boolean { return /\d/.test(this.password?.value ?? ''); }
  get pwSpecialMet():   boolean { return /[@$!%*?&]/.test(this.password?.value ?? ''); }
}
