import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild, inject } from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ColorPickerText} from '../../models/particle-component-text.model';
import { NgClass } from '@angular/common';

/**
 * Component that wraps the native HTML5 color picker for supported browsers
 */
@Component({
  selector: 'particle-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [NgClass, FormsModule]
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit {
  private renderer = inject(Renderer2);
  private changeDetectorRef = inject(ChangeDetectorRef);


  /**
   * Regex to match a hexadecimal string (000000)
   * @private
   */
  private static readonly FULL_HEX_REGEX = new RegExp('^[0-9A-Fa-f]{6}$');

  /**
   * Regex to match a short hexadecimal string (000)
   * @private
   */
  private static readonly SHORT_HEX_REGEX = new RegExp('^[0-9A-Fa-f]{3}$');

  /**
   * Regex to match a valid hex character (A-F, a-f, 0-9)
   * @private
   */
  private static readonly HEX_CHARACTER_REGEX = new RegExp('^[0-9A-Fa-f]$');

  /**
   * Navigation keys
   * @private
   */
  private static readonly NAVIGATION_KEYS = [
    'Enter', 'Esc', 'Escape', 'Tab', 'Shift',
    'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
    'Backspace', 'Delete'
  ];

  /**
   * Set the value of the color picker
   * @param value the value to set
   */
  @Input()
  set value(value: string) {
    let hexString = value ?? '';

    if (hexString) {
      ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
      ColorPickerComponent.SHORT_HEX_REGEX.lastIndex = 0;

      hexString = hexString.replace('#', '').toLowerCase();

      if (ColorPickerComponent.SHORT_HEX_REGEX.test(hexString)) {
        hexString = ColorPickerComponent.expandShortHexString(hexString);
      }

      if (!ColorPickerComponent.FULL_HEX_REGEX.test(hexString)) {
        hexString = '';
      }
    }

    this._value = hexString;

    if (this.colorInput) {
      this.colorInput.nativeElement.value = this._value;
    }
  }

  /**
   * Set disabled
   * @param disabled whether or not the control should be disabled
   */
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * Class list to apply to the hex string input
   */
  @Input()
  classList: string = null as any;

  @Input()
  text = {
    chooseColor: 'Choose a Color',
    enterHexCode: 'Enter a Hex Code'
  } as ColorPickerText;

  /**
   * Event emitted on hex string input event. Emits the current value of the input
   */
  @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
  input = new EventEmitter<string>();

  /**
   * Event emitted on color selection from color picker (color picker widget dismissed)
   * or valid hex string typed in input. Emits the current value of the input
   */
  @Output()
  colorSelected = new EventEmitter<string>();

  /**
   * ViewChild of the color input element
   */
  @ViewChild('colorInput')
  colorInput: ElementRef<HTMLInputElement> = null as any;

  /**
   * Whether to render the component
   */
  render: boolean = false;

  /**
   * Whether the native HTML5 color picker is supported
   */
  colorPickerSupported: boolean = false;

  /**
   * The value of the color picker
   */
  _value = '';

  /**
   * Whether the color picker is disabled
   * @private
   */
  _disabled = false;

  /**
   * Expand a short hex string (#abc) into its full form (#aabbcc)
   * @param hexString the short hex string to expand
   * @private
   */
  private static expandShortHexString(hexString: string): string {
    let fullHexString = '';

    for (let i = 0; i <= 2; i++) {
      fullHexString += `${hexString[i]}${hexString[i]}`;
    }

    return fullHexString;
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
   * Init component, check for color picker browser support
   */
  ngOnInit(): void {
    this.colorPickerSupported = this.isColorPickerSupported();
    this.render = true;
  }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: string): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register on change function
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register on touched function
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set whether the control should be disabled
   * @param isDisabled disabled or not
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Prevent illegal input
   * @param event the keydown KeyboardEvent
   */
  handleKeyDown(event: KeyboardEvent): void {
    const {key} = event;
    const {selectionStart, selectionEnd, value} = event.target as HTMLInputElement;

    if (!ColorPickerComponent.NAVIGATION_KEYS.includes(key) && !event.ctrlKey) {
      ColorPickerComponent.HEX_CHARACTER_REGEX.lastIndex = 0;

      const preventDefault = !ColorPickerComponent.HEX_CHARACTER_REGEX.test(key) ||
        (value.length >= 6 && (selectionStart === selectionEnd));

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }

  /**
   * Update model
   * @param value the new value of the model
   * @param emitColorSelected whether or not emit the color selected event
   * @private
   */
  updateModel(value: string, emitColorSelected = false): void {
    ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
    let updateValue = value;

    if (updateValue) {
      updateValue = updateValue.replace('#', '');
    }

    if (!this._disabled && ColorPickerComponent.FULL_HEX_REGEX.test(updateValue)) {
      const valueBeforeUpdate = this._value;
      this.value = updateValue;

      if (valueBeforeUpdate !== this._value) {
        this.onChange(`#${updateValue}`);

        if (emitColorSelected) {
          this.colorSelected.emit(`#${updateValue}`);
        }
      }
    } else if (!value) {
      this.value = null as any;
      this.onChange(null);
    }
  }

  /**
   * Null out value on blur if not valid hex string, otherwise update model
   * @param value the value to check
   */
  handleBlur(value: string): void {
    ColorPickerComponent.SHORT_HEX_REGEX.lastIndex = 0;
    ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;

    if (ColorPickerComponent.SHORT_HEX_REGEX.test(value)) {
      this.updateModel(ColorPickerComponent.expandShortHexString(value), true);
    } else if (ColorPickerComponent.FULL_HEX_REGEX.test(value)) {
      this.updateModel(value, true);
    } else {
      this.value = null as any;
      this.onChange(null);
    }
  }

  /**
   * Prevent pasting a non-hex string
   * @param event the paste ClipboardEvent
   */
  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (!this._disabled) {
      let clipboardData: DataTransfer = null as any;

      if (event.clipboardData) {
        clipboardData = event.clipboardData;
      } else if ('clipboardData' in window) {
        clipboardData = (window as any).clipboardData.getData('text');
      }

      if (clipboardData) {
        ColorPickerComponent.FULL_HEX_REGEX.lastIndex = 0;
        const pastedText = clipboardData.getData('text')
          .replace('#', '');

        if (ColorPickerComponent.FULL_HEX_REGEX.test(pastedText)) {
          this.updateModel(pastedText);
        }
      }
    }
  }

  /**
   * Determine if the browser supports the HTML5 color picker
   * @private
   */
  private isColorPickerSupported(): boolean {
    let colorPickerSupported = false;

    try {
      const inputElement: HTMLInputElement = this.renderer.createElement('input');
      inputElement.type = 'color';
      inputElement.value = '!';

      colorPickerSupported = inputElement.type === 'color' && inputElement.value !== '!';
    } catch (e) {
      //console.log(e);
    }

    return colorPickerSupported;
  }
}
