import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import PanelHeader from '../../../../../../components/PanelHeader';
import CodeEditor from '../../../../../../components/CodeEditor';
import RawHtml from '../../../../../../components/RawHtml';

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

export default function ReadmeSection({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
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

  const infoTextReadme =
    'Keep track of changes to your integration, enabling you to track down problems based on changes to your integration or its flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <>
      <PanelHeader title="Readme" infoText={infoTextReadme} />
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor
            name="readme"
            value={value}
            mode="html"
            readOnly={!canEditIntegration}
            onChange={handleChange}
          />
        </div>

        <Typography variant="h4">Preview</Typography>
        <RawHtml className={classes.previewContainer} html={value} />

        <Button
          data-test="saveReadme"
          disabled={!canEditIntegration}
          variant="contained"
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  );
}
