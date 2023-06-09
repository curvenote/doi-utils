import { DEFAULT_RESOLVERS, STRICT_RESOLVERS } from './resolvers.js';
import { validatePart } from './validatePart.js';

export { DEFAULT_RESOLVERS, STRICT_RESOLVERS } from './resolvers.js';

export type Options = {
  strict?: boolean;
};

/**
 * Validate that the input string is valid.
 *
 * Uses DOI pattern described here: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 *
 * @param possibleDOI
 * @returns true if DOI is valid
 */
export function validate(possibleDOI?: string | null, opts?: Options): boolean {
  if (!possibleDOI) return false;
  return !!normalize(possibleDOI, opts);
}

/**
 * Normalize an input string to the component of the DOI
 *
 * @param possibleDOI
 * @returns a string if it is valid
 */
export function normalize(possibleDOI?: string | null, opts?: Options): string | undefined {
  let doi: string | undefined = undefined;
  if (!possibleDOI) return undefined;
  if (validatePart(possibleDOI)) return possibleDOI;
  if (possibleDOI.startsWith('doi:')) {
    doi = possibleDOI.slice(4);
    if (validatePart(doi)) return doi;
  }
  try {
    const url = new URL(possibleDOI.startsWith('http') ? possibleDOI : `http://${possibleDOI}`);
    const resolvers = opts?.strict ? STRICT_RESOLVERS : DEFAULT_RESOLVERS;
    const resolver = resolvers.find((r) => r.test(url));
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
export function buildUrl(possibleDOI?: string | null, opts?: Options): string | undefined {
  const doi = normalize(possibleDOI, opts);
  if (!doi) return undefined;
  return `https://doi.org/${doi}`;
}

export const doi = {
  validatePart,
  validate,
  normalize,
  buildUrl,
};
