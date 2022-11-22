module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.afm$/,
      type: 'asset/resource',
    })
    return config
  },
}
