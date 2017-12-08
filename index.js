const cloneDeep = require('lodash.clonedeep');

const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined;
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
    rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher));
    return result;
}

const findRule = (rulesSource, ruleMatcher) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
    return rules[index];
}

const cssRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.css$/);

const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`/${loader}/`) !== -1;
const cssLoaderMatcher = createLoaderMatcher('css-loader');

const fileLoaderMatcher = createLoaderMatcher('file-loader');

const addAfterRule = (rulesSource, ruleMatcher, value) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
    rules.splice(index + 1, 0, value);
}

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    rules.splice(index, 0, value)
};

function createRewirePostCSSModules(localIdentName = `[local]__[name]__[hash:base64:5]`) {
  return function (config, env) {
    // Add CSS modules
    const cssRule = findRule(config.module.rules, cssRuleMatcher);
    const cssModulesRule = cloneDeep(cssRule);

    cssRule.exclude = /\.module\.css$/;

    const cssModulesRuleCssLoader = findRule(cssModulesRule, cssLoaderMatcher);
    cssModulesRuleCssLoader.options = Object.assign({
      modules: true,
      localIdentName: localIdentName
    }, cssModulesRuleCssLoader.options);

    addBeforeRule(config.module.rules, fileLoaderMatcher, cssModulesRule);

    return config;
  }
};

const rewirePostCSSModules = createRewirePostCSSModules();

rewirePostCSSModules.withLoaderOptions = createRewirePostCSSModules;

module.exports = rewirePostCSSModules;
