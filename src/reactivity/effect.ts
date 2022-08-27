let activeEffect

class ReactiveEffect {
    private _fn: any

    constructor(fn) {
        this._fn = fn
    }

    run() {
        activeEffect = this
        this._fn()
    }
}

// 收集依赖
const targetMap = new WeakMap()
export function track(target, key) {
    // target --> key --> dep
    let depMap = targetMap.get(target)
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    if (!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }
    // 这里要拿到effect里面传入的fn，可以直接拿到effect实例也可以
    dep.add(activeEffect)
}

// 触发依赖
export function trigger(target, key) {
    // 拿到依赖一个个执行
    const depMap = targetMap.get(target)
    const dep = depMap.get(key)
    for (const effect of dep) {
        effect.run()
    }
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn)
    // 开始就自动执行一次
    _effect.run()
}
