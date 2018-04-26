import 'antd/dist/antd.css'
import fetch from 'node-fetch'
import React from 'react' // eslint-disable-line no-unused-vars
import { ApolloClient, addTypename } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import injectTapEventPlugin from 'react-tap-event-plugin'
import styled, { injectGlobal } from 'styled-components'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'
import {
  Bars,
  Beers,
  Breweries,
  Home, 
} from './routes'

import {
  TopMenu,
} from './components'

const { Header, Content, Footer } = Layout;
// import { Route }
// import Auth from './utils/auth'

injectGlobal`
  @font-face {
    font-family: 'HS-Light';
    src: url('fonts/Hind_Siliguri/HindSiliguri-Light.ttf');
  }
  @font-face {
    font-family: 'HS-Regular';
    src: url('fonts/Hind_Siliguri/HindSiliguri-Regular.ttf');
  }
  @font-face {
    font-family: 'HS-Medium';
    src: url('fonts/Hind_Siliguri/HindSiliguri-Medium.ttf');
  }
  @font-face {
    font-family: 'HS-SemiBold';
    src: url('fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf');
  }
  @font-face {
    font-family: 'HS-Bold';
    src: url('fonts/Hind_Siliguri/HindSiliguri-Bold.ttf');
  }
`

injectTapEventPlugin()

const link = new HttpLink({
  fetch: fetch,
  uri: 'http://api.beers.dev/api',
})

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [],
      // types: [{
      //   kind: 'INTERFACE',
      //   name: 'ContentItem',
      //   possibleTypes: [{
      //     name: 'GalleryItem',
      //   }, {
      //     name: 'TextIten',
      //   }, {
      //     name: 'TitleItem',
      //   }],
      // }],
    },
  },
})

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) {
        let dataId = result.__typename + result.id
        if (result.__typename === 'Image') {
          let matches = result.location.match(/.*?-(\d+|x)-(\d+|x)-(fit|cover|contain)(.jpg|.png|.jpeg)$/)
          if (matches && matches.length > 3) {
            return `${dataId}-${matches[1]}-${matches[2]}-${matches[3]}`
          }
        }
        return dataId
      }
      return null
    },
  }),
  queryTransformer: addTypename,
})

const AppContainer = styled.div`
  transition: all 1s ease-out;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 8fr 1fr;
  grid-template-areas:
    'h h h h h h h h h h h h'
    'c c c c c c c c c c c c'
    'f f f f f f f f f f f f';
`

const HeaderContainer = styled.div`
  grid-area: h;
`

const ContentContainer = styled.div`
  grid-area: c;
  padding: 0px 50px;
`

const FooterContainer = styled.div`
  grid-area: f;
  display: grid;
  text-align: center;
  align-content: stretch;	
`



const App = () => {

  return (
    <ApolloProvider client={client}>
      <AppContainer>
        <HeaderContainer>
          <div className='logo' />
          <TopMenu />
        </HeaderContainer>
        <ContentContainer>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Route exact path='/' component={Home} />
            <Route exact path='/bars' component={Bars} />
            <Route exact path='/beers' component={Beers} />
            <Route exact path='/breweries' component={Breweries} />
          </div>
        </ContentContainer>
        <FooterContainer>
          <Footer>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </FooterContainer>
      </AppContainer>
    </ApolloProvider>
  )
}

export default App
