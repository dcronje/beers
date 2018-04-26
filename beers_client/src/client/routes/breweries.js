import React, { Component } from 'react'
import gql from "graphql-tag"
import { Query } from "react-apollo"
import { List, Avatar } from 'antd'
import { TextIcon, ListImage, Loader } from '../components'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

const GET_BARS = gql`
  query AllBreweriesQuery($skip:Int! $limit: Int!) {
    breweries:allBreweries(skip: $skip, limit: $limit, order: [{ order: NAME, direction: ASC }]) {
      count
      list {
        _id
        name
        logo
        description
        beerCount
      }
    }
  }
`

class Breweries extends Component {

  render() {
    console.log(this.props)
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign({
      skip: 0,
      limit: 10,
    }, parsed)

    return (
      <Query query={GET_BARS} variables={{ skip: query.skip, limit: query.limit }}>
        {({ loading, error, data }) => {

          if (loading) {
            return <Loader text='Loading Beers' />
          } else if (error) {
            return `Error! ${error.message}`
          }

          const pagination = {
            pageSize: parseInt(query.limit),
            current: (parseInt(query.skip) / parseInt(query.limit)) + 1,
            total: data.breweries.count,
            onChange: this._handlePagination,
          }

          return (
            <List
              itemLayout="vertical"
              size="large"
              pagination={pagination}
              dataSource={data.breweries.list}
              renderItem={(item) => {

                const $listImage = <ListImage alt={item.name} src={item.logo} />
                const $avatar = <Avatar src={item.logo} />
                const $link = <a href='#' onClick={this._handleShowBrewery.bind(this, item._id)}>{item.name}</a>
                const $actions = [
                  <TextIcon onClick={this._handleShowBeers.bind(this, item._id)} type="heart-o" text={`${item.beerCount} Beers`} />,
                ]

                return (
                  <List.Item
                    key={item._id}
                    actions={$actions}
                    extra={$listImage}>
                    <List.Item.Meta
                      avatar={$avatar}
                      title={$link}
                      description={item.address} />
                    {item.description}
                  </List.Item>
                )

              }}
            />
          )

        }}
      </Query>
    )
  }

  _handleShowBrewery = (_breweryId, e) => {
    e.preventDefault()
    this.props.history.push(`/breweries/${_breweryId}`)
  }

  _handleShowBeers = (_breweryId, e) => {
    this.props.history.push(`/beers?breweries=${_breweryId}`)
  }

  _handlePagination = (pageNumber, pageSize) => {
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign(parsed, {
      skip: (pageNumber - 1) * pageSize,
      limit: pageSize,
    })
    this.props.history.push(`/breweries?${queryString.stringify(query)}`)
  }

}

const DecoratedBreweries = withRouter(Breweries)

export default DecoratedBreweries
