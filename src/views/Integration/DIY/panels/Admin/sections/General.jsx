import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));

export default function GeneralSection({ integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const { name, description } =
    useSelector(state =>
      selectors.resource(state, 'integrations', integrationId)
    ) || {};
  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        name: {
          id: 'name',
          helpKey: 'integration.name',
          name: 'name',
          type: 'text',
          label: 'Name',
          defaultValue: name,
        },
        description: {
          id: 'description',
          helpKey: 'integration.description',
          name: 'description',
          type: 'text',
          multiline: true,
          maxRows: 5,
          label: 'Description',
          defaultValue: description,
        },
      },
      layout: {
        fields: ['name', 'description'],
      },
    }),
    [description, name]
  );

  useEffect(() => {
    setCount(count => count + 1);
  }, [name, description]);
  const handleSubmit = useCallback(
    formVal => {
      const patchSet = [
        {
          op: 'replace',
          path: '/name',
          value: formVal.name,
        },
        {
          op: 'replace',
          path: '/description',
          value: formVal.description,
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
      setCount(count => count + 1);
    },
    [dispatch, integrationId]
  );

  return (
    <>
      <PanelHeader title="General" />

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
    </>
  );
}
