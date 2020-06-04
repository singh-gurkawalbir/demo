import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import FlowAuditLog from '../../../FlowAuditLog';

export default function AuditLog() {
  const match = useRouteMatch();
  const { connectionId } = match.params;

  return <FlowAuditLog resourceId={connectionId} resourceType="connections" />;
}
