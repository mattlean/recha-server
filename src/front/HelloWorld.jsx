import React from 'react'

function HelloWorld() {
  console.log(this)
  return <h1>Hello world!</h1>
}

export default HelloWorld
