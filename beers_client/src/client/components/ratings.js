import React, { Component } from 'react'
import gql from "graphql-tag"
import { Query, Mutation } from "react-apollo"
import { Rate, Card, Form, Input, Icon, Row, Col, Button } from 'antd'
import { TextIcon, ListImage, Loader } from '../components'
import * as _ from 'underscore'
import styled from 'styled-components'

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

const GET_RATINGS = gql`
  query BeerRatings($beerId: ID!) {
    beer:oneBeer(_id: $beerId) {
      _id
      name
      label
      rating
    }
  }
`

const ADD_RATING = gql`
  mutation AddRating($input: AddRatingInput!) {
    addRating(input: $input) {
      _id
      value
    }
  }
`

const RatingContainer = styled.div`
  transition: all 1s ease-out;
  width: 100%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 8fr 1fr;
  grid-template-areas:
    'l l l l l r r r r r r r'
    'l l l l l r r r r r r r'
    'l l l l l r r r r r r r';
`

const LeftContainer = styled.div`
  grid-area: l;
`

const RightContainer = styled.div`
  grid-area: r;
  padding: 0px 50px;
`

class Ratings extends Component {

  state = {
    rating: 0,
    review: '',
  }

  render() {
    return (
      <Query query={GET_RATINGS} variables={{ beerId: this.props.beerId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Loader text='Loading Beers' />
          } else if (error) {
            return `Error! ${error.message}`
          }
          return (
            <RatingContainer>
              <LeftContainer>
                <Card
                  style={{ width: '100%' }}
                  cover={<img alt="example" src={data.beer.label} />}>
                  <Rate disabled defaultValue={data.beer.rating} />
                </Card>
              </LeftContainer>
              <RightContainer>
                <Mutation mutation={ADD_RATING}>
                  {(addRating, { data, loading, error }) => {
                    if (loading) {
                      return <Loader text='Loading Beers' />
                    } else if (error) {
                      return `Error! ${error.message}`
                    }

                    let _submitMutation = () => {
                      this.props.onLoading()
                      addRating({
                        variables: {
                          input: {
                            _userId: '5ad46060406eaa0df019a488',
                            _beerId: this.props.beerId,
                            value: this.state.rating,
                            review: this.state.review,
                          },
                        },
                      })
                      .then(() => {
                        console.log('THEN FIRED')
                        this.props.onComplete()
                      })
                    }

                    return (
                      <div>
                        <Form>
                          <Form.Item
                            label="Review">
                            <Input placeholder="Your review" value={this.state.review} onChange={this._handleReviewChanged} />
                          </Form.Item>
                          <Form.Item
                            label="Rating">
                            <Rate value={this.state.rating} onChange={this._handleRatingChanged} />
                          </Form.Item>
                          <Button type="primary" onClick={_submitMutation}>Submit</Button>
                        </Form>
                      </div>
                    )
                  }}
                </Mutation>
              </RightContainer>
            </RatingContainer>
          )
        }}
      </Query>
    )
  }

  _handleReviewChanged = (e) => {
    console.log(e.target.value)
    let state = Object.assign(this.state)
    state.review = e.target.value
    this.setState(state)
  }

  _handleRatingChanged = (value) => {
    console.log(value)
    let state = Object.assign(this.state)
    state.rating = value
    this.setState(state)
  }

}

export default Ratings
