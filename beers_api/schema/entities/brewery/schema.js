const brewerySchema = `
  enum BreweryListOrderEnums {
    #Order by Name
    NAME
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type BreweryList {
    list: [Brewery]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input BreweryListFilters {
    #Filter by Name
    name: String
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input BreweryListOrder {
    order: BreweryListOrderEnums!
    direction: OrderDirectionEnum
  }

  type Brewery {
    _id: ID!
    name: String!
    logo: URL!
    description: String!
    allBeers(skip: Int, limit: Int, filters: BeerListFilters, order: [BeerListOrder]): BeerList!
    oneBeer(_id: ID!): Beer!
    beerCount(filters: BeerListFilters): Int!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddBreweryInput {
    name: String!
    logo: URL!
    description: String!
  }

  input UpdateBreweryInput {
    name: String
    logo: URL
    description: String
  }
`

const breweryList = `
  allBreweries(skip: Int, limit: Int, filters: BreweryListFilters, order: [BreweryListOrder]): BreweryList!
  oneBrewery(_id: ID!): Brewery!
  breweryCount(filters: BreweryListFilters): Int!
`

const breweryMutations = `
  addBrewery(input: AddBreweryInput!): Brewery!
  updateBrewery(_id: ID!, input: UpdateBreweryInput!): Brewery!
  removeBrewery(_id: ID!): ID!
`
module.exports = {
  brewerySchema,
  breweryList,
  breweryMutations,
}
