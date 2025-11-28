import { SajuInput } from './types/saju';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSajuInput(input: Partial<SajuInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: '이름을 입력해주세요.' });
  } else if (input.name.length < 2 || input.name.length > 10) {
    errors.push({ field: 'name', message: '이름은 2-10자 사이여야 합니다.' });
  }

  // Birth date validation
  if (!input.birthDate) {
    errors.push({ field: 'birthDate', message: '생년월일을 선택해주세요.' });
  } else {
    const year = input.birthDate.getFullYear();
    if (year < 1900 || year > 2100) {
      errors.push({ field: 'birthDate', message: '올바른 생년월일을 입력해주세요.' });
    }
  }

  // Birth time validation
  if (input.birthTime === undefined || input.birthTime === null) {
    errors.push({ field: 'birthTime', message: '출생시간을 선택해주세요.' });
  } else if (input.birthTime < 0 || input.birthTime > 23) {
    errors.push({ field: 'birthTime', message: '올바른 시간을 선택해주세요 (0-23).' });
  }

  // Gender validation
  if (!input.gender) {
    errors.push({ field: 'gender', message: '성별을 선택해주세요.' });
  } else if (input.gender !== 'male' && input.gender !== 'female') {
    errors.push({ field: 'gender', message: '올바른 성별을 선택해주세요.' });
  }

  return errors;
}

export function getErrorMessage(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
