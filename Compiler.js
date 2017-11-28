const Watcher = require('./Watcher')

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment(el) {
    const fragment = document.createDocumentFragment()
    let child

    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  init() {
    this.compileElement(this.$fragment)
  }
  compileElement(el) {
    const childNodes = el.childNodes
    const reg = /\{\{(.*)\}\}/

    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compileNode(node)
      } else if (this.isTextNode(node) && reg.test(node.textContent)) {
        this.compileText(node, RegExp.$1)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }
  compileNode(node) {
    const attrs = node.attributes

    Array.from(attrs).forEach(attr => {
      const name = attr.name
      if (this.isDirective(name)) {
        const exp = attr.value
        const dir = name.substring(2)

        if (this.isEventDirective(dir)) {
          Compiles.eventHandler(node, this.$vm, exp, dir)
        } else {
          Compiles[dir] && Compiles[dir](node, this.$vm, exp)
        }

        node.removeAttribute(name)
      }
    })
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isTextNode(node) {
    return node.nodeType === 3
  }

  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  isEventDirective(attr) {
    return attr.indexOf('on') === 0
  }

  compileText(node, exp) {
    Compiles.text(node, this.$vm, exp)
  }
}

const updaters = {
  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  }
}

class Compiles {
  static text(node, vm, exp) {
    Compiles.bind(node, vm, exp, dir)
  }

  static bind(node, vm, exp, dir) {
    const updaterFn = updaters[dir + 'Updater']

    updaterFn && updaterFn(node, Compiles.getVmVal(vm, exp))

    new Watcher(vm, exp, function (newV, oldV) {
      updaterFn && updaterFn(node, newV, oldV)
    })
  }

  static eventHandler(node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  }

  static getVmVal(vm, exp) {
    let val = vm
    const exps = exp.split('.')
    exp.forEach(k => {
      val = val[k]
    })
    return val
  }
}