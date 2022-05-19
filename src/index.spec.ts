import { validateDoi, buildDoiUrl, sanitizeDoi } from './';

describe('validateDoi', () => {
  test('should return true if doi is correct', () => {
    expect(validateDoi('10.1234/56789')).toBe(true);
  });

  // can expand on here if needed
  test('should return false if doi is incorrect', () => {
    expect(validateDoi(':10.1234/56789a')).toBe(false);
  });
});

describe('buildDoiUrl', () => {
  test('should build doi.org url with doi', () => {
    expect(buildDoiUrl('10.1234/56789')).toBe('https://doi.org/10.1234/56789');
  });
});

describe('sanitizeDoi', () => {
  test('should remove "doi:"', () => {
    expect(sanitizeDoi('doi:10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url', () => {
    expect(sanitizeDoi('doi.org/10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url', () => {
    expect(sanitizeDoi('https://doi.org/10.1234/56789')).toBe('10.1234/56789');
  });
});
