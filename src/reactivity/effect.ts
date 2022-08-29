import { extend } from '../shared'

let activeEffect

class ReactiveEffect {
    private _fn: any
    deps = []
    active = true
    onStop?: () => void
    public scheduler: Function | undefined

    constructor(fn, scheduler?: Function) {
        this._fn = fn
        // 把scheduler 绑定在this当中，方便track中调用
        this.scheduler = scheduler
    }

    run() {
        activeEffect = this
        // 把函数执行结果返回
        return this._fn()
    }

    stop() {
        if (this.active) {
            cleanEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

function cleanEffect(effect) {
    // 找到所有依赖这个 effect 的响应式对象
    // 从这些响应式对象里把这个effect删除
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    // 开始就自动执行一次
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    // 把 effect 挂载到runner上
    runner.effect = _effect
    return runner
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

    if (!activeEffect) return

    // 这里要拿到effect里面传入的fn，可以直接拿到effect实例也可以
    dep.add(activeEffect)
    // 反向收集，用effect去收集dep，然后调用stop的时候，清除掉dep就行了
    activeEffect.deps.push(dep)
}

// 触发依赖
export function trigger(target, key) {
    // 拿到依赖一个个执行
    const depMap = targetMap.get(target)
    const dep = depMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

// 传入一个runner，
export function stop(runner) {
    runner.effect.stop()
}
