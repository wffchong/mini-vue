# mini-vue

## 一：setUp 环境 - 集成 jest 做单元测试

### 安装相关依赖

yarn add @types/jest -D

### 初始化 ts

npx tsc --init
在 tsconfig.json 中 types 里面加上 test

### 配置 jest ES-Module 导入模块规范

yarn add --dev babel-jest @babel/core @babel/preset-env
创建 babel.config.js

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

## 二：实现effect 和 reactive 依赖收集

* 主要是做到在get的时候track收集依赖，在set的时候trigger触发依赖，选择合适的数据结构保存依赖。

## 三： 实现effect返回runner

* effect(fn) --> function (runner) --> fn --> return
* 调用effect会返回一个函数runner， 调用runner会再次执行fn，调用fn， fn会返回一个返回值
