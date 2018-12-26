import React from 'react'
import { hot } from 'react-hot-loader'

import './App.css'

class App extends React.Component {
  state = {
    name: '<%= data.name %>'
  }

  render () {
    return (
      <div className="App">
        <h1>Welcome to {this.state.name}</h1>
      </div>
    )
  }
}

export default hot(module)(App)
