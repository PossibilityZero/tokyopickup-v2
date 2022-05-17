// Create clients and set shared const values outside of the handler.

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */

function formatPostText(options) {
  return [
    `(Weeknight pickup April/May - English follows Japanese)`,
    ``,
    `4・5月の平日夜広尾ピックアップの予定です。`,
    `4月：6（水）、13（水）、20（水）、27（水）`,
    `5月：4（水）、11（水）、18（水）、25（水）`,
    `時間：18:30~20:45`,
    `場所：広尾中学校 (https://goo.gl/maps/ptmJ2)`,
    ``,
    `６時半前には校庭に入らないでください。`,
    `東門から入ってください。`,
    `運動着を白黒それぞれ一枚、ディスク一枚を持参してください。`,
    `スパイク禁止のため、ランシューズまたはトレーニングシューズを用意してください。`,
    `雨天で中止になる可能性もあります。当日にまた投稿するので確認ください。`,
    ``,
    `Weeknight Hiroo Pickup dates for April/May`,
    `April 6 (Wed), 13 (Wed), 20 (Wed), 27 (Wed)`,
    `May 4 (Wed), 11 (Wed), 18 (Wed), 25 (Wed)`,
    `Time: 6:30 PM - 8:45 PM`,
    `Location: Hiroo Jr High School (https://goo.gl/maps/ptmJ2)`,
    ``,
    `Please bring:`,
    `* A DARK and a WHITE (not light, grey, or ambiguously hued) shirt.`,
    `* SNEAKERS or TURF SHOES. Cleats are not allowed.`,
    `* A DISC for warm-ups.`,
    ``,
    `Please enter from the east gate on Komazawa Dori, *not* the north gate. Please do not enter the school grounds before 6:30 PM.`,
    ``,
    `Pickup is cancelled in case of rain or if the fields are wet. We will post on the day of each pickup, so please check to confirm that the game is on.`,
  ].join('\n');  
}


exports.generateMonthlyPost = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const pickupDatesParam = event.queryStringParameters.pickup_dates;
  const pickupDates = pickupDatesParam.split(',').map(dateString => new Date(dateString)).sort();
  const months = {};
  new Set(pickupDates.map(date => date.getUTCMonth()))
    .forEach(function(month) {
      months[month] = pickupDates.filter(date => date.getUTCMonth() == month);
    });

  // TODO: Format post text
  // const options = {
  //   month: pickupDate.getMonth() + 1,
  //   date: pickupDate.getDate(),
  //   monthEnglish: pickupDate.toLocaleString('en-US', { month: 'long' }),
  //   dayEnglish: pickupDate.toLocaleString('en-US', { weekday: 'short' }),
  //   dayJapanese: pickupDate.toLocaleString('ja-JP', { weekday: 'short' }),
  //   relativeDayEnglish: relativeDay.english,
  //   relativeDayJapanese: relativeDay.japanese
  // };
  // const postText = formatPostText(options);

  const now = new Date();
  const responseBody = { months, now };
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
