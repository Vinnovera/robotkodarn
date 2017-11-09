module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react"
  ],
  "rules": {
    "semi": [
      "error",
      "never"
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "import/no-named-as-default": "off",
    "import/prefer-default-export": "off",
    "react/prop-types": "off",
    "no-underscore-dangle": "off",
    "react/jsx-filename-extension": "off",
    "arrow-body-style": "off",
    "consistent-return": "off",
    "class-methods-use-this": "off", // Skip forcing static until further investigation
    "func-names": "off" // Since we are using unnamed functions in webpack config
  },
  "globals": {
    "chrome": false
  }
};
