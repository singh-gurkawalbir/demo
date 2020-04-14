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
import { isJsonString } from '../../../../../../utils/string';

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
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)
        .accessLevel
  );
  const disableForm = accessLevel === 'monitor';
  const developerModeOn = useSelector(state => selectors.developerMode(state));
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
        disabled: !developerModeOn,
        type: 'settings',
        label: 'Settings',
        defaultValue: settings,
      },
    },
    layout: {
      fields: ['name', 'description'],
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'Custom Settings',
          fields: ['settings'],
        },
      ],
    },
  };

  useEffect(() => {
    setCount(count => count + 1);
  }, [name, description, settings]);
  const handleSubmit = formVal => {
    let settings;

    if (isObject(formVal.settings)) {
      ({ settings } = formVal);
    } else if (isJsonString(formVal.settings)) {
      settings = JSON.parse(formVal.settings);
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

  return (
    <Fragment>
      <PanelHeader title="General" />

      <div className={classes.form}>
        <DynaForm
          disabled={disableForm}
          fieldMeta={fieldMeta}
          key={count}
          render>
          <DynaSubmit disabled={disableForm} onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </div>
    </Fragment>
  );
}
