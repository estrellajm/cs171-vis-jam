import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { User } from '@interfaces/user.interface';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage {
  users: User[] = [
    {
      firstName: 'Jose',
      lastName: 'Estrella',
      email: 'joe714@g.harvard.edu',
    },
    {
      firstName: 'Aleksejs',
      lastName: 'Nazarovs',
      email: 'aln755@g.harvard.edu',
    },
    {
      firstName: 'Mohamed',
      lastName: 'Kassem',
      email: 'mok206@g.harvard.edu',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  makeFirstCharBold(name: string): SafeHtml {
    if (!name) return '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<strong>${name.charAt(0)}</strong>${name.slice(1)}`
    );
  }
}
