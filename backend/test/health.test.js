const test = require('node:test');
const assert = require('node:assert/strict');
const { stringField } = require('../middleware/validate');
const { TIME_SLOTS, dayBounds } = require('../services/availability');

test('stringField rejects oversized input', () => {
  assert.equal(stringField('x'.repeat(501), 'Description', { max: 500 }), 'Description must be at most 500 characters');
});

test('stringField accepts optional empty input', () => {
  assert.equal(stringField('', 'Notes', { required: false }), null);
});

test('availability exposes fixed two-hour appointment slots', () => {
  assert.equal(TIME_SLOTS.length, 5);
  assert.equal(TIME_SLOTS[0], '9:00 AM - 11:00 AM');
  assert.equal(TIME_SLOTS[4], '5:00 PM - 7:00 PM');
});

test('dayBounds creates a UTC day range for availability queries', () => {
  const bounds = dayBounds('2026-10-12');
  assert.equal(bounds.start.toISOString(), '2026-10-12T00:00:00.000Z');
  assert.equal(bounds.end.toISOString(), '2026-10-13T00:00:00.000Z');
  assert.equal(dayBounds('not-a-date'), null);
});
