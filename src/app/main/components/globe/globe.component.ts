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
  selector: 'app-globe-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss'],
})
export class GlobeEarthComponent {
  sortDataFunc: any;
  ascending: boolean = true;
  colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b'];

  parentElement: any;
  geoData: any;
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
    let promises = [
      d3.json('assets/data/wd_indicators.json'),
      d3.json('assets/data/world-atlas.json'),
    ];
    Promise.all(promises)
      .then((data) => {
        this.initMainPage(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  initMainPage(allDataArray: any[]) {
    this.initVis('rotating-globe', allDataArray[0], allDataArray[1]);
  }

  initVis(parentElement: string, airportData: any, geoData: any) {
    let vis = this;
    vis.parentElement = parentElement;
    vis.airportData = airportData;
    vis.geoData = geoData;
    vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    vis.width = vis.margin.left - vis.margin.right + 500;
    vis.height = window.innerHeight;
    // vis.height = vis.margin.top - vis.margin.bottom + 500;

    // init drawing area
    vis.svg = d3
      .select(`#${vis.parentElement}`)
      .append('svg')
      .attr('width', vis.width)
      .attr('height', vis.height);

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

    vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries);

    vis.countries = vis.svg
      .selectAll('.country')
      .data(vis.world.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', vis.path)
      .attr('fill', 'transparent');

    let m0: any[], o0: number[];

    vis.svg.attr('cursor', 'grab')
    vis.svg.call(
      d3
        .drag()
        .on('start', function (event) {
          let lastRotationParams = vis.projection.rotate();
          m0 = [event.x, event.y];
          o0 = [-lastRotationParams[0], -lastRotationParams[1]];
          d3.select(this).attr('cursor', 'grabbing');
        })
        .on('drag', function (event) {
          if (m0) {
            let m1 = [event.x, event.y],
              o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
            vis.projection.rotate([-o1[0], -o1[1]]);
          }
        })
        .on('end', function () {
          d3.select(this).attr('cursor', 'grab'); 
        })
    );

    vis.startRotation();
    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.countryInfo = {};
    vis.geoData.objects.countries.geometries.forEach((d: any) => {
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
    let velocity = [0.0, 0, 0];
    let then = Date.now();

    d3.timer(function () {
      let now = Date.now();
      let delta = now - then;
      then = now;

      // Update the projection's rotation
      vis.projection.rotate([
        vis.projection.rotate()[0] + velocity[0] * delta, // Rotate around the x-axis
        vis.projection.rotate()[1] + velocity[1] * delta, // Rotate around the y-axis
        vis.projection.rotate()[2] + velocity[2] * delta, // Rotate around the z-axis
      ]);

      // Redraw the map
      vis.svg.selectAll('.country').attr('d', vis.path);
    });
  }
}
