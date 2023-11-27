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
  selector: 'app-scatter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss'],
})
export class ScatterEarthComponent {
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
  x: any;
  y: any;
  xAxis: any;
  yAxis: any;
  yVariable: any;
  xVariable: any;
  areas: any;
  years: any;
  displayData: any;
  circles: any;

  ngOnInit() {
    let promises = [d3.json('assets/data/wd_indicators.json')];
    Promise.all(promises)
      .then((data) => {
        console.log(data);

        this.initMainPage(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  initMainPage(allDataArray: any[]) {
    this.addVariablesToSelect(allDataArray[0]);
    this.addAreasToSelect(allDataArray[0]);
    this.addYearsToSelect(allDataArray[0]);

    this.initVis('scatterDiv', allDataArray[0]);
  }

  initVis(parentElement: string, data: any) {
    let vis = this;
    vis.parentElement = parentElement;
    vis.data = data;
    vis.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    vis.width = window.innerWidth - 700;
    vis.height = window.innerHeight - 200;

    vis.svg = d3
      .select('#' + vis.parentElement)
      .append('svg')
      .attr('width', vis.width)
      .attr('height', vis.height)
      .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)
      .style('background-color', '#1D31F2');

    vis.x = d3.scaleLog().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = vis.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${vis.height - 10})`)
      .call(d3.axisBottom(vis.x))
      .call((g: any) => g.selectAll('.tick line').remove())
      .call((g: any) => g.selectAll('.tick text').remove())
      .selectAll('path')
      .style('stroke', 'white')
      .style('opacity', '0.3')
      .style('stroke-width', '20px');

    vis.yAxis = vis.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(10,0)`)
      .call(d3.axisLeft(vis.y))
      .call((g: any) => g.selectAll('.tick line').remove())
      .call((g: any) => g.selectAll('.tick text').remove())
      .selectAll('path')
      .style('stroke', '#616FF6')
      .style('stroke-width', '20px');

    vis.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'scatterTooltip');

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    // vis.yVariable = this.getSelectedValues('yvarSelector')[0];
    // vis.xVariable = this.getSelectedValues('xvarSelector')[0];
    // vis.areas = this.getSelectedValues('areaSelector');
    // vis.years = this.getSelectedValues('yearSelector').map((year) => +year);

    vis.yVariable = 'GDP per capita (2015 US$)';
    vis.xVariable = 'Renewable energy consumption (% of energy consumption)';
    vis.areas = ['World'];
    vis.years = [
      1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971,
      1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983,
      1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
      2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
      2020, 2021, 2022,
    ];

    interface TempData {
      [key: string]: any; // Replace 'YourValueType' with the type of value you expect in tempData
    }

    const tempData: TempData = {};
    vis.data.forEach((areaObject: any) => {
      if (vis.areas.includes(areaObject.country)) {
        tempData[areaObject.country] = {};
        for (let key in areaObject) {
          if (Array.isArray(areaObject[key])) {
            areaObject[key].forEach((yearObject: any) => {
              if (vis.years.includes(yearObject.year)) {
                if (
                  !tempData[areaObject.country].hasOwnProperty(yearObject.year)
                ) {
                  tempData[areaObject.country][yearObject.year] = {};
                }
                for (let variable in yearObject) {
                  if (
                    variable.includes(vis.yVariable) ||
                    variable.includes(vis.xVariable)
                  ) {
                    if (vis.yVariable !== vis.xVariable) {
                      tempData[areaObject.country][yearObject.year][variable] =
                        yearObject[variable];
                    } else {
                      tempData[areaObject.country][yearObject.year][variable] =
                        yearObject[variable];
                      tempData[areaObject.country][yearObject.year][
                        variable + '*'
                      ] = yearObject[variable];
                    }
                  }
                }
              }
            });
          }
        }
      }
    });

    vis.displayData = [];
    for (let area in tempData) {
      for (let year in tempData[area]) {
        let objAreaYear = tempData[area][year];
        let hasTwoProperties = Object.keys(objAreaYear).length === 2;
        let bothValuesNotNull = Object.keys(objAreaYear).every(
          (key) => objAreaYear[key] !== null
        );
        if (hasTwoProperties && bothValuesNotNull) {
          vis.displayData.push({
            area: area,
            year: year,
            x: objAreaYear[vis.xVariable],
            y: objAreaYear[
              vis.xVariable !== vis.yVariable
                ? vis.yVariable
                : vis.xVariable + '*'
            ],
          });
        }
      }
    }

    console.log(vis.displayData);

    vis.updateVis();
  }

  changeXscaling(new_scale: any) {
    // Is called only when the user changes one of the scales
    let vis = this;

    if (new_scale === 'log') {
      vis.x = d3.scaleLog();
    } else {
      vis.x = d3.scaleLinear();
    }
    vis.x.range([0, vis.width]);

    vis.updateVis(true, false);
  }

  changeYscaling(new_scale: any) {
    // Is called only when the user changes one of the scales
    let vis = this;

    if (new_scale === 'log') {
      vis.y = d3.scaleLog();
    } else {
      vis.y = d3.scaleLinear();
    }

    vis.y.range([vis.height, 0]);

    vis.updateVis(false, true);
  }

  updateVis(xScalingHasChanged = false, yScalingHasChanged = false) {
    let vis = this;

    vis.x.domain(d3.extent(vis.displayData, (d: any) => d.x));
    vis.y.domain(d3.extent(vis.displayData, (d: any) => d.y));

    if (!xScalingHasChanged) {
      vis.xAxis.transition().duration(400);
    }
    if (!yScalingHasChanged) {
      vis.yAxis.transition().duration(400);
    }
    vis.xAxis.call(d3.axisBottom(vis.x));
    vis.yAxis.call(d3.axisLeft(vis.y));

    vis.circles = vis.svg.selectAll('circle').data(vis.displayData);

    vis.circles
      .enter()
      .append('circle')
      .style('fill', 'white')
      .style('opacity', '0.5')
      .on('mouseover', function (event: any, d: any) {
        d3.select(this)
          .attr('stroke-width', '2px')
          .attr('stroke', '#24D4A6')
          .style('opacity', '1');

        vis.tooltip
          .style('opacity', 1)
          .style('left', event.pageX + 20 + 'px')
          .style('top', event.pageY - 50 + 'px').html(`
                    <div style="border: thin solid grey; border-radius: 10px; background: white; padding: 20px">
                        <div style="display: flex; justify-content: space-between;">
                            <div class="country">${d.area}</div>
                            <div class="year">${d.year}</div>
                        </div>
                        <div class="content" style="text-align: left;">
                            ${
                              vis.xVariable !== vis.yVariable
                                ? `<div class="label">${vis.yVariable}</div>
                             <div class="value">${d.y.toLocaleString(
                               'en-US'
                             )}</div>`
                                : ''
                            }
                             <div class="label">${vis.xVariable}</div>
                             <div class="value">${d.x.toLocaleString(
                               'en-US'
                             )}</div>
                        </div>
                    </div>`);
      })
      .on('mouseout', function (event: any, d: any) {
        d3.select(this).attr('stroke', 'none').style('opacity', '0.5');

        vis.tooltip
          .style('opacity', 0)
          .style('left', 0)
          .style('top', 0)
          .html(``);
      })

      .merge(vis.circles)
      .transition()
      .duration(1500)
      .attr('cx', (d: any) => vis.x(d.x))
      .attr('cy', (d: any) => vis.y(d.y))
      .attr('r', 7.5)
      .style('fill', 'white')
      .style('opacity', '0.5');

    vis.circles
      .exit()
      .transition()
      .duration(1500)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 0)
      .style('opacity', '0')
      .remove();
  }

  addVariablesToSelect(allDataArray: any) {
    let variables = [];
    let firstObject = allDataArray[0];
    for (let key in firstObject) {
      if (Array.isArray(firstObject[key])) {
        let firstYear = firstObject[key][0];
        for (let variable in firstYear) {
          if (variable !== 'year') {
            variables.push(variable);
          }
        }
      }
    }
    let yvarSelector = document.getElementById('yvarSelector');
    let xvarSelector = document.getElementById('xvarSelector');
    variables.forEach((variable, i) => {
      [yvarSelector, xvarSelector].forEach((selector) => {
        let option = document.createElement('option');
        option.value = variable;
        option.textContent = variable.split(' (')[0];
        if (
          (i === 0 && selector === yvarSelector) ||
          (i === variables.length - 1 && selector === xvarSelector)
        ) {
          option.selected = true;
        }
        // selector.appendChild(option);
      });
    });
  }

  addAreasToSelect(allDataArray: any) {
    let areas = allDataArray.map((item: any) => item.country);
    let areaSelector = document.getElementById('areaSelector');
    areas.forEach((area: any) => {
      let option = document.createElement('option');
      option.value = area;
      option.textContent = area;
      if (area === 'World') {
        option.selected = true;
      }
      // areaSelector.appendChild(option);
    });
  }

  addYearsToSelect(allDataArray: any) {
    let years = allDataArray[0]['economy'].map((item: any) => item.year);
    let yearSelector = document.getElementById('yearSelector');
    years.forEach((year: any, i: any) => {
      let option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (true) {
        option.selected = true;
      }
      // yearSelector.appendChild(option);
    });
  }

  getSelectedValues(selectId: any) {
    let selectElement = document.getElementById(selectId);
    // let selectedOptions = selectElement.selectedOptions;
    // return Array.from(selectedOptions).map((option) => option.value);
    return [];
  }
}
