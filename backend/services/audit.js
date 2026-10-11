const AuditEvent = require('../models/AuditEvent');

async function recordAudit({ actorId, action, resourceType, resourceId, metadata, requestId }) {
  try {
    await AuditEvent.create({ actorId, action, resourceType, resourceId, metadata, requestId });
  } catch (error) {
    console.error('Audit event could not be recorded:', error.message);
  }
}

module.exports = { recordAudit };
