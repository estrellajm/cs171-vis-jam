import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
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
  selector: 'app-earth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earth.component.html',
  styleUrls: ['./earth.component.scss'],
})
export class EarthComponent {
  @ViewChild('mapDiv') mapDiv: ElementRef;

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

  private el = inject(ElementRef);
  private render = inject(Renderer2);

  ngOnInit() {
    let promises = [
      d3.json('assets/data/airports.json'),
      d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'),
    ];
    Promise.all(promises)
      .then((data) => {
        this.initMainPage(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  // ngAfterViewInit() {
  //   const width = this.mapDiv.nativeElement.getBoundingClientRect().width;
  //   const height = this.mapDiv.nativeElement.getBoundingClientRect().height;
  //   console.log('Width of mapDiv:', width);
  //   console.log('Height of mapDiv:', height);
  // }
  // initMainPage
  initMainPage(allDataArray: any[]) {
    // log data
    // activity 2, force layout
    this.initVis('#mapDiv', allDataArray[0], allDataArray[1]);
  }

  initVis(parentElement: string, airportData: any, geoData: any) {
    let vis = this;
    vis.parentElement = parentElement;
    vis.airportData = airportData;
    vis.geoData = geoData;
    vis.margin = { top: 20, right: 20, bottom: 20, left: 200 };
    vis.width = vis.margin.left - vis.margin.right + 400;
    vis.height = vis.margin.top - vis.margin.bottom + 400;

    // init drawing area
    vis.svg = d3
      .select(parentElement)
      .append('svg')
      .attr('width', vis.width)
      .attr('height', vis.height)
      .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

    // add title
    vis.svg
      .append('g')
      .attr('class', 'title')
      .attr('id', 'map-title')
      .append('text')
      .text('Title for Map')
      .attr('transform', `translate(${vis.width / 2}, 20)`)
      .attr('text-anchor', 'middle');

    vis.projection = d3
      .geoOrthographic() // d3.geoStereographic()
      .scale(160)
      .translate([vis.width / 2, vis.height / 2]);
    vis.path = d3.geoPath().projection(vis.projection);
    vis.world = topojson.feature(geoData, geoData.objects.countries);
    // vis.world = topojson.feature(geoData, geoData.objects.countries).features;

    /** Paint Ocean */
    this.svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'graticule')
      .attr('fill', '#ADDEFF')
      .attr('stroke', 'rgba(129,129,129,0.35)')
      .attr('d', vis.path);

    let m0: any[], o0: number[];

    this.svg.call(
      d3
        .drag()
        .on('start', function (event) {
          let lastRotationParams = vis.projection.rotate();
          m0 = [event.x, event.y];
          o0 = [-lastRotationParams[0], -lastRotationParams[1]];
        })
        .on('drag', function (event) {
          if (m0) {
            let m1 = [event.x, event.y],
              o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
            vis.projection.rotate([-o1[0], -o1[1]]);
            vis.updateMap();
          }
        })
    );

    vis.createTooltip();
    vis.wrangleData();
  }

  createTooltip() {
    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

  updateMap() {
    let vis = this;

    vis.path = d3.geoPath().projection(vis.projection);
    vis.svg.selectAll('.country').attr('d', vis.path);
    vis.svg.selectAll('.graticule').attr('d', vis.path);
  }

  wrangleData() {
    let vis = this;

    // create random data structure with information for each land
    vis.countryInfo = {};

    vis.geoData.objects.countries.geometries.forEach((d: any) => {
      let randomCountryValue = Math.random() * 4;
      vis.countryInfo[d.properties.name] = {
        name: d.properties.name,
        category: `category_${Math.floor(randomCountryValue)}`,
        color: this.colors[Math.floor(randomCountryValue)],
        value: (randomCountryValue / 4) * 100,
      };
    });

    this.updateVis();
  }

  updateVis() {
    let vis = this;

    this.drawGraticules();
    // Ordinal color scale (10 default colors)
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    vis.countries = this.svg
      .selectAll('.country')
      .data(vis.world)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', vis.path)
      .style('fill', function (d: any, index: any) {
        return vis.countryInfo[d.properties.name].color;
      })
      .on('mouseover', function (event: any, d: any) {
        const country = vis.countryInfo[d.properties.name];
        d3.select(this)
          .attr('stroke-width', '2px')
          .attr('stroke', 'black')
          .attr('fill', 'rgba(173,222,255,0.62)');

        vis.tooltip
          .style('opacity', 1)
          .style('left', event.pageX + 20 + 'px')
          .style('top', event.pageY + 'px').html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>${country.name}<h3>
							<h4> Name: ${country.name}</h4>
                            <h4> Category: ${country.category}</h4>
							<h4> Color: ${vis.countryInfo[d.properties.name].color}</h4>
                            <h4> Value: ${country.value}</h4>            
                        </div>`);
      })
      .on('mouseout', function (event: any, d: any) {
        d3.select(this)
          .attr('stroke-width', '0px')
          .attr('fill', (d: any) => vis.countryInfo[d.properties.name].color);

        vis.tooltip
          .style('opacity', 0)
          .style('left', 0)
          .style('top', 0)
          .html(``);
      });

    // append tooltip
    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'pieTooltip');

    /** LEGEND */
    // Usage of the drawLegend function in a context where the SVG has already been defined.
    const svg = d3.select('svg'); // Assuming the SVG has been selected or created earlier.
    const svgWidth = +svg.attr('width'); // Extract the width of the SVG for positioning the legend.

    this.drawLegend();
  }

  drawGraticules() {
    let vis = this;
    // Define the graticule generator
    var graticule = d3.geoGraticule();

    // Create a path generator using the projection
    var path = d3.geoPath().projection(this.projection);

    // Append the graticule lines to the SVG
    this.svg
      .append('path')
      .datum(graticule) // Bind the graticule data
      .attr('class', 'graticule') // Apply a class for styling if needed
      .attr('d', path) // Generate the path data
      .attr('fill', 'none')
      .attr('stroke', '#000') // Style the lines with a light grey color
      .attr('stroke-width', 0.2)
      .attr('stroke-opacity', 0.6);

    // Optionally, append the outline of the graticule (the frame)
    this.svg
      .append('path')
      .datum(graticule.outline)
      .attr('class', 'graticule-outline')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5);
  }

  drawLegend() {
    // Define the width and height for each color segment and SVG dimensions
    const segmentWidth = this.colors.length * 30;
    const width = 20;
    const height = 20;
    const svgWidth = segmentWidth + 20; // additional space for padding
    const svgHeight = 80;

    const legendXPosition = width - svgWidth;
    const legendYPosition = height - svgHeight + 30;

    // Create SVG element
    const legend = this.svg
      .append('g')
      .attr('transform', `translate(${legendXPosition}, ${legendYPosition})`);

    // Draw the color segments
    this.colors.forEach((color, i) => {
      legend
        .append('rect')
        .attr('x', i * (segmentWidth / this.colors.length) + 10)
        .attr('y', 10)
        .attr('width', segmentWidth / this.colors.length)
        .attr('height', height)
        .style('fill', color);
    });

    // Set up the scale for the xAxis
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([10, segmentWidth + 10]);

    // Define the xAxis
    const xAxis = d3.axisBottom(xScale).ticks(2);

    // Add the xAxis to the legend
    legend
      .append('g')
      .attr('transform', `translate(0, ${height + 10})`)
      .call(xAxis);
  }
}
