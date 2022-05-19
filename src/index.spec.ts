import { validate, buildUrl, normalize } from './index'

describe('validateDoi', () => {
  test('should return true if doi is correct', () => {
    expect(validate('10.1234/56789')).toBe(true)
  })

  // can expand on here if needed
  test('should return false if doi is incorrect', () => {
    expect(validate(':10.1234/56789a')).toBe(false)
  })
})

describe('buildDoiUrl', () => {
  test('should build doi.org url with doi', () => {
    expect(buildUrl('10.1234/56789')).toBe('https://doi.org/10.1234/56789')
  })

  test.each([
    ['http://dx.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://www.doi.org/10.1016/j.cageo.2015.09.015'],
    ['http://doi.org/10.1016/j.cageo.2015.09.015'],
    ['doi.org/10.1016/j.cageo.2015.09.015'],
  ])('should normalize url when it is %p', (doi) => {
    expect(buildUrl(doi)).toBe('https://doi.org/10.1016/j.cageo.2015.09.015')
  })
})

describe('normalize', () => {
  test('should remove "doi:"', () => {
    expect(normalize('doi:10.1234/56789')).toBe('10.1234/56789')
  })

  test('should extract doi from doi.org url', () => {
    expect(normalize('doi.org/10.1234/56789')).toBe('10.1234/56789')
  })

  test('should extract doi from doi.org url with http protocol', () => {
    expect(normalize('https://doi.org/10.1234/56789')).toBe('10.1234/56789')
  })

  test('should handle www.', () => {
    expect(normalize('http://www.doi.org/10.1234/56789')).toBe('10.1234/56789')
  })
})
