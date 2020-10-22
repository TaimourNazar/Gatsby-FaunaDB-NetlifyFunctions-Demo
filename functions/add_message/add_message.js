var faunadb = require('faunadb'), q = faunadb.query;
require('dotenv').config();
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event,context) => {
  
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {

    const messageBody=JSON.parse(event.body);
    var adminClient = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });

    const result = await adminClient.query(
      q.Create(
          q.Collection('messages'),
          { data: { detail: messageBody.message} },
      )
    );
    //const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: result.ref.id}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
