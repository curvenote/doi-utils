import { DEFAULT_RESOLVERS } from './resolvers';
import { validatePart } from './validatePart';

export { validatePart } from './validatePart';

/**
 * Validate that the input string is valid.
 *
 * Uses DOI pattern described here: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 *
 * @param possibleDOI
 * @returns true if DOI is valid
 */
export function validate(possibleDOI?: string): boolean {
  if (!possibleDOI) return false;
  return !!normalize(possibleDOI);
}

/**
 * Normalize an input string to the component of the DOI
 *
 * @param possibleDOI
 * @returns a string if it is valid
 */
export function normalize(possibleDOI: string): string | undefined {
  let doi: string | undefined = undefined;
  if (!possibleDOI) return undefined;
  if (validatePart(possibleDOI)) return possibleDOI;
  if (possibleDOI.startsWith('doi:')) {
    doi = possibleDOI.slice(4);
    if (validatePart(doi)) return doi;
  }
  try {
    const url = new URL(possibleDOI.startsWith('http') ? possibleDOI : `http://${possibleDOI}`);
    const resolver = DEFAULT_RESOLVERS.find((r) => r.test(url));
    if (!resolver) return undefined;
    doi = resolver.parse(url);
  } catch (error) {
    // pass
  }
  if (validatePart(doi)) return doi;
  return undefined;
}

/**
 * Builds a canonical URL pointing to https://doi.org
 *
 * @param possibleDOI
 * @returns the doi as a string
 */
export function buildUrl(possibleDOI: string): string | undefined {
  const doi = normalize(possibleDOI);
  if (!doi) return undefined;
  return `https://doi.org/${doi}`;
}

export default {
  validatePart,
  validate,
  normalize,
  buildUrl,
};
