import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, ViewChild, inject, input } from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, tap} from 'rxjs';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {PopoverComponent} from '../popover/popover.component';
import {CalendarComponent} from '../calendar/calendar.component';
import {DatePickerComponent} from '../date-picker/date-picker.component';
import {DateRangePickerText} from '../../models/particle-component-text.model';

@Component({
    selector: 'particle-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateRangePickerComponent),
            multi: true
        }
    ],
    imports: [NgClass, PopoverComponent, DatePickerComponent, FormsModule, CalendarComponent, AsyncPipe, DatePipe]
})
export class DateRangePickerComponent implements ControlValueAccessor, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);


  currentYear = new Date().getFullYear();
  _disabled = false;

  private _value$ = new BehaviorSubject<any>(null);

  private _lastValue: any = null as any;
  private _init = false;

  valueObs$ = this._value$.asObservable().pipe(tap(
    value => {
      let newValue = {start: null, end: null};
      if (value && value.start && value.end) {
        newValue = {start: value.start, end: value.end};
      }

      if (newValue !== this._lastValue) {
        this._lastValue = newValue;

        if (this._init) {
          this.onChange(this._lastValue);
        }
      }
    }
  ));

  readonly inputId = input<string>(null as any);

  readonly inputClassList = input('');

  readonly calendarButtonClassList = input('');

  readonly text = input({
    begin: 'Begin',
    end: 'End',
    done: 'Done',
    clear: 'Clear',
    openCalendar: 'Open Calendar',
    selectRange: 'Choose a Range'
} as DateRangePickerText);

  @Input()
  set dateRange(value: { minDate: Date, maxDate: Date }) {
    this._dateRange = value;

    if (this.value && this.value.start) {
      this._endDateRange = {
        minDate: this.value.start,
        maxDate: value.maxDate
      };
    } else {
      this._endDateRange = value;
    }
  }

  get dateRange(): { minDate: Date, maxDate: Date } {
    return this._dateRange;
  }

  get endDateRange(): { minDate: Date, maxDate: Date } {
    return this._endDateRange;
  }

  private _dateRange = {
    minDate: new Date(this.currentYear - 100, 0, 1),
    maxDate: new Date(this.currentYear + 100, 11, 31)
  };

  private _endDateRange = {
    minDate: new Date(this.currentYear - 100, 0, 1),
    maxDate: new Date(this.currentYear + 100, 11, 31)
  }

  @Input()
  set value(value: { start: Date, end: Date }) {
    if (!value) {
      value = {start: null as any, end: null as any};
    }

    this._value$.next(value);

    if (value) {
      this.beginDate = value.start;
    }
  }

  get value(): { start: Date, end: Date } {
    return this._lastValue;
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  readonly ariaLabel = input<string>(null as any);

  /**
   * Format for the selected date range in the selection preview. Must
   * be a valid Angular DatePipe format
   */
  readonly dateFormat = input('MM/dd/y');

  @ViewChild('calendarPopover')
  calendarPopover: PopoverComponent = null as any;

  @ViewChild('beginCalendar')
  beginCalendar: CalendarComponent = null as any;

  @ViewChild('endCalendar')
  endCalendar: CalendarComponent = null as any;

  ngAfterViewInit(): void {
    this._init = true;
  }

  get beginDate(): Date {
    if (this._value$.value) {
      return this._value$.value.start;
    }

    return null as any;
  }

  set beginDate(beginDate: Date) {
    const value = this._value$.value;
    value.start = beginDate;

    if (!beginDate && this.beginCalendar) {
      if (this.beginCalendar) {
        this.beginCalendar.clear();
      }
    }

    this._value$.next(value);

    if (!beginDate || beginDate > this.endDate) {
      this.endDate = null as any;
    }

    this._endDateRange = {
      minDate: beginDate,
      maxDate: this.dateRange.maxDate
    };
  }

  get endDate(): Date {
    if (this._value$.value) {
      return this._value$.value.end;
    }

    return null as any;
  }

  set endDate(endDate: Date) {
    if (this._value$.value && endDate < this._value$.value.start) {
      endDate = null as any;
      if (this.endCalendar) {
        this.endCalendar.clear();
      }
    }

    const value = this._value$.value;
    value.end = endDate;

    if (!endDate && this.endCalendar) {
      if (this.endCalendar) {
        this.endCalendar.clear();
      }
    }

    this._value$.next(value);
  }

  /**
   * Function to call on change
   */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {
  };

  /**
   * Function to call on touch
   */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {
  };

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: { start: Date, end: Date }): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register function on change
   * @param fn the function to change
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register function on touch
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   * @param isDisabled whether or not the control is disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  openCalendar(event: Event): void {
    if (!this.disabled) {
      this.calendarPopover.toggle(event);
    }
  }

  updateModel(isBegin: boolean, date: Date): void {
    if (isBegin) {
      this.beginDate = date;
    } else {
      this.endDate = date;
    }
  }

  checkState(): void {
    const val = this._value$.value;
    if (val && ((val.start > val.end) || !(val.start && val.end))) {
      this.clear();
    }
  }

  clear(): void {
    this.value = null as any;
  }

}
