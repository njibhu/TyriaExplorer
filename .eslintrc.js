module.exports = {
  extends: ["standard"],
  plugins: [],
  parserOptions: {},
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", "never"]
  },
  globals: {
    w2ui: true,
    T3D: true,
    THREE: true,
    DataStream: true,
    $: true
  }
};
