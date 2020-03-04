import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { isObject } from 'lodash';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import PanelHeader from '../../../../../../components/PanelHeader';
import CodeEditor from '../../../../../../components/CodeEditor';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import { isJsonString } from '../../../../../../utils/string';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(2),
  },
  editorContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    height: '25vh',
    marginBottom: theme.spacing(3),
  },
  previewContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRadius: 4,
    backgroundColor: theme.palette.background.default,
    height: '25vh',
    padding: theme.spacing(1),
    margin: theme.spacing(2, 0),
    overflow: 'auto',
  },
}));

export default function SettingsSection({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const monitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const developerModeOn = useSelector(state => selectors.developerMode(state));
  // TODO: Shiva, can you please enhance the permission api to return
  // the necessary tile lever perms to show/hide the readme code editor.
  // const permissions = useSelector(state =>
  //   selectors.permissions(state, 'account1')
  // );
  const [value, setValue] = useState(integration && integration.settings);

  function handleChange(value) {
    setValue(value);
  }

  const handleSave = () => {
    let settings;

    if (isObject(value)) {
      settings = value;
    } else if (isJsonString(value)) {
      settings = JSON.parse(value);
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
  };

  return (
    <Fragment>
      <PanelHeader title="Custom settings" />
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor
            name="settings"
            value={value}
            mode="json"
            readOnly={monitorLevelAccess || !developerModeOn}
            onChange={handleChange}
          />
        </div>

        <Button
          data-test="saveSettings"
          disabled={monitorLevelAccess || !developerModeOn}
          variant="contained"
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </Fragment>
  );
}
