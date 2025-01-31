import { Component, OnInit, inject } from '@angular/core';
import {Theme} from './shared/models/theme.model';
import {ThemingService} from './shared/services/theming.service';
import {RouterOutlet} from '@angular/router';
import {ScrollToTopComponent} from './shared/components/scroll-to-top/scroll-to-top.component';
import {NotificationComponent} from './shared/components/notification/notification.component';

/**
 * App Component to test out stuff built here. Not useful for anything else. Should not be exported by this package.
 */
@Component({
    selector: 'particle-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, ScrollToTopComponent, NotificationComponent]
})
export class AppComponent implements OnInit {
  private themingService = inject(ThemingService);

  themes: Array<Theme> = [
    {
      themeId: 'b170c2d1-5ce4-449b-9519-0b7082be9200',
      isDefault: true,
      name: 'Default',
      layoutColors: {
        menuColor: '#3f6570',
        headerColor: '#1f5a69',
        footerColor: '#4d4d4d',
        bodyColor: '#d9d9d9',
        contentColor: '#FEFEFE',
      },
      colorPalette: {
        bgRed: '#823841',
        bgOrange: '#946a15',
        bgYellow: '#7a7626',
        bgGreen: '#447d4c',
        bgBlue: '#317d99',
        bgPurple: '#7b507d',
        bgBrown: '#67523f',
        bgGrey: '#707070',
        extension: [
          {className: 'bg_red_alt', color: '#944646'},
          {className: 'bg_orange_alt', color: '#a1660d'},
          {className: 'bg_yellow_alt', color: '#7a7a0f'},
          {className: 'bg_green_alt', color: '#37852b'},
          {className: 'bg_blue_alt', color: '#0b799e'},
          {className: 'bg_purple_alt', color: '#8a4878'},
          {className: 'bg_brown_alt', color: '#6b6032'},
          {className: 'bg_grey_alt', color: '#616161'},
          {className: 'test_combo', color: '#333333', textColor: '#ad9103'},
          {className: 'bg_empty', textColor: '#333333'}
        ],
      },
      buttonColorPalette: {
        cancelButtonColor: '#7e7e7e',
        closeButtonColor: '#444141',
        deleteButtonColor: '#944646',
        okButtonColor: '#0b799e',
        nextButtonColor: '#0187be',
        openButtonColor: '#572e6c',
        previousButtonColor: '#396b80',
        saveButtonColor: '#37852b'
      },
      layoutVariables: {
        headerHeight: '100px',
        footerHeight: '0',
        menuWidth: '250'
      },
      fonts: [
        {name: 'Roboto'},
        {name: 'Montserrat', isDefault: true}
      ],
      accessibility: {
        enabled: true,
        hoverEnabled: false,
        highlightColor: '#0b799e',
        highlightOffset: '1px',
        highlightThickness: '2px'
      },
      stylingVariables: {
        inputHeight: '50px',
        inputTextSize: '14pt',
        inputLabelSize: '12pt',
        borderRadius: '5px',
        borderSize: '1px',
        borderColor: '#e7e7e7',
        inputBgColor: '#ffffff',
        inputPadding: '0 10px',
        tooltipBackgroundColor: '#eeeeee',
        tooltipTextSize: '16px',
        tooltipBorderColor: '#555555',
        tooltipBorderSize: '2px',
        tooltipCaretSize: '8px'
      }
    } as Theme,
    {
      themeId: 'c12fd008-88eb-49ec-bcfe-bb4cfced56a5',
      isDefault: false,
      name: 'Other',
      layoutColors: {
        menuColor: '#230e26',
        headerColor: '#2c0a38',
        footerColor: '#192752',
        bodyColor: '#151515',
        contentColor: '#000000',
      },
      colorPalette: {
        bgRed: '#910f20',
        bgOrange: '#9f6f03',
        bgYellow: '#6e680d',
        bgGreen: '#1c962a',
        bgBlue: '#1a5d75',
        bgPurple: '#56185b',
        bgBrown: '#493c31',
        bgGrey: '#4b4848',
        extension: [
          {className: 'bg_red_alt', color: '#944646'},
          {className: 'bg_orange_alt', color: '#a1660d'},
          {className: 'bg_yellow_alt', color: '#7a7a0f'},
          {className: 'bg_green_alt', color: '#37852b'},
          {className: 'bg_blue_alt', color: '#0b799e'},
          {className: 'bg_purple_alt', color: '#8a4878'},
          {className: 'bg_brown_alt', color: '#6b6032'},
          {className: 'bg_grey_alt', color: '#616161'},
        ],
      },
      buttonColorPalette: {
        cancelButtonColor: '#616161',
        closeButtonColor: '#444141',
        deleteButtonColor: '#944646',
        okButtonColor: '#0b799e',
        nextButtonColor: '#a1660d',
        openButtonColor: '#544310',
        previousButtonColor: '#8a4878',
        saveButtonColor: '#37852b'
      },
      layoutVariables: {
        headerHeight: '150px',
        footerHeight: '0',
        menuWidth: '300'
      },
      fonts: [
        {name: 'acumin-pro', id: 'gna4twy', source: 'adobe', isSerif: false, isDefault: true},
        {name: 'Open Sans'}
      ],
      accessibility: {
        enabled: true,
        hoverEnabled: true,
        highlightColor: '#0b799e',
        highlightOffset: '1px',
        highlightThickness: '2px'
      }
    } as Theme
  ];

  ngOnInit(): void {
    this.themingService.appInit('particle_ng', this.themes);
  }
}
