import { Component } from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactUs {

  contactForm: FormGroup;

  readonly serviceOptions = [
    { key: 'serviceJava', label: 'Enterprise Java Development' },
    { key: 'serviceNet', label: '.NET Application Development' },
    { key: 'serviceWeb', label: 'Web & Frontend Development' },
    { key: 'serviceCloud', label: 'Cloud & DevOps' },
    { key: 'serviceCyber', label: 'Cybersecurity & Compliance' },
    { key: 'serviceArchitecture', label: 'Solution Architecture' },
    { key: 'serviceConsulting', label: 'IT Consulting' },
    { key: 'serviceSupport', label: 'Managed Support Services' }
  ];

  constructor(private fb: FormBuilder,
              private http: HttpClient) {

    this.contactForm = this.fb.group({

      companyName: ['', Validators.required],

      customerName: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.pattern(/^[+]?[0-9\s()-]{8,20}$/)
        ]
      ],

      website: [
        '',
        [
          Validators.pattern(
            /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
          )
        ]
      ],

      region: [
        '',
        Validators.required
      ],

      services: this.fb.array(
      this.serviceOptions.map(() => this.fb.control(false)),
      this.atLeastOneChecked
    ),

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(20)
        ]
      ]

    });

  }

  /**
   * Custom Validator
   * At least one checkbox must be selected
   */
  atLeastOneChecked(
    control: AbstractControl
  ): ValidationErrors | null {

    const values = Object.values(control.value);

    const checked = values.some(value => value === true);

    return checked ? null : { required: true };

  }

  onSubmit(): void {

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    const selectedServices = Object.entries(
      this.contactForm.value.services
    )
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    const payload = {

      companyName: this.contactForm.value.companyName,

      customerName: this.contactForm.value.customerName,

      email: this.contactForm.value.email,

      phone: this.contactForm.value.phone,

      website: this.contactForm.value.website,

      region: this.contactForm.value.region,

      services: selectedServices,

      message: this.contactForm.value.message

    };

    console.log('Contact Request');

    console.log(payload);

    // TODO
    // Call your backend API here

    this.http.post('http://localhost:8090/api/v1/contact-us', payload)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.contactForm.reset();
        },
        error: (error) => console.log(error)
      });

    this.contactForm.get('services')?.patchValue({
      serviceJava: false,
      serviceNet: false,
      serviceWeb: false,
      serviceCloud: false,
      serviceCyber: false,
      serviceArchitecture: false,
      serviceConsulting: false,
      serviceSupport: false
    });

  }

  // -----------------------
  // Getters
  // -----------------------

  get companyName() {
    return this.contactForm.get('companyName');
  }

  get customerName() {
    return this.contactForm.get('customerName');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get website() {
    return this.contactForm.get('website');
  }

  get region() {
    return this.contactForm.get('region');
  }

  get servicesArray() {
    return this.contactForm.get('services') as FormArray;
  }

  get message() {
    return this.contactForm.get('message');
  }

}
