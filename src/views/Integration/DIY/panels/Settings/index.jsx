import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, ListItem, makeStyles } from '@material-ui/core';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import { SCOPES } from '../../../../../sagas/resourceForm';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { isJsonString } from '../../../../../utils/string';
import PanelHeader from '../../../../../components/PanelHeader';
import FormBuilderButton from '../../../../../components/FormBuilderButton/afe2';
import useSaveStatusIndicator from '../../../../../hooks/useSaveStatusIndicator';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import redirectToCorrectGroupingRoute from '../../../../../utils/flowgroupingsRedirectTo';

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  root: {
    backgroundColor: theme.palette.common.white,
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
}));

export const useSettingsPatch = (integrationId, sectionId, path) => {
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

  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );
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

      dispatch(
        actions.resource.patchStaged(integrationId, patchSet, SCOPES.VALUE)
      );
      dispatch(
        actions.resource.commitStaged(
          'integrations',
          integrationId,
          SCOPES.VALUE
        )
      );
    },
    [dispatch, integrationId, patchPath]
  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/integrations/${integrationId}`,
      method: 'put',
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
    <div className={classes.root}>
      <PanelHeader title="Settings" >
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
    </div>
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
      <CustomSettings
        integrationId={integrationId}
        sectionId="general"
      />
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
                {title}
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item className={classes.content}>

        <CustomSettings
          integrationId={integrationId}
          sectionId={sectionId}
          />

      </Grid>
    </Grid>
  );
}
