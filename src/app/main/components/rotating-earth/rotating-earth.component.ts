import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { CountriesSelectors } from 'src/app/core/stores/countries/countries.selectors';
import * as topojson from 'topojson-client';

@Component({
  selector: 'jam-rotating-earth',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="rotating-globe"></div>`,
})
export class RotatingEarthComponent implements OnInit {
  @Select(CountriesSelectors.getRotating) globe$: Observable<any>;

  ngOnInit() {
    this.globe$.subscribe((data) => {
      /** Using old world data, located in archive */
      const world = topojson.feature(data, data.objects.countries);
      this.initGlobe(world);
    });
  }

  private initGlobe(data: any): void {
    const parentElement = 'rotating-globe';
    let width = 700;
    const height = 700;
    const sensitivity = 50;

    const projection = d3
      .geoOrthographic()
      .scale(300)
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
      .attr(
        'class',
        (d: any) => 'country_' + d.properties.name.replace(' ', '_')
      )
      .attr('d', path as any)
      .attr('fill', '#09119F')
      .style('stroke', 'black')
      .style('stroke-width', 0.5)
      .style('opacity', 0.8);

    // rotate
    d3.timer(function (elapsed) {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + 5 * k, rotate[1]]);
      path = d3.geoPath().projection(projection);
      svg.selectAll('path').attr('d', path as any);
    }, 200);
  }
}
