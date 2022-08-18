// Import all functions from weekly-post.js
const lambda = require('../../../src/handlers/weekly-post.js');

describe('generateWeeklyPost', () => {
  beforeAll(() => {
  });

  afterAll(() => {
  });

  it('should return HTTP 200', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { pickup_date: '2022-07-09' }
    };

    const result = await lambda.generateWeeklyPost(event);

    // expect 200 status code
    expect(result.statusCode).toEqual(200);
  });

  it('should return a string with the correct day of week', async () => {
    const event = {
      httpMethod: 'GET',
      queryStringParameters: { pickup_date: '2022-07-09' }
    };

    const result = await lambda.generateWeeklyPost(event);

    // expect Saturday for 2022-07-09
    expect(result.body).toMatch(/土/);
  });
});
