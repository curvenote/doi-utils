import { validatePart } from './validatePart';

interface Resolver {
  test: (url: URL) => boolean;
  parse: (url: URL) => string;
}

const doiOrg: Resolver = {
  test(url) {
    return !!url.hostname.match(/(?:dx\.)?(?:www\.)?doi\.org/);
  },
  parse(url) {
    return url.pathname.replace(/^\//, '');
  },
};

const doiSubdomain: Resolver = {
  test(url) {
    return !!url.hostname.match(/(?:^|\.)doi./) || url.pathname.includes('/doi/');
  },
  parse(url) {
    return url.pathname.replace(/\/doi\//, '').replace(/^\//, '');
  },
};

const elife: Resolver = {
  test(url) {
    return url.hostname.endsWith('elifesciences.org') && url.pathname.startsWith('/articles/');
  },
  parse(url) {
    return `10.7554/eLife.${url.pathname.replace('/articles/', '')}`;
  },
};

const zenodo: Resolver = {
  test(url) {
    return (
      url.hostname.endsWith('zenodo.org') &&
      !!url.pathname.match(/^\/(?:record|badge\/latestdoi)\//)
    );
  },
  parse(url) {
    return `10.5281/zenodo.${url.pathname.replace(/^\/(?:record|badge\/latestdoi)\//, '')}`;
  },
};

function clumpParts(url: URL) {
  const parts = url.pathname.split('/').filter((p) => !!p);
  return parts.slice(0, -1).map((a, i) => `${a}/${parts[i + 1]}`);
}

const pathParts: Resolver = {
  test(url) {
    return !!clumpParts(url).find(validatePart);
  },
  parse(url) {
    return clumpParts(url).find(validatePart);
  },
};

export const DEFAULT_RESOLVERS = [doiOrg, doiSubdomain, elife, zenodo, pathParts];
