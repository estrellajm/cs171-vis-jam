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
    25, 7, 5, 26, 11, 8, 25, 14, 23, 19, 14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
    24, 18, 25, 9, 3,
  ];
  ngOnInit() {
    this.genRandomDataSet(20);
  }

  genRandomDataSet(n: number) {
    this.dataset = [...Array(n).keys()].map(() =>
      Math.floor(Math.random() * 100)
    );
    this.createD3();
  }
  createD3() {
    d3.select('figure#wiring')
      .selectAll('div')
      .data(this.dataset)
      .enter()
      .append('div')
      .attr('class', 'bar')
      .style('height', (d) => `${d * 5}px`);
    // .text((d) => d);
  }

  processData = (d: any) => {
    console.log(d);

    return `Yesh! ${d}`;
  };
}
