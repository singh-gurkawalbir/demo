import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import * as selectors from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import PanelHeader from '../../../../../../../components/PanelHeader';
import RawHtml from '../../../../../../../components/RawHtml';
import ReadmeEditor from './ReadmeEditor';

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
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = `readme-${integrationId}`;
  const readmeValue = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.readme || ''
  );

  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );

  const toggleEditMode = useCallback(() => {
    history.push(`${match.url}/editReadme`);
    // initializing editor again to clearout previous uncommitted changes
    dispatch(
      actions.editor.init(editorId, 'readme', {
        data: readmeValue,
        _init_data: readmeValue,
        integrationId,
      })
    );
  }, [history, match.url, dispatch, editorId, readmeValue, integrationId]);


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
      <ReadmeEditor editorId={editorId} />
    </>
  );
}
