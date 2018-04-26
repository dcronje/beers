let { barSchema, barMutations, barList } = require('./entities/bar/schema')
let { barBeerSchema, barBeerMutations, barBeerList } = require('./entities/barbeer/schema')
let { beerSchema, beerMutations, beerList } = require('./entities/beer/schema')
let { brewerySchema, breweryMutations, breweryList } = require('./entities/brewery/schema')
let { ratingSchema, ratingMutations, ratingList } = require('./entities/rating/schema')
let { userSchema, userMutations, userList } = require('./entities/user/schema')

const schemaString = `

  enum OrderDirectionEnum {
    #Order Ascending
    ASC
    #Order Descending
    DESC
  }

  scalar DateTime
  scalar URL
  scalar Email
  scalar Phone
  scalar Date

  enum BeerTypeEnum {
    #Larger Beers
    LAGER
    #Larger Beers
    PILSNER
    #Larger Beers
    AMBER_ALE
    #Larger Beers
    INDIA_PALE_ALE
    #Larger Beers
    BLONDE_ALE
    #Larger Beers
    BITTER
    #Larger Beers
    STOUT
  }

  ${barSchema}
  ${barBeerSchema}
  ${beerSchema}
  ${brewerySchema}
  ${ratingSchema}
  ${userSchema}

  type Query {
    ${barList}
    ${barBeerList}
    ${beerList}
    ${breweryList}
    ${ratingList}
    ${userList}
  }

  type Mutation {
    ${barMutations}
    ${barBeerMutations}
    ${beerMutations}
    ${breweryMutations}
    ${ratingMutations}
    ${userMutations}
  }

  schema {
    query: Query
    mutation: Mutation
  }

`

module.exports = schemaString
