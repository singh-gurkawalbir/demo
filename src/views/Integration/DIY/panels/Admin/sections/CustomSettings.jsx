import { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));

export default function CustomSettings({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [formKey, setFormKey] = useState(0);
  const settings = useSelector(state => {
    const resource = selectors.resource(state, 'integrations', integrationId);

    return resource ? resource.settings : {};
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
          label: 'Custom',
          defaultValue: settings,
          collapsed: false,
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
  const handleSubmit = useCallback(
    formVal => {
      // dont submit the form if there is validation error
      // REVIEW: re-visit once Surya's form PR is merged
      if (formVal && formVal.settings && formVal.settings.__invalid) return;
      const patchSet = [
        {
          op: 'replace',
          path: '/settings',
          value: formVal && formVal.settings,
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

  return (
    <Fragment>
      <div className={classes.form}>
        <DynaForm
          disabled={!canEditIntegration}
          fieldMeta={fieldMeta}
          resourceType="integrations"
          resourceId={integrationId}
          key={formKey}>
          <DynaSubmit
            resourceType="integrations"
            resourceId={integrationId}
            disabled={!canEditIntegration}
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </div>
    </Fragment>
  );
}
