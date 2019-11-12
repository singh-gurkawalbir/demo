import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import PanelHeader from '../../PanelHeader';
import CodeEditor from '../../../../../components/CodeEditor';

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
    marginBottom: theme.spacing(2),
    overflow: 'auto',
  },
}));

export default function ReadmeSection({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const monitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const [value, setValue] = useState(integration && integration.readme);

  function handleChange(value) {
    setValue(value);
  }

  const handleSave = () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/readme',
        value,
      },
    ];

    dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
    dispatch(
      actions.resource.commitStaged('integrations', integrationId, 'value')
    );
  };

  return (
    <Fragment>
      <PanelHeader title="Readme" />
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor
            name="readme"
            value={value}
            mode="html"
            readOnly={monitorLevelAccess}
            onChange={handleChange}
          />
        </div>
        <Typography variant="h4">Preview</Typography>
        <div
          className={classes.previewContainer}
          // TODO: We need to run the html through some type of sanitize
          // process. I do not know if we already have something in the
          // old UI to use here?
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: value }}
        />
        <Button
          disabled={monitorLevelAccess}
          variant="contained"
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </Fragment>
  );
}
