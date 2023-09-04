import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface DateObj {
  Date: Date;
  Amount: number;
}

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent {
  ngOnInit() {
    this.updatedNewD3BarChart();
  }

  updatedNewD3BarChart() {
    const w = 600;
    const h = 250;
    const barPadding = 1;

    const genRandomDataSet = (n: number, maxNumber: number = 100) => {
      return [...Array(n).keys()].map(() =>
        Math.floor(Math.random() * maxNumber)
      );
    };

    let dataset = [
      { key: 0, value: 5 }, //dataset is now an array of objects.
      { key: 1, value: 10 }, //Each object has a 'key' and a 'value'.
      { key: 2, value: 13 },
      { key: 3, value: 19 },
      { key: 4, value: 21 },
      { key: 5, value: 25 },
      { key: 6, value: 22 },
      { key: 7, value: 18 },
      { key: 8, value: 15 },
      { key: 9, value: 13 },
      { key: 10, value: 11 },
      { key: 11, value: 12 },
      { key: 12, value: 15 },
      { key: 13, value: 20 },
      { key: 14, value: 18 },
      { key: 15, value: 17 },
      { key: 16, value: 16 },
      { key: 17, value: 18 },
      { key: 18, value: 23 },
      { key: 'ee', value: 25 },
    ];
    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length) as unknown as string)
      .rangeRound([0, w])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.value)!])
      .range([0, h]);

    const svg = d3
      .select('figure#wiring')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const key = (d: any) => {
      return d.key
    }

    //Create bars
    svg
      .selectAll('rect')
      .data(dataset, key)
      .enter()
      .append('rect')
      .attr('x', (d, i: any) => xScale(i)!)
      .attr('y', (d) => h - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(d.value))
      .attr('fill', (d) => `rgb(0, 0, ${Math.round(d.value * 10)})`);

    //Create labels
    svg
      .selectAll('text')
      .data(dataset, key)
      .enter()
      .append('text')
      .text((d) => d.value)
      .attr('text-anchor', 'middle')
      .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
      .attr('y', (d) => h - yScale(d.value) + 14)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', 'white');

    d3.select('div#addMoreData').on('click', (dd) => {
      const maxValue = 25;
      const randMaxValue = Math.floor(Math.random() * maxValue);
      dataset.push({ key: `${randMaxValue}eee`, value: randMaxValue });

      xScale.domain(d3.range(dataset.length) as any);
      yScale.domain([0, d3.max(dataset, (d) => d.value)] as any);
      //Select…
      const bars = svg
        .selectAll('rect') //Select all bars
        .data(dataset, key); //Re-bind data to existing bars, return the 'update' selection
      //'bars' is now the update selection

      bars
        .enter() //References the enter selection (a subset of the update selection)
        .append('rect') //Creates a new rect
        .attr('x', w) //Sets the initial x position of the rect beyond the far right edge of the SVG
        .attr('y', (d) => h - yScale(d.value)) //Sets the y value, based on the updated yScale
        .attr('width', xScale.bandwidth()) //Sets the width value, based on the updated xScale
        .attr('height', (d) => yScale(d.value)) //Sets the height value, based on the updated yScale
        .attr('fill', (d) => `rgb(0, 0, ${Math.round(d.value * 10)})`) //Sets the fill value
        .merge(bars as any) //Merges the enter selection with the update selection
        .transition() //Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr('x', (d, i: any) => xScale(i)!)
        .attr('y', (d) => h - yScale(d.value)) //Set new y position, based on the updated yScale
        .attr('width', xScale.bandwidth()) //Set new width value, based on the updated xScale
        .attr('height', (d) => yScale(d.value)); //Set new height value, based on the updated yScale

      const barTexts = svg
        .selectAll('text') //Select all bars
        .data(dataset, key); //Re-bind data to existing bars, return the 'update' selection
      //'bars' is now the update selection

      barTexts
        .enter()
        .append('text')
        .attr('x', w)
        .attr('y', (d) => h - yScale(d.value) + 14)
        .text((d) => d.value)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .merge(barTexts as any)
        .transition()
        .duration(500)
        .text((d) => d.value)
        .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
        .attr('y', (d) => h - yScale(d.value) + 14);
    });

    d3.select('div#deleteData').on('click', (dd) => {
      dataset.shift();

      xScale.domain(d3.range(dataset.length) as any);
      yScale.domain([0, d3.max(dataset, (d) => d.value)] as any);
      //Select…
      const bars = svg
        .selectAll('rect') //Select all bars
        .data(dataset, key); //Re-bind data to existing bars, return the 'update' selection
      //'bars' is now the update selection

      bars
        .enter() //References the enter selection (a subset of the update selection)
        .append('rect') //Creates a new rect
        .attr('x', w) //Sets the initial x position of the rect beyond the far right edge of the SVG
        .attr('y', (d) => h - yScale(d.value)) //Sets the y value, based on the updated yScale
        .attr('width', xScale.bandwidth()) //Sets the width value, based on the updated xScale
        .attr('height', (d) => yScale(d.value)) //Sets the height value, based on the updated yScale
        .attr('fill', (d) => `rgb(0, 0, ${Math.round(d.value * 10)})`) //Sets the fill value
        .merge(bars as any) //Merges the enter selection with the update selection
        .transition() //Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr('x', (d, i: any) => xScale(i)!)
        .attr('y', (d) => h - yScale(d.value)) //Set new y position, based on the updated yScale
        .attr('width', xScale.bandwidth()) //Set new width value, based on the updated xScale
        .attr('height', (d) => yScale(d.value)); //Set new height value, based on the updated yScale

      const barTexts = svg
        .selectAll('text') //Select all bars
        .data(dataset, key); //Re-bind data to existing bars, return the 'update' selection
      //'bars' is now the update selection

      barTexts
        .enter()
        .append('text')
        .attr('x', w)
        .attr('y', (d) => h - yScale(d.value) + 14)
        .text((d) => d.value)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .merge(barTexts as any)
        .transition()
        .duration(500)
        .text((d) => d.value)
        .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
        .attr('y', (d) => h - yScale(d.value) + 14);

      bars
        .exit() //References the enter selection (a subset of the update selection)
        .transition() //Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr('x', -xScale.bandwidth())
        .remove();
      barTexts
        .exit() //References the enter selection (a subset of the update selection)
        .transition() //Initiate a transition on all elements in the update selection (all rects)
        .duration(500)
        .attr('x',  -xScale.bandwidth())
        .remove();
    });
  }

  // updatedNewD3BarChart() {
  //   const w = 600;
  //   const h = 250;
  //   const barPadding = 1;

  //   const genRandomDataSet = (n: number, maxNumber: number = 100) => {
  //     return [...Array(n).keys()].map(() =>
  //       Math.floor(Math.random() * maxNumber)
  //     );
  //   };

  //   let dataset = [
  //     5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23,
  //     25,
  //   ];

  //   const xScale = d3
  //     .scaleBand()
  //     .domain(d3.range(dataset.length) as unknown as string)
  //     .rangeRound([0, w])
  //     .paddingInner(0.05);

  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(dataset)!])
  //     .range([0, h]);

  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   //Create bars
  //   svg
  //     .selectAll('rect')
  //     .data(dataset)
  //     .enter()
  //     .append('rect')
  //     .attr('x', (d, i: any) => xScale(i)!)
  //     .attr('y', (d) => h - yScale(d))
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', (d) => yScale(d))
  //     .attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`);

  //   //Create labels
  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d) => d)
  //     .attr('text-anchor', 'middle')
  //     .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
  //     .attr('y', (d) => h - yScale(d) + 14)
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', 'white');

  //   d3.select('div#addMoreData').on('click', (dd) => {
  //     const maxValue = 25;
  //     const randMaxValue = Math.floor(Math.random() * maxValue);
  //     dataset.push(randMaxValue);

  //     xScale.domain(d3.range(dataset.length) as any);
  //     yScale.domain([0, d3.max(dataset)] as any);
  //     //Select…
  //     const bars = svg
  //       .selectAll('rect') //Select all bars
  //       .data(dataset); //Re-bind data to existing bars, return the 'update' selection
  //     //'bars' is now the update selection

  //     bars
  //       .enter() //References the enter selection (a subset of the update selection)
  //       .append('rect') //Creates a new rect
  //       .attr('x', w) //Sets the initial x position of the rect beyond the far right edge of the SVG
  //       .attr('y', (d) => h - yScale(d)) //Sets the y value, based on the updated yScale
  //       .attr('width', xScale.bandwidth()) //Sets the width value, based on the updated xScale
  //       .attr('height', (d) => yScale(d)) //Sets the height value, based on the updated yScale
  //       .attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`) //Sets the fill value
  //       .merge(bars as any) //Merges the enter selection with the update selection
  //       .transition() //Initiate a transition on all elements in the update selection (all rects)
  //       .duration(500)
  //       .attr('x', (d, i: any) => xScale(i)!)
  //       .attr('y', (d) => h - yScale(d)) //Set new y position, based on the updated yScale
  //       .attr('width', xScale.bandwidth()) //Set new width value, based on the updated xScale
  //       .attr('height', (d) => yScale(d)); //Set new height value, based on the updated yScale

  //     const barTexts = svg
  //       .selectAll('text') //Select all bars
  //       .data(dataset); //Re-bind data to existing bars, return the 'update' selection
  //     //'bars' is now the update selection

  //     barTexts
  //       .enter()
  //       .append('text')
  //       .attr('x', w)
  //       .attr('y', (d) => h - yScale(d) + 14)
  //       .text((d) => d)
  //       .attr('text-anchor', 'middle')
  //       .attr('font-family', 'sans-serif')
  //       .attr('font-size', '11px')
  //       .attr('fill', 'white')
  //       .merge(barTexts as any)
  //       .transition()
  //       .duration(500)
  //       .text((d) => d)
  //       .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
  //       .attr('y', (d) => h - yScale(d) + 14);
  //   });

  //   d3.select('div#deleteData').on('click', (dd) => {
  //     dataset.pop();

  //     xScale.domain(d3.range(dataset.length) as any);
  //     yScale.domain([0, d3.max(dataset)] as any);
  //     //Select…
  //     const bars = svg
  //       .selectAll('rect') //Select all bars
  //       .data(dataset); //Re-bind data to existing bars, return the 'update' selection
  //     //'bars' is now the update selection

  //     bars
  //       .enter() //References the enter selection (a subset of the update selection)
  //       .append('rect') //Creates a new rect
  //       .attr('x', w) //Sets the initial x position of the rect beyond the far right edge of the SVG
  //       .attr('y', (d) => h - yScale(d)) //Sets the y value, based on the updated yScale
  //       .attr('width', xScale.bandwidth()) //Sets the width value, based on the updated xScale
  //       .attr('height', (d) => yScale(d)) //Sets the height value, based on the updated yScale
  //       .attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`) //Sets the fill value
  //       .merge(bars as any) //Merges the enter selection with the update selection
  //       .transition() //Initiate a transition on all elements in the update selection (all rects)
  //       .duration(500)
  //       .attr('x', (d, i: any) => xScale(i)!)
  //       .attr('y', (d) => h - yScale(d)) //Set new y position, based on the updated yScale
  //       .attr('width', xScale.bandwidth()) //Set new width value, based on the updated xScale
  //       .attr('height', (d) => yScale(d)); //Set new height value, based on the updated yScale

  //     const barTexts = svg
  //       .selectAll('text') //Select all bars
  //       .data(dataset); //Re-bind data to existing bars, return the 'update' selection
  //     //'bars' is now the update selection

  //     barTexts
  //       .enter()
  //       .append('text')
  //       .attr('x', w)
  //       .attr('y', (d) => h - yScale(d) + 14)
  //       .text((d) => d)
  //       .attr('text-anchor', 'middle')
  //       .attr('font-family', 'sans-serif')
  //       .attr('font-size', '11px')
  //       .attr('fill', 'white')
  //       .merge(barTexts as any)
  //       .transition()
  //       .duration(500)
  //       .text((d) => d)
  //       .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
  //       .attr('y', (d) => h - yScale(d) + 14);

  //     bars
  //       .exit() //References the enter selection (a subset of the update selection)
  //       .transition() //Initiate a transition on all elements in the update selection (all rects)
  //       .duration(500)
  //       .attr('x', w)
  //       .remove();
  //     barTexts
  //       .exit() //References the enter selection (a subset of the update selection)
  //       .transition() //Initiate a transition on all elements in the update selection (all rects)
  //       .duration(500)
  //       .attr('x', w)
  //       .remove();

  //     // const barTexts = svg
  //     //   .selectAll('text') //Select all bars
  //     //   .data(dataset); //Re-bind data to existing bars, return the 'update' selection
  //     // //'bars' is now the update selection

  //     // barTexts
  //     //   .exit() //References the enter selection (a subset of the update selection)
  //     //   .transition() //Initiate a transition on all elements in the update selection (all rects)
  //     //   .duration(500)
  //     //   .attr('x', w)
  //     //   .remove();
  //   });
  // }

  // d3ScatterPlotScalesWithAxis() {
  //   const genRandomCoordinates = (n: number, maxNumber: number = 1000) => {
  //     return [...Array(n).keys()].map(() => [
  //       Math.floor(Math.random() * maxNumber),
  //       Math.floor(Math.random() * maxNumber),
  //     ]);
  //   };
  //   let dataset = genRandomCoordinates(50);

  //   const w = 500;
  //   const h = 300;
  //   const padding = 40;

  //   const xMax = d3.max(dataset, (d) => d[0])!;
  //   const xScale = d3
  //     .scaleLinear()
  //     .domain([0, xMax])
  //     .range([padding, w - padding * 2]);
  //   const yMax = d3.max(dataset, (d) => d[1])!;
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([0, yMax])
  //     .range([h - padding, padding]);

  //   const xAxis = d3.axisBottom(xScale).ticks(5);
  //   const yAxis = d3.axisLeft(yScale).ticks(5);

  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   //Define clipping path
  //   svg
  //     .append('clipPath')
  //     .attr('id', 'chart-area')
  //     .append('rect')
  //     .attr('x', padding)
  //     .attr('y', padding)
  //     .attr('width', w - padding * 3)
  //     .attr('height', h - padding * 2);

  //   const grayLines = svg
  //     .selectAll('line')
  //     .data(dataset)
  //     .enter()
  //     .append('line')
  //     .attr('x1', (d: any) => xScale(d[0]))
  //     .attr('x2', (d: any) => xScale(d[0]))
  //     .attr('y1', h - padding)
  //     .attr('y2', (d: any) => yScale(d[1]))
  //     .attr('stroke', '#ddd')
  //     .attr('stroke-width', 1);

  //   //Create circles
  //   svg
  //     .append('g')
  //     .attr('id', 'circles')
  //     .attr('clip-path', 'url(#chart-area)')
  //     .selectAll('circle')
  //     .data(dataset)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (d) => xScale(d[0]))
  //     .attr('cy', (d) => yScale(d[1]))
  //     .attr('r', 2);

  //   /** X Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'x axis')
  //     .attr('transform', `translate(0, ${h - padding})`)
  //     .call(xAxis);

  //   /** Y Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'y axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis);

  //   d3.select('figure#wiring').on('click', (dd) => {
  //     /** New values for dataset */
  //     dataset = genRandomCoordinates(50, Math.floor(Math.random() * 1000));

  //     //Update scale domains
  //     xScale.domain([0, d3.max(dataset, (d) => d[0])!]);
  //     yScale.domain([0, d3.max(dataset, (d) => d[1])!]);

  //     svg
  //       .selectAll('circle')
  //       .data(dataset)
  //       .transition()
  //       .duration(800)
  //       /** to use 'this' you MUST use the traditional
  //        *  'function() {}' not the fat arrow '() => {}'  */
  //       .on('start', function () {
  //         d3.select(this).attr('fill', 'magenta').attr('r', 7);
  //       })
  //       .delay((d, i) => (i / dataset.length) * 50)
  //       .attr('cx', (d) => xScale(d[0]))
  //       .attr('cy', (d) => yScale(d[1]))
  //       .transition()
  //       .duration(400)
  //       .attr('fill', 'black')
  //       .attr('r', 2);

  //     grayLines
  //       .data(dataset)
  //       .transition()
  //       .duration(1000)
  //       .attr('x1', (d: any) => xScale(d[0]))
  //       .attr('x2', (d: any) => xScale(d[0]))
  //       .attr('y1', h - padding)
  //       .attr('y2', (d: any) => yScale(d[1]));
  //     svg
  //       .select('.x.axis')
  //       .transition()
  //       .duration(1000)
  //       .call(xAxis as any);
  //     svg
  //       .select('.y.axis')
  //       .transition()
  //       .duration(1000)
  //       .call(yAxis as any);

  //     svg
  //       .append('clipPath')
  //       .attr('id', 'chart-area')
  //       .append('rect')
  //       .attr('x', padding)
  //       .attr('y', padding)
  //       .attr('width', w - padding * 3)
  //       .attr('height', h - padding * 2);
  //   });
  // }

  // genRandomDataSet(n: number, maxNumber: number = 100) {
  //   return [...Array(n).keys()].map(() =>
  //     Math.floor(Math.random() * maxNumber)
  //   );
  // }

  // updatedNewD3BarChart() {
  //   const w = 600;
  //   const h = 250;
  //   const barPadding = 1;

  //   let dataset = [
  //     5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23,
  //     25,
  //   ];

  //   const xScale = d3
  //     .scaleBand()
  //     .domain(d3.range(dataset.length) as unknown as string)
  //     .rangeRound([0, w])
  //     .paddingInner(0.05);

  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(dataset)!])
  //     .range([0, h]);

  //   const svg = d3
  //     .select('figure#wiring')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   //Create bars
  //   svg
  //     .selectAll('rect')
  //     .data(dataset)
  //     .enter()
  //     .append('rect')
  //     .attr('x', (d, i: any) => xScale(i)!)
  //     .attr('y', (d) => h - yScale(d))
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', (d) => yScale(d))
  //     .attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`);

  //   //Create labels
  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d) => d)
  //     .attr('text-anchor', 'middle')
  //     .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
  //     .attr('y', (d) => h - yScale(d) + 14)
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', 'white');

  //   d3.select('body').on('click', (dd) => {
  //     /** instead of 'click' above you can use 'keyup' */

  //     const randMaxValue = Math.floor(Math.random() * 50);

  //     //New values for dataset
  //     dataset = this.genRandomDataSet(20);
  //     const dur = 750;
  //     const xScale = d3
  //       .scaleBand()
  //       .domain(d3.range(dataset.length) as unknown as string)
  //       .rangeRound([0, w])
  //       .paddingInner(0.05);

  //     yScale.domain([0, d3.max(dataset)!]);

  //     //Update all rects
  //     svg
  //       .selectAll('rect')
  //       .data(dataset)
  //       .transition()
  //       .delay((d, i) => (i / dataset.length) * 50)
  //       .duration(dur)
  //       .ease(d3.easeBounce)
  //       .attr('y', (d) => h - yScale(d))
  //       .attr('height', (d) => yScale(d))
  //       .attr('fill', (d) => `rgb(0, 0, ${Math.round(d * 10)})`);

  //     svg
  //       .selectAll('text')
  //       .data(dataset)
  //       .transition()
  //       .delay((d, i) => (i / dataset.length) * 50)
  //       .duration(dur)
  //       .ease(d3.easeBounce)
  //       .text((d) => d)
  //       .attr('y', (d) => h - yScale(d) + (d < 10 ? -2 : +14))
  //       .attr('font-size', (d) => (d < 10 ? '12px' : '11px'))
  //       .attr('fill', (d) => (d < 10 ? 'black' : 'white'));
  //   });
  // }

  // async d3TimeScalesPrettied() {
  //   //Width and height
  //   let w = 500;
  //   let h = 300;
  //   let padding = 40;

  //   let dataset: any, xScale: any, yScale: any; //Empty, for now

  //   //For converting strings to Dates
  //   let parseTime = d3.timeParse('%m/%d/%y');

  //   //For converting Dates to strings
  //   let formatTime = d3.timeFormat('%e');

  //   //Function for converting CSV values from strings to Dates and numbers
  //   const rowConverter = (d: any) => {
  //     return {
  //       Date: parseTime(d.Date),
  //       Amount: parseInt(d.Amount),
  //     };
  //   };

  //   const arrConverter = (arr: any[]) => {
  //     return arr.map(rowConverter);
  //   };

  //   /** Load in the data */
  //   const importedData: DateObj[] = (await d3
  //     .csv('assets/time_scale_data.csv')
  //     .then(arrConverter)) as DateObj[];

  //   // dataset = aaa.filter(Boolean)
  //   function isString(value: any) {
  //     // console.log(value.Date);
  //     // console.log(value.Amount);

  //     if (!value.Date) null;
  //     return value;
  //   }
  //   dataset = importedData;

  //   //Discover start and end dates in dataset
  //   var startDate = d3.min(dataset, (d: DateObj) => d.Date);
  //   var endDate = d3.max(dataset, (d: DateObj) => d.Date);

  //   const xMax = d3.max(dataset, (d: DateObj) => d.Date);
  //   const xMin = d3.min(dataset, (d: DateObj) => d.Date);
  //   xScale = d3
  //     .scaleLinear()
  //     .domain([
  //       d3.timeDay.offset(startDate!, -1), //startDate minus one day, for padding
  //       d3.timeDay.offset(endDate!, 1),
  //     ])
  //     .range([padding, w - padding]);

  //   const yMax = d3.max(dataset, (d: DateObj) => d.Amount);
  //   const yMin = d3.min(dataset, (d: DateObj) => d.Amount);
  //   yScale = d3
  //     .scaleLinear()
  //     .domain([0, yMax!])
  //     .range([h - padding, padding]);

  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .scale(xScale)
  //     .ticks(9)
  //     .tickFormat((d: any) => formatTime(d));
  //   const yAxis = d3.axisLeft(yScale).ticks(4);

  //   /** Create SVG element */ let svg = d3
  //     .select('body')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   //Generate guide gray lines
  //   svg
  //     .selectAll('line')
  //     .data(dataset)
  //     .enter()
  //     .append('line')
  //     .attr('x1', (d: any) => xScale(d.Date))
  //     .attr('x2', (d: any) => xScale(d.Date))
  //     .attr('y1', h - padding)
  //     .attr('y2', (d: any) => yScale(d.Amount))
  //     .attr('stroke', '#ddd')
  //     .attr('stroke-width', 1);

  //   //Generate circles last, so they appear in front
  //   svg
  //     .selectAll('circle')
  //     .data(dataset)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (d: any) => xScale(d.Date))
  //     .attr('cy', (d: any) => yScale(d.Amount))
  //     .attr('r', 2);

  //   /** X Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(0, ${h - padding})`)
  //     .call(xAxis);

  //   /** Y Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis);
  // }

  // /** D3 Scatter Plot Scales With Axis */
  // d3ScatterPlotScalesWithAxis() {
  //   const genRandomCoordinates = (n: number) => {
  //     return [...Array(n).keys()].map(() => [
  //       Math.floor(Math.random() * 1000),
  //       Math.floor(Math.random() * 1000),
  //     ]);
  //   };
  //   const dataset = genRandomCoordinates(50);

  //   const w = 500;
  //   const h = 300;
  //   const padding = 40;

  //   const xMax = d3.max(dataset, (d) => d[0])!;
  //   const xScale = d3
  //     .scaleLinear()
  //     .domain([0, xMax])
  //     .range([padding, w - padding * 2]);
  //   const yMax = d3.max(dataset, (d) => d[1])!;
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([0, yMax])
  //     .range([h - padding, padding]);
  //   const aScale = d3.scaleSqrt().domain([0, yMax]).range([0, 10]);

  //   // const formatAsPercentage = d3.format('.1%');
  //   // const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(formatAsPercentage);
  //   const xAxis = d3.axisBottom(xScale).ticks(5);
  //   const yAxis = d3.axisLeft(yScale).ticks(4);

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
  //     .attr('cx', (d) => xScale(d[0]))
  //     .attr('cy', (d) => yScale(d[1]))
  //     .attr('r', (d) => aScale(d[1]));

  //   /** X Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(0, ${h - padding})`)
  //     .call(xAxis);

  //   /** Y Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis);
  // }

  // async d3TimeScales() {
  //   //Width and height
  //   let w = 500;
  //   let h = 300;
  //   let padding = 40;

  //   let dataset: any, xScale: any, yScale: any; //Empty, for now

  //   //For converting strings to Dates
  //   let parseTime = d3.timeParse('%m/%d/%y');

  //   //For converting Dates to strings
  //   let formatTime = d3.timeFormat('%b %e');

  //   //Function for converting CSV values from strings to Dates and numbers
  //   const rowConverter = (d: any) => {
  //     return {
  //       Date: parseTime(d.Date),
  //       Amount: parseInt(d.Amount),
  //     };
  //   };

  //   const arrConverter = (arr: any[]) => {
  //     return arr.map(rowConverter);
  //   };

  //   /** Load in the data */
  //   const importedData: DateObj[] = (await d3
  //     .csv('assets/time_scale_data.csv')
  //     .then(arrConverter)) as DateObj[];

  //   // dataset = aaa.filter(Boolean)
  //   function isString(value: any) {
  //     // console.log(value.Date);
  //     // console.log(value.Amount);

  //     if (!value.Date) null;
  //     return value;
  //   }
  //   dataset = importedData;

  //   const xMax = d3.max(dataset, (d: DateObj) => d.Date);
  //   const xMin = d3.min(dataset, (d: DateObj) => d.Date);
  //   xScale = d3
  //     .scaleLinear()
  //     .domain([xMin!, xMax!])
  //     .range([padding, w - padding]);

  //   const yMax = d3.max(dataset, (d: DateObj) => d.Amount);
  //   const yMin = d3.min(dataset, (d: DateObj) => d.Amount);
  //   yScale = d3
  //     .scaleLinear()
  //     .domain([yMin!, yMax!])
  //     .range([h - padding, padding]);

  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .scale(xScale)
  //     .ticks(4)
  //     .tickFormat((d: any) => formatTime(d));
  //   const yAxis = d3.axisLeft(yScale).ticks(4);

  //   /** Create SVG element */ let svg = d3
  //     .select('body')
  //     .append('svg')
  //     .attr('width', w)
  //     .attr('height', h);

  //   /** Generate date labels first, so they are in back */
  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d: any) => formatTime(d.Date))
  //     .attr('x', (d: any) => xScale(d.Date) + 4)
  //     .attr('y', (d: any) => yScale(d.Amount) + 4)
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', '#bbb');

  //   /** Generate circles last, so they appear in front */
  //   svg
  //     .selectAll('circle')
  //     .data(dataset)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (d: any) => xScale(d.Date))
  //     .attr('cy', (d: any) => yScale(d.Amount))
  //     .attr('r', 2);

  //   /** X Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(0, ${h - padding})`)
  //     .call(xAxis);

  //   /** Y Axis Bar */
  //   svg
  //     .append('g')
  //     .attr('class', 'axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis);
  // }

  // /** D3 Scales Works */
  // d3ScatterPlotScales() {
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
  //     [600, 150],
  //   ];

  //   const w = 500;
  //   const h = 300;
  //   const padding = 40;

  //   const xMax = d3.max(dataset, (d) => d[0])!;
  //   const xScale = d3.scaleLinear().domain([0, xMax]).range([padding, w - padding * 2]);
  //   const yMax = d3.max(dataset, (d) => d[1])!;
  //   const yScale = d3.scaleLinear().domain([0, yMax]).range([h - padding, padding]);
  //   const rMax = d3.max(dataset, (d) => d[1])!;
  //   const rScale = d3.scaleLinear().domain([0, yMax]).range([2, 5]);
  //   const aMax = d3.max(dataset, (d) => d[1])!;
  //   const aScale = d3.scaleSqrt().domain([0, yMax]).range([0, 10]);

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
  //     .attr('cx', (d) => xScale(d[0]))
  //     .attr('cy', (d) => yScale(d[1]))
  //     .attr('r', (d) => aScale(d[1]));

  //   svg
  //     .selectAll('text')
  //     .data(dataset)
  //     .enter()
  //     .append('text')
  //     .text((d) => `${d[0]}, ${d[1]}`)

  //     .attr('x', (d) => xScale(d[0]))
  //     .attr('y', (d) => yScale(d[1]))
  //     .attr('font-family', 'sans-serif')
  //     .attr('font-size', '11px')
  //     .attr('fill', 'red');

  // }

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
