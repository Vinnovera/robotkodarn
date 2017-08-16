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
    "import/no-named-as-default": "off", // Not working with common Redux pattern
    "react/prop-types": "off", // TODO: Discuss, not working well with mapStateToProps
    "no-underscore-dangle": "off",
    "react/jsx-filename-extension": "off"
  }
};
