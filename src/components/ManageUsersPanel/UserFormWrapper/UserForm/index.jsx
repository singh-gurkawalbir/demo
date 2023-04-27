import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  EMAIL_REGEX,
} from '../../../../constants';
import { message } from '../../../../utils/messageStore';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import LoadResources from '../../../LoadResources';
import ActionGroup from '../../../ActionGroup';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';
import { TextButton } from '../../../Buttons';

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
  const history = useHistory();
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const users = useSelector(state => selectors.usersList(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isSSOEnabled = useSelector(state => selectors.isSSOEnabled(state));

  const isEditMode = !!id;
  // isValidUser is used to check if the id entered is corrupted through URL . Reference : IO-24595
  const isValidUser = !!users.find(u => u._id === id);
  const data = isEditMode ? users.find(u => u._id === id) : undefined;
  let integrationsToManage = [];
  let integrationsToMonitor = [];

  if (
    isEditMode &&
    isValidUser &&
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
        isLoggable: false,
        defaultValue: isEditMode && isValidUser ? data.sharedWithUser.email : '',
        required: true,
        defaultDisabled: isEditMode,
        helpKey: 'userForm.email',
        noApi: true,
        validWhen: {
          matchesRegEx: {
            pattern: EMAIL_REGEX,
            message: message.USER_SIGN_IN.INVALID_EMAIL,
          },
        },
      },
      accessLevel: {
        isLoggable: true,
        id: 'accessLevel',
        name: 'accessLevel',
        type: 'select',
        label: 'Access level',
        defaultValue: isEditMode && isValidUser ? data.accessLevel || 'tile' : '',
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
        noApi: true,
      },
      integrationsToManage: {
        isLoggable: true,
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
        helpKey: 'userForm.integrationsToManage',
        noApi: true,
      },
      integrationsToMonitor: {
        isLoggable: true,
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
        helpKey: 'userForm.integrationsToMonitor',
        noApi: true,
      },
      accountSSORequired: {
        isLoggable: true,
        type: 'switch',
        id: 'accountSSORequired',
        name: 'accountSSORequired',
        label: 'Require SSO?',
        tooltip: message.MFA.ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP,
        defaultValue: isEditMode && isValidUser ? !!data.accountSSORequired : false,
        visible: !isEditMode && isAccountOwnerOrAdmin && isSSOEnabled,
        // Incase of invite, this field should not be passed if the owner has not enabled SSO
        omitWhenHidden: !isEditMode,
        disabledWhen: [{ field: 'accountMFARequired', is: [true] }],
        helpKey: 'userForm.accountSSORequired',
        noApi: true,
      },
      accountMFARequired: {
        isLoggable: true,
        type: 'switch',
        id: 'accountMFARequired',
        name: 'accountMFARequired',
        label: 'Require MFA?',
        defaultValue: isEditMode && isValidUser ? !!data.accountMFARequired : false,
        visible: !isEditMode && isAccountOwnerOrAdmin,
        disabledWhen: [{ field: 'accountSSORequired', is: [true] }],
        tooltip: message.MFA.ACCOUNT_SSO_OR_MFA_REQUIRED_TOOLTIP,
        helpKey: 'userForm.accountMFARequired',
        noApi: true,
      },
    },
    layout: {
      fields: [
        'email',
        'accessLevel',
        'integrationsToManage',
        'integrationsToMonitor',
        'accountSSORequired',
        'accountMFARequired',
      ],
    },
  };
  const formKey = useFormInitWithPermissions({ fieldMeta });

  if (isEditMode && !isValidUser) {
    history.goBack();

    return null;
  }

  return (
    <LoadResources required resources="integrations,ssoclients" >
      <DrawerContent>
        <DynaForm
          formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ActionGroup>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            data-test="submitUserForm"
            onClick={onSaveClick}>
            {disableSave ? 'Saving...' : 'Save'}
          </DynaSubmit>
          <TextButton
            data-test="cancelUserForm"
            onClick={onCancelClick}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </LoadResources>
  );
}
