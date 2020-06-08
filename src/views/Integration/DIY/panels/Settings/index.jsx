import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import { SCOPES } from '../../../../../sagas/resourceForm';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function GeneralSection({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const { settings } =
    useSelector(state =>
      selectors.resource(state, 'integrations', integrationId)
    ) || {};
  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );
  const fieldMeta = {
    fieldMap: {
      settings: {
        id: 'settings',
        helpKey: 'integration.settings',
        name: 'settings',
        type: 'settings',
        label: 'Settings',
        defaultValue: settings,
      },
    },
    layout: {
      fields: ['settings'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [settings]);
  const handleSubmit = formVal => {
    let settings;

    if (isObject(formVal.settings)) {
      ({ settings } = formVal);
    }

    const patchSet = [
      {
        op: 'replace',
        path: '/settings',
        value: settings,
      },
    ];

    dispatch(
      actions.resource.patchStaged(integrationId, patchSet, SCOPES.VALUE)
    );
    dispatch(
      actions.resource.commitStaged('integrations', integrationId, SCOPES.VALUE)
    );
    setCount(count => count + 1);
  };

  return (
    <div className={classes.root}>
      <PanelHeader title="Settings" />

      <div className={classes.form}>
        <DynaForm
          disabled={!canEditIntegration}
          fieldMeta={fieldMeta}
          resourceType="integrations"
          resourceId={integrationId}
          key={count}
          render>
          <DynaSubmit disabled={!canEditIntegration} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </div>
    </div>
  );
}
