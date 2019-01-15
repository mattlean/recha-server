const model = {
  clearReadOnlyProps(data) {
    const d = data
    delete d.createdAt

    return d
  }
}

export = model
