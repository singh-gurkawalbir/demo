import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import PanelHeader from '../../../../../../../components/PanelHeader';
import RawHtml from '../../../../../../../components/RawHtml';
import Editor from './Editor';
import RightDrawer from '../../../../../../../components/drawer/Right';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(2),
  },
  previewContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRadius: 4,
    backgroundColor: theme.palette.background.default,
    height: '30vh',
    padding: theme.spacing(1),
    margin: theme.spacing(2, 0),
    overflow: 'auto',
  },
  button: {
    marginRight: theme.spacing(-0.75),
  },
}));

export default function ReadmeSection({ integrationId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const readmeValue = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.readme || ''
  );

  const canEditIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );

  const toggleEditMode = useCallback(() => {
    history.push(`${match.url}/edit/readme`);
  }, [history, match.url]);

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <PanelHeader title="Readme">
        <Button
          className={classes.button}
          data-test="form-editor-action"
          variant="text"
          disabled={!canEditIntegration}
          onClick={toggleEditMode}>
          Edit readme
        </Button>
      </PanelHeader>
      <div className={classes.root}>
        <RawHtml className={classes.previewContainer} html={readmeValue} />
      </div>
      <RightDrawer
        path="edit/readme"
        height="tall"
        width="xl"
        // type="paper"
        title="Edit readme"
        variant="temporary"
        onClose={onClose}>
        <Editor readmeValue={readmeValue} onClose={onClose} integrationId={integrationId} />
      </RightDrawer>
    </>
  );
}
