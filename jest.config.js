module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  "testPathIgnorePatterns": [
    "/node_modules"
  ],
  "moduleNameMapper": {
    '^@library/(.*)$': '<rootDir>/sources/$1'
  }
}
