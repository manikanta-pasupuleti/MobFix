const test = require('node:test');
const assert = require('node:assert/strict');
const { canTransition } = require('../services/bookingLifecycle');

test('booking lifecycle allows the expected forward path', () => {
  assert.equal(canTransition('Pending', 'Quoted'), true);
  assert.equal(canTransition('Quoted', 'Confirmed'), true);
  assert.equal(canTransition('Confirmed', 'In Progress'), true);
  assert.equal(canTransition('In Progress', 'Ready for Pickup'), true);
  assert.equal(canTransition('Ready for Pickup', 'Completed'), true);
});

test('booking lifecycle rejects skipping states and reopening terminal states', () => {
  assert.equal(canTransition('Pending', 'Completed'), false);
  assert.equal(canTransition('Completed', 'In Progress'), false);
  assert.equal(canTransition('Cancelled', 'Pending'), false);
});
