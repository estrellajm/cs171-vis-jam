import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
  selector: 'jam-radar',
  template: `<div
    #radarContainer
    id="radarDiv"
    class="w-full h-full bg-[#0C1673] flex justify-center items-center"
  ></div>`,
})
export class RadarComponent {
  @ViewChild('radarContainer') globeContainer: ElementRef;

  data: any;
  constructor(
    public dialogRef: MatDialogRef<RadarComponent>,
    @Inject(MAT_DIALOG_DATA) public country: any
  ) {}

  ngAfterViewInit() {
    this.initVis('radarDiv', this.country);
    console.log(this.country);
  }

  margin: any;
  width: any;
  height: any;
  radius: any;
  svg: any;
  angleSlice: any;
  rScale: any;
  initVis(parentElement: string, data: any) {
    let vis = this;
    vis.data = data;

    // Set up dimensions
    vis.margin = { top: 50, right: 50, bottom: 50, left: 50 };
    vis.width =
      this.globeContainer.nativeElement.offsetWidth -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      this.globeContainer.nativeElement.offsetHeight -
      vis.margin.top -
      vis.margin.bottom;
    vis.radius = Math.min(vis.width, vis.height) / 2;

    // Init drawing area
    vis.svg = d3
      .select('#' + parentElement)
      .append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
      .append('g')
      .attr(
        'transform',
        `translate(${vis.margin.left + vis.width / 2}, ${
          vis.margin.top + vis.height / 2
        })`
      );

    vis.svg
      .append('rect')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
      .attr(
        'transform',
        `translate(${-vis.width / 2 - vis.margin.left}, ${
          -vis.height / 2 - vis.margin.top
        })`
      )
      .attr('fill', '#0C1673');

    // Scales and axes
    vis.angleSlice = (Math.PI * 2) / vis.data.length;
    vis.rScale = d3.scaleLinear().range([0, vis.radius]).domain([0, 100]); // Domain should be dynamic based on the data

    vis.createAxes();
    vis.drawRadar();
  }

  createAxes() {
    let vis = this;

    // Create concentric circles
    let levels = 5; // Adjust if needed
    for (let level = 0; level < levels; level++) {
      let r = vis.radius * ((level + 1) / levels);
      vis.svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', r)
        .style('fill', 'none')
        .style('stroke', '#6D72C5')
        .style('stroke-width', '0.5px');
    }
  }

  drawRadar() {
    let vis = this;

    // Radar line generator
    let radarLine = d3
      .lineRadial()
      .radius((d: any) => vis.rScale(d.axisValue))
      .angle((d, i) => i * vis.angleSlice)
      .curve(d3.curveCardinalClosed.tension(0.5));

    // Append the radar area
    vis.svg
      .append('path')
      .datum(vis.data)
      .attr('d', radarLine)
      .style('fill', '#061043')
      .style('fill-opacity', 1)
      .style('stroke', '#25DEA7')
      .style('stroke-width', '7px'); // to ensure the fill works correctly with round corners

    // Draw the outer circle at 100% scale
    vis.svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', vis.rScale(100)) // 100% of the scale
      .style('fill', 'none')
      .style('stroke', '#6D72C5')
      .style('stroke-width', '3px');

    // Draw the axes and labels
    vis.data.forEach((d: any, i: any) => {
      // Calculate the angle of the axis
      let angle = i * vis.angleSlice - Math.PI / 2; // Subtract Math.PI / 2 to start from the top
      let labelFactor = 1.1; // How far out compared to the radius the label should be

      // Append the axis line
      vis.svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', vis.rScale(100) * Math.cos(angle))
        .attr('y2', vis.rScale(100) * Math.sin(angle))
        .style('stroke', 'white')
        .style('opacity', '0.2')
        .style('stroke-width', '1px');

      // Append the label
      vis.svg
        .append('text')
        .attr('class', 'label')
        .attr('x', vis.rScale(100) * labelFactor * Math.cos(angle))
        .attr('y', vis.rScale(100) * labelFactor * Math.sin(angle))
        .attr(
          'text-anchor',
          i === 0 || i === vis.data.length / 2
            ? 'middle'
            : i < vis.data.length / 2
            ? 'start'
            : 'end'
        )
        .text(d.axis)
        .style('fill', 'white')
        .style('font-size', '15px'); // Adjust the font size as needed
    });
    function wrapText(text: any, width: any) {
      text.each(function () {
        let position = +(+d3.select(this).attr('x')).toFixed(5);
        let w = width;
        if (position===0) {
          w = 180
        };
        let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line: any = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr('x'),
          y = text.attr('y'),
          dy = 0, // We will adjust this in the first tspan creation
          tspan: any = text
            .text(null)
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy + 'em');

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dy', ++lineNumber * lineHeight + dy + 'em')
              .text(word);
          }
        }
      });
    }

    // Usage: Pass the selection of text elements and a specified width for wrapping
    vis.svg.selectAll('.label').call(wrapText, 180);
  }
}
