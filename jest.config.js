module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": [
      require.resolve('@swc/jest'),
      {
        sourceMaps: true,
        jsc: {
          target: 'es2019',
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: { runtime: 'automatic', useBuiltins: true },
          },
        },
      },
    ],
  },
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).ts(x|)',
  ],
};
