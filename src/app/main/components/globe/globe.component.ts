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
  @Input() data: any[];
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
    const geoData = (await d3.json('assets/world.json')) as any;

    this.initGlobe('globe-data', geoData, this.globeContainer.nativeElement);
  }

  private async initGlobe(
    parentElement: string,
    geoData: any,
    container: HTMLElement
  ): Promise<void> {
    const ng = this;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const sensitivity = 50;

    /** get geoData */
    const world = topojson.feature(geoData, geoData.objects.countries) as any;

    let projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([100, 0])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    let path = d3.geoPath().projection(projection);

    const colorScale = d3
      .scaleLinear()
      .domain([0, 1]) // Assuming the value is normalized between 0 and 1
      .range(['rgba(36, 212, 166, 0.2)', 'rgba(36, 212, 166, 1)'] as any);

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

    /** Code below add the countries */

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

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    let undefinedCount = 0;
    let definedCount = 0;

    /***#
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */
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

    const array1 = geoData.objects.countries.geometries.map(
      (c: any) => c.properties.name
    );
    const array2 = ng.data.map((c) => c.country);

    const differences = findDifferences(array1, array2);
    



    function normalizeCountryName(name: any) {
      return name.toLowerCase()
          .replace(/\./g, '') // Remove periods
          .replace(/[^a-z\s]/g, '') // Remove punctuation
          .replace(/\b(islands?|isle|is)\b/g, 'is') // Standardize 'Islands' abbreviation
          .replace(/\b(republic|rep)\b/g, 'rep') // Standardize 'Republic' abbreviation
          .replace(/\bdemocratic\b/g, 'dem') // Standardize 'Democratic' abbreviation
          .replace(/\bthe\b/g, '') // Remove 'The' prefix
          .replace(/\s+/g, ' ') // Collapse multiple spaces to a single space
          .trim(); // Remove leading/trailing spaces
  }
  
  function findSimilarAndUniqueCountries(worldArray: any, dataArray: any) {
      const normalizedData = dataArray.map(normalizeCountryName);
      let matches: any = {};
      let uniqueInWorld: any = [];
      let uniqueInData = normalizedData.slice(); // Start with a copy of normalized data array
  
      worldArray.forEach((country: any) => {
          const normalizedCountry = normalizeCountryName(country);
          const indexInData = normalizedData.findIndex((dataCountry: any) => dataCountry === normalizedCountry || dataCountry.includes(normalizedCountry) || normalizedCountry.includes(dataCountry));
          
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
          uniqueInData: uniqueInData.map((name: any, index: any) => dataArray[index]) // Map back to original names
      };
  }
  

  // console.log('GeoData from World:', differences.uniqueInFirst);
  // console.log('Data from Team:', differences.uniqueInSecond);
  const results = findSimilarAndUniqueCountries(differences.uniqueInFirst, differences.uniqueInSecond);
  
  console.log('Similar countries:', results.similar);
  console.log('Unique in world array:', results.uniqueInWorld);
  console.log('Unique in data array:', results.uniqueInData);

    /****#
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */
    let countryInfo: any = {};
    geoData.objects.countries.geometries.slice(0, 5).forEach((d: any) => {
      let randomValue = Math.random(); // Normalized value between 0 and 1
      let countryName = d.properties.name;

      console.log(countryName);

      const category = ng.data.find((c) => c.country === d.countryName);
      console.log(category);

      if (category === undefined) undefinedCount++;
      if (category !== undefined) definedCount++;

      countryInfo[countryName] = {
        name: countryName,
        value: randomValue,
        color: colorScale(randomValue), // Assign color based on the value
        // [ng.selectedCategory]: ng.data.find((c) => c.country === countryName)[
        //   ng.selectedCategory
        // ],
      };
    });

    console.log(undefinedCount);
    console.log(definedCount);

    /** fill map color */
    countries
      .attr('fill', (d: any) => {
        const countryName = d.properties.name;
        return countryInfo[countryName]
          ? countryInfo[countryName].color
          : 'transparent';
      })
      .attr('stroke', '#000566') // Set the stroke color for the country borders
      .attr('stroke-width', '1px')
      // .on('click', (event: PointerEvent, d: any) => {
      //   const countryName = d.properties.name;
      //   console.log('Country Clicked', countryInfo[countryName]);
      //   this.showTooltip(event, countryInfo[countryName]);
      // });
      .on('mouseover', function (event: PointerEvent, d: any) {
        // Highlight the country path
        d3.select(this).attr('stroke-width', '1px').attr('stroke', 'white');

        let countryName = d.properties.name;
        const country = ng.data.find((c) => c.country === countryName);
        console.log(countryInfo[d.properties.name]);
        console.log(ng.data);

        let year = '2018';
        let tooltipOffsetX = 10; // Horizontal offset from the cursor position
        let tooltipOffsetY = 20;

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
          <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between;">
                  <h2>${countryName}</h2>
                  <h2>${ng.selectedCategory}</h2>
              </div>
              <p class='data-point'>Data Point</p>
              <p class='value'>Value</p>
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

        console.log(country);
        console.log(country[ng.title]);

        // Add X scale and axis
        const x = d3
          .scaleTime()
          .domain(
            d3.extent(country[ng.title], (d: any) => {
              console.log(d);
              console.log(ng.selectedCategory);

              return d[ng.selectedCategory];
            }) as any
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
          .domain([
            0,
            d3.max(country[ng.title], (d: any) => d[ng.selectedCategory]),
          ] as any)
          .range([height, 0]);

        // Add the line
        chart
          .append('path')
          .datum(country[ng.title])
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
}
