import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../utils/constants';
import LoadResources from '../LoadResources';

const mapStateToProps = state => ({
  integrations: selectors.resourceList(state, {
    type: 'integrations',
    ignoreEnvironmentFilter: true,
  }).resources,
  users: selectors.orgUsers(state),
});

@withStyles(theme => ({
  actions: {
    textAlign: 'right',
    padding: theme.spacing(0.5),
  },
  actionButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))
class UserForm extends Component {
  render() {
    const {
      classes,
      integrations,
      users,
      onSaveClick,
      onCancelClick,
      id,
    } = this.props;
    const isEditMode = !!id;
    const data = isEditMode ? users.find(u => u._id === id) : undefined;
    let integrationsToManage = [];
    let integrationsToMonitor = [];

    if (
      isEditMode &&
      ![
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      ].includes(data.accessLevel) &&
      data.integrationAccessLevel.length
    ) {
      integrationsToManage = data.integrationAccessLevel
        .filter(ial => ial.accessLevel === INTEGRATION_ACCESS_LEVELS.MANAGE)
        .map(ial => ial._integrationId);
      integrationsToMonitor = data.integrationAccessLevel
        .filter(ial => ial.accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR)
        .map(ial => ial._integrationId);
    }

    const fieldMeta = {
      fieldMap: {
        email: {
          id: 'email',
          name: 'email',
          type: 'text',
          label: 'Email',
          defaultValue: isEditMode ? data.sharedWithUser.email : '',
          required: true,
          defaultDisabled: isEditMode,
          helpText:
            'Enter the email of the user you would like to invite to manage and/or monitor selected integrations.',
        },
        accessLevel: {
          id: 'accessLevel',
          name: 'accessLevel',
          type: 'select',
          label: 'Access Level',
          defaultValue: isEditMode ? data.accessLevel || 'tile' : '',
          required: true,
          options: [
            {
              items: [
                {
                  label: 'Manage All (including future) Integrations',
                  value: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                },
                {
                  label: 'Monitor All (including future) Integrations',
                  value: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
                {
                  label: 'Manage/Monitor Selected Integrations',
                  value: USER_ACCESS_LEVELS.TILE,
                },
              ],
            },
          ],
          helpText: 'Access Level help text',
        },
        integrationsToManage: {
          id: 'integrationsToManage',
          name: 'integrationsToManage',
          type: 'multiselect',
          label: 'Integrations to Manage',
          defaultValue: integrationsToManage,
          visibleWhen: [
            {
              field: 'accessLevel',
              is: [USER_ACCESS_LEVELS.TILE],
            },
          ],
          requiredWhen: [
            {
              field: 'integrationsToMonitor',
              is: [[]],
            },
          ],
          options: [
            {
              items: integrations.map(i => ({
                label: `${i.name}${i.sandbox ? ' (SB)' : ''}`,
                value: i._id,
              })),
            },
          ],
          helpText:
            'The invited user will have permissions to manage the integrations selected here.',
        },
        integrationsToMonitor: {
          id: 'integrationsToMonitor',
          name: 'integrationsToMonitor',
          type: 'multiselect',
          label: 'Integrations to Monitor',
          defaultValue: integrationsToMonitor,
          visibleWhen: [
            {
              field: 'accessLevel',
              is: [USER_ACCESS_LEVELS.TILE],
            },
          ],
          requiredWhen: [
            {
              field: 'integrationsToManage',
              is: [[]],
            },
          ],
          options: [
            {
              items: integrations.map(i => ({
                label: `${i.name}${i.sandbox ? ' (SB)' : ''}`,
                value: i._id,
              })),
            },
          ],
          helpText:
            'The invited user will have permissions to monitor the integrations selected here.',
        },
      },
      layout: {
        fields: [
          'email',
          'accessLevel',
          'integrationsToManage',
          'integrationsToMonitor',
        ],
      },
    };

    return (
      <LoadResources required resources="integrations">
        <DynaForm fieldMeta={fieldMeta}>
          <div className={classes.actions}>
            <Button
              data-test="cancelUserForm"
              onClick={onCancelClick}
              className={classes.actionButton}
              size="small"
              variant="contained"
              color="secondary">
              Cancel
            </Button>
            <DynaSubmit
              data-test="submitUserForm"
              className={classes.actionButton}
              onClick={onSaveClick}>
              Save
            </DynaSubmit>
          </div>
        </DynaForm>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(UserForm);
