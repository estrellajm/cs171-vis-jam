import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface DateObj {
  Date: Date;
  Amount: number;
}

interface DataSet {
  key: string | number;
  value: number;
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

  clickMe(aaa: any) {
    console.log(`you clicked: ${aaa}`);
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

    let dataset: DataSet[] = [
      { key: '0', value: 5 }, //dataset is now an array of objects.
      { key: '1', value: 10 }, //Each object has a 'key' and a 'value'.
      { key: '2', value: 13 },
      // { key: '3', value: 19 },
      // { key: '4', value: 21 },
      // { key: '5', value: 25 },
      // { key: '6', value: 22 },
      // { key: '7', value: 18 },
      // { key: '8', value: 15 },
      // { key: '9', value: 13 },
      // { key: '10', value: 11 },
      // { key: '11', value: 12 },
      // { key: '12', value: 15 },
      // { key: '13', value: 20 },
      // { key: '14', value: 18 },
      // { key: '15', value: 17 },
      // { key: '16', value: 16 },
      // { key: '17', value: 18 },
      // { key: '18', value: 23 },
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
      return d.key;
    };

    //Create bars
    svg
      .selectAll('rect')
      .data(dataset, key)
      .enter()
      .append('rect')
      .attr('id', (d) => d.key)
      .classed('cursor-pointer', true)
      .attr('x', (d, i: any) => xScale(i)!)
      .attr('y', (d) => h - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(d.value))
      .attr('fill', (d) => `rgb(0, 0, ${Math.round(d.value * 10)})`);

    /** Create labels */
    svg
      .selectAll('text')
      .data(dataset, key)
      .enter()
      .append('text')
      .text((d) => d.value)
      .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
      .attr('y', (d) => h - yScale(d.value) + 14)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '11px')
      .attr('fill', 'white');

    d3.selectAll('rect').on('click', function (ddd: PointerEvent) {
      const key = d3.select(this).attr('id');
      const updatedDataSet = dataset.filter((ds) => ds.key !== key);
      deleteData(updatedDataSet);
    });

    /** BUG: Rapid Click bug creates phantom elements */
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
        .attr('id', (d) => d.key)
        .classed('cursor-pointer', true)
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
        .attr('text-anchor', 'middle')
        .text((d) => d.value)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .merge(barTexts as any)
        .transition()
        .duration(500)
        .text((d) => d.value)
        .attr('x', (d, i: any) => xScale(i)! + xScale.bandwidth() / 2)
        .attr('y', (d) => h - yScale(d.value) + 14);

      d3.selectAll('rect').on('click', function (ddd: PointerEvent) {
        const key = d3.select(this).attr('id');
        const updatedDataSet = dataset.filter((ds) => ds.key !== key);
        deleteData(updatedDataSet);
      });
    });

    d3.select('div#deleteData').on('click', (dd) => {
      dataset.shift();
      deleteData(dataset);
    });

    function deleteData(targetData: DataSet[]) {
      dataset = targetData;

      xScale.domain(d3.range(targetData.length) as any);
      yScale.domain([0, d3.max(targetData, (d) => d.value)] as any);
      //Select…
      const bars = svg
        .selectAll('rect') //Select all bars
        .data(targetData, key); //Re-bind data to existing bars, return the 'update' selection
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
        .data(targetData, key); //Re-bind data to existing bars, return the 'update' selection
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
        .attr('x', -xScale.bandwidth())
        .remove();
    }
  }
}
