import React from 'react'
import { Icon } from 'antd'

const TextIcon = ({ type, text, onClick }) => {

  let _handleClicked = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <span>
      <Icon onClick={_handleClicked} type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  )
}

export default TextIcon
