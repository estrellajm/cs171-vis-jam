import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rotating-earth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rotating-earth.component.html',
  styleUrls: ['./rotating-earth.component.scss'],
})
export class RotatingEarthComponent implements OnInit {
  ngOnInit() {
    d3.json('assets/world.json').then((data) => {
      this.initGlobe('rotating-globe', data);
    });
  }

  private initGlobe(parentElement: string, data: any): void {
    let width = 500;
    const height = 500;
    const sensitivity = 50;

    const projection = d3
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

    const globe = svg
      .append('circle')
      .attr('fill', '#070b5d')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.2')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', initialScale);

    // svg
    //   .call(
    //     d3.drag().on('drag', (event) => {
    //       const rotate = projection.rotate();
    //       const k = sensitivity / projection.scale();
    //       projection.rotate([
    //         rotate[0] + event.dx * k,
    //         rotate[1] - event.dy * k,
    //       ]);
    //       path = d3.geoPath().projection(projection);
    //       svg.selectAll('path').attr('d', path as any);
    //     }) as any
    //   )
    //   .call(
    //     d3.zoom().on('zoom', (event) => {
    //       if (event.transform.k > 0.3) {
    //         projection.scale(initialScale * event.transform.k);
    //         path = d3.geoPath().projection(projection);
    //         svg.selectAll('path').attr('d', path as any);
    //         globe.attr('r', projection.scale());
    //       } else {
    //         event.transform.k = 0.3;
    //       }
    //     }) as any
    //   );

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

    // rotate
    d3.timer(function (elapsed) {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();
      projection.rotate([rotate[0] + 1 * k, rotate[1]]);
      path = d3.geoPath().projection(projection);
      svg.selectAll('path').attr('d', path as any);
    }, 200);
  }
}
