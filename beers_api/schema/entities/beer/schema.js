const beerSchema = `
  enum BeerListOrderEnums {
    #Order by Beer type
    BEER_TYPE
    #Order by Name
    NAME
    #Order by Alcohol content
    ALCOHOL_CONTENT
    #Order by Rating
    RATING
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type BeerList {
    list: [Beer]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input BeerListFilters {
    #Filter by Breweries
    breweries: [ID]
    #Filter by Beer type
    beerTypes: [BeerTypeEnum]
    #Filter by Name
    name: String
    #Filter by bars
    bars: [ID]
    #Filter by Alcohol content
    AlcoholContent: Float
    #Filter by Min Alcohol content
    maxAlcoholContent: Float
    #Filter by Max Alcohol content
    minAlcoholContent: Float
    #Filter by Rating
    Rating: Float
    #Filter by Min Rating
    maxRating: Float
    #Filter by Max Rating
    minRating: Float
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input BeerListOrder {
    order: BeerListOrderEnums!
    direction: OrderDirectionEnum
  }

  type Beer {
    _id: ID!
    beerType: BeerTypeEnum!
    name: String!
    label: URL
    description: String
    alcoholContent: Float!
    rating: Float!
    brewery: Brewery!
    allBars(skip: Int, limit: Int, filters: BarBeerListFilters, order: [BarBeerListOrder]): BarBeerList!
    oneBar(_id: ID!): BarBeer!
    barCount(filters: BarBeerListFilters): Int!
    allRatings(skip: Int, limit: Int, filters: RatingListFilters, order: [RatingListOrder]): RatingList!
    oneRating(_id: ID!): Rating!
    ratingCount(filters: RatingListFilters): Int!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddBeerInput {
    beerType: BeerTypeEnum!
    name: String!
    label: URL
    description: String
    alcoholContent: Float!
    _breweryId: ID!
  }

  input UpdateBeerInput {
    beerType: BeerTypeEnum
    name: String
    label: URL
    description: String
    alcoholContent: Float
    _breweryId: ID
  }
`

const beerList = `
  allBeers(skip: Int, limit: Int, filters: BeerListFilters, order: [BeerListOrder]): BeerList!
  oneBeer(_id: ID!): Beer!
  beerCount(filters: BeerListFilters): Int!
`

const beerMutations = `
  addBeer(input: AddBeerInput!): Beer!
  updateBeer(_id: ID!, input: UpdateBeerInput!): Beer!
  removeBeer(_id: ID!): ID!
`
module.exports = {
  beerSchema,
  beerList,
  beerMutations,
}
