import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RotatingEarthComponent } from '../../components/rotating-earth/rotating-earth.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, RotatingEarthComponent],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    this.addStars();
  }

  private addStars() {
    const container = this.el.nativeElement.querySelector(
      '.stars'
    );
    for (let i = 0; i < 500; i++) {
      // Number of stars
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');
      this.renderer.setStyle(star, 'left', `${Math.random() * 100}%`);
      this.renderer.setStyle(star, 'top', `${Math.random() * 100}%`);
      this.renderer.appendChild(container, star);
    }
  }
}
