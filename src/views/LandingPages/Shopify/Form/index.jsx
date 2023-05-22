import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Box, styled } from '@mui/material';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import RadioGroup from '../../../../components/DynaForm/fields/radiogroup/DynaQueryRadioGroup';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DynaForm from '../../../../components/DynaForm';
import connectionMetaData from './metadata/connection';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import SaveAndCloseMiniResourceForm from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
import { FORM_SAVE_STATUS } from '../../../../constants';
import InstallationGuideIcon from '../../../../components/icons/InstallationGuideIcon';
import CeligoLinkAppLogo from '../../../../components/CeligoLinkAppLogo';
import FormHeader from './Header';
import useHandleSubmit from '../../../../components/ResourceFormFactory/Actions/Groups/hooks/useHandleSubmit';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import { useSelectorMemo } from '../../../../hooks';

const useStyles = makeStyles(theme => ({
  resourceFormRadioGroupWrapper: {
    marginBottom: theme.spacing(2),
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
    color: theme.palette.secondary.light,
  },
  form: {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 232px)',
  },
  connectionForm: {
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(3),
  },
  logosWrapper: {
    margin: theme.spacing(4, 0),
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  borderTop: '1px solid',
  borderColor: theme.palette.secondary.lightest,
  background: theme.palette.background.paper,
  padding: theme.spacing(2, 3),
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: theme.spacing(8),
}));

export default function AddOrSelectForm({
  resourceId,
  resourceType = 'connections',
  selectedAccountHasSandbox,
  helpURL,
}) {
  const classes = useStyles();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [useNew, setUseNew] = useState(true);
  const [remountCount, setRemountCount] = useState(0);
  const [connId, setConnId] = useState(resourceId);
  const formKey = getAsyncKey(resourceType, resourceId);
  const queryParams = new URLSearchParams(search);
  const shop = queryParams.get('shop');
  const type = queryParams.get('type');
  const authorizationCode = queryParams.get('code');
  const clientId = queryParams.get('clientId');

  const connectionId = useSelector(state => selectors.createdResourceId(state, resourceId));
  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, connectionId || connId);
  const integrationAppName = useSelector(state => selectors.getLandingPageIntegrationName(state, resource?._integrationId));

  const integrationId = useSelector(state => selectors.fieldState(state, formKey, '_integrationId'))?.value;

  const asyncResourceType = integrationId ? `integrations/${integrationId}/${resourceType}` : resourceType;
  const formSaveStatus = useSelector(state => selectors.asyncTaskStatus(state, getAsyncKey(asyncResourceType, connId)));

  const connectionIdFieldValue = useSelector(state => selectors.fieldState(state, formKey, 'resourceId'))?.value;

  useEffect(() => {
    if (connectionIdFieldValue) {
      setConnId(connectionIdFieldValue);
    }
  }, [connectionIdFieldValue]);

  const fieldMeta = connectionMetaData.getMetaData({
    isIA: type === 'IA',
    url: shop,
    useNew,
    clientId,
    connId,
  });

  const handleTypeChange = useCallback((id, value) => {
    setUseNew(value === 'new');
    setConnId(resourceId);
    setRemountCount(remountCount => remountCount + 1);
  }, [resourceId]);

  const handleToggle = useCallback(() => {
    setConnId(resourceId);
  }, [resourceId]);

  useFormInitWithPermissions({
    formKey,
    remount: remountCount,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  const handleInitForm = useCallback(
    () => {
      dispatch(
        actions.resourceForm.init(
          resourceType,
          resourceId,
          false,
          false,
          undefined,
          undefined,
          undefined,
          fieldMeta
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, resourceId, resourceType]
  );

  const handleClearResourceForm = useCallback(
    () => {
      dispatch(actions.resourceForm.clear(resourceType, resourceId));
    },
    [dispatch, resourceId, resourceType]
  );

  useEffect(() => {
    handleInitForm();

    return () => handleClearResourceForm();
  }, [handleInitForm, handleClearResourceForm]);

  const handleSubmit = useHandleSubmit({formKey, resourceType: 'connections', resourceId: connId, parentContext: {queryParams: [`code=${authorizationCode}`]}});
  const handleSave = handleSubmit;

  useEffect(() => {
    dispatch(actions.resource.patchStaged(connId, fieldMeta?.patchSet?.()));

    return () => {
      dispatch(actions.resource.clearStaged(connId));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connId]);

  useEffect(() => {
    if (formSaveStatus === FORM_SAVE_STATUS.COMPLETE) {
      if (type !== 'IA') {
        history.replace(`/${resourceType}`);
      } else {
        history.replace(`/integrationapps/${getIntegrationAppUrlName(integrationAppName)}/${resource?._integrationId}`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSaveStatus]);

  return (
    <>
      <FormHeader selectedAccountHasSandbox={selectedAccountHasSandbox} helpURL={helpURL} handleToggle={handleToggle} />
      <DrawerContent className={classes.form}>
        {selectedAccountHasSandbox ? (

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Box
              component="a"
              href={helpURL}
              rel="noreferrer"
              target="_blank"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <InstallationGuideIcon className={classes.guideLinkIcon} />Shopify connection guide
            </Box>
          </Box>
        ) : null}
        <CeligoLinkAppLogo application="shopify" className={classes.logosWrapper} />
        {/* uncomment below code to show errors in future
        {errorMessage ? (
          <NotificationToaster
            variant="error"
            size="large"
            >
            {errorMessage}
          </NotificationToaster>
        ) : null} */}
        <RadioGroup
          value={useNew ? 'new' : 'existing'}
          id="selectType"
          className={classes.resourceFormRadioGroupWrapper}
          defaultValue={useNew ? 'new' : 'existing'}
          isValid
          onFieldChange={handleTypeChange}
          options={[
            {
              items: [
                { label: 'Set up new connection', value: 'new' },
                { label: 'Use existing connection', value: 'existing' },
              ],
            },
          ]}
        />
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <StyledFooter>
        <SaveAndCloseMiniResourceForm
          formKey={formKey}
          submitButtonLabel="Save & authorize"
          formSaveStatus={formSaveStatus}
          handleSave={handleSave}
          shouldNotShowCancelButton
        />
      </StyledFooter>
    </>
  );
}
