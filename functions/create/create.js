const faunadb = require("faunadb")
q = faunadb.query
require("dotenv").config()

const handler = async event => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" }
    }
    const client = new faunadb.Client({ secret: process.env.DB_SECRET })
    const obj = JSON.parse(event.body)
    let result = await client.query(
      q.Create(q.Collection("messages"), { data: obj })
    )
    console.log("Entry Created and Inserted in Container: " + result.ref.id)

    const subject = event.queryStringParameters.name || "World"
    return {
      statusCode: 200,
      body: JSON.stringify({ id: `${result.ref.id}` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
