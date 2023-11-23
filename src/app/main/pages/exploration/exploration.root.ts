import { Component } from '@angular/core';

@Component({
  templateUrl: './exploration.root.html',
})
export class ExplorationPage {
  routes = [
    {
      route: 'economy',
      title: 'Economy',
    },
    {
      route: 'education',
      title: 'Education',
    },
    {
      route: 'environment',
      title: 'Environment',
    },
    {
      route: 'correlation',
      title: 'Correlation',
    },
  ];
  isTooltipVisible = false;
  tooltipContent = '';
  tooltipStyle = {};

  showTooltip(event: MouseEvent, content: string) {
    this.tooltipContent = content;
    this.tooltipStyle = {
      left: `${event.x + 20}px`,
      top: `${event.y - 25}px`, // Adjust as needed for positioning
    };
    this.isTooltipVisible = true;
  }

  hideTooltip() {
    this.isTooltipVisible = false;
    this.tooltipStyle = {
      left: `0px`,
      top: `0px`, // Adjust as needed for positioning
    };
  }
}
