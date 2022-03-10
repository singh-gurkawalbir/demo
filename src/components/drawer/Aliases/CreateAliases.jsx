import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
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

const ALIAS_FORM_KEY = 'resource-alias';

const getFieldMeta = (parentResourceId, parentResourceType, alias, isEdit) => ({
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
      defaultValue: '',
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

const AliasForm = ({ resourceId, resourceType, aliasId, isEdit, parentUrl }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [remountCount, setRemountCount] = useState(0);
  const [isFormSaveTriggered, setIsFormSaveTriggered] = useState(false);
  const asyncTaskStatus = useSelector(state => selectors.asyncTaskStatus(state, ALIAS_FORM_KEY));
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, resourceType, resourceId);
  const formFields = useSelector(state => selectors.formState(state, ALIAS_FORM_KEY)?.fields);

  let alias;

  if (isEdit) {
    alias = resourceAliases.some(ra => ra.alias === aliasId);
  }

  const fieldMeta = getFieldMeta(resourceId, resourceType, alias, isEdit);

  useFormInitWithPermissions({formKey: ALIAS_FORM_KEY, fieldMeta, optionsHandler: fieldMeta?.optionsHandler, remount: remountCount});

  useEffect(() => {
    if (!isFormSaveTriggered || !(asyncTaskStatus === FORM_SAVE_STATUS.COMPLETE)) {
      return;
    }

    // if the create alias form is saved
    // we will open the edit alias form of the newly created alias
    if (!isEdit) {
      history.replace(
        getRoutePath(`${parentUrl}/edit`)
      );
    }
  }, [history, isFormSaveTriggered, asyncTaskStatus, parentUrl, isEdit]);

  const handleClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  const handleSave = useCallback(closeAfterSave => {
    let newResourceAliases;
    const newAlias = {
      alias: formFields?.aliasId?.value,
      description: formFields?.description?.value,
    };

    if (formFields?.aliasResourceType?.value === 'connections') {
      newAlias._connectionId = formFields?.aliasResourceName?.value;
    } else if (formFields?.aliasResourceType?.value === 'exports') {
      newAlias._exportId = formFields?.aliasResourceName?.value;
    } else if (formFields?.aliasResourceType?.value === 'flows') {
      newAlias._flowId = formFields?.aliasResourceName?.value;
    } else {
      newAlias._importId = formFields?.aliasResourceName?.value;
    }

    if (isEdit) {
      newResourceAliases = resourceAliases.map(alias => {
        if (!(alias.alias === aliasId)) return alias;

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
  }, [handleClose]);

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

export default function CreateAliasDrawer({resourceId, resourceType}) {
  const {disabled, setCancelTriggered} = useFormOnCancel(ALIAS_FORM_KEY);
  const match = useRouteMatch();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');
  const infoTextEditAlias = 'Editing an alias is helpful when you\'ve built an improved flow or other resource and want all of the scripts that reference the alias to use the new resource. You can update any of the fields for an alias as needed, but keep in mind this may have implications on any scripts that currently reference the alias. <br><b>CAUTION:</b> *If you change the Alias ID (name), it is not updated in existing scripts. <br>*Only change the type and select a new resource matching that type only if you\'re certain this will not adversely impact any existing scripts that reference the alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const infoTextCreateAlias = 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. You can create aliases for flows, connections, imports, and exports.';

  return (
    <RightDrawer
      height="short"
      width="default"
      path={['add', 'edit/:aliasId']}
    >
      <DrawerHeader
        title={isEdit ? 'Edit alias' : 'Create alias'}
        infoText={isEdit ? infoTextEditAlias : infoTextCreateAlias}
        disableClose={disabled}
        handleClose={setCancelTriggered} />
      <AliasForm parentUrl={match.url} isEdit={isEdit} resourceId={resourceId} resourceType={resourceType} />
    </RightDrawer>
  );
}
