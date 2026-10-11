const mongoose = require('mongoose');

const AuditEventSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true, maxlength: 80 },
  resourceType: { type: String, required: true, maxlength: 40 },
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: mongoose.Schema.Types.Mixed },
  requestId: { type: String, maxlength: 100 }
}, { timestamps: true });

AuditEventSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
AuditEventSchema.index({ actorId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditEvent', AuditEventSchema);
