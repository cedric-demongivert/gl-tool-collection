module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  "testPathIgnorePatterns": [
    "/node_modules"
  ],
  "moduleNameMapper": {
    '^@library/(.*)$': '<rootDir>/src/$1'
  }
}
