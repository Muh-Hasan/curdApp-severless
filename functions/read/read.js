const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

const handler = async event => {
  try {
    const client = new faunadb.Client({ secret: process.env.DB_SECRET })

    var result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("messages"))),
        q.Lambda(x => q.Get(x))
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
