const CracoLessPlugin = require('craco-less-fix');

module.exports = {
  devServer: {
    allowedHosts: ['185.198.27.35'], // IP adresinizi buraya ekleyin
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1DA57A',
              '@layout-header-background': '#001529',
              '@layout-sider-background': '#001529',
              '@menu-bg': '#001529',
              '@menu-item-active-bg': '#1890ff',
              '@menu-item-color': 'white',
              '@menu-highlight-color': 'white',
              '@menu-item-active-border-width': '0px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
