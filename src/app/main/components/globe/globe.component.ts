import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('globeContainer') globeContainer: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    d3.json('assets/world.json').then((data) => {
      this.initGlobe('globe-data', data, this.globeContainer.nativeElement);
    });
  }

  private async initGlobe(
    parentElement: string,
    data: any,
    container: HTMLElement
  ): Promise<void> {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const sensitivity = 50;

    let projection = d3
      .geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, 0])
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
      .data(data.features)
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

    /** get geoData */
    const geoData = (await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
    )) as any;

    let countryInfo: any = {};
    geoData.objects.countries.geometries.forEach((d: any) => {
      let randomValue = Math.random(); // Normalized value between 0 and 1
      countryInfo[d.properties.name] = {
        name: d.properties.name,
        value: randomValue,
        color: colorScale(randomValue), // Assign color based on the value
      };
    });

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
      .on('click', (event: PointerEvent, d: any) => {
        const countryName = d.properties.name;
        console.log('Country Clicked', countryInfo[countryName]);
      })
      .on('mouseover', function (event: PointerEvent, d: any) {
        // Highlight the country path
        d3.select(this).attr('stroke-width', '1px').attr('stroke', 'white');

        let countryName = d.properties.name;
        let dataPoint = countryInfo[countryName]
          ? countryInfo[countryName].value.toFixed(2)
          : 'N/A';
        let year = '2018';

        let tooltipOffsetX = 10; // Horizontal offset from the cursor position
        let tooltipOffsetY = 20;

        const dummyData = [
          { year: new Date(2000, 0, 1), value: 30 },
          { year: new Date(2001, 0, 1), value: 50 },
          { year: new Date(2002, 0, 1), value: 45 },
          { year: new Date(2003, 0, 1), value: 70 },
          { year: new Date(2004, 0, 1), value: 60 },
          { year: new Date(2005, 0, 1), value: 90 },
        ];

        // Show the tooltip
        tooltip
          .style('position', 'absolute')
          .style('opacity', 1)
          .style('left', event.pageX + tooltipOffsetX + 'px')
          .style('top', event.pageY + tooltipOffsetY + 'px')
          .style('width', '379px')
          // .style('height', '280px')
          .style('flex-shrink', 0)
          .style('border-radius', '12px')
          .style('background', '#FFF')
          .style('box-shadow', '4px 4px 4px 0px rgba(0, 0, 0, 0.35)').html(`
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between;">
                    <h2>${countryName}</h2>
                    <h2>${year}</h2>
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

        // Add X scale and axis
        const x = d3
          .scaleTime()
          .domain(d3.extent(dummyData, (d: any) => d.year) as any)
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
          .domain([0, d3.max(dummyData, (d) => d.value)] as any)
          .range([height, 0]);

        // Add the line
        chart
          .append('path')
          .datum(dummyData)
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

  private addResetRotation() {}
}
