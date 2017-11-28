import Watcher from './Watcher'
import { Observer } from './Observer'
import Compile from './Compiler'

export default class MVVM {
  public $options: any
  private _data: any
  private $compile: Compile

  constructor(options: any) {
    this.$options = options || {}
    const data = (this._data = this.$options.data)

    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })

    new Observer(data)

    this.$compile = new Compile(options.el || document.body, this)
  }

  $watch(key: string, cb: Function, options: any) {
    const watcher = new Watcher(this, key, cb)
    // console.log(watcher)
  }

  _proxyData(key: string) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        return this._data[key]
      },
      set: newV => {
        this._data[key] = newV
      }
    })
  }
}
