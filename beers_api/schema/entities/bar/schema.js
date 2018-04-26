const barSchema = `
  enum BarListOrderEnums {
    #Order by Name
    NAME
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type BarList {
    list: [Bar]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input BarListFilters {
    #Filter by Name
    name: String
    #Filter by beers
    beers: [ID]
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input BarListOrder {
    order: BarListOrderEnums!
    direction: OrderDirectionEnum
  }

  type Bar {
    _id: ID!
    name: String!
    logo: URL!
    email: Email!
    contact: Phone!
    description: String!
    address: String!
    building: String!
    allBeers(skip: Int, limit: Int, filters: BarBeerListFilters, order: [BarBeerListOrder]): BarBeerList!
    oneBeer(_id: ID!): BarBeer!
    beerCount(filters: BarBeerListFilters): Int!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddBarInput {
    name: String!
    logo: URL!
    email: Email!
    contact: Phone!
    description: String!
    address: String!
    building: String!
  }

  input UpdateBarInput {
    name: String
    logo: URL
    email: Email
    contact: Phone
    description: String
    address: String
    building: String
  }
`

const barList = `
  allBars(skip: Int, limit: Int, filters: BarListFilters, order: [BarListOrder]): BarList!
  oneBar(_id: ID!): Bar!
  barCount(filters: BarListFilters): Int!
`

const barMutations = `
  addBar(input: AddBarInput!): Bar!
  updateBar(_id: ID!, input: UpdateBarInput!): Bar!
  removeBar(_id: ID!): ID!
`
module.exports = {
  barSchema,
  barList,
  barMutations,
}
