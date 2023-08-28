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
  ngOnInit() {
    this.deScales();
  }

  deScales() {
    const dataset = [
      [5, 20],
      [480, 90],
      [250, 50],
      [100, 33],
      [330, 95],
      [410, 12],
      [475, 44],
      [25, 67],
      [85, 21],
      [220, 88],
      [600, 150],
    ];

    const w = 1000;
    const h = 300;
    const padding = 20;

    // const scale = (axis: 'x' | 'y') => {
    //   if (axis === 'x') {
    //     const max = d3.max(dataset, (d) => d[0])!;
    //     return d3.scaleLinear().domain([0, max]).range([10, w]);
    //   }
    //   if (axis === 'y') {
    //     const max = d3.max(dataset, (d) => d[1])!;
    //     return d3.scaleLinear().domain([0, max]).range([10, h]);
    //   }
    //   return d3.scaleLinear().domain([0, 100]).range([10, h]);
    // };
    const xMax = d3.max(dataset, (d) => d[0])!;
    const xScale = d3.scaleLinear().domain([0, xMax]).range([padding, w - padding * 2 - 3]);
    const yMax = d3.max(dataset, (d) => d[1])!;
    const yScale = d3.scaleLinear().domain([0, yMax]).range([h - padding, padding]);
    const rMax = d3.max(dataset, (d) => d[1])!;
    const rScale = d3.scaleLinear().domain([0, yMax]).range([2, 5]);
    const aMax = d3.max(dataset, (d) => d[1])!;
    const aScale = d3.scaleSqrt().domain([0, yMax]).range([0, 10]);

    const svg = d3
      .select('figure#wiring')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d[0]))
      .attr('cy', (d) => yScale(d[1]))
      .attr('r', (d) => aScale(d[1]));

    svg
      .selectAll('text')
      .data(dataset)
      .enter()
      .append('text')
      .text((d) => `${d[0]}, ${d[1]}`)

      .attr('x', (d) => xScale(d[0]))
      .attr('y', (d) => yScale(d[1]))
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', 'red');


      
  }

  // d3ScatterPlot() {
  //   const dataset = [
  //     [5, 20],
  //     [480, 90],
  //     [250, 50],
  //     [100, 33],
  //     [330, 95],
  //     [410, 12],
  //     [475, 44],
  //     [25, 67],
  //     [85, 21],
  //     [220, 88],
  //   ];

  //   const w = 500;
  //   const h = 100;

  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   svg
  //     .selectAll('circle')
  //     .data(dataset)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (d) => d[0])
  //     .attr('cy', (d) => d[1])
  //     .attr('r', (d) => Math.sqrt(h - d[1]));

  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d) => `${d[0]}, ${d[1]}`)
  //     .attr('x', (d) => d[0])
  //     .attr('y', (d) => d[1])
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', 'red');
  // }

  // createNewD3BarChart() {
  //   const w = 500;
  //   const h = 100;
  //   const barPadding = 1;

  //   const dataset = [
  //     5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23,
  //   ];
  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   svg
  //     .selectAll('rect')
  //     .data(dataset)
  //     .enter()
  //     .append('rect')
  //     .attr('x', (d, i) => i * (w / dataset.length))
  //     .attr('y', (d) => h - d * 4)
  //     .attr('width', w / dataset.length - barPadding)
  //     .attr('height', (d) => d * 4)
  //     .attr('fill', (d) => `rgb(0,0,${Math.round(d * 10)})`);

  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d) => d)
  //     .attr(
  //       'x',
  //       (d, i) =>
  //         i * (w / dataset.length) + (w / dataset.length - barPadding) / 2
  //     )
  //     // .attr('y', (d) => h - d * 4 + 14) // anchor text - top of bar
  //     .attr('y', h - 5)
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', 'white')
  //     .attr('text-anchor', 'middle');
  // }

  // createD3Circles() {
  //   const h = 100;
  //   const w = 1000;

  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('height', h)
  //     .attr('width', w);

  //   const circles = svg
  //     .selectAll('circle')
  //     .data(this.dataset)
  //     .enter()
  //     .append('circle');

  //   circles
  //     .attr('cx', (d, i) => {
  //       return i * 50 + 25;
  //     })
  //     .attr('cy', h / 2)
  //     .attr('r', (d) => d)
  //     .attr('fill', 'yellow')
  //     .attr('stroke', 'orange')
  //     .attr('stroke-width', (d) => d / 2);
  // }

  // createD3BarChart() {
  //   d3.select('figure#wiring')
  //     .selectAll('div')
  //     .data(this.dataset)
  //     .enter()
  //     .append('div')
  //     .attr('class', 'bar')
  //     .style('height', (d) => `${d * 5}px`)
  //     .text(this.processData);
  // }
  // genRandomDataSet(n: number) {
  //   this.dataset = [...Array(n).keys()].map(() =>
  //     Math.floor(Math.random() * 100)
  //   );
  //   this.createD3BarChart();
  // }
  // processData = (d: any) => {
  //   return `Yesh! ${d}`;
  // };
}
