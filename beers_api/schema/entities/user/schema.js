const userSchema = `
  enum UserListOrderEnums {
    #Order by First Name
    FIRST_NAME
    #Order by Last Name
    LAST_NAME
    #Order by Created at
    CREATED_AT
    #Order by Updated at
    UPDATED_AT
  }

  type UserList {
    list: [User]!
    count: Int!
    skip: Int!
    limit: Int!
  }

  input UserListFilters {
    #Filter by First Name
    firstName: String
    #Filter by First Name
    lastName: String
    #Filter by Min Created at
    minCreationTime: DateTime
    #Filter by Max Created at
    maxCreationTime: DateTime
    #Filter by Min Updated at
    minUpdatedTime: DateTime
    #Filter by Max Updated at
    maxUpdatedTime: DateTime
  }

  input UserListOrder {
    order: UserListOrderEnums!
    direction: OrderDirectionEnum
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    profileImage: URL!
    allRatings(skip: Int, limit: Int, filters: RatingListFilters, order: [RatingListOrder]): RatingList!
    oneRating(_id: ID!): Rating!
    ratingCount(filters: RatingListFilters): Int!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input AddUserInput {
    firstName: String!
    lastName: String!
    profileImage: URL!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    profileImage: URL
  }
`

const userList = `
  allUsers(skip: Int, limit: Int, filters: UserListFilters, order: [UserListOrder]): UserList!
  oneUser(_id: ID!): User!
  userCount(filters: UserListFilters): Int!
`

const userMutations = `
  addUser(input: AddUserInput!): User!
  updateUser(_id: ID!, input: UpdateUserInput!): User!
  removeUser(_id: ID!): ID!
`
module.exports = {
  userSchema,
  userList,
  userMutations,
}
