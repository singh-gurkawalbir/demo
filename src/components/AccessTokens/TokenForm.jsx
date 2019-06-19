import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import LoadResources from '../LoadResources';

const mapStateToProps = (state, { integrationId }) => {
  const resources = {};

  ['connections', 'exports', 'imports'].forEach(rt => {
    resources[rt] = selectors.resourceList(state, { type: rt }).resources;
  });

  ['connections', 'exports', 'imports'].forEach(rt => {
    resources[rt] = resources[rt].filter(r => {
      if (integrationId) {
        return r._integrationId === integrationId;
      }

      return !r._integrationId;
    });
  });

  return {
    accessTokens: selectors.accessTokenList(state, integrationId),
    resources,
  };
};

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing.unit / 2,
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}))
class TokenForm extends Component {
  render() {
    const {
      classes,
      accessTokens,
      resources,
      onSaveClick,
      onCancelClick,
      id,
      integrationId,
    } = this.props;
    const isEditMode = !!id;
    const data = isEditMode ? accessTokens.find(at => at._id === id) : {};
    let autoPurgeOptions = [];

    if (!integrationId) {
      autoPurgeOptions.push({ label: 'Never', value: 'never' });
    }

    autoPurgeOptions = autoPurgeOptions.concat([
      { label: '1 Hour', value: '1-h' },
      { label: '4 Hours', value: '4-h' },
      { label: '1 Day', value: '1-d' },
      { label: '4 Days', value: '4-d' },
      { label: '10 Days', value: '10-d' },
      { label: '30 Days', value: '30-d' },
    ]);
    let isAutoPurgeRequired = true;

    if (id && data.autoPurgeAt) {
      isAutoPurgeRequired = moment(data.autoPurgeAt).diff(moment()) <= 0;
    }

    const neverAutoPurge = id && !data._integrationId && !data.autoPurgeAt;
    const fields = [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: data.name || '',
        required: true,
        helpText:
          'Name your token so that you can easily reference it from other parts of the application.',
      },
      {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description',
        defaultValue: data.description || '',
        required: true,
        helpText:
          'Describe how your token is being used and be sure to mention exactly where your token is being stored externally.',
      },
      {
        id: 'autoPurge',
        name: 'autoPurge',
        type: 'select',
        label: 'Auto Purge Token',
        defaultValue: neverAutoPurge ? 'never' : '',
        required: isAutoPurgeRequired,
        options: [
          {
            items: autoPurgeOptions,
          },
        ],
        helpText: 'Access Level help text',
      },
      {
        id: 'scope',
        name: 'scope',
        type: 'radiogroup',
        label: 'Scope',
        defaultValue: data.fullAccess ? 'fullAccess' : 'custom',
        options: [
          {
            items: [
              { label: 'Full Access', value: 'fullAccess' },
              { label: 'Custom', value: 'custom' },
            ],
          },
        ],
        helpText:
          'Scope is used to define access permissions for your token. Full Access - Full access tokens have unlimited permissions to your integrator.io account. Please be very careful provisioning full access tokens! Custom - Custom scope tokens can be created with only minimal permissions to specific resources in your integrator.io account, and they can only be used to invoke very specific integrator.io APIs (i.e. only the APIs required to import or export data from external applications).',
      },
      {
        id: '_connectionIds',
        name: '_connectionIds',
        type: 'multiselect',
        label: 'Connections',
        defaultValue: data._connectionIds || [],
        visibleWhen: [
          {
            field: 'scope',
            is: ['custom'],
          },
        ],
        options: [
          {
            items: resources.connections.map(i => ({
              label: i.name,
              value: i._id,
            })),
          },
        ],
        helpText:
          'Select the Connections that this token should provide access to.',
      },
      {
        id: '_exportIds',
        name: '_exportIds',
        type: 'multiselect',
        label: 'Exports',
        defaultValue: data._exportIds || [],
        visibleWhen: [
          {
            field: 'scope',
            is: ['custom'],
          },
        ],
        options: [
          {
            items: resources.exports.map(i => ({
              label: i.name,
              value: i._id,
            })),
          },
        ],
        helpText:
          'Select the Exports that this token should provide access to.',
      },
      {
        id: '_importIds',
        name: '_importIds',
        type: 'multiselect',
        label: 'Imports',
        defaultValue: data._importIds || [],
        visibleWhen: [
          {
            field: 'scope',
            is: ['custom'],
          },
        ],
        options: [
          {
            items: resources.imports.map(i => ({
              label: i.name || i._id,
              value: i._id,
            })),
          },
        ],
        helpText:
          'Select the Imports that this token should provide access to.',
      },
    ];

    return (
      <LoadResources required resources="connections, exports, imports">
        <DynaForm fieldMeta={{ fields }}>
          <div className={classes.actions}>
            <Button
              onClick={onCancelClick}
              className={classes.actionButton}
              size="small"
              variant="contained">
              Cancel
            </Button>
            <DynaSubmit className={classes.actionButton} onClick={onSaveClick}>
              Save
            </DynaSubmit>
          </div>
        </DynaForm>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(TokenForm);
