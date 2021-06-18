import { trigger, sequence, state, animate, transition, style, query, keyframes, stagger } from '@angular/animations';

// first function block source:
// https://stackblitz.com/edit/wizdm-places?file=src%2Fapp%2Flogin%2Flogin-animations.ts
const $timing = '400ms cubic-bezier(0.5,0.5,0.5,1.0)';

export const $animations = [

  trigger('vanish', [
    transition('* => *', [
      style({ opacity: '0'}),
      animate($timing, style('*'))  
    ])
  ]),
  trigger('inflate', [
    transition(':enter', [
      style({ 
        opacity: '0', 
        height: '0',
        transform: 'rotateX(90deg)'
      }),
      animate($timing, style('*'))
    ]),
    transition(':leave', [
      animate($timing, style({ 
        opacity: '0', 
        height: '0',
        transform: 'rotateX(90deg)'
      }))
    ])
  ])
];


export const rowsAnimation =
    // trigger()
    trigger('rowsAnimation', [
      transition('void => *', [
        style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
        sequence([
          animate("1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'  })),
          animate("1s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
        ])
      ])
    ]);


export const inOutAnimation = trigger('inOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1s', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate(80, style({ opacity: 0 }))
  ])
]);

export const cardAnimation = trigger('cardAnimation', [
  // Transition from any state to any state
  transition('* => *', [
    // Initially the all cards are not visible
    query(':enter', style({ opacity: 0 }), { optional: true }),

    // Each card will appear sequentially with the delay of 300ms
    // query(':enter', stagger('300ms', [
    //   animate('.5s ease-in', keyframes([
    //     style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
    //     style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
    //     style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
    //   ]))]), { optional: true }),

    query(':enter', stagger('400ms', [
      animate('500ms ease-out', keyframes([
        style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
        style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
        style({ opacity: .7, transform: 'scale(1.1)', offset: 0.7 }),
        style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
      ]))]), { optional: true }),
    // Cards will disappear sequentially with the delay of 300ms
    query(':leave', stagger('100ms', [
      animate('500ms ease-out', keyframes([
        style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
        style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
        style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
      ]))]), { optional: true })
  ]),
])


export const plusAnimation = trigger('plusAnimation', [

  // Transition from any state to any state
  transition('* => *', [
    query('.plus-card', style({ opacity: 0, transform: 'translateY(-40px)' })),
    query('.plus-card', stagger('500ms', [
      animate('300ms 1.1s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ])),
  ])
])


export const timeAnimation = trigger('timeAnimation', [
  // Transition from any state to any state
  transition('* => *', [
    // Initially the all cards are not visible
    query(':enter', style({ opacity: 0 }), { optional: true }),

    // Each card will appear sequentially with the delay of 300ms
    query(':enter', stagger('100ms', [
      animate('.2s ease-in', keyframes([
        style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
        style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
        style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
      ]))]), { optional: true }),
    // Cards will disappear sequentially with the delay of 300ms
    query(':leave', stagger('50ms', [
      animate('100ms ease-out', keyframes([
        style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
        style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
        style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
      ]))]), { optional: true })
  ]),
])

export const openClose = trigger('openClose', [
  state('open', style({
      height: '*',
      opacity: 1,
  })),
  state('closed', style({
      height: '0',
      opacity: 0,
      visibility: 'hidden'
  })),
  transition('open => closed', [
      animate('.35s')
  ]),
  transition('closed => open', [
      animate('.35s')
  ]),
]);

export const openClose2 = trigger('openClose2', [
  state('check', style({
      height: '*',
      opacity: 1,
  })),
  state('closed', style({
      height: '0',
      opacity: 0,
      visibility: 'hidden'
  })),
  transition(':enter', [
      animate('.35s')
  ]),
  transition('closed => open', [
      animate('.35s')
  ]),
]);
