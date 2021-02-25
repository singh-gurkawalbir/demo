import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch} from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import PanelHeader from '../../../../../../../components/PanelHeader';
import RawHtml from '../../../../../../../components/RawHtml';
import actions from '../../../../../../../actions';
import IconTextButton from '../../../../../../../components/IconTextButton';
import EditorDrawer from '../../../../../../../components/AFE2/Drawer';

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
  panelHeaderReadme: {
    paddingRight: 0,
  },
  editReadmebutton: {
    marginRight: -20,
  },
}));

export default function ReadmeSection({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = 'readme';
  const readmeValue = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.readme || ''
  );
  const canEditIntegration = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'readme', {
      resourceId: integrationId,
      resourceType: 'integrations',
      // we don't need sample data for readme editor,
      // hence adding dummy data to stop the saga from requesting the same
      data: 'dummy data',
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, history, integrationId, match.url]);

  return (
    <>
      <PanelHeader title="Readme" className={classes.panelHeaderReadme}>
        <IconTextButton
          className={classes.editReadmebutton}
          data-test="form-editor-action"
          variant="text"
          disabled={!canEditIntegration}
          onClick={handleEditorClick}>
          Edit readme
        </IconTextButton>
      </PanelHeader>
      <div className={classes.root}>
        <RawHtml className={classes.previewContainer} html={readmeValue} />
      </div>

      <EditorDrawer hidePreview />
    </>
  );
}
