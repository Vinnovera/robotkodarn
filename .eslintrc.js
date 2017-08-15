module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
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
    "no-underscore-dangle": "off",
    "react/jsx-filename-extension": "off"
  }
};
