const DOI_VALIDATION_PATTERN = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i; // source: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
// const DOI_URL_PATTERN = /(?:https?:\/\/)?(?:dx\.)?(?:www\.)?doi.org\//;

/**
 * Validate that the input DOI string is valid.
 *
 * Uses DOI pattern described here: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 *
 * @param possibleDOI
 * @returns true if DOI is valid
 */
export function validatePart(possibleDOI?: string): boolean {
  if (!possibleDOI) return false;
  return possibleDOI.match(DOI_VALIDATION_PATTERN) !== null;
}
