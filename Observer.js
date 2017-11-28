class Observer {
  constructor(data) {
    this.data = data
    this.observer(data)
  }

  observer(data, path = []) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key], path)
    })
  }

  defineReactive(data, key, value, path) {
    const newPath = path.concat(key)
    const dep = new Dep()
    this.observer(value, newPath)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        if (Dep.target) {
          Dep.target.addDep(dep)
        }
        return value
      },
      set: function(newV) {
        console.log(`watch value change; ${value} => ${newV}`)
        console.log('change paths: ' + newPath.join(' => '))
        value = newV

        new Observer(newV)
        dep.notify()
      }
    })
  }
}

let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.watchers = []
  }

  addWatcher(watcher) {
    this.watchers.push(watcher)
  }

  removeWatcher(watcher) {
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

module.exports.Observer = Observer
module.exports.Dep = Dep
