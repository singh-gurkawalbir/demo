import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, ListItem, makeStyles } from '@material-ui/core';
import { generatePath, NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import { SCOPES } from '../../../../../sagas/resourceForm';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { isJsonString } from '../../../../../utils/string';
import PanelHeader from '../../../../../components/PanelHeader';
import FormBuilderButton from '../../../../../components/FormBuilderButton';
import useSaveStatusIndicator from '../../../../../hooks/useSaveStatusIndicator';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 1, 2, 1),
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
    padding: theme.spacing(3, 2),
  },
}));

const getPatchPath = (allSections, sectionId) => {
  if (!sectionId || sectionId === 'general') return '/settings';
  // if sectionId is defined and its not general we are probably looking up a flow grouping
  const sectionsExcludingGeneral = allSections.filter(sec => sec.sectionId !== 'general');
  // general is the first section in allSections
  const ind = sectionsExcludingGeneral.findIndex(sec => sec.sectionId === sectionId);

  return `/flowGroupings/${ind}/settings`;
};
const emptyObj = {};

function CustomSettings({ integrationId, sectionId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [formKey, setFormKey] = useState(0);

  const {allSections} = useSelectorMemo(selectors.mkGetAllCustomFormsForAResource, 'integrations', integrationId) || emptyObj;

  const settings = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, 'integrations', integrationId, sectionId || 'general')?.settings;

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

  useEffect(() => {
    setFormKey(formKey => formKey + 1);
  }, [fieldMeta]);
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
          path: getPatchPath(allSections, sectionId),
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
      setFormKey(formKey => formKey + 1);
    },
    [allSections, dispatch, integrationId, sectionId]
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
    remount: formKey,

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
          formKey={formKeyRef}
          fieldMeta={fieldMeta} />
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

  // for integrations without any flowgroupings
  if (!hasFlowGroupings) {
    return (
      <CustomSettings
        integrationId={integrationId}
        sectionId="general"
      />
    );
  }
  const sectionId = match.params?.sectionId;

  const isMatchingWithSectionId = allSections.some(ele => ele.sectionId === sectionId);

  if (!isMatchingWithSectionId) {
    const redirectToGeneralTab = generatePath(match.path, {

      ...match.params, sectionId: 'general',
    });

    history.replace(redirectToGeneralTab);
  }

  return (
    <Grid container wrap="nowrap">
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
