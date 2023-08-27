import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent {
  dataset = [
    5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23,
  ];
  ngOnInit() {
    this.createD3();
  }

  createD3() {
    const h = 100;
    const w = 1000;

    const svg = d3
      .select('figure#wiring')
      .append('svg')
      .attr('height', h)
      .attr('width', w);

    const circles = svg
      .selectAll('circle')
      .data(this.dataset)
      .enter()
      .append('circle');

    circles
      .attr('cx', (d, i) => {
        return i * 50 + 25;
      })
      .attr('cy', h / 2)
      .attr('r', (d) => d)
      .attr('fill', 'yellow')
      .attr('stroke', 'orange')
      .attr('stroke-width', (d) => d / 2);
  }

  createD3BarChart() {
    d3.select('figure#wiring')
      .selectAll('div')
      .data(this.dataset)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style('height', (d) => `${d * 5}px`)
      .text(this.processData);
  }
  genRandomDataSet(n: number) {
    this.dataset = [...Array(n).keys()].map(() =>
      Math.floor(Math.random() * 100)
    );
    this.createD3BarChart();
  }
  processData = (d: any) => {
    return `Yesh! ${d}`;
  };
}
