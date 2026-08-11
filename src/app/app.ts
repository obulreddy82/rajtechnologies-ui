import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet, Header,Home,  Footer],
  imports: [Header,Home,  Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('raj-technologies');
}
