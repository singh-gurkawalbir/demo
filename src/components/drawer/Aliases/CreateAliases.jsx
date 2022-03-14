import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { useFormOnCancel } from '../../FormOnCancelContext';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import SaveAndCloseButtonGroupForm from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import { getResourceFromAlias } from '../../../utils/resource';
import { FORM_SAVE_STATUS } from '../../../utils/constants';
import getRoutePath from '../../../utils/routePaths';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import InstallationGuideIcon from '../../icons/InstallationGuideIcon';
import ActionGroup from '../../ActionGroup';
import CeligoDivider from '../../CeligoDivider';

const ALIAS_FORM_KEY = 'resource-alias';

const getFieldMeta = (parentResourceId, parentResourceType, alias, aliasResourceId, isEdit) => ({
  fieldMap: {
    aliasId: {
      id: 'aliasId',
      name: 'aliasId',
      type: 'aliasid',
      label: 'Alias ID',
      defaultValue: alias?.alias,
      helpKey: 'alias.aliasId',
      isEdit,
      required: true,
      parentResourceId,
      parentResourceType,
      alias,
    },
    description: {
      id: 'description',
      name: 'description',
      type: 'text',
      label: 'Alias description',
      defaultValue: alias?.description,
      helpKey: 'alias.description',
    },
    aliasResourceType: {
      id: 'aliasResourceType',
      name: 'aliasResourceType',
      type: 'select',
      label: 'Resource type',
      helpKey: 'alias.resourceType',
      defaultValue: getResourceFromAlias(alias).resourceType || '',
      options: [{
        items: [
          {
            label: 'Connection',
            value: 'connections',
          },
          {
            label: 'Export',
            value: 'exports',
          },
          {
            label: 'Flow',
            value: 'flows',
          },
          {
            label: 'Import',
            value: 'imports',
          },
        ],
      }],
      required: true,
      isLoggable: true,
    },
    aliasResourceName: {
      id: 'aliasResourceName',
      name: 'aliasResourceName',
      type: 'selectaliasresource',
      label: 'Resource Name',
      helpKey: 'alias.resource',
      defaultValue: aliasResourceId,
      required: true,
      isLoggable: true,
      refreshOptionsOnChangesTo: ['aliasResourceType'],
      visibleWhen: [
        {
          field: 'aliasResourceType',
          isNot: [''],
        },
      ],
    },
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'aliasResourceName') {
      const resourceType = fields.find(
        field => field.id === 'aliasResourceType'
      );

      return {
        resourceType: resourceType?.value,
        parentResourceId,
        parentResourceType,
      };
    }

    return null;
  },
  layout: {
    containers: [
      {
        fields: [
          'aliasId', 'description', 'aliasResourceType',
        ],
      },
      {
        type: 'indent',
        containers: [
          {
            fields: [
              'aliasResourceName',
            ],
          },
        ],
      },
    ],
  },
});

const AliasForm = ({ resourceId, resourceType, isEdit, parentUrl }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const aliasId = match?.params?.aliasId;
  const [remountCount, setRemountCount] = useState(0);
  const [isFormSaveTriggered, setIsFormSaveTriggered] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const asyncTaskStatus = useSelector(state => selectors.asyncTaskStatus(state, ALIAS_FORM_KEY));
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, resourceType, resourceId);
  const formVal = useSelector(state => selectors.formValueTrimmed(state, ALIAS_FORM_KEY), shallowEqual);

  let alias;

  if (isEdit) {
    alias = resourceAliases.find(ra => ra.alias === aliasId);
  }
  const { id: aliasResourceId } = getResourceFromAlias(alias);
  const fieldMeta = getFieldMeta(resourceId, resourceType, alias, aliasResourceId, isEdit);

  useFormInitWithPermissions({formKey: ALIAS_FORM_KEY, fieldMeta, optionsHandler: fieldMeta?.optionsHandler, remount: remountCount});

  useEffect(() => {
    if (!isFormSaveTriggered || !(asyncTaskStatus === FORM_SAVE_STATUS.COMPLETE)) {
      return;
    }

    enqueueSnackbar({ message: 'You’ve successsfully created an alias.' });

    // if the create alias form is saved
    // we will open the edit alias form of the newly created alias
    if (!isEdit) {
      history.replace(
        getRoutePath(`${parentUrl}/edit/${formVal.alias}`)
      );
    }
  }, [history, formVal, isFormSaveTriggered, asyncTaskStatus, parentUrl, isEdit, enqueueSnackbar]);

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSave = useCallback(closeAfterSave => {
    let newResourceAliases;
    const newAlias = {
      alias: formVal.aliasId,
      description: formVal.description,
    };

    if (formVal.aliasResourceType === 'connections') {
      newAlias._connectionId = formVal.aliasResourceName;
    } else if (formVal.aliasResourceType === 'exports') {
      newAlias._exportId = formVal.aliasResourceName;
    } else if (formVal.aliasResourceType === 'flows') {
      newAlias._flowId = formVal.aliasResourceName;
    } else {
      newAlias._importId = formVal.aliasResourceName;
    }

    if (isEdit) {
      newResourceAliases = resourceAliases.map(aliasData => {
        if (!(aliasData.alias === aliasId)) return aliasData;

        return newAlias;
      });
    } else {
      newResourceAliases = [...resourceAliases, newAlias];
    }

    const patchSet = [
      {
        op: 'replace',
        path: '/aliases',
        value: newResourceAliases,
      },
    ];

    dispatch(actions.resource.patch(resourceType, resourceId, patchSet, ALIAS_FORM_KEY));

    if (closeAfterSave) {
      return handleClose();
    }
    setIsFormSaveTriggered(true);
  }, [dispatch, resourceType, resourceId, formVal, aliasId, isEdit, resourceAliases, handleClose]);

  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={ALIAS_FORM_KEY} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          formKey={ALIAS_FORM_KEY}
          onSave={handleSave}
          onClose={handleClose}
          remountAfterSaveFn={remountForm}
        />
      </DrawerFooter>
    </>
  );
};

export default function CreateAliasDrawer({resourceId, resourceType, height = 'short' }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(ALIAS_FORM_KEY);
  const match = useRouteMatch();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');
  const infoTextEditAlias = 'Editing an alias is helpful when you\'ve built an improved flow or other resource and want all of the scripts that reference the alias to use the new resource. You can update any of the fields for an alias as needed, but keep in mind this may have implications on any scripts that currently reference the alias. <br><b>CAUTION:</b> *If you change the Alias ID (name), it is not updated in existing scripts. <br>*Only change the type and select a new resource matching that type only if you\'re certain this will not adversely impact any existing scripts that reference the alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const infoTextCreateAlias = 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. You can create aliases for flows, connections, imports, and exports.';

  return (
    <RightDrawer
      height={height}
      width="default"
      path={['add', 'edit/:aliasId']}
    >
      <DrawerHeader
        title={isEdit ? 'Edit alias' : 'Create alias'}
        infoText={isEdit ? infoTextEditAlias : infoTextCreateAlias}
        disableClose={disabled}
        handleClose={setCancelTriggered} >
        <ActionGroup>
          <InstallationGuideIcon />
          <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" rel="noreferrer" target="_blank">
            Aliases guide
          </a>
        </ActionGroup>
        <CeligoDivider position="right" />
      </DrawerHeader>
      <AliasForm parentUrl={match.url} isEdit={isEdit} resourceId={resourceId} resourceType={resourceType} />
    </RightDrawer>
  );
}
