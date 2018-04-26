import React from 'react'
import { Menu } from 'antd'
import { withRouter } from 'react-router-dom'

const TopMenu = ({ location, history }) => {
  let selectedKey = 'HOME'
  let _handleSelect = ({ key }) => {
    console.log(key)
    if (key === 'BARS') {
      history.push('/bars')
    } else if (key === 'BEERS') {
      history.push('/beers')
    } else if (key === 'BREWERIES') {
      history.push('/breweries')
    }
  }
  if (location.pathname.indexOf('bar') !== -1) {
    selectedKey = 'BARS'
  } else if (location.pathname.indexOf('beer') !== -1) {
    selectedKey = 'BEERS'
  } else if (location.pathname.indexOf('brewer') !== -1) {
    selectedKey = 'BREWERIES'
  }
  return (
    <Menu
      theme='dark'
      mode='horizontal'
      selectedKeys={[selectedKey]}
      style={{ lineHeight: '64px' }}
      onSelect={_handleSelect}
    >
      <Menu.Item key='BARS'>Bars</Menu.Item>
      <Menu.Item key='BEERS'>Beers</Menu.Item>
      <Menu.Item key='BREWERIES'>Breweries</Menu.Item>
    </Menu>
  )
}

export default withRouter(TopMenu)
