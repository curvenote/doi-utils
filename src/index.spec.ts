import { describe, expect, test } from 'vitest';
import { doi } from './index';

describe('validate', () => {
  test('should return true if doi is correct', () => {
    expect(doi.validate('10.1234/56789')).toBe(true);
  });

  test('empty is not a validPart', () => {
    expect(doi.validatePart()).toBe(false);
    expect(doi.validatePart('')).toBe(false);
  });

  test('empty is not valid', () => {
    expect(doi.validate()).toBe(false);
    expect(doi.validate('')).toBe(false);
  });

  test.each([
    'https://doi.org/10.1371/journal.pclm.0000068',
    'doi:10.1234/56789',
    '10.1234/56789',
    'doi.org/10.1371/journal.pclm.0000068',
  ])('Validate works for %p', (valid) => {
    expect(doi.validate(valid)).toBe(true);
  });

  // can expand on here if needed
  test.each([
    'https://doi.org/10.1371/journal.pclm.0000068',
    ':10.1234/56789a',
    'doi:10.1234/56789',
  ])('should not validatePart when it is %p', (invalid) => {
    expect(doi.validatePart(invalid)).toBe(false);
  });
});

describe('buildDoiUrl', () => {
  test('should build doi.org url with doi', () => {
    expect(doi.buildUrl('10.1234/56789')).toBe('https://doi.org/10.1234/56789');
  });

  test.each([
    ['http://dx.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://www.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://doi.org/10.1016/j.cageo.2015.09.015'],
    ['www.doi.org/10.1016/j.cageo.2015.09.015'],
    ['doi.org/10.1016/j.cageo.2015.09.015'],
    ['doi.something.else/10.1016/j.cageo.2015.09.015'],
    ['something.else/doi/10.1016/j.cageo.2015.09.015'],
  ])('should normalize url when it is %p', (doiString) => {
    expect(doi.buildUrl(doiString)).toBe('https://doi.org/10.1016/j.cageo.2015.09.015');
  });
});

describe('normalize', () => {
  test('should remove "doi:"', () => {
    expect(doi.normalize('doi:10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url', () => {
    expect(doi.normalize('doi.org/10.1234/56789')).toBe('10.1234/56789');
  });

  test('should extract doi from doi.org url with http protocol', () => {
    expect(doi.normalize('https://doi.org/10.1234/56789')).toBe('10.1234/56789');
  });

  test('should handle www.', () => {
    expect(doi.normalize('http://www.doi.org/10.1234/56789')).toBe('10.1234/56789');
  });
});

describe('external DOI links', () => {
  test.each([
    ['elife', 'https://elifesciences.org/articles/59045', '10.7554/eLife.59045'],
    [
      'wiley',
      'https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022GC010600',
      '10.1029/2022GC010600',
    ],
    [
      'plos',
      'https://journals.plos.org/climate/article?id=10.1371/journal.pclm.0000068',
      '10.1371/journal.pclm.0000068',
    ],
    ['zenodo', 'https://zenodo.org/badge/latestdoi/169800572', '10.5281/zenodo.169800572'],
    ['joss', 'https://joss.theoj.org/papers/10.21105/joss.04767', '10.21105/joss.04767'],
    ['pathnames', 'https://pangaea.de/doi/10.1594/PANGAEA.941238', '10.1594/PANGAEA.941238'],
    ['subdomains', 'https://doi.pangaea.de/10.1594/PANGAEA.941238', '10.1594/PANGAEA.941238'],
  ])('Test %s (%s) <%s>', (_, url, doiString) => {
    expect(doi.normalize(url)).toBe(doiString);
    expect(doi.validate(url)).toBe(true);
    expect(doi.validate(url, { strict: true })).toBe(false);
  });
});

describe('Open Funder Registry', () => {
  test.each([
    ['', false],
    ['http://www.doi.org/10.1234/56789', false],
    ['http://dx.doi.org/10.13039/100000879', true],
    ['10.13039/100000879', true],
  ])('Test %s <%s>', (doiString, result) => {
    expect(doi.isOpenFunderRegistry(doiString)).toBe(result);
  });
});
