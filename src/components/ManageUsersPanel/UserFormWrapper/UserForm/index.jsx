import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import LoadResources from '../../../LoadResources';
import ButtonGroup from '../../../ButtonGroup';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function UserForm({
  id,
  onSaveClick,
  onCancelClick,
  disableSave,
}) {
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const users = useSelector(state => selectors.usersList(state));
  const isEditMode = !!id;
  const data = isEditMode ? users.find(u => u._id === id) : undefined;
  let integrationsToManage = [];
  let integrationsToMonitor = [];

  if (
    isEditMode &&
    [
      USER_ACCESS_LEVELS.TILE,
      USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
    ].includes(data.accessLevel) &&
    // integrationAccessLevel is expected to be an array but can be undefined
    data.integrationAccessLevel?.length
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
        validWhen: {
          matchesRegEx: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: 'Please enter a valid email address',
          },
        },
      },
      accessLevel: {
        id: 'accessLevel',
        name: 'accessLevel',
        type: 'select',
        label: 'Access level',
        defaultValue: isEditMode ? data.accessLevel || 'tile' : '',
        required: true,
        skipSort: true,
        options: [
          {
            items: [
              {
                label: 'Administer account',
                value: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              },
              {
                label: 'Manage all integrations',
                value: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              },
              {
                label: 'Monitor all integrations',
                value: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
              },
              {
                label: 'Manage/monitor select integrations',
                value: USER_ACCESS_LEVELS.TILE,
              },
            ],
          },
        ],
        helpKey: 'users.accesslevel',
      },
      integrationsToManage: {
        id: 'integrationsToManage',
        name: 'integrationsToManage',
        type: 'multiselect',
        label: 'Integrations to manage',
        defaultValue: integrationsToManage,
        visibleWhen: [
          {
            field: 'accessLevel',
            is: [USER_ACCESS_LEVELS.TILE],
          },
          {
            field: 'accessLevel',
            is: [USER_ACCESS_LEVELS.ACCOUNT_MONITOR],
          },
        ],
        requiredWhenAll: [
          {
            field: 'accessLevel',
            is: [USER_ACCESS_LEVELS.TILE],
          },
          {
            field: 'integrationsToMonitor',
            is: [[]],
          },
        ],
        options: [
          {
            items: integrations.filter(i => !i._parentId).map(i => ({
              label: `${i.name}${i.sandbox ? ' (SB)' : ''}`,
              value: i._id,
              tag: i.tag,
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
        label: 'Integrations to monitor',
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
            items: integrations.filter(i => !i._parentId).map(i => ({
              label: `${i.name}${i.sandbox ? ' (SB)' : ''}`,
              value: i._id,
              tag: i.tag,
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
  const formKey = useFormInitWithPermissions({ fieldMeta });

  return (
    <LoadResources required resources="integrations">
      <DrawerContent>
        <DynaForm
          formKey={formKey}
          fieldMeta={fieldMeta} />
      </DrawerContent>
      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            data-test="submitUserForm"
            onClick={onSaveClick}>
            {disableSave ? 'Saving...' : 'Save'}
          </DynaSubmit>
          <Button
            data-test="cancelUserForm"
            onClick={onCancelClick}
            variant="text"
            color="primary">
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </LoadResources>
  );
}
