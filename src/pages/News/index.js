import React from "react"

export default class News extends React.Component {
  componentDidMount() {
    console.log('new');
  }
  render() {
    return (
      <div>这是 News</div>
    )
  }
}