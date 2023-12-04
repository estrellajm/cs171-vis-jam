import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'jam-rotating-earth',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="rotating-globe"></div>`,
})
export class RotatingEarthComponent implements OnInit {
  ngOnInit() {
    d3.json('assets/archive/world.json').then((data: any) => {
      const world = topojson.feature(data, data.objects.countries);
      this.initGlobe('rotating-globe', world);
    });
  }

  private initGlobe(parentElement: string, data: any): void {
    let width = 500;
    const height = 500;

    const projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, 0])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

    const svg = d3
      .select(`#${parentElement}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const globe = svg
      .append('circle')
      .attr('fill', '#070b5d')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

    let map = svg.append('g');

    map
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', (d: any) => 'country_' + d.properties.name.replace(' ', '_'))
      .attr('d', path as any)
      .attr('fill', '#09119F')
      .style('stroke', 'black')
      .style('stroke-width', 0.5)
      .style('opacity', 0.8);

    // rotate
    /** BUG: Code below is causing '[Violation] 'setTimeout' handler took 66ms' */
    // d3.timer(function (elapsed) {
    //   const rotate = projection.rotate();
    //   const k = sensitivity / projection.scale();
    //   projection.rotate([rotate[0] + 1 * k, rotate[1]]);
    //   path = d3.geoPath().projection(projection);
    //   svg.selectAll('path').attr('d', path as any);
    // }, 200);
  }
}
