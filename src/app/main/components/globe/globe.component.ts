import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'jam-globe-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div #globeContainer id="globe-data" class="w-full h-full"></div>`,
})
export class GlobeEarthComponent implements OnInit, AfterViewInit {
  @ViewChild('globeContainer') globeContainer: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    d3.json('assets/world.json').then((data) => {
      this.initGlobe('globe-data', data, this.globeContainer.nativeElement);
    });
  }

  private initGlobe(
    parentElement: string,
    data: any,
    container: HTMLElement
  ): void {
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

    const svg = d3
      .select(`#${parentElement}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    d3.select(`#${parentElement}`);

    // Select the parent element where the button will be appended
    var parentEl = d3.select(`#${parentElement}`);

    // Ensure the parent element is positioned relatively
    parentEl.style('position', 'relative');

    // Assume zoom is the d3.zoom() behavior attached to your SVG
    var zoom = d3
      .zoom()
      // your zoom configuration here
      .on('zoom', zoomed);

    // Function to handle zooming
    function zoomed(event: any) {
      svg.attr('transform', event.transform);
    }

    // Append a button, set its text, and style it for top-left positioning
    var resetButton = parentEl
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

    const globe = svg
      .append('circle')
      .attr('fill', '#070b5d')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

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

    let map = svg.append('g');

    map
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr(
        'class',
        (d: any) => 'country_' + d.properties.name.replace(' ', '_')
      )
      .attr('d', path as any)
      .attr('fill', '#09119F')
      .style('stroke', 'black')
      .style('stroke-width', 0.5)
      .style('opacity', 0.8);
  }
}
