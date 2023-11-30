import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface DateObj {
  Date: Date;
  Amount: number;
}

interface DataSet {
  key: string | number;
  value: number;
}

@Component({
  selector: 'app-rotating-earth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rotating-earth.component.html',
  styleUrls: ['./rotating-earth.component.scss'],
})
export class RotatingEarthComponent {
  sortDataFunc: any;
  ascending: boolean = true;
  colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b'];

  parentElement: any;
  data: any;
  airportData: any;

  svg: any;
  projection: any;
  tooltip: any;
  countryInfo: any;
  margin: any;
  width: any;
  height: any;
  path: any;
  world: any;
  countries: any;
  connections: any;
  airports: any;

  ngOnInit() {
    d3.json('assets/data/world-atlas.json').then((data) => {
      this.initVis('rotating-globe', data);
    });
  }

  initVis(parentElement: string, data: any) {
    console.log('Loaded data:', data); // Add this line

    let vis = this;
    vis.parentElement = parentElement;
    vis.data = data;
    vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    vis.width = window.innerWidth;
    vis.height = window.innerHeight;

    // init drawing area
    vis.svg = d3
      .select(`#${vis.parentElement}`)
      .append('svg')
      .attr('width', vis.width - 20)
      .attr('height', vis.height - 20);

    // projection
    vis.projection = d3
      .geoOrthographic()
      .translate([vis.width / 2, vis.height / 2]);

    vis.path = d3.geoPath().projection(vis.projection);

    vis.svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', vis.path)
      .attr('fill', '#070b5d')
      .attr('stroke', 'none');

    vis.world = topojson.feature(vis.data, vis.data.objects.countries);

    vis.countries = vis.svg
      .selectAll('.country')
      .data(vis.world.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', vis.path)
      .attr('fill', 'transparent');

    vis.wrangleData();

    /**
     * Rotating the Earth causes the following warning
     * [Violation] 'requestAnimationFrame' handler took <N>ms
     *
     * It also makes the animated transition very laggy and not smooth
     *
     * Will leave this off for now
     */
    // vis.startRotation();
  }

  wrangleData() {
    let vis = this;

    vis.countryInfo = {};
    vis.data.objects.countries.geometries.forEach((d: any) => {
      let randomCountryValue = Math.random() * 4;
      vis.countryInfo[d.properties.name] = {
        name: d.properties.name,
        category: 'category_' + Math.floor(randomCountryValue),
        color: vis.colors[Math.floor(randomCountryValue)],
        value: (randomCountryValue / 4) * 100,
      };
    });

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.countries
      .attr('fill', '#09119f')
      .attr('stroke', '#000566')
      .attr('stroke-width', '1px');
  }

  startRotation() {
    let vis = this;
    let velocity = [0.01, 0, 0]; // Adjust this to control rotation speed
    let then = performance.now(); // Use performance.now for higher accuracy

    function animate(now: any) {
      // Calculate time difference
      let delta = now - then;
      then = now;

      // Update the projection's rotation, using a more efficient calculation
      let rotation = vis.projection.rotate();
      rotation[0] += velocity[0] * delta;
      rotation[1] += velocity[1] * delta;
      rotation[2] += velocity[2] * delta;
      vis.projection.rotate(rotation);

      // Redraw the map
      vis.svg.selectAll('.country').attr('d', vis.path);

      // Continue the animation loop
      requestAnimationFrame(animate);
    }

    // Start the animation loop
    requestAnimationFrame(animate);
  }
}
