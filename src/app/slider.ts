import {
  trigger,
  transition,
  query,
  style,
  group,
  animate,
  animateChild,
} from '@angular/animations';

export const slider = trigger('routeAnimations', [
  transition(':increment', slideTo('bottom')),
  transition(':decrement', slideTo('top')),
]);

function slideTo(direction: string) {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          // top: 0,
          [direction]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('600ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))]),
    ]),
  ];
}
