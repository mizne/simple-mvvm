import { Dep } from './Observer'
import MVVM from './MVVM'

export default class Watcher {
  private vm: MVVM
  private expOrFn: string | Function
  private cb: Function
  private deps: { [key: string]: Dep }

  private getter: Function
  private value: any
  constructor(vm: MVVM, expOrFn: string | Function, cb: Function) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.deps = { }

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }

    this.value = this.get()
  }

  update() {
    const oldValue = this.value
    const newValue = this.get()

    if (newValue !== oldValue) {
      this.value = newValue
      this.cb.call(this.vm, newValue, oldValue)
    }
  }

  addDep(dep: Dep) {
    if (!this.deps.hasOwnProperty(dep.id)) {
      dep.addWatcher(this)
      this.deps[dep.id] = dep
    }
  }

  get() {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  parseGetter(exp: string) {
    if (/[^\w.$]/.test(exp)) {
      return 
    }

    const exps = exp.split('.')
    return function (obj: any) {
      for (let i = 0; i < exps.length; i += 1) {
        if (!obj) {return}
        obj = obj[exps[i]]
      }

      return obj
    }
  }
}
