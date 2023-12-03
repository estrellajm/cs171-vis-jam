import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from './tooltip/tooltip.component'; // Assume you have a TooltipComponent

import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'jam-globe-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div #globeContainer id="globe-data" class="w-full h-full"></div>`,
})
export class GlobeEarthComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Input() title: string;
  @Input() selectedCategory: string;
  @ViewChild('globeContainer') globeContainer: ElementRef;

  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    this.initGlobe();
  }

  ngOnChanges() {
    // console.log(this.data);
    // console.log(this.selectedCategory);
  }

  private initGlobe(): void {
    const ng = this;
    const width = this.globeContainer.nativeElement.offsetWidth;
    const height = this.globeContainer.nativeElement.offsetHeight;
    const sensitivity = 50;
    const parentElement = 'globe-data';
    const geoData = this.data.world;

    /** Use the function below to compare the data
     * between the world and dataset
     */
    // this.compareDataToWorld();

    /** INITIALIZATIONS */
    let projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([100, 0])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

    /** Globe Init */
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

    const getMaxAverage = (data: any, key: string) => {
      const countryAverages: any = {};

      data.forEach((country: any) => {
        const values = country[ng.title]
          .map((econ: any) => econ[key])
          .filter((val: any) => val !== null); // TODO: Ask the Team. Currently filtering null
        const sum = values.reduce((acc: number, val: number) => acc + val, 0);
        const average = values.length > 0 ? sum / values.length : 0;
        countryAverages[country.country] = average;
      });
      const averages: number[] = [
        ...Object.values(countryAverages),
      ] as number[];
      const minAverage = Math.min(...averages);
      const maxAverage = Math.max(...averages);
      return { countryAverages, maxAverage };
    };

    const { countryAverages, maxAverage } = getMaxAverage(
      ng.data.countries,
      ng.selectedCategory
    );

    // console.log('Average GDP per Capita per Country:', countryAverages);
    // console.log('Highest Average GDP per Capita:', maxAverage);

    const colorScale = d3
      .scaleLinear()
      .domain([0, maxAverage / 10]) // Assuming the value is normalized between 0 and 1
      .range(['rgba(36, 212, 166, 0.2)', 'rgba(36, 212, 166, 1)'] as any);

    /** Code below is to sort */
    // // Convert the countryGDP object into an array of [country, gdp] pairs
    // const countryGDPArray = Object.entries(countryAverages);

    // // Sort the array by GDP value in descending order
    // const sortedCountryGDPArray = countryGDPArray.sort(
    //   (a: any, b: any) => b[1] - a[1]
    // );

    // // console.log(sortedCountryGDPArray);

    const twoDecimalPlaces = (val: number | null): number | null => {
      if (!val) return null;
      return +val.toFixed(2);
    };
    function transformData(data: any, selectedCategory: string) {
      // console.log(data);

      const years: any = {};
      data.map((cat: any) => {
        years[cat.Year] = twoDecimalPlaces(cat[selectedCategory]);
      });
      return years;
    }

    /** DATA PROCESSING */
    const worldData: any = {};
    for (let d of ng.data.countries) {
      const name = d.country;
      const code = d.code;
      const year = ng.data.year;
      const selectedCategory = ng.selectedCategory;
      const average = twoDecimalPlaces(countryAverages[name]) ?? 0;
      const color = colorScale(average);

      worldData[d.country] = {
        name,
        code,
        year,
        average,
        color,
        selectedCategory,
        [ng.title]: transformData(d[ng.title], selectedCategory),
      };
    }

    /** get geoData */
    const world = topojson.feature(geoData, geoData.objects.countries) as any;

    /** Add the countries */
    const countries = svg
      .selectAll('.country')
      .data(world.features)
      .enter()
      .append('path')
      .attr(
        'class',
        (d: any) => 'country_' + d.properties.name.replace(' ', '_')
      )
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', '#09119F')
      .style('stroke', 'black')
      .style('stroke-width', 0.5)
      .style('opacity', 0.8);

    /** Create the tooltip div */
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    /** Draw the legend */
    ng.legend({ svg, height, width });

    /** fill map color */
    countries
      .attr('fill', (d: any) => {
        const countryName = d.properties.name;
        return worldData[countryName]
          ? worldData[countryName].color
          : 'black';
      })
      .attr('stroke', '#000566') // Set the stroke color for the country borders
      .attr('stroke-width', '1px')
      .on('click', (event: PointerEvent, d: any) => {
        let countryName = d.properties.name;
        const country = worldData[countryName];
        console.log(country);

        // TODO: Open popup with web data
      })
      .on('mouseover', function (event: PointerEvent, d: any) {
        // TODO: extract tooltip to component
        // this.showTooltip(event, worldData[countryName]);

        // Highlight the country path
        d3.select(this).attr('stroke-width', '1px').attr('stroke', 'white');

        let countryName = d.properties.name;
        const country = worldData[countryName];

        if (!country) return;

        const tooltipOffsetX = 10; // Horizontal offset from the cursor position
        const tooltipOffsetY = 20;
        
        const formatValue = (val: any) => {
          const dollars = ['GDP per capita (constant 2015 US$)'];
          if (dollars.includes(country.selectedCategory))
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(val);
          return val;
        };

        // Show the tooltip
        tooltip
          .style('position', 'absolute')
          .style('opacity', 1)
          .style('left', event.pageX + tooltipOffsetX + 'px')
          .style('top', event.pageY + tooltipOffsetY + 'px')
          .style('width', '379px')
          .style('flex-shrink', 0)
          .style('border-radius', '12px')
          .style('background', '#FFF')
          .style('box-shadow', '4px 4px 4px 0px rgba(0, 0, 0, 0.35)').html(`
            <div class="p-5 space-y-3">
                <div class="flex justify-between">
                    <h2 class="font-bold text-[#09119F] text-xl">${countryName}</h2>
                    <h2  class="font-bold text-[#09119F] text-xl">${
                      country.year
                    }</h2>
                </div>
                <p class='data-point'>${ng.selectedCategory}</p>
                <p class='font-bold text-[#09119F]'>${formatValue(
                  country.average
                )}</p>
                <svg id="timeseries-chart" width="325" height="100"></svg>
            </div>
          `);

        const svg = d3.select('#timeseries-chart');

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 10, bottom: 20, left: 30 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

        // Append the SVG object to the body of the tooltip
        const chart = svg
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const arrayOfObjects = Object.entries(country[ng.title]).map(
          ([year, value]) => ({
            year: new Date(+year, 0, 1),
            value: value ?? 0,
          })
        );

        // Add X scale and axis
        const x = d3
          .scaleTime()
          .domain(d3.extent(arrayOfObjects, (d) => d.year) as any)
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
          .domain([0, d3.max(arrayOfObjects, (d: any) => d.value)] as any)
          .range([height, 0]);

        // Add the line
        chart
          .append('path')
          .datum(arrayOfObjects)
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
              .x((d: any) => x(d.year))
              .y((d: any) => y(d.value)) as any
          );
      })
      .on('mouseout', function (event, d) {
        // Hide the tooltip
        d3.select(this)
          .attr('stroke', '#000566') // Set the stroke color for the country borders
          .attr('stroke-width', '1px');
        tooltip.style('opacity', 0).style('left', '0px').style('top', '0px');
      });

    /** Code below adds 'drag' and 'zoom' */
    svg
      .call(
        d3.drag().on('drag', (event) => {
          const rotate = projection.rotate();
          const k = sensitivity / projection.scale();
          projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k,
            // rotate[1] /** disable Y rotation */,
          ]);
          path = d3.geoPath().projection(projection);
          svg.selectAll('path').attr('d', path as any);
        }) as any
      )
      .call(
        d3.zoom().on('zoom', (event) => {
          if (event.transform.k > 0.3) {
            projection.scale(initialScale * event.transform.k);
            path = d3.geoPath().projection(projection);
            svg.selectAll('path').attr('d', path as any);
            globe.attr('r', projection.scale());
          } else {
            event.transform.k = 0.3;
          }
        }) as any
      );

    /** --- Code below is for the Reset Rotation --- **/
    // Select the parent element where the button will be appended
    let parentEl = d3.select(`#${parentElement}`);
    // Ensure the parent element is positioned relatively
    parentEl.style('position', 'relative');
    // Assume zoom is the d3.zoom() behavior attached to your SVG
    let zoom = d3
      .zoom()
      // your zoom configuration here
      .on('zoom', zoomed);

    // Function to handle zooming
    function zoomed(event: any) {
      svg.attr('transform', event.transform);
    }
    // Append a button, set its text, and style it for top-left positioning
    let resetButton = parentEl
      .append('button')
      .text('Reset Rotation')
      .style('position', 'absolute')
      .style('top', '10px')
      .style('left', '10px')
      .on('click', () => {
        // Reset projection
        projection = d3
          .geoOrthographic()
          .scale(250)
          .center([0, 0])
          .rotate([0, 0])
          .translate([width / 2, height / 2]);

        // Redraw the globe and paths
        path = d3.geoPath().projection(projection);
        svg.selectAll('path').attr('d', path as any);
        globe.attr('r', projection.scale());

        // Reset zoom
        svg
          /** transition and duration might be smooth, but start at full page width */
          // .transition()
          // .duration(500)
          .call(zoom.transform as any, d3.zoomIdentity); // Reset zoom
      });
  }

  // Assuming you have a method to create and return a position strategy
  getPositionStrategy(x: number, y: number) {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: -10,
        },
      ]);
  }

  showTooltip(event: MouseEvent, country: any) {
    // Close any existing tooltip overlays
    this.hideTooltip();

    // Use the event coordinates to set up the initial position strategy
    const positionStrategy = this.getPositionStrategy(
      event.clientX,
      event.clientY
    );

    // Create the overlay with the initial position strategy
    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: false,
      panelClass: 'tooltip-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      height: '400px',
      width: '600px',
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    // Attach the TooltipComponent to the overlay
    const tooltipPortal = new ComponentPortal(
      TooltipComponent,
      this.viewContainerRef
    );
    const tooltipRef = this.overlayRef.attach(tooltipPortal);
    tooltipRef.instance.text = country.name;

    // // Function to update the position of the tooltip
    // const updatePosition = (e: MouseEvent) => {
    //   // Update the position strategy with the new mouse position
    //   this.overlayRef.updatePositionStrategy(
    //     this.getPositionStrategy(e.clientX, e.clientY)
    //   );
    //   // Manually trigger an update of the overlay's position
    //   this.overlayRef.updatePosition();
    // };

    // // Add mouse move listener to update the tooltip position
    // window.addEventListener('mousemove', updatePosition);

    // // Subscribe to the overlay's disposal to remove the event listener
    // this.overlayRef.detachments().subscribe(() => {
    //   window.removeEventListener('mousemove', updatePosition);
    // });
  }

  hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private addResetRotation() {}

  private legend(earth: { svg: any; height: number; width: number }) {
    /** LEGEND */
    const legendWidth = 200;
    const legendHeight = 10;
    const legendPosition = {
      x: earth.width - legendWidth - 20,
      y: earth.height - legendHeight - 20,
    };

    // Create a legend group
    const legend = earth.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendPosition.x}, ${legendPosition.y})`);

    // Draw the legend gradient rectangles
    const defs = earth.svg.append('defs');
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
      .attr('stop-color', 'rgba(36, 212, 166, 0.2)');

    // Define the end of the gradient (100% opacity)
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(36, 212, 166, 1)');

    // Draw the legend rectangle and fill it with the gradient
    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#gradient)');

    // Add legend min/max labels
    legend
      .append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .style('text-anchor', 'start')
      .text('Low');

    legend
      .append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .style('text-anchor', 'end')
      .text('High');
  }

  private compareDataToWorld() {
    function findDifferences(array1: any, array2: any) {
      const uniqueInFirst = array1
        .filter((element: any) => !array2.includes(element))
        .sort();
      const uniqueInSecond = array2
        .filter((element: any) => !array1.includes(element))
        .sort();

      return {
        uniqueInFirst,
        uniqueInSecond,
      };
    }

    const array1 = this.data.world.objects.countries.geometries.map(
      (c: any) => c.properties.name
    );
    const array2 = this.data.countries.map((c: any) => c.country);
    const differences = findDifferences(array1, array2);

    const normalizeCountryName = (name: any) => {
      return name
        .toLowerCase()
        .replace(/\./g, '') // Remove periods
        .replace(/[^a-z\s]/g, '') // Remove punctuation
        .replace(/\b(islands?|isle|is)\b/g, 'is') // Standardize 'Islands' abbreviation
        .replace(/\b(republic|rep)\b/g, 'rep') // Standardize 'Republic' abbreviation
        .replace(/\bdemocratic\b/g, 'dem') // Standardize 'Democratic' abbreviation
        .replace(/\bthe\b/g, '') // Remove 'The' prefix
        .replace(/\s+/g, ' ') // Collapse multiple spaces to a single space
        .trim(); // Remove leading/trailing spaces
    };

    const findSimilarAndUniqueCountries = (worldArray: any, dataArray: any) => {
      const normalizedData = dataArray.map(normalizeCountryName);
      let matches: any = {};
      let uniqueInWorld: any = [];
      let uniqueInData = normalizedData.slice(); // Start with a copy of normalized data array

      worldArray.forEach((country: any) => {
        const normalizedCountry = normalizeCountryName(country);
        const indexInData = normalizedData.findIndex(
          (dataCountry: any) =>
            dataCountry === normalizedCountry ||
            dataCountry.includes(normalizedCountry) ||
            normalizedCountry.includes(dataCountry)
        );

        if (indexInData > -1) {
          // If a match is found, add to matches and remove from uniqueInData
          matches[country] = dataArray[indexInData];
          uniqueInData.splice(indexInData, 1);
        } else {
          // If no match is found, add to uniqueInWorld
          uniqueInWorld.push(country);
        }
      });

      return {
        similar: matches,
        uniqueInWorld: uniqueInWorld,
        uniqueInData: uniqueInData.map(
          (name: any, index: any) => dataArray[index]
        ), // Map back to original names
      };
    };

    console.log('GeoData from World:', differences.uniqueInFirst);
    console.log('Data from Team:', differences.uniqueInSecond);
    const results = findSimilarAndUniqueCountries(
      differences.uniqueInFirst,
      differences.uniqueInSecond
    );

    console.log('Similar countries:', results.similar);
    console.log('Unique in world array:', results.uniqueInWorld);
    console.log('Unique in data array:', results.uniqueInData);
  }
}
