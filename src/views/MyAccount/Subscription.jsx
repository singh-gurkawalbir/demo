import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CheckPermissions from '../../components/CheckPermissions';

export const SubscriptionItem = () => (
  <Typography variant="h6">Subscription</Typography>
);

export default class Subscription extends Component {
  render() {
    const { hide } = this.props;

    if (hide) return '';

    return (
      <CheckPermissions permission="subscriptions.view">
        <div>
          <Typography variant="h6">Subscription</Typography>
        </div>
      </CheckPermissions>
    );
  }
}
