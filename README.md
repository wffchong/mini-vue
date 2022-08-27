# setUp 环境 - 集成 jest 做单元测试

安装相关依赖 yarn add @types/jest -D

初始化 ts npx tsc --init 在 tsconfig.json 中 types 里面加上 test

配置 jest ES-Module 导入模块规范 yarn add --dev babel-jest @babel/core @babel/preset-env 创建 babel.config.js

```js
module.exports = {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}
```

yarn add --dev @babel/preset-typescript

```js
module.exports = {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript']
}
```
