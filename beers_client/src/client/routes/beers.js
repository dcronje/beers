import React, { Component } from 'react'
import gql from "graphql-tag"
import { Query } from "react-apollo"
import { List, Avatar, Select, Modal } from 'antd'
import { TextIcon, ListImage, Loader, Ratings } from '../components'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import * as _ from 'underscore'

const GET_BARS = gql`
  query AllBeersQuery($skip:Int! $limit: Int!, $bars:[ID]!, $breweries:[ID]!) {
    beers:allBeers(skip: $skip, limit: $limit, order: [{ order: NAME, direction: ASC }], filters: { bars: $bars, breweries: $breweries }) {
      count
      list {
        _id
        name
        label
        description
        rating
      }
    }
    bars:allBars(order: [{ order: NAME, direction: ASC }]) {
      list {
        _id
        name
      }
    }
    breweries:allBreweries(order: [{ order: NAME, direction: ASC }]) {
      list {
        _id
        name
      }
    }
  }
`

class Beers extends Component {

  state = {
    showRatings: false,
    isLoading: false,
    beerSelectedForRating: null,
    beerSelectedForRatingName: '',
  }

  render() {
    console.log(this.props)
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign({
      skip: 0,
      limit: 10,
      bars: [],
      breweries: [],
    }, parsed)

    if (query.bars && typeof query.bars === 'string') {
      query.bars = query.bars.split(',')
    }

    if (query.breweries && typeof query.breweries === 'string') {
      query.breweries = query.breweries.split(',')
    }

    console.log(query)

    return (
      
      <Query query={GET_BARS} variables={{ skip: query.skip, limit: query.limit, bars: query.bars, breweries: query.breweries }}>
        {({ loading, error, data, refetch }) => {
          console.log(data)
          if (loading) {
            return <Loader text='Loading Beers' />
          } else if (error) {
            return `Error! ${error.message}`
          }

          const pagination = {
            pageSize: parseInt(query.limit),
            current: (parseInt(query.skip) / parseInt(query.limit)) + 1,
            total: data.beers.count,
            onChange: this._handlePagination,
          }

          let $barOptions = _.map(data.bars.list, (bar) => {
            return <Select.Option key={bar._id}>{bar.name}</Select.Option>
          })

          let $breweryOptions = _.map(data.breweries.list, (brewery) => {
            return <Select.Option key={brewery._id}>{brewery.name}</Select.Option>
          })

          return (
            <div>
              <div>
                <Modal title={this.state.beerSelectedForRatingName}
                  visible={this.state.showRatings}
                  confirmLoading={this.state.isLoading}
                  onCancel={this._handleCancelReview}>
                  <Ratings beerId={this.state.beerSelectedForRating} onLoading={this._handleRatingLoading} onComplete={() => {
                    this._handleRatingComplete()
                    refetch()
                  }} />
                </Modal>
              </div>
              <Select
                mode="multiple"
                placeholder="Filter by bars"
                onChange={this._handleBarFilterChange}
                value={query.bars}
                style={{ width: '100%', marginBottom: '15px' }}>
                {$barOptions}
              </Select>
              <Select
                mode="multiple"
                placeholder="Filter by breweries"
                onChange={this._handleBreweriesFilterChange}
                value={query.breweries}
                style={{ width: '100%', marginBottom: '15px' }}>
                {$breweryOptions}
              </Select>
              <List
                itemLayout="vertical"
                size="large"
                pagination={pagination}
                dataSource={data.beers.list}
                renderItem={(item) => {

                  const $listImage = <ListImage alt={item.name} src={item.label} />
                  const $avatar = <Avatar src={item.label} />
                  const $link = <span>{item.name}</span>
                  const $actions = [
                    <TextIcon onClick={this._handleShowReviews.bind(this, item._id, item.name)} type="star-o" text={item.rating} />,
                  ]

                  return (
                    <List.Item
                      key={item._id}
                      actions={$actions}
                      extra={$listImage}>
                      <List.Item.Meta
                        avatar={$avatar}
                        title={$link}
                        description='Awesome' />
                      {item.description}
                    </List.Item>
                  )

                }}
              />
            </div>
          )

        }}
      </Query>
    )
  }

  _handleRatingLoading = (e) => {
    let state = Object.assign(this.state)
    state.isLoading = true
    state.showRatings = true
    this.setState(state)
  }

  _handleRatingComplete = (e) => {
    let state = Object.assign(this.state)
    state.isLoading = false
    state.showRatings = false
    this.setState(state)
  }

  _handelShowBrewer = (_brewerId, e) => {

  }

  _handleShowReviews = (_beerId, beerName, e) => {
    let state = Object.assign(this.state)
    state.beerSelectedForRating = _beerId
    state.beerSelectedForRatingName = beerName
    state.isLoading = false
    state.showRatings = true
    this.setState(state)
  }

  _handleCancelReview = (e) => {
    let state = Object.assign(this.state)
    state.beerSelectedForRating = null
    state.isLoading = false
    state.showRatings = false
    this.setState(state)
  }
  
  _handleBarFilterChange = (options) => {
    console.log(options)
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign(parsed, {
      skip: 0,
      limit: 10,
      bars: options,
    })
    this.props.history.push(`/beers?${queryString.stringify(query)}`)
  }

  _handleBreweriesFilterChange = (options) => {
    console.log(options)
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign(parsed, {
      skip: 0,
      limit: 10,
      breweries: options,
    })
    this.props.history.push(`/beers?${queryString.stringify(query)}`)
  }

  _handlePagination = (pageNumber, pageSize) => {
    let parsed = queryString.parse(this.props.location.search)
    let query = Object.assign(parsed, {
      skip: (pageNumber - 1) * pageSize,
      limit: pageSize,
    })
    this.props.history.push(`/beers?${queryString.stringify(query)}`)
  }

}

const DecoratedBeers = withRouter(Beers)

export default DecoratedBeers
