import { validate, buildUrl, normalize, validatePart } from './index';

describe('validate', () => {
  test('should return true if doi is correct', () => {
    expect(validate('10.1234/56789')).toBe(true);
  });

  test('empty is not a validPart', () => {
    expect(validatePart()).toBe(false);
    expect(validatePart('')).toBe(false);
  });

  test('empty is not valid', () => {
    expect(validate()).toBe(false);
    expect(validate('')).toBe(false);
  });

  test.each([
    'https://doi.org/10.1371/journal.pclm.0000068',
    'doi:10.1234/56789',
    '10.1234/56789',
    'doi.org/10.1371/journal.pclm.0000068',
  ])('Validate works for %p', (valid) => {
    expect(validate(valid)).toBe(true);
  });

  // can expand on here if needed
  test.each([
    'https://doi.org/10.1371/journal.pclm.0000068',
    ':10.1234/56789a',
    'doi:10.1234/56789',
  ])('should not validatePart when it is %p', (invalid) => {
    expect(validatePart(invalid)).toBe(false);
  });
});

describe('buildDoiUrl', () => {
  test('should build doi.org url with doi', () => {
    expect(buildUrl('10.1234/56789')).toBe('https://doi.org/10.1234/56789');
  });

  test.each([
    ['http://dx.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://www.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://doi.org/10.1016/j.cageo.2015.09.015'],
    ['www.doi.org/10.1016/j.cageo.2015.09.015'],
    ['doi.org/10.1016/j.cageo.2015.09.015'],
    ['doi.something.else/10.1016/j.cageo.2015.09.015'],
    ['something.else/doi/10.1016/j.cageo.2015.09.015'],
  ])('should normalize url when it is %p', (doi) => {
    expect(buildUrl(doi)).toBe('https://doi.org/10.1016/j.cageo.2015.09.015');
  });
});

describe('normalize', () => {
  test('should remove "doi:"', () => {
    expect(normalize('doi:10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url', () => {
    expect(normalize('doi.org/10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url with http protocol', () => {
    expect(normalize('https://doi.org/10.1234/56789')).toBe('10.1234/56789');
  });

  test('should handle www.', () => {
    expect(normalize('http://www.doi.org/10.1234/56789')).toBe('10.1234/56789');
  });
});

describe('external DOI links', () => {
  test('Pull out domains that look like DOIs (subdomain)', () => {
    expect(normalize('https://doi.pangaea.de/10.1594/PANGAEA.941238')).toBe(
      '10.1594/PANGAEA.941238'
    );
  });
  test('Pull out domains that look like DOIs (url)', () => {
    expect(normalize('https://pangaea.de/doi/10.1594/PANGAEA.941238')).toBe(
      '10.1594/PANGAEA.941238'
    );
  });
  test('eLife', () => {
    expect(normalize('https://elifesciences.org/articles/59045')).toBe('10.7554/eLife.59045');
  });
  test('zenodo', () => {
    expect(normalize('https://zenodo.org/badge/latestdoi/169800572')).toBe(
      '10.5281/zenodo.169800572'
    );
    expect(normalize('https://zenodo.org/record/169800572')).toBe('10.5281/zenodo.169800572');
  });
  test('joss', () => {
    expect(normalize('https://joss.theoj.org/papers/10.21105/joss.04767')).toBe(
      '10.21105/joss.04767'
    );
  });
});
