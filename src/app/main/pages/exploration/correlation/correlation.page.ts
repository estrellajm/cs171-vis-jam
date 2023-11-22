import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-correlation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './correlation.page.html',
  styleUrls: ['./correlation.page.scss'],
})
export class CorrelationPage {}
