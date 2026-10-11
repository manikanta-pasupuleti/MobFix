const TRANSITIONS = {
  Pending: ['Quoted', 'Cancelled'],
  Quoted: ['Confirmed', 'Cancelled'],
  Confirmed: ['In Progress', 'Cancelled'],
  'In Progress': ['Ready for Pickup', 'Cancelled'],
  'Ready for Pickup': ['Completed'],
  Completed: [],
  Cancelled: []
};

function canTransition(from, to) {
  return TRANSITIONS[from] ? TRANSITIONS[from].includes(to) : false;
}

module.exports = { TRANSITIONS, canTransition };
