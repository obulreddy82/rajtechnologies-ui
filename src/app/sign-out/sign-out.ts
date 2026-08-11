import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sign-out.html',
  styleUrl: './sign-out.css'
})
export class SignOut implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.signOut();
  }
}
