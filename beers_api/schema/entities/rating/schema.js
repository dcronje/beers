const ratingSchema = `
  enum RatingListOrderEnums {
    #Order by User Name
    USER_NAME
    #Order by Beer Name
    BEER_NAME
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type RatingList {
    list: [Rating]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input RatingListFilters {
    #Filter by Beers
    beers: [ID]
    #Filter by Users
    users: [ID]
    #Filter by Beer Name
    beerName: String
    #Filter by User Name
    userName: String
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input RatingListOrder {
    order: RatingListOrderEnums!
    direction: OrderDirectionEnum
  }

  type Rating {
    _id: ID!
    value: Int!
    review: String
    beer: Beer!
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddRatingInput {
    value: Int!
    review: String
    _beerId: ID!
    _userId: ID!
  }

  input UpdateRatingInput {
    value: Int!
    review: String
  }
`

const ratingList = `
  allRatings(skip: Int, limit: Int, filters: RatingListFilters, order: [RatingListOrder]): RatingList!
  oneRating(_id: ID!): Rating!
  ratingCount(filters: RatingListFilters): Int!
`

const ratingMutations = `
  addRating(input: AddRatingInput!): Rating!
  updateRating(_id: ID!, input: UpdateRatingInput!): Rating!
  removeRating(_id: ID!): ID!
`
module.exports = {
  ratingSchema,
  ratingList,
  ratingMutations,
}
