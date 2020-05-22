import { Fragment, useState, useEffect } from 'react';
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
  const [count, setCount] = useState(0);
  const { name, description, settings } =
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
        label: 'Custom',
        defaultValue: settings,
        collapsed: false,
      },
    },
    layout: {
      fields: ['settings'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [name, description, settings]);
  const handleSubmit = formVal => {
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
      actions.resource.commitStaged('integrations', integrationId, SCOPES.VALUE)
    );
    setCount(count => count + 1);
  };

  return (
    <Fragment>
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
    </Fragment>
  );
}
