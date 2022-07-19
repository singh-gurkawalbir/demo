export const JOB_TYPES = Object.freeze({
  FLOW: 'flow',
  IMPORT: 'import',
  EXPORT: 'export',
  RETRY: 'retry',
  BULK_RETRY: 'bulk_retry',
});
export const JOB_STATUS = Object.freeze({
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  FAILED: 'failed',
  QUEUED: 'queued',
  RUNNING: 'running',
  RETRYING: 'retrying',
  CANCELING: 'canceling',
});
