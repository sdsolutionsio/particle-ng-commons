import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {Component, inject, input} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {NotificationText} from '../../models/particle-component-text.model';
import {AsyncPipe, NgClass} from '@angular/common';

/**
 * Component for displaying notifications
 */
@Component({
  selector: 'particle-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query('@items', stagger(300, animateChild()), {optional: true})
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),
        animate('0.65s cubic-bezier(.8,-0.6,0.2,1.5)', style({transform: 'scale(1)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'scale(1)', opacity: 1, height: '*'}),
        animate('0.65s cubic-bezier(.8,-0.6,0.2,1.5)', style({
          transform: 'scale(0.5)',
          opacity: 0,
          height: '0px',
          marginLeft: '0px',
          marginTop: '0px',
          marginRight: '0px',
          marginBottom: '0px',
          paddingLeft: '0px',
          paddingTop: '0px',
          paddingRight: '0px',
          paddingBottom: '0px'
        }))
      ]),
    ])
  ],
  imports: [NgClass, AsyncPipe]
})
export class NotificationComponent {

  private notificationService = inject(NotificationService);

  readonly text = input<NotificationText>({
    dismiss: 'Dismiss'
  } as NotificationText);

  /**
   * Array of notifications as an Observable
   */
  readonly notifications$ = this.notificationService.getNotifications();

  /**
   * Map of notification severity to color class
   */
  readonly severityColorMap = {
    'success': 'bg_green',
    'warn': 'bg_orange',
    'error': 'bg_red',
    'info': 'bg_purple'
  };

  /**
   * Map of notification severity to icon class
   */
  readonly severityIconMap = {
    'success': 'fa-check-circle',
    'warn': 'fa-exclamation-circle',
    'error': 'fa-circle-xmark',
    'info': 'fa-info-circle'
  };

  /**
   * Delete a notification
   * @param id the ID of the notification to delete
   */
  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id);
  }
}
