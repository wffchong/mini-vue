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
})
