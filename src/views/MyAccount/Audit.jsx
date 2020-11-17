import React from 'react';
import AuditLog from '../../components/AuditLog';
import PanelHeader from '../../components/PanelHeader';

export default function Audit() {
  return (
    <>
      <PanelHeader title="Audit Log" />
      <AuditLog />
    </>
  );
}
