import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { DialogService } from '@services/dialog/dialog.service';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import * as topojson from 'topojson-client';

@Component({
  selector: 'jam-globe-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div #globeContainer id="globeDiv" class="w-full h-full"></div>`,
})
export class GlobeEarthComponent implements AfterViewInit {
  @Input() data: any;
  @Input() title: string;
  @Input() selectedValues: any;
  @Input() selectedValues$: Observable<any>;
  @ViewChild('globeContainer') globeContainer: ElementRef;

  private dialogService = inject(DialogService);

  parentElement: any;
  geoData: any;
  category: any;
  margin: any;
  width: any;
  height: any;
  world: any;
  path: any;
  svg: any;
  countries: any;
  tooltip: any;
  projection: any;
  legend: any;
  variable: any;
  year: any;
  countryInfo: any;
  radarRawData: any;
  radarDataByVariable: any;
  colorScale: any;
  radarData: any;

  colors: any = {
    economy: '198, 212, 36',
    education: '72, 244, 255',
    environment: '36, 212, 166',
  };

  constructor() {}

  async loadData() {
    //  const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
    const world = await d3.json('assets/data/world.json');
    const countries = await d3.json('assets/data/wd_indicators.json');

    this.parentElement = 'globeDiv';
    this.geoData = world;
    this.data = countries;
    this.category = this.title;
    this.initVis();
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.selectedValues$.subscribe((change) => {
      this.variable = change.category;
      this.year = change.year;
      this.wrangleData();
    });
  }

  initVis() {
    let vis = this;
    vis.variable = vis.selectedValues.category;
    vis.year = 2018;

    vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    vis.width =
      this.globeContainer.nativeElement.offsetWidth -
      vis.margin.left -
      vis.margin.right;
    vis.height =
      this.globeContainer.nativeElement.offsetHeight -
      vis.margin.top -
      vis.margin.bottom;

    // init drawing area
    vis.svg = d3
      .select('#' + vis.parentElement)
      .append('svg')
      .attr('width', vis.width)
      .attr('height', vis.height)
      .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

    vis.colorScale = d3.scaleLog();

    vis.colorScale.range([
      `rgba(${vis.colors[vis.category]}, 0.2)`,
      `rgba(${vis.colors[vis.category]}, 1)`,
    ]);

    // projection
    vis.projection = d3
      .geoOrthographic()
      .scale(350) //scaling the default zoom
      .translate([vis.width / 2, vis.height / 2]);

    vis.path = d3.geoPath().projection(vis.projection);

    // console.log(vis.geoData.features);

    const filteredCountries = vis.geoData.features.filter(
      (c: any) => c.properties.NAME !== 'San Marino'
    );

    vis.svg
      .append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', vis.path)
      .attr('fill', '#070b5d')
      .attr('stroke', 'none');

    vis.countries = vis.svg
      .selectAll('.country')
      .data(filteredCountries)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('id', (d: any) => d.properties.NAME)
      .attr('d', vis.path)
      .attr('fill', 'transparent');

    console.log(vis.countries);

    vis.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    let m0: any, o0: any;

    // Store the initial scale of the projection
    const initialScale = vis.projection.scale();

    // Define Zoom Behavior
    const zoom = d3.zoom().on('zoom', (event) => {
      // Check if the zoom scale is above the minimum threshold
      if (event.transform.k > 0.3) {
        // Update the projection scale based on zoom level
        vis.projection.scale(initialScale * event.transform.k);

        // Update the path generator with the new projection
        vis.path = d3.geoPath().projection(vis.projection);

        // Apply the updated path to all country elements
        vis.svg.selectAll('path').attr('d', vis.path);

        // Optionally, update the radius of the globe if it's a sphere
        // vis.svg.select('.sphere').attr('r', vis.projection.scale());
      } else {
        // Prevent zooming out too much
        event.transform.k = 0.3;
      }
    });

    vis.svg
      .call(
        d3
          .drag()
          .on('start', function (event) {
            var lastRotationParams = vis.projection.rotate();
            m0 = [event.x, event.y];
            o0 = [-lastRotationParams[0], -lastRotationParams[1]];
          })
          .on('drag', function (event) {
            if (m0) {
              var m1 = [event.x, event.y],
                o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
              vis.projection.rotate([-o1[0], -o1[1]]);
            }

            // Update the map (countries and graticule)
            vis.svg.selectAll('.country').attr('d', vis.path);
          })
      )
      .call(zoom);

    const legendWidth = 200;
    const legendHeight = 10;
    const legendPosition = {
      x: vis.width - legendWidth - 40,
      y: vis.height - legendHeight - 40,
    };

    // Create a legend group
    vis.legend = vis.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendPosition.x}, ${legendPosition.y})`);

    // Draw the legend gradient rectangles
    const defs = vis.svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    // Define the start of the gradient (0% opacity)
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', `rgba(${vis.colors[vis.category]}, 0.2)`);
    // Define the end of the gradient (100% opacity)
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', `rgba(${vis.colors[vis.category]}, 1)`);

    // Create a legend group
    vis.legend = vis.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendPosition.x}, ${legendPosition.y})`);

    // Draw the legend rectangle and fill it with the gradient
    vis.legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#gradient)');

    // Add legend min/max labels
    vis.legend
      .append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .style('text-anchor', 'start')
      .style('fill', 'white')
      .text('Low');

    vis.legend
      .append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .style('text-anchor', 'end')
      .style('fill', 'white')
      .text('High');

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.countryInfo = {};
    vis.radarRawData = {};
    vis.radarDataByVariable = {};
    vis.data.forEach((d: any) => {
      let history: any = {};
      d[vis.category]?.forEach((yearObject: any) => {
        history[yearObject.year] = yearObject[vis.variable];

        if (yearObject.year === vis.year) {
          vis.radarRawData[d.country] = {};
          for (let variable in yearObject) {
            if (variable !== 'year' && yearObject[variable] !== null) {
              vis.radarRawData[d.country][variable] = yearObject[variable];
              if (!vis.radarDataByVariable.hasOwnProperty(variable)) {
                vis.radarDataByVariable[variable] = [];
              }
              vis.radarDataByVariable[variable].push(yearObject[variable]);
            }
          }
        }
      });

      vis.countryInfo[d.country] = {
        value: history[vis.year],
        color: vis.colorScale(history[vis.year]),
        history: history,
      };

      // console.log(history);
      // console.log(vis.countryInfo);
    });

    // define variables for which it is better to have smaller value
    let ascending = [
      'CO2 emissions per $ of GDP (kg, 2015 US$)',
      'CO2 emissions per capita (tons)',
      'Greenhouse gas emissions per capita (tons of CO2 equiv.)',
    ];

    for (let variable in vis.radarDataByVariable) {
      if (ascending.includes(vis.variable)) {
        vis.radarDataByVariable[variable].sort((a: any, b: any) => a - b);
      } else {
        vis.radarDataByVariable[variable].sort((a: any, b: any) => b - a);
      }
    }

    vis.radarData = {};
    for (let country in vis.radarRawData) {
      vis.radarData[country] = [];
      for (let variable in vis.radarRawData[country]) {
        let value = vis.radarRawData[country][variable];
        let rank = 1 + vis.radarDataByVariable[variable].indexOf(value);
        let outOf = vis.radarDataByVariable[variable].length;
        let scale = d3.scaleLinear().range([0, 100]).domain([outOf, 1]);
        let axisValue = scale(rank);
        vis.radarData[country].push({
          axis: variable + ' ' + value + ' ' + rank + '/' + outOf,
          axisValue: axisValue,
          value: value,
          rank: rank,
          outOf: outOf,
        });
      }
    }

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.colorScale.domain(
      d3.extent(Object.values(vis.countryInfo), (d: any) => d.value)
    );
    // console.log(d3.max(Object.values(vis.countryInfo), (d: any) => d.value));

    vis.countries
      .attr('fill', (d: any) => {
        let countryName = d.properties.NAME;
        return vis.countryInfo[countryName]
          ? vis.colorScale(vis.countryInfo[countryName].value)
          : 'black';
      })
      .attr('stroke', '#000566') // Set the stroke color for the country borders
      .attr('stroke-width', '1px')
      .on('click', (event: PointerEvent, d: any) => {
        let countryName = d.properties.NAME;
        const country = vis.radarData[countryName];
        vis.dialogService.openDialog(country);
      })
      .on('mouseover', function (event: any, d: any) {
        // Highlight the country path
        d3.select(this)
          .attr('stroke-width', '1px')
          .attr('stroke', 'white')
          .raise();

        let countryName = d.properties.NAME;

        if (
          vis.countryInfo.hasOwnProperty(countryName) &&
          vis.countryInfo[countryName].value !== null
        ) {
          let dataPoint = vis.countryInfo[countryName];

          let filteredHistory = Object.entries(dataPoint.history)
            .filter((entry) => entry[1] !== null)
            .map((entry) => [Number(entry[0]), entry[1]]);

          let tooltipOffsetX = 10;
          let tooltipOffsetY = 20;

          const formatValue = (val: any) => {
            return val.toLocaleString('en-US');
          };

          // Show the tooltip
          vis.tooltip
            .style('position', 'absolute')
            .style('opacity', 1)
            .style('left', event.pageX + tooltipOffsetX + 'px')
            .style('top', event.pageY + tooltipOffsetY + 'px')
            .style('width', '379px')
            .style('height', '250px')
            .style('flex-shrink', 0)
            .style('border-radius', '12px')
            .style('background', '#FFF')
            .style('box-shadow', '4px 4px 4px 0px rgba(0, 0, 0, 0.35)').html(`
        <div class="p-5 space-y-1">
          <div class="flex justify-between">
            <h2 class="font-bold text-[#09119F] text-xl">${countryName}</h2>
            <h2 class="font-bold text-[#09119F] text-xl">
              ${vis.year}
            </h2>
          </div>
          <p class='data-point'>${vis.variable}</p>
          <p class='font-bold text-[#09119F]'>${formatValue(
            dataPoint.value
          )}</p>
          <svg id="timeseries-chart" width="325" height="100"></svg>
        </div>
      `);

          const svg = d3.select('#timeseries-chart');

          // Set the dimensions and margins of the graph
          const margin = { top: 10, right: 10, bottom: 20, left: 40 },
            width = +svg.attr('width') - margin.left - margin.right,
            height = +svg.attr('height') - margin.top - margin.bottom;

          // Append the SVG object to the body of the tooltip
          const chart = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

          // Add X scale and axis
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(
                filteredHistory,
                (d: any) => new Date(d[0], 0, 1)
              ) as any
            )
            .range([0, width]);

          chart
            .append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(6))
            .attr('color', '#BABABA')
            .selectAll('line')
            .attr('stroke-width', 1);

          // Add Y scale
          const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredHistory, (d: any) => d[1]) as any])
            .range([height, 0]);

          chart
            .append('g')
            .call(d3.axisLeft(y).ticks(5))
            .attr('color', '#BABABA')
            .selectAll('line')
            .attr('stroke-width', 1);

          // Add the line
          chart
            .append('path')
            .datum(filteredHistory)
            .attr('fill', 'none')
            .attr('stroke', '#09119F')
            .attr('stroke-width', 4)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr(
              'd',
              d3
                .line()
                .curve(d3.curveBasis) // This creates the curved corners in the line
                .x((d) => x(new Date(d[0], 0, 1)))
                .y((d) => y(d[1])) as any
            );

          // Ensure tooltip stays within the viewport
          let tooltip = vis.tooltip.node();
          let tooltipRect = tooltip.getBoundingClientRect();
          let xPosition = event.pageX + tooltipOffsetX;
          let yPosition = event.pageY + tooltipOffsetY;

          // Check if the tooltip is partially outside the viewport
          if (xPosition + tooltipRect.width > window.innerWidth) {
            xPosition = window.innerWidth - tooltipRect.width;
          }

          if (yPosition + tooltipRect.height > window.innerHeight) {
            yPosition = window.innerHeight - tooltipRect.height;
          }

          // Update the tooltip's position
          vis.tooltip
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px');
        }
      })
      .on('mouseout', function (event: any, d: any) {
        // Hide the tooltip
        d3.select(this)
          .attr('stroke', '#000566') // Set the stroke color for the country borders
          .attr('stroke-width', '1px');
        vis.tooltip
          .style('opacity', 0)
          .style('left', '0px')
          .style('top', '0px')
          .style('width', '0')
          .style('height', '0')
          .html(``);
      });
  }
}
