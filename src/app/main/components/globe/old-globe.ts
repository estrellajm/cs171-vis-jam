import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'jam-globe-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="globe-oldd"></div>`,
})
export class GlobeEarthComponent {
  sortDataFunc: any;
  ascending: boolean = true;
  colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b'];

  parentElement: any;
  geoData: any;
  wdData: any;

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

  dragStart: number = 0;
  rotateStart: number = 0;

  ngOnInit() {
    let promises = [
      d3.csv('assets/data/wd_indicators.csv'),
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

  initVis(parentElement: string, wdData: any, geoData: any) {
    let vis = this;
    vis.parentElement = parentElement;
    vis.wdData = wdData;
    vis.geoData = geoData;
    vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    vis.width = vis.margin.left - vis.margin.right + 500;
    vis.height = window.innerHeight;

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

    // show grab hand
    vis.svg.attr('cursor', 'grab');

    // Draggable globe
    let drag = d3
      .drag()
      .on('start', function (event) {
        let [longitude] = vis.projection.rotate();
        vis.rotateStart = longitude; // Ensured to be a number
        vis.dragStart = event.x; // Ensured to be a number
        d3.select(this).attr('cursor', 'grabbing');
      })
      .on('drag', function (event) {
        if (
          typeof vis.dragStart === 'number' &&
          typeof vis.rotateStart === 'number'
        ) {
          let dx = (event.x - vis.dragStart) * 0.2; // Reduced sensitivity
          let longitude = vis.rotateStart + dx; // Adjusted for smoother rotation

          vis.projection.rotate([longitude, 0]); // Lock latitude to 0
          vis.svg.selectAll('.country').attr('d', vis.path);
        }
      })
      .on('end', function () {
        vis.dragStart = 0; // Reset to a number
        d3.select(this).attr('cursor', 'grab');
      });

    vis.svg.call(drag);

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
}
