import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[jamClickOutsideDiv]',
  standalone: true,
})
export class ClickOutsideDivDirective {
  @Input() jamClickOutsideDiv: boolean;
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {
    
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {


    console.log(this.jamClickOutsideDiv);
    if (!this.jamClickOutsideDiv) {
      // If the condition is false, do nothing
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
