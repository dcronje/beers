import React from 'react'

const Html = (props) => {
  const styles = {
    body: {
      margin: 0,
      padding: 0,
    }
  }
  return (
    <html>
      <head>
        <title>App</title>
      </head>
      <body style={styles.body}>
        <div id='react-app'>{props.children}</div>
        <script src='/js/bundle.js'></script>
      </body>
    </html>
  )
}

export default Html
