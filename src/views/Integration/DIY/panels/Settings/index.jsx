import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import { SCOPES } from '../../../../../sagas/resourceForm';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { isJsonString } from '../../../../../utils/string';
import PanelHeader from '../../../../../components/PanelHeader';
import FormBuilderButton from '../../../../../components/FormBuilderButton';
import useSaveStatusIndicator from '../../../../../hooks/useSaveStatusIndicator';

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(0, 1, 0, 1),
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  noSettings: {
    margin: theme.spacing(1, 2, 4, 2),
  },
}));

const emptyObj = {};

export default function CustomSettings({ integrationId: parentIntegrationId, childId }) {
  const integrationId = useMemo(() => childId || parentIntegrationId, [childId, parentIntegrationId]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [formKey, setFormKey] = useState(0);
  const settings = useSelector(state => {
    const resource = selectors.resource(state, 'integrations', integrationId);

    return resource ? resource.settings : emptyObj;
  });
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
    [settings]
  );

  useEffect(() => {
    setFormKey(formKey => formKey + 1);
  }, [settings]);
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
      const patchSet = [
        {
          op: 'replace',
          path: '/settings',
          value: formVal?.settings,
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
    [dispatch, integrationId]
  );

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/integrations/${integrationId}`,
      method: 'put',
      onSave: handleSubmit,
    }
  );
  return (
    <div className={classes.root}>
      <PanelHeader title="Settings" >
        <FormBuilderButton resourceType="integrations" resourceId={integrationId} integrationId={integrationId} />
      </PanelHeader>

      <div className={classes.form}>
        <DynaForm
          disabled={!canEditIntegration}
          fieldMeta={fieldMeta}
          resourceType="integrations"
          resourceId={integrationId}
          validationHandler={validationHandler}
          key={formKey}>
          <DynaSubmit
            resourceType="integrations"
            resourceId={integrationId}
            disabled={!canEditIntegration || disableSave}
            onClick={submitHandler()}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
        </DynaForm>
      </div>
    </div>
  );
}
