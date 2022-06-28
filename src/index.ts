const DOI_VALIDATION_PATTERN = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i; // source: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
// const DOI_URL_PATTERN = /(?:https?:\/\/)?(?:dx\.)?(?:www\.)?doi.org\//;

const repos = {
  zenodo: '10.5281/zenodo.',
  elife: '10.7554/eLife.',
};

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
  return possibleDOI.match(DOI_VALIDATION_PATTERN) !== null;
}

/**
 * Normalize an input string to the component of the DOI
 *
 * @param possibleDOI
 * @returns a string if it is valid
 */
export function normalize(possibleDOI: string): string | undefined {
  let doi: string | undefined = undefined;
  if (validate(possibleDOI)) return possibleDOI;
  if (possibleDOI.startsWith('doi:')) {
    doi = possibleDOI.slice(4);
    if (validate(doi)) return doi;
  }
  try {
    const url = new URL(possibleDOI.startsWith('http') ? possibleDOI : `http://${possibleDOI}`);
    if (url.hostname.match(/(?:dx\.)?(?:www\.)?doi\.org/)) {
      doi = url.pathname.replace(/^\//, '');
    }
    if (url.hostname.match(/(?:^|\.)doi./) || url.pathname.includes('/doi/')) {
      doi = url.pathname.replace(/\/doi\//, '').replace(/^\//, '');
    }
    if (
      url.hostname.endsWith('elifesciences.org') &&
      url.pathname.startsWith('/articles/') &&
      !url.hash // Can have a #bib1 which we don't want
    ) {
      doi = `${repos.elife}${url.pathname.replace('/articles/', '')}`;
    }
    if (
      url.hostname.endsWith('zenodo.org') &&
      url.pathname.match(/^\/(?:record|badge\/latestdoi)\//)
    ) {
      doi = `${repos.zenodo}${url.pathname.replace(/^\/(?:record|badge\/latestdoi)\//, '')}`;
    }
  } catch (error) {
    // pass
  }
  if (validate(doi)) return doi;
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
