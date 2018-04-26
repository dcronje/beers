const barBeerSchema = `
  enum BarBeerListOrderEnums {
    #Order by Bar Name
    BAR_NAME
    #Order by Beer Name
    BEER_NAME
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type BarBeerList {
    list: [BarBeer]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input BarBeerListFilters {
    #Filter by Bars
    bars: [ID]
    #Filter by Beers
    beers: [ID]
    #Filter by Bar name
    barName: String
    #Filter by Beer name
    beerName: String
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input BarBeerListOrder {
    order: BarBeerListOrderEnums!
    direction: OrderDirectionEnum
  }

  type BarBeer {
    _id: ID!
    bar: Bar!
    beer: Beer!
    stock: Int!
    price: Float!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddBarBeerInput {
    _barId: ID!
    _beerId: ID!
    stock: Int!
    price: Float!
  }

  input UpdateBarBeerInput {
    stock: Int
    price: Float
  }
`

const barBeerList = `
  allBarBeers(skip: Int, limit: Int, filters: BarBeerListFilters, order: [BarBeerListOrder]): BarBeerList!
  oneBarBeer(_id: ID!): BarBeer!
  barBeerCount(filters: BarBeerListFilters): Int!
`

const barBeerMutations = `
  addBarBeer(input: AddBarBeerInput!): BarBeer!
  updateBarBeer(_id: ID!, input: UpdateBarBeerInput!): BarBeer!
  removeBarBeer(_id: ID!): ID!
`
module.exports = {
  barBeerSchema,
  barBeerList,
  barBeerMutations,
}
