import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 18
        })

        let nextAge

        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(19)

        // update
        user.age++
        expect(nextAge).toBe(20)
    })

    it('should return runner when call effect', () => {
        // effect(fn) --> function (runner) --> fn --> return
        // 调用effect会返回一个函数runner， 调用runner会再次执行fn，调用fn， fn会返回一个返回值
        let foo = 100
        const runner = effect(() => {
            foo++
            return 'foo'
        })

        expect(foo).toBe(101)
        const r = runner()
        expect(foo).toBe(102)
        expect(r).toBe('foo')
    })

    it('scheduler', () => {
        let dummy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            // 当初始化或者再次调用的时候执行第一个参数
            () => {
                dummy = obj.foo
            },
            //   当响应式依赖发生变化执行第二个参数
            { scheduler }
        )
        // 测试scheduler是否没被执行一次
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        // 测试scheduler是否被执行一次
        expect(scheduler).toHaveBeenCalledTimes(1)
        // should not run yet
        // obj.foo++后应该执行scheduler，而不是dummy,所以还是1
        expect(dummy).toBe(1)
        // manually run
        // 调用run则dummy执行两次
        run()
        // should have run
        expect(dummy).toBe(2)
    })
})
