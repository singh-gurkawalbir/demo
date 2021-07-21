import React from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../../../reducers';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  EMAIL_REGEX,
  INVITE_USER_DRAWER_FORM_KEY,
} from '../../../../utils/constants';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import LoadResources from '../../../LoadResources';
import DynaForm from '../../../DynaForm';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function UserForm({
  id,
  onSaveClick,
  onCancelClick,
  dataPublic,
}) {
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const users = useSelector(state => selectors.usersList(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isSSOEnabled = useSelector(state => selectors.isSSOEnabled(state));

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
            pattern: EMAIL_REGEX,
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
      accountSSORequired: {
        type: 'checkbox',
        id: 'accountSSORequired',
        name: 'accountSSORequired',
        label: 'Require account Single sign-on(SSO)?',
        defaultValue: isEditMode ? !!data.accountSSORequired : true,
        visible: !isEditMode && isAccountOwnerOrAdmin && isSSOEnabled,
        // Incase of invite, this field should not be passed if the owner has not enabled SSO
        omitWhenHidden: !isEditMode,
        helpText: 'Check this box to require single sign-on (SSO) authentication for this user.',
      },
    },
    layout: {
      fields: [
        'email',
        'accessLevel',
        'integrationsToManage',
        'integrationsToMonitor',
        'accountSSORequired',
      ],
    },
  };

  useFormInitWithPermissions({ fieldMeta, formKey: INVITE_USER_DRAWER_FORM_KEY });
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, INVITE_USER_DRAWER_FORM_KEY)
  );
  const values = useSelector(state => selectors.formValueTrimmed(state, INVITE_USER_DRAWER_FORM_KEY), shallowEqual);
  const handleSave = () => {
    onSaveClick(values);
  };

  return (
    <LoadResources required resources="integrations,ssoclients">
      <DrawerContent>
        <DynaForm
          dataPublic={dataPublic}
          formKey={INVITE_USER_DRAWER_FORM_KEY} />
      </DrawerContent>
      <DrawerFooter>
        <SaveAndCloseMiniResourceForm
          formKey={INVITE_USER_DRAWER_FORM_KEY}
          submitButtonLabel="Save & Close"
          submitTransientLabel="Saving..."
          formSaveStatus={formSaveStatus}
          handleSave={handleSave}
          handleCancel={onCancelClick}
        />
      </DrawerFooter>
    </LoadResources>
  );
}
