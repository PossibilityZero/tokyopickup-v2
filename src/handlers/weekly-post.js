// Create clients and set shared const values outside of the handler.

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */

function formatPostText (options) {
  const weeklyPost = [
  `Weeknight Pickup ${options.month}/${options.date} (${options.dayEnglish}) (English follows Japanese)`,
  '',
  `今週のピックアップは${options.month}月${options.date}日(${options.dayJapanese})です。18:30~20:45、広尾中学校(https://goo.gl/maps/ptmJ2)。東門から入ってください。6時半前には校庭に入らないでください。`,
  '運動着を白黒それぞれ一枚、ディスク一枚を持参してください。',
  'スパイク禁止のため、ランシューズまたはトレーニングシューズを用意してください。',
  '',
  `Weeknight pickup this week is on ${options.monthEnglish} ${options.date} (${options.dayEnglish}) at Hiroo Jr. High (https://goo.gl/maps/ptmJ2), 6:30 PM - 8:45 PM. Please enter from the east gate (on Komazawa-dori), and do not enter the school grounds before 6:30 PM.`,
  "Bring a white shirt, a dark shirt, and a disc. Also, cleats aren't allowed on the field, so please bring sneakers or turf shoes instead."
  ].join('\n');
  return weeklyPost;
}

exports.generateWeeklyPost = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const pickupDateParam = event.queryStringParameters.pickup_date;
  const pickupDate = new Date(pickupDateParam);

  const options = {
    month: pickupDate.getMonth() + 1,
    date: pickupDate.getDate(),
    monthEnglish: pickupDate.toLocaleString('en-US', { month: 'long' }),
    dayEnglish: pickupDate.toLocaleString('en-US', { weekday: 'short' }),
    dayJapanese: pickupDate.toLocaleString('ja-JP', { weekday: 'short' })
  };
  const postText = formatPostText(options);
  const responseBody = { postText };
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
