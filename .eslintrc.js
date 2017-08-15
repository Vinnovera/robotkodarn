module.exports = {
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
      "no-shadow": [
        "error",
        {
        "allow": ["error", "part"]
        }
      ],
      "no-underscore-dangle": "off",
      "react/prop-types": 0,
      "react/jsx-filename-extension": [
        1,
        {
          "extensions": [".js", ".jsx"]
        }
      ]
    }
};
