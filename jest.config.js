module.exports = {
  verbose: false,
  silent: true,
  collectCoverage: true,
  coverageReporters: ["text", "html", "cobertura"],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  }
}
