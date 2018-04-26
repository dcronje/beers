// TODO: Figure out subscriptions?
let DateTime = require('./scalars/datetime')
let URL = require('./scalars/url')
let Email = require('./scalars/email')
let Phone = require('./scalars/phone')
let Date = require('./scalars/date')
let { barQueryResolvers, barMutationResolvers } = require('./entities/bar/resolvers')
let { barBeerQueryResolvers, barBeerMutationResolvers } = require('./entities/barbeer/resolvers')
let { beerQueryResolvers, beerMutationResolvers } = require('./entities/beer/resolvers')
let { breweryQueryResolvers, breweryMutationResolvers } = require('./entities/brewery/resolvers')
let { ratingQueryResolvers, ratingMutationResolvers } = require('./entities/rating/resolvers')
let { userQueryResolvers, userMutationResolvers } = require('./entities/user/resolvers')


const resolverMap = {
  DateTime: DateTime,
  URL: URL,
  Email: Email,
  Phone: Phone,
  Date: Date,
  Query: Object.assign({}, 
    barQueryResolvers(),
    barBeerQueryResolvers(),
    beerQueryResolvers(),
    breweryQueryResolvers(),
    ratingQueryResolvers(),
    userQueryResolvers()
  ),
  Mutation: Object.assign({}, 
    barMutationResolvers(),
    barBeerMutationResolvers(),
    beerMutationResolvers(),
    breweryMutationResolvers(),
    ratingMutationResolvers(),
    userMutationResolvers()
  ),
}

module.exports = resolverMap
