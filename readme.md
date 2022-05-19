# `doi-utils`

[![doi-utils on npm](https://img.shields.io/npm/v/doi-utils.svg)](https://www.npmjs.com/package/doi-utils)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/doi-utils/blob/master/LICENSE)
![CI](https://github.com/curvenote/doi-utils/actions/workflows/ci.yml/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/doi-utils/)

A small utility for validating, normalizing, and extracting DOIs from text strings.
This repository follows the advice of [CrossRef](https://www.crossref.org/blog/dois-and-matching-regular-expressions/) for regular expression patterns.

> For the 74.9M DOIs we have seen this matches 74.4M of them. If you need to use only one pattern then use this one.

## Install

```bash
npm install doi-utils
```

## Overview & Usage

```ts
import { validate } from 'doi-utils';

const isValid = validate('http://doi.org/10.1016/j.cageo.2015.09.015');

buildUrl('http://dx.doi.org/10.1016/j.cageo.2015.09.015');
buildUrl('http://www.doi.org/10.1016/j.cageo.2015.09.015');
buildUrl('http://doi.org/10.1016/j.cageo.2015.09.015');
buildUrl('doi:10.1016/j.cageo.2015.09.015');
// All of these produce a normalized DOI url:
// https://doi.org/10.1016/J.CAGEO.2015.09.015
```

## Included Utilities

- `validate` - Validates if a single DOI string is valid, is tolerant of leading link or `doi:` strings.
- `normalize` - Normalizes a DOI url or string into a DOI of the form `10.1000/xyz000`
- `buildUrl` - Builds a URL to https://doi.org, includes normalization

---

<p style="text-align: center; color: #aaa; padding-top: 50px">
  Made with love by
  <a href="https://curvenote.com" target="_blank" style="color: #aaa">
    <img src="https://curvenote.dev/images/icon.png" style="height: 1em" /> Curvenote
  </a>
</p>
