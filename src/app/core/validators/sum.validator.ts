import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function sumValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const standard = group.get('standard')?.value || 0;
    const premium = group.get('premium')?.value || 0;

    return (standard + premium > 0) && !(standard < 0) && !(premium < 0) ? null : { nonPositiveSum: true };
  };
}
