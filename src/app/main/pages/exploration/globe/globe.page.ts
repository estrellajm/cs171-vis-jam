import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {}
