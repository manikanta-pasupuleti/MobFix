const Booking = require('../models/Booking');

const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM'
];

const DEFAULT_SLOT_CAPACITY = 2;

function dayBounds(dateValue) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return { start: date, end: next };
}

function getSlotCapacity() {
  const configured = Number.parseInt(process.env.APPOINTMENT_SLOT_CAPACITY || '', 10);
  return Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_SLOT_CAPACITY;
}

async function getAvailability(dateValue) {
  const bounds = dayBounds(dateValue);
  if (!bounds) return null;

  const counts = await Booking.aggregate([
    {
      $match: {
        preferredDate: { $gte: bounds.start, $lt: bounds.end },
        status: { $ne: 'Cancelled' }
      }
    },
    { $group: { _id: '$preferredTimeSlot', booked: { $sum: 1 } } }
  ]);
  const bookedBySlot = new Map(counts.map(entry => [entry._id, entry.booked]));
  const capacity = getSlotCapacity();

  return TIME_SLOTS.map(slot => {
    const booked = bookedBySlot.get(slot) || 0;
    return { slot, booked, capacity, available: Math.max(capacity - booked, 0), isFull: booked >= capacity };
  });
}

module.exports = { TIME_SLOTS, dayBounds, getAvailability, getSlotCapacity };
