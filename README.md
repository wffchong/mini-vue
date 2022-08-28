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

## 四：实现effect的scheduler功能

1. 通过effect的第二个参数给定一个scheduler的fn
2. effect第一次执行的时候还是会执行第一个回调
3. 当响应式对象更改的时候会执行传入的scheduler的fn，而不是第一个回调
4. 当再次执行runner的时候，会执行第一个回调

例子：

```js
<script setup>
import { reactive } from 'vue'
const obj = reactive({ foo: 1 })

const test = () => {
    // 当点击按钮的时候这里是不会再继续打印的，只有初始化的时候会打印，或者再次调用test的时候会重新打印
    console.log(obj.foo)
    return 1
}
test()

const handleClick = () => {
    obj.foo++
}
</script>

<template>
    <div class="dv">
        <button @click="handleClick">增加</button>
        <span>{{ obj.foo }}</span>
        <button @click="test()">调用test</button>
    </div>
</template>
```
