import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-rings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rings.component.html',
  styleUrls: ['./rings.component.scss'],
})
export class RingsComponent {
  dataset = [
    { ring: 'inner', title: '', progress: 0.75, color: '#653A73', radius: 87 },
    { ring: 'middle', title: '', progress: 0.75, color: '#FF7049', radius: 49 },
    { ring: 'outer', title: '', progress: 0.75, color: '#20C997', radius: 16 },
  ];
  ngOnInit() {
    this.createD3RingsChart();
  }

  createD3RingsChart() {
    const size = 184;
    const xy = 92;
    const strokeWidth = 10;

    const svg = d3
      .select('figure#rings')
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('fill', 'none');

    const group = svg.selectAll('g').data(this.dataset).enter().append('g');

    const circle = group
      .append('circle')
      .attr('cx', xy)
      .attr('cy', xy)
      .attr('r', (d) => d.radius)
      .attr('stroke', '#F2F3F9')
      .attr('stroke-width', strokeWidth);

    const path = group.append('path');
  }
}
