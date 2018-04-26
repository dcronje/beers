let shared = null

class ClassRegistry {

  static shared() {
    if (!shared) {
      shared = new ClassRegistry()
    }
    return shared
  }

  constructor() {
    this.objects = {}
  }

  register(name, classObject) {
    this.objects[name] = classObject
  }

  get(name) {
    if (!this.objects[name]) {
      throw new Error(JSON.stringify({
        message: `Object of type: "${name}" not found`,
        code: 500,
      }))
    }
    return this.objects[name]
  }

}

module.exports = ClassRegistry
