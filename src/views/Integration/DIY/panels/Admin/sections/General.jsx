import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import { makeStyles } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../../../../../components/PanelHeader';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';

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
      fields: ['name', 'description', 'settings'],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [name, description, settings]);
  const handleSubmit = formVal => {
    let settings;

    if (isObject(formVal.settings)) {
      ({ settings } = formVal);
    }

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

  const formKey = useFormInitWithPermissions({
    fieldsMeta: fieldMeta,
    disabled: !canEditIntegration,
    remount: count,
    resourceType: 'integrations',
    resourceId: integrationId,
  });

  return (
    <Fragment>
      <PanelHeader title="General" />

      <div className={classes.form}>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <DynaSubmit
          formKey={formKey}
          disabled={!canEditIntegration}
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
      </div>
    </Fragment>
  );
}
