import Watcher from './Watcher'

export class Observer {
  private data: any
  constructor(data: any) {
    this.data = data
    this.observer(data)
  }

  observer(data: any, path: string[] = []): void {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key], path)
    })
  }

  defineReactive(data: any, key: string, value: any, path: string[]) {
    const newPath = path.concat(key)
    let dep: Dep
    this.observer(value, newPath)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        if (Dep.target) {
          dep = dep || new Dep()
          Dep.target.addDep(dep)
        }
        return value
      },
      set: function(newV) {
        console.log(`watch value change; ${value} => ${newV}`)
        console.log('change paths: ' + newPath.join(' => '))
        value = newV

        new Observer(newV)
        dep && dep.notify()
      }
    })
  }
}

let id = 0

export class Dep {
  public id: number
  private watchers: Watcher[]
  static target: Watcher | null
  constructor() {
    this.id = id++
    console.log(id)
    this.watchers = []
  }

  addWatcher(watcher: Watcher) {
    this.watchers.push(watcher)
  }

  removeWatcher(watcher: Watcher) {
    const index = this.watchers.indexOf(watcher)
    if (index !== -1) {
      this.watchers.splice(index, 1)
    }
  }

  notify() {
    this.watchers.forEach((watcher) => {
      watcher.update()
    })
  }
}

