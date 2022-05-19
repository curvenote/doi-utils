module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: true,
        jsc: {
          target: 'es2019',
          parser: {
            syntax: 'typescript',
          },
        },
      },
    ],
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/**/*.(spec|test).ts'],
  extensionsToTreatAsEsm: ['.ts'],
}
