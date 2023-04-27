import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { isJsonString } from '../../../../../utils/string';
import PanelHeader from '../../../../../components/PanelHeader';
import FormBuilderButton from '../../../../../components/FormBuilderButton';
import useSaveStatusIndicator from '../../../../../hooks/useSaveStatusIndicator';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import redirectToCorrectGroupingRoute from '../../../../../utils/flowgroupingsRedirectTo';
import CeligoTruncate from '../../../../../components/CeligoTruncate';
import infoText from '../../../../../components/Help/infoText';

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  noSettings: {
    margin: theme.spacing(1, 2, 4, 2),
  },
  subNav: {
    minWidth: 200,
    maxWidth: 240,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  listItem: {
    color: theme.palette.secondary.main,
    width: '100%',
    wordBreak: 'break-word',
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  content: {
    width: '100%',
  },
  settingsGroupContainer: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  flowTitle: {
    // TODO: Karthik use flowSectionTitle component
    minHeight: 42,
  },
}));

const useSettingsPatch = (integrationId, sectionId, path) => {
  const allSections = useSelectorMemo(selectors.mkGetAllCustomFormsForAResource, 'integrations', integrationId)?.allSections;

  if (!sectionId || sectionId === 'general') return path;
  // if sectionId is defined and its not general we are probably looking up a flow grouping
  const sectionsExcludingGeneral = allSections.filter(sec => sec.sectionId !== 'general');
  // general is the first section in allSections
  const ind = sectionsExcludingGeneral.findIndex(sec => sec.sectionId === sectionId);

  return `/flowGroupings/${ind}${path}`;
};
const emptyObj = {};

function CustomSettings({ integrationId, sectionId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {settings} = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, 'integrations', integrationId, sectionId || 'general') || emptyObj;

  const hasPreSaveHook = useSelector(state => {
    const integration = selectors.resourceData(state, 'integrations', integrationId);

    return !!(integration?.preSave?._scriptId && integration.preSave?.function);
  });
  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        settings: {
          id: 'settings',
          helpKey: 'integration.settings',
          name: 'settings',
          sectionId,
          type: 'settings',
          label: 'Settings',
          defaultValue: settings,
          fieldsOnly: true,
        },
      },
      layout: {
        fields: ['settings'],
      },
    }),
    [sectionId, settings]
  );

  const validationHandler = useCallback(field => {
    // Incase of invalid json throws error to be shown on the field

    if (field?.id === 'settings') {
      if (
        field.value &&
        typeof field.value === 'string' &&
        !isJsonString(field.value)
      ) {
        return 'Settings must be valid JSON';
      }
      // TODO: refactor validation handlers to use forceField state
      if (field.value?.__invalid) {
        return 'Sub-form invalid.';
      }
    }
  }, []);

  const patchPath = useSettingsPatch(integrationId, sectionId, '/settings');

  const handleSubmit = useCallback(
    formVal => {
      // dont submit the form if there is validation error
      // REVIEW: @ashu, re-visit once Surya's form PR is merged
      if (formVal?.settings?.__invalid) return;
      let value = formVal?.settings;

      if (isJsonString(value)) {
        value = JSON.parse(value);
      }
      const patchSet = [
        {
          op: 'replace',
          path: patchPath,
          value,
        },
      ];
      const refetchResources = isFrameWork2 || hasPreSaveHook;

      if (isFrameWork2) {
        dispatch(actions.resource.patchAndCommitStaged('integrations', integrationId, patchSet, {
          options: {
            refetchResources,
          },
        }));
      } else {
        dispatch(actions.resource.patch('integrations', integrationId, patchSet));
      }
    },
    [dispatch, integrationId, isFrameWork2, patchPath, hasPreSaveHook]
  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/integrations/${integrationId}`,
      method: isFrameWork2 ? 'put' : 'PATCH',
      onSave: handleSubmit,
    }
  );

  const formKeyRef = useFormInitWithPermissions({
    disabled: !canEditIntegration,
    fieldMeta,
    resourceType: 'integrations',
    resourceId: integrationId,
    validationHandler,
    remount: fieldMeta,
  });

  return (
    <>
      <PanelHeader title="Settings" infoText={infoText.Settings}>
        <FormBuilderButton
          resourceType="integrations" resourceId={integrationId}
          integrationId={integrationId} sectionId={sectionId} />
      </PanelHeader>

      <div className={classes.form}>
        <DynaForm
          formKey={formKeyRef} />
        <DynaSubmit
          formKey={formKeyRef}
          resourceType="integrations"
          resourceId={integrationId}
          disabled={!canEditIntegration || disableSave}
          onClick={submitHandler()}>
          {defaultLabels.saveLabel}
        </DynaSubmit>
      </div>
    </>
  );
}

export default function SettingsForm({integrationId: parentIntegrationId, childId}) {
  const integrationId = childId || parentIntegrationId;

  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const {allSections, hasFlowGroupings} = useSelectorMemo(selectors.mkGetAllCustomFormsForAResource, 'integrations', integrationId) || emptyObj;

  const redirectTo = redirectToCorrectGroupingRoute(match, hasFlowGroupings ? allSections : null, 'general');
  const sectionId = match.params?.sectionId;

  useEffect(() => {
    const shouldRedirect = !!redirectTo;

    if (shouldRedirect) {
      history.replace(redirectTo);
    }
  }, [history, redirectTo]);
  // for integrations without any flowgroupings
  if (!hasFlowGroupings) {
    return (
      <div className={classes.root}>
        <CustomSettings
          integrationId={integrationId}
          sectionId="general" />
      </div>
    );
  }

  return (
    <Grid container wrap="nowrap" className={classes.settingsGroupContainer}>
      <Grid item className={classes.subNav}>
        <List>
          {allSections.map(({ title, sectionId }) => (
            <ListItem key={sectionId} className={classes.flowTitle}>
              <NavLink
                className={classes.listItem}
                activeClassName={classes.activeListItem}
                to={sectionId}
                data-test={sectionId}>
                <CeligoTruncate lines={3}>{title}</CeligoTruncate>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item className={classes.content}>
        <CustomSettings
          integrationId={integrationId}
          sectionId={sectionId} />
      </Grid>
    </Grid>
  );
}
