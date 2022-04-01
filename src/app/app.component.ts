import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'image-converter';
  contact_url = 'https://github.com/Winay-Chowdary66';
  contact() {
    window.open(this.contact_url);
  }
}
