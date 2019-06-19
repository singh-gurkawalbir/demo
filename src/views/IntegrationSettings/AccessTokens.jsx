import { Component } from 'react';
import AccessTokens from '../../components/AccessTokens';

export default class AuditLogs extends Component {
  render() {
    const { match } = this.props;
    const { integrationId } = match.params;

    return <AccessTokens integrationId={integrationId} />;
  }
}
