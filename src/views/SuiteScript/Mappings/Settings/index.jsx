import React, { useMemo, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import { isEqual } from 'lodash';
import { TextButton } from '@celigo/fuse-ui';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import netsuiteMetadata from './metadata/netsuite';
import salesforceMetadata from './metadata/salesforce';
import { selectors } from '../../../../reducers';
import settingsUtil from './util';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import actions from '../../../../actions';
import ActionGroup from '../../../../components/ActionGroup';

/**
 *
 * disabled property set to true in case of monitor level access
 */

const emptyObject = {};

function MappingSettings({disabled, mappingKey}) {
  const history = useHistory();
  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const {value, ssLinkedConnectionId, integrationId, recordType, flowId, subRecordMappingId} = useSelector(state => {
    const { mappings, ssLinkedConnectionId, integrationId, recordType, flowId, subRecordMappingId } = selectors.suiteScriptMapping(state);
    const value = mappings?.find(({key}) => key === mappingKey);

    return { value, ssLinkedConnectionId, integrationId, recordType, flowId, subRecordMappingId };
  }, shallowEqual);
  const { generate, extract } = value;
  const {data: generateFields} = useSelector(state => selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}));
  const extractFields = useSelector(state => selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId})).data;

  const lookup = useSelector(state => {
    const { mappings, lookups } = selectors.suiteScriptMapping(state);
    const value = mappings?.find(({key}) => key === mappingKey);

    if (!value || !value.lookupName) {
      return;
    }

    return lookups.find(({name}) => name === value.lookupName);
  }, shallowEqual);
  const {importType, connectionId} = useSelector(state => {
    const flows = selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    });
    const selectedFlow = flows && flows.find(flow => flow._id === flowId);
    const {type, _connectionId } = (selectedFlow && selectedFlow.import) || {};

    return {importType: type, connectionId: _connectionId};
  }, shallowEqual);

  const fieldMeta = useMemo(
    () => {
      if (importType === 'netsuite') {
        return netsuiteMetadata.getMetaData({
          value,
          extractFields,
          generate,
          generateFields,
          ssLinkedConnectionId,
          connectionId,
          lookup,
          recordType,
        });
      }
      if (importType === 'salesforce') {
        return salesforceMetadata.getMetaData({
          value,
          extractFields,
          generate,
          generateFields,
          ssLinkedConnectionId,
          connectionId,
          lookup,
        });
      }
    }, [connectionId, extractFields, generate, generateFields, importType, lookup, recordType, ssLinkedConnectionId, value]
  );

  const handleClose = useCallback(
    () => {
      history.goBack();
    },
    [history],
  );

  const handleLookupUpdate = useCallback(newLookup => {
    if (lookup && newLookup && isEqual(lookup, newLookup)) {
      return;
    }
    dispatch(actions.suiteScript.mapping.updateLookup({oldValue: lookup, newValue: newLookup}));
  }, [dispatch, lookup]);

  const patchSettings = useCallback(settings => {
    dispatch(actions.suiteScript.mapping.patchSettings(mappingKey, settings));
    handleClose();
  }, [dispatch, handleClose, mappingKey]);

  const handleSubmit = useCallback(
    formVal => {
      const {
        settings,
        lookup: updatedLookup,
        errorMessage,
      } = settingsUtil.getFormattedValue(
        { generate, extract, lookup },
        formVal
      );

      if (errorMessage) {
        enquesnackbar({
          message: errorMessage,
          variant: 'error',
        });

        return;
      }

      handleLookupUpdate(updatedLookup);
      patchSettings(settings);
    },
    [enquesnackbar, extract, generate, handleLookupUpdate, lookup, patchSettings]
  );

  const formKey = useFormInitWithPermissions({
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ActionGroup>
          <DynaSubmit
            formKey={formKey}
            disabled={disabled}
            id="fieldMappingSettingsSave"
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <TextButton
            data-test="fieldMappingSettingsCancel"
            onClick={handleClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}

function MappingSettingsWrapper(props) {
  const match = useRouteMatch();

  const { mappingKey } = match.params;
  const isSettingsConfigured = useSelector(state => {
    const {mappings} = selectors.suiteScriptMapping(state);
    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return !!value?.generate;
  });

  if (!isSettingsConfigured) {
    return <Redirect push={false} to={`${match.url.substr(0, match.url.indexOf('/settings'))}`} />;
  }

  return (
    <MappingSettings {...props} mappingKey={mappingKey} />
  );
}
export default function SettingsDrawer(props) {
  return (
    <RightDrawer
      isSuitescript
      hideBackButton
      variant="temporary"
      disableBackdropClick
      path={[
        'settings/:mappingKey',
      ]}
      height="tall"
    >
      <DrawerHeader title="Settings" />
      <MappingSettingsWrapper
        {...props} />

    </RightDrawer>
  );
}
