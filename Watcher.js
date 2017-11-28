const Dep = require('./Observer').Dep

class Watcher {
  constructor(vm, expOrFn, cb) {
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

  addDep(dep) {
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

  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) {
      return 
    }

    const exps = exp.split('.')
    return function (obj) {
      for (let i = 0; i < exps.length; i += 1) {
        if (!obj) {return}
        obj = obj[exps[i]]
      }

      return obj
    }
  }
}

module.exports = Watcher