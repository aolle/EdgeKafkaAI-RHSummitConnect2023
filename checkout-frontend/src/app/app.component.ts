import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showContent = true;

  constructor(private router: Router) { }

  toggleContent() {
    this.showContent = false;
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 500);
  }
}
