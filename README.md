# react-app-rewire-postcss-modules
Configure modules on webpack to your create-react-app via react-app-rewired

# Install

npm:
```bash
$ npm install --saveDev react-app-rewire-postcss-modules
```

yarn:
```bash
$ yarn add --dev react-app-rewire-postcss-modules
```

# Add it to your project

* [Rewire your app](https://github.com/timarney/react-app-rewired#how-to-rewire-your-create-react-app-project) than modify `config-overrides.js`

```javascript
const rewireCSSModules = require('react-app-rewire-postcss-modules');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireCSSModules(config, env);
  // with override localIdentName
  // config = rewireCSSModules.withLoaderOptions('[local]--[hash:base64:8]')(config, env);
  // ...
  return config;
}
```
