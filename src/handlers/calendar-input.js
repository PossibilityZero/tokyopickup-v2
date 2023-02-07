// Create clients and set shared const values outside of the handler.

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */

function generateCalendarInputHtml () {
  // generate html template
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Calendar Input</title></head><body><h1>Calendar Input</h1><form action="/calendar" method="post"><label for="title">Title</label><input type="text" id="title" name="title"><br><label for="start">Start</label><input type="datetime-local" id="start" name="start"><br><label for="end">End</label><input type="datetime-local" id="end" name="end"><br><label for="description">Description</label><input type="text" id="description" name="description"><br><label for="location">Location</label><input type="text" id="location" name="location"><br><label for="organizer">Organizer</label><input type="text" id="organizer" name="organizer"><br><label for="attendees">Attendees</label><input type="text" id="attendees" name="attendees"><br><input type="submit" value="Submit"></form></body></html>';
  return html;
}

exports.renderCalendarInput = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const response = {
    statusCode: 200,
    body: generateCalendarInputHtml()
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
