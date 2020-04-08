import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../../../reducers';
import { SCOPES } from '../../../../../../../sagas/resourceForm';
import actions from '../../../../../../../actions';
import DynaForm from '../../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  form: {
    paddingLeft: theme.spacing(2),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
}));

export default function GeneralSection({
  ssLinkedConnectionId,
  integrationId,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const { name, description, settings } =
    useSelector(state =>
      selectors.suiteScriptResource(state, {
        resourceType: 'integrations',
        id: integrationId,
        ssLinkedConnectionId,
      })
    ) || {};
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        helpKey: 'integration.name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: name,
      },
    },
    layout: {
      fields: ['name'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [name, description, settings]);
  const handleSubmit = formVal => {
    const patchSet = [
      {
        op: 'replace',
        path: '/name',
        value: formVal.name,
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
      <PanelHeader title="General" />

      <div className={classes.form}>
        <DynaForm fieldMeta={fieldMeta} key={count} render>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </div>
    </Fragment>
  );
}
