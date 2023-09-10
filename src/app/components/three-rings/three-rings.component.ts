import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-three-rings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three-rings.component.html',
  styleUrls: ['./three-rings.component.scss'],
})
export class ThreeRingsComponent {
  private element = inject(ElementRef);

  constructor() {}

  ngOnInit(): void {
    this.createSvg();
  }

  private createSvg(): void {
    const svg = d3.select('figure#rings')
      .append('svg')
      .attr('width', 250)
      .attr('height', 250);
  
    // Add defs and filters
    const defs = svg.append('defs');
  
    // Create filter0
    const filter0 = defs.append('filter')
      .attr('id', 'filter0_i_19_415')
      .attr('x', 37)
      .attr('y', 63)
      .attr('width', 174)
      .attr('height', 174)
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('color-interpolation-filters', 'sRGB');
  
    // Continue to add filter elements for filter0
    // ... same as before ...
  
    // Create filter1
    const filter1 = defs.append('filter')
      .attr('id', 'filter1_f_19_415')
      .attr('x', 174)
      .attr('y', 80)
      .attr('width', 34)
      .attr('height', 34)
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('color-interpolation-filters', 'sRGB');
  
    // Add elements for filter1
    // ... same as filter0 but with different attributes ...
  
    // Create filter2
    const filter2 = defs.append('filter')
      .attr('id', 'filter2_f_19_415')
      .attr('x', 44)
      .attr('y', 87)
      .attr('width', 34)
      .attr('height', 34)
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('color-interpolation-filters', 'sRGB');
  
    // Add elements for filter2
    // ... same as filter0 and filter1 but with different attributes ...
  
    // Add SVG elements that use these filters
    const circle = svg.append('circle')
      .attr('cx', 125)
      .attr('cy', 125)
      .attr('r', 40)
      .attr('filter', 'url(#filter0_i_19_415)');
        
    // Continue to add other elements and attributes to match your original SVG
    // ...
  
    const rect = svg.append('rect')
      .attr('x', 50)
      .attr('y', 50)
      .attr('width', 150)
      .attr('height', 150)
      .attr('fill', 'green');
  
    // Add any additional SVG elements you may have in your original SVG
  }
  
}
