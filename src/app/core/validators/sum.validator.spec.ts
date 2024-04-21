import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import {sumValidator} from "./sum.validator";

describe('sumValidator', () => {

  let control: AbstractControl;

  beforeEach(() => {
    control = new FormGroup({
      standard: new FormControl(),
      premium: new FormControl()
    });
  });

  it('should return null when sum is positive', () => {
    control.get('standard')!.setValue(5);
    control.get('premium')!.setValue(5);

    expect(sumValidator()(control)).toBeNull();
  });

  it('should return error when sum is zero', () => {
    control.get('standard')!.setValue(0);
    control.get('premium')!.setValue(0);

    expect(sumValidator()(control)).toEqual({ nonPositiveSum: true });
  });

  it('should return error when one of the values is negative', () => {
    control.get('standard')!.setValue(-5);
    control.get('premium')!.setValue(5);

    expect(sumValidator()(control)).toEqual({ nonPositiveSum: true });
  });
});
