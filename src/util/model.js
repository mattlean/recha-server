// @flow

const model = {
  clearReadOnlyProps(data: Object) {
    const d = data
    delete d.createdAt

    return d
  }
}

module.exports = model
