const { connectDb, Rescue } = require('../db.js');

const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'GET') {
    await connectDb();
    const { rescueId } = event.queryStringParameters;
    const rescue = await Rescue.findById(rescueId);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ finished: rescue.finished ?? false, blockNumber: rescue.blockNumber }),
    }
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({ message: `Success` }),

    // // more keys you can return:
    // headers: { "headerName": "headerValue", ... },
    // isBase64Encoded: true,
  }
}

module.exports = { handler }
