import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { CountriesSelectors } from 'src/app/core/stores/countries/countries.selectors';
import { SelectedValues } from 'src/app/core/stores/countries/countries.state';

@Component({
  selector: 'jam-scatter',
  standalone: true,
  imports: [CommonModule],
  template: '<div id="scatterDiv"></div>',
})
export class ScatterEarthComponent {
  @Select(CountriesSelectors.getSelectedCorrelationValues)
  selectedValues$: Observable<any>;

  sortDataFunc: any;
  ascending: boolean = true;

  parentElement: any;
  data: any;

  svg: any;
  tooltip: any;
  margin: any;
  width: any;
  height: any;
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

  xAxisLabel: any;
  yAxisLabel: any;

  ngOnInit() {}

  async loadData() {
    const countries: any = await d3.json('assets/data/wd_indicators.json');
    this.parentElement = 'scatterDiv';
    this.data = countries;

    // set default values for the scatter plot
    this.yVariable = 'GDP per capita (2015 US$)';
    this.xVariable = 'Renewable energy consumption (% of energy consumption)';
    this.areas = ['World'];
    this.years = [
      1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971,
      1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983,
      1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995,
      1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
      2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
      2020, 2021, 2022,
    ];

    this.initMainPage(countries);
  }

  // load the data and subscribe to changes
  ngAfterViewInit(): void {
    this.loadData();
    this.selectedValues$.subscribe((selected: SelectedValues) => {
      this.xVariable = selected.xVariable;
      this.yVariable = selected.yVariable;
      this.areas = selected.areas;
      this.years = selected.selectedYears;
      this.wrangleData();
    });
  }

  // init with data
  initMainPage(countries: any[]) {
    this.addVariablesToSelect(countries);
    this.addAreasToSelect(countries);
    this.addYearsToSelect(countries);
    this.initVis();
  }

  // init D3
  initVis() {
    let vis = this;

    vis.width = window.innerWidth - 700;
    vis.height = window.innerHeight - 200;

    vis.margin = { top: 10, right: 30, bottom: 30, left: 50 };

    vis.svg = d3
      .select('#' + vis.parentElement)
      .append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
      .append('g')
      .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`)
      .style('background-color', '#1D31F2');

    vis.x = d3.scaleLinear().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    // axis
    vis.xAxis = vis.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxis = vis.svg.append('g').attr('class', 'axis axis--y');

    // axis labes
    vis.xAxisLabel = vis.svg
      .append('g')
      .attr('class', 'x-axis-label')
      .append('text')
      .attr('x', vis.width)
      .attr('y', vis.height - 5)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'alphabetic')
      .attr('font-size', 11)
      .style('fill', 'white');

    vis.yAxisLabel = vis.svg
      .append('g')
      .attr('class', 'y-axis-label')
      .append('text')
      .attr('x', 0)
      .attr('y', 3)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'hanging')
      .attr('transform', 'rotate(-90)')
      .attr('font-size', 11)
      .style('fill', 'white');

    // tooltip
    vis.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'scatterTooltip');

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    let tempData: any = {};
    vis.data?.forEach((areaObject: any) => {
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

    if (vis.displayData.length < 1) return;
    vis.updateVis(false, true);
  }

  updateVis(xScalingHasChanged = false, yScalingHasChanged = false) {
    let vis = this;

    vis.x.domain(d3.extent(vis.displayData, (d: any) => d.x));
    vis.y.domain(d3.extent(vis.displayData, (d: any) => d.y));

    if (!xScalingHasChanged) {
      vis.xAxis.transition().duration(1500);
    }
    if (!yScalingHasChanged) {
      vis.yAxis.transition().duration(1500);
    }

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

        let tooltipOffsetX = 10;
        let tooltipOffsetY = 20;
        vis.tooltip
          .style('position', 'absolute')
          .style('opacity', 1)
          .style('left', event.pageX + tooltipOffsetX + 'px')
          .style('top', event.pageY + tooltipOffsetY + 'px')
          .style('width', '350px')
          .style('height', '200px')
          .style('flex-shrink', 0)
          .style('border-radius', '12px')
          .style('background', '#FFF')
          .style('box-shadow', '4px 4px 4px 0px rgba(0, 0, 0, 0.35)').html(`
                    <div style="border-radius: 10px; background: white; padding: 20px">
                        <div style="display: flex; justify-content: space-between;">
                            <h2 class="country font-bold text-[#09119F] text-xl">${d.area}</h2>
                            <h2 class="year font-bold text-[#09119F] text-xl">${d.year}</h2>
                        </div>
                        <div class="content" style="text-align: left;">
                            ${
                              vis.xVariable !== vis.yVariable
                                ? `<p class="label">${vis.yVariable}</p>
                             <p class="value font-bold text-[#09119F]">${d.y.toLocaleString(
                               'en-US'
                             )}</p> <div style="height: 10px;"></div>
`
                                : ''
                            }
                             <div class="label">${vis.xVariable}</div>
                             <p class="value font-bold text-[#09119F]">${d.x.toLocaleString(
                               'en-US'
                             )}</p>
                        </div>
                    </div>`);

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

    vis.xAxis
      .transition()
      .duration(1500)
      .call(d3.axisBottom(vis.x))
      .style('fill', '#616FF6')
      .selectAll('text')
      .style('fill', 'white');
    vis.xAxis.selectAll('line').style('stroke', '#1D31F2');
    vis.xAxis.selectAll('path').style('stroke', '#1D31F2');

    vis.yAxis
      .transition()
      .duration(1500)
      .call(d3.axisLeft(vis.y))
      .style('fill', '#616FF6')
      .selectAll('text')
      .style('fill', 'white');
    vis.yAxis.selectAll('line').style('stroke', '#1D31F2');
    vis.yAxis.selectAll('path').style('stroke', '#1D31F2');

    vis.xAxisLabel.text(vis.xVariable);
    vis.yAxisLabel.text(vis.yVariable);
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
