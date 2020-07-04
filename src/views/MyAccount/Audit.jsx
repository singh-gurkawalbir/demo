import React, { Component } from 'react';
import AuditLog from '../../components/AuditLog';
import PanelHeader from '../../components/PanelHeader';

export default class Audit extends Component {
  render() {
    return (
      <>
        <PanelHeader title="Audit Log" />
        <AuditLog />
      </>
    );
  }
}
