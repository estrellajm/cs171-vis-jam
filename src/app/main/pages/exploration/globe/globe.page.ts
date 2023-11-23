import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './globe.page.html',
  styleUrls: ['./globe.page.scss'],
})
export class GlobePage {
  data: any;

  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data['data'][0]);
      
      this.data = data['data'];
    });
  }
}
