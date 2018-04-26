import React from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'

const CenterContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
`

const Loader = ({ title }) => {
  return <CenterContainer><Spin size="large" /></CenterContainer>
}

export default Loader
