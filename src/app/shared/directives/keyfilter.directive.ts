import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * Directive to apply key filtering to an HTML input element
 */
@Directive({
    selector: '[particleKeyfilter]',
    standalone: true
})
export class KeyfilterDirective {
  private hostElement = inject<ElementRef<HTMLInputElement>>(ElementRef);


  /**
   * Array of keyboard key names that are always allowed
   * (arrow keys, backspace, delete, tab, escape)
   * @private
   */
  private static readonly ALLOWED_KEYS = [
    'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
    'Backspace', 'Delete', 'Tab', 'Esc', 'Escape', 'Home', 'End'
  ];

  /**
   * Array of keyboard alpha key names
   * @private
   */
  private static readonly ALPHA_KEYS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
  ];

  /**
   * Array of keyboard alpha key names
   * @private
   */
  private static readonly URL_TOKEN_KEYS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '-', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9'
  ];

  /**
   * The type of filtering to apply
   */
  @Input('particleKeyfilter')
  filterType: 'alpha' | 'numeric' | 'alphanumeric' | 'digits' | 'url-token' = null as any;

  /**
   * Whether spaces should be allowed (default false)
   */
  @Input()
  allowSpaces = false;

  /**
   * Determine if the input key is numeric (a digit)
   * @param key the key to test
   * @private
   */
  private static keyIsNumeric(key: string): boolean {
    return new RegExp('^\\d|[.-]$', 'g').test(key);
  }

  private static keyIsDigit(key: string): boolean {
    return new RegExp('^\\d$', 'g').test(key);
  }

  private static valueIsNumeric(value: string): boolean {
    return new RegExp('^(-?\\d+\\.\\d+)$|^(-?\\d+)$', 'g').test(value);
  }

  /**
   * Determine if the input key is an alpha key (a letter of
   * the English alphabet)
   * @param key the key to test
   * @private
   */
  private static keyIsAlpha(key: string): boolean {
    return KeyfilterDirective.ALPHA_KEYS.includes(key.toLowerCase());
  }

  private static keyIsUrlToken(key: string): boolean {
    return KeyfilterDirective.URL_TOKEN_KEYS.includes(key.toLowerCase());
  }

  /**
   * Filter out keys based on the specified filter type
   * @param event the keydown KeyboardEvent
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.filterType) {
      let preventDefault = true;
      const { key } = event;

      if (KeyfilterDirective.ALLOWED_KEYS.includes(key)) {
        preventDefault = false;
      } else if (this.allowSpaces && key === ' ') {
        preventDefault = false;
      } else if (this.filterType === 'alpha') {
        preventDefault = !KeyfilterDirective.keyIsAlpha(key);
      } else if (this.filterType === 'numeric') {
        preventDefault = !event.ctrlKey && !KeyfilterDirective.keyIsNumeric(key);
      } else if (this.filterType === 'digits') {
        preventDefault = !KeyfilterDirective.keyIsDigit(key);
      } else if (this.filterType === 'url-token') {
        preventDefault = !KeyfilterDirective.keyIsUrlToken(key);
      } else if (this.filterType === 'alphanumeric') {
        const isNumeric = KeyfilterDirective.keyIsDigit(key);
        const isAlpha = KeyfilterDirective.keyIsAlpha(key);

        preventDefault = !(isNumeric || isAlpha);
      }

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }

  /**
   * Prevent paste if input contains forbidden characters
   * @param event the paste ClipboardEvent
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (this.filterType) {
      let clipboardData: DataTransfer = null as any;

      if (event.clipboardData) {
        clipboardData = event.clipboardData;
      } else if ('clipboardData' in window) {
        clipboardData = (window as any).clipboardData.getData('text');
      }

      if (clipboardData) {
        const pastedText = clipboardData.getData('text');

        for (const char of pastedText.toString()) {
          const isSpace = char === ' ';
          const isAlpha = KeyfilterDirective.keyIsAlpha(char);
          const isNumeric = KeyfilterDirective.keyIsNumeric(char);
          const isDigit = KeyfilterDirective.keyIsDigit(char);
          const isAlphaNumeric = isAlpha || isDigit;

          const charIsValid = (isSpace && this.allowSpaces) ||
            (this.filterType === 'alpha' && isAlpha) ||
            (this.filterType === 'numeric' && isNumeric) ||
            (this.filterType === 'digits' && isDigit) ||
            (this.filterType === 'alphanumeric' && isAlphaNumeric);

          if (!charIsValid) {
            event.preventDefault();
          }
        }
      }
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.filterType === 'numeric' && !KeyfilterDirective.valueIsNumeric(this.hostElement.nativeElement.value)) {
      this.hostElement.nativeElement.value = '';
    }
  }
}
