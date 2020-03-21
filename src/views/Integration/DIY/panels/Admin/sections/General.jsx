import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../../components/LoadResources';
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
  const integration =
    useSelector(state =>
      selectors.resource(state, 'integrations', integrationId)
    ) || {};
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        helpKey: 'integrations.name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: integration.name,
      },
      description: {
        id: 'description',
        helpKey: 'integrations.description',
        name: 'description',
        type: 'text',
        label: 'Description',
        defaultValue: integration.description,
      },
    },
    layout: {
      fields: ['name', 'description'],
    },
  };
  const handleSubmit = formVal => {
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
      actions.resource.commitStaged('integrations', integrationId, SCOPES.VALUE)
    );
    setCount(count => count + 1);
  };

  return (
    <Fragment>
      <PanelHeader title="General" />

      <LoadResources required resources="notifications,flows,connections">
        <div className={classes.form}>
          <DynaForm fieldMeta={fieldMeta} key={count} render>
            <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
          </DynaForm>
        </div>
      </LoadResources>
    </Fragment>
  );
}
