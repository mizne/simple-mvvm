const Observer = require('./Observer').Observer
const Watcher = require('./Watcher')
const Compile = require('./Compiler')

class MVVM {
  constructor(options) {
    this.$options = options || {}
    const data = this._data = this.$options.data

    Object.keys(data).forEach((key) => {
      this._proxyData(key)
    })

    new Observer(data)

    // this.$compile = new Compile(options.el || document.body, this)
  }

  $watch(key, cb, options) {
    const watcher = new Watcher(this, key, cb)
    // console.log(watcher)
  }

  _proxyData(key, setter, getter) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        return this._data[key]
      },
      set: (newV) => {
        this._data[key] = newV
      }
    })
  }
}

module.exports = MVVM