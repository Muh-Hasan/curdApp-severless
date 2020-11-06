const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()


const handler = async (event) => {
  try {
    const client = new faunadb.Client({ secret: process.env.DB_SECRET })

    const result = await client.query(
      q.Delete(q.Ref(q.Collection("messages"), '281435618325561861'))
    )
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `delted` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
