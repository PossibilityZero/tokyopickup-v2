// Create clients and set shared const values outside of the handler.

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */

function getLocalizedMonth(date, language) {
  return date.toLocaleString(language, { month: 'long' });
}

function getLocalizedDate(date, language) {
  // Output example: '6 (Wed)' or '6 (水)'
  return `${date.getDate()} (${date.toLocaleString(language, { weekday: 'short' })})`;
}

function getLocalizedListOfDatesInMonth(dates, language) {
  // TODO: Check if all dates are same month
  const localizedMonth = getLocalizedMonth(dates[0], language);
  const localizedListOfDates = dates
    .map(date => getLocalizedDate(date, language))
    .join(', ');
  // Output example: 'May: 6 (Wed), 13 (Wed), 19 (Tue)'
  return `${localizedMonth}: ${localizedListOfDates}`
}

function generateMonthlyPostVariables(pickupDates) {
  // pickupDates: Sorted array of Date objects
  // months: array of arrays, each containing the list of Date objects
  // for one month's pickup dates. All elements are sorted
  const firstMonth = pickupDates[0].getMonth();
  const months = [
    pickupDates.filter(date => date.getMonth() == firstMonth),
    pickupDates.filter(date => date.getMonth() == (firstMonth + 1) % 12) // % in case of Dec-Jan
  ];

  return {
    monthNames: {
      en: months.map((dates) => getLocalizedMonth(dates[0], 'en')),
      ja: months.map((dates) => getLocalizedMonth(dates[0], 'ja'))
    },
    datesListByMonth: {
      en: months.map((date) => getLocalizedListOfDatesInMonth(date, 'en')),
      ja: months.map((date) => getLocalizedListOfDatesInMonth(date, 'ja'))
    }
  };
}

function getPickupDatesFromQueryString(queryStringParams) {
  // return a sorted array of Date objects
  const pickupDatesParam = queryStringParams.pickup_dates;
  const pickupDates = pickupDatesParam.split(',')
    .map(dateString => new Date(dateString))
    .sort((date1, date2) => date1.getTime() - date2.getTime());
  // Note (Kai): I do not know why Array.sort() here needs a comparison function.
  // From all my local tests, it sorted Date objects correctly, in ascending order.
  // However, it went haywire when deployed, so I added an explicit comparison.

  return pickupDates;
}

function formatPostText(options) {
  return [
    `(Weeknight pickup ${options.monthNames.en.join('/')} - English follows Japanese)`,
    ``,
    `${options.monthNames.ja.join('・')}の平日夜広尾ピックアップの予定です。`,
    `${options.datesListByMonth.ja[0]}`,
    `${options.datesListByMonth.ja[1]}`,
    `時間：18:30~20:45`,
    `場所：広尾中学校 (https://goo.gl/maps/ptmJ2)`,
    ``,
    `６時半前には校庭に入らないでください。`,
    `東門から入ってください。`,
    `運動着を白黒それぞれ一枚、ディスク一枚を持参してください。`,
    `スパイク禁止のため、ランシューズまたはトレーニングシューズを用意してください。`,
    `雨天で中止になる可能性もあります。当日にまた投稿するので確認ください。`,
    ``,
    `Weeknight Hiroo Pickup dates for ${options.monthNames.en.join('/')} `,
    `${options.datesListByMonth.en[0]}`,
    `${options.datesListByMonth.en[1]}`,
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

  const pickupDates = getPickupDatesFromQueryString(event.queryStringParameters);
  const postVariables = generateMonthlyPostVariables(pickupDates);

  console.info(`postVariables: ${JSON.stringify(postVariables)}`);
  const responseBody = {
    postText: formatPostText(postVariables)
  };
  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
