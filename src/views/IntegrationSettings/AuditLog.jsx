import { Component } from 'react';
import AuditLog from '../../components/AuditLog';

export default class AuditLogs extends Component {
  render() {
    const { match } = this.props;
    const { integrationId } = match.params;

    return <AuditLog resourceType="integrations" resourceId={integrationId} />;
  }
}
