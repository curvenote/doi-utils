const DOI_VALIDATION_PATTERN = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i // source: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
const DOI_URL_PATTERN = /(?:https?:\/\/)?(?:dx\.)?(?:www\.)?doi.org\//

export function validate(v: string) {
  return v.match(DOI_VALIDATION_PATTERN) !== null
}

export function normalize(str: string) {
  if (str.startsWith('doi:')) {
    return str.substring(4)
  }
  return str.replace(DOI_URL_PATTERN, '')
}

export function buildUrl(doi: string) {
  return `https://doi.org/${normalize(doi)}`
}
