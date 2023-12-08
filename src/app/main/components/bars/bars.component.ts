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
  selector: 'jam-bars-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div #barContainer id="barDiv" class="w-full h-[400px]"></div>`,
})
export class BarsComponent implements AfterViewInit {
  @Input() data: any;
  @Input() title: string;
  @Input() selectedValues: any;
  @Input() selectedValues$: Observable<any>;
  @ViewChild('barContainer') globeContainer: ElementRef;

  transitionDuration = 800;
  colors: any = {
    economy: '198, 212, 36',
    education: '72, 244, 255',
    environment: '36, 212, 166',
  };

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
  xAxis: any;
  yAxis: any;
  nMissing: any;
  bars: any;
  labels: any;
  x: any;
  y: any;

  constructor() {}

  async loadData() {
    const world = await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
    );
    const countries = await d3.json('assets/data/wd_indicators.json');

    this.parentElement = 'barDiv';

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
    const vis = this;
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

    // Append the SVG object to the specified div and add a 'g' group for margins
    vis.svg = d3
      .select('#' + vis.parentElement)
      .append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom);
    // .append('g')
    // .attr('transform', `translate(${vis.margin.left} - 200, ${vis.margin.top})`)
    // .style('background-color', '#0D187C');

    // Scales
    vis.x = d3.scaleLinear().range([0, vis.width]);

    vis.y = d3.scaleBand().range([0, vis.height]).padding(0.5);

    // Axes
    vis.xAxis = vis.svg
      .append('g')
      .attr('transform', `translate(0,${vis.height})`);

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.nMissing = 0;
    vis.countryInfo = {};
    vis.data.forEach((d: any) => {
      if (d.country !== 'World') {
        d[vis.category].forEach((yearObject: any) => {
          if (yearObject.year === vis.year) {
            if (yearObject[vis.variable] !== null) {
              vis.countryInfo[d.country] = yearObject[vis.variable];
            } else {
              vis.nMissing += 1;
            }
          }
        });
      }
    });

    // define variables for which it is better to have smaller value
    let ascending = [
      'CO2 emissions per $ of GDP (kg, 2015 US$)',
      'CO2 emissions per capita (tons)',
      'Greenhouse gas emissions per capita (tons of CO2 equiv.)',
    ];

    console.log(`Data is missing for ${vis.nMissing} countries.`);

    vis.countryInfo = Object.entries(vis.countryInfo);
    if (ascending.includes(vis.variable)) {
      vis.countryInfo.sort((a: any, b: any) => a[1] - b[1]);
    } else {
      vis.countryInfo.sort((a: any, b: any) => b[1] - a[1]);
    }

    vis.countryInfo = vis.countryInfo.slice(0, 10);

    vis.updateVis();
  }

  // Method to update the visualization if the data changes
  updateVis() {
    const vis = this;

    // Update the scale domains with the new data
    vis.x.domain([0, d3.max(vis.countryInfo, (d: any) => d[1])]);
    vis.y.domain(vis.countryInfo.map((d: any) => d[0]));

    // Bars
    vis.bars = vis.svg.selectAll('.bar').data(vis.countryInfo);

    vis.bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', `rgba(${vis.colors[vis.category]}, 1)`)
      .merge(vis.bars)
      .transition()
      .duration(vis.transitionDuration)
      .attr('x', 180)
      .attr('y', (d: any) => vis.y(d[0]))
      .attr('width', (d: any) => vis.x(d[1]) - 150)
      .attr('height', vis.y.bandwidth());

    vis.bars
      .exit()
      .transition()
      .duration(vis.transitionDuration)
      .attr('y', vis.height)
      .style('opacity', '0')
      .remove();

    // Update the labels with new data
    vis.labels = vis.svg.selectAll('.label').data(vis.countryInfo);

    vis.labels
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('fill', '#fff')
      .merge(vis.labels)
      .transition()
      .duration(vis.transitionDuration)
      .attr('y', (d: any) => vis.y(d[0]) + vis.y.bandwidth() / 2 + 5)
      .attr('x', 0)
      .style('text-anchor', 'start')
      .text((d: any) => d[0]);

    vis.labels
      .exit()
      .transition()
      .duration(vis.transitionDuration)
      .attr('y', vis.height)
      .style('opacity', '0')
      .remove();

    // Update the axes if needed
    // vis.xAxis
    //   .transition()
    //   .duration(vis.transitionDuration)
    //   .call(d3.axisBottom(vis.x))
    //   .style('fill', 'white')
    //   .selectAll('text')
    //   .style('fill', '#fff');
  }
}
