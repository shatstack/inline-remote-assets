const test = require('ava');
const {ping} = require('../src/main');

test('ping', async (t) => {
  t.is(await ping(), 'pong');
});
