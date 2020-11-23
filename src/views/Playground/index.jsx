import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
// import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import examples from './examples';
import editors from './editorMetadata';
import Editor from '../../components/AFE2/Editor';
import EditorPreviewButton from '../../components/AFE2/PreviewButtonGroup';
import FullScreenOpenIcon from '../../components/icons/FullScreenOpenIcon';
import ExampleMenu from './ExampleMenu';
import ExplorerMenu from './ExplorerMenu';
import EditorDrawer from '../../components/AFE2/Drawer';
import actions from '../../actions';
import ResourceDrawer from '../../components/drawer/Resource';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: `calc(100% - ${theme.pageBarHeight + theme.appBarHeight}px)`,
  },
  editorList: {
    width: 300,
    padding: theme.spacing(3),
    border: `solid 0 ${theme.palette.secondary.lightest}`,
    borderRightWidth: 1,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

  },
  editorListExpanded: {
    width: 600,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    flexGrow: 1,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuSection: {
    marginBottom: theme.spacing(2),
  },
}));
// const editorId = 'playground';

export default function Editors() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeType, setActiveType] = useState();
  const [exampleKey, setExampleKey] = useState();
  const activeEditor = editors.find(e => e.type === activeType);
  const activeExample = examples[activeType]?.find(e => e.key === exampleKey);
  const editorId = `${activeType}-${exampleKey}`;

  const handleFullScreen = () => history.push(`/playground/editor/${editorId}`);
  const handleExampleClick = (type, exampleKey) => {
    setActiveType(type);
    setExampleKey(exampleKey);

    // eslint-disable-next-line no-console
    console.log(type, exampleKey);
  };

  const handleCancelEditorClick = () => {
    setActiveType();
    setExampleKey();
  };

  const handleExplorerClick = (flowId, resourceId, stage, fieldId) => {
    // eslint-disable-next-line no-console
    console.log({flowId, resourceId, stage, fieldId});
  };

  // console.log(activeType, exampleKey, activeExample);
  useEffect(() => {
    if (activeExample) {
      dispatch(actions._editor.init(
        editorId,
        activeExample.type,
        {
          rule: activeExample.rule,
          data: activeExample.data,
          resultMode: 'json',
        // type: [http, url, dataUri], // do we need this?
        }
      // whatever other props are needed. Note if the data is supplied,
      // no need to pass props which are used to obtain sample data.
      ));
    }
    // every time a user selects a new example, we run this effect to
    // reset the initial state of the editor.
  }, [activeExample, dispatch, editorId]);

  const Subtitle = () => {
    if (!activeEditor) return null;

    return `${activeEditor.label}: ${activeExample.description || activeExample.name}`;
  };

  return (
    <>
      <CeligoPageBar title="Developer playground" subtitle={<Subtitle />}>
        {activeType && (
          <Tooltip title="Fullscreen mode" placement="right">
            <IconButton onClick={handleFullScreen} size="small">
              <FullScreenOpenIcon />
            </IconButton>
          </Tooltip>
        )}

      </CeligoPageBar>
      <div className={classes.root}>
        <div className={clsx(classes.editorList, {[classes.editorListExpanded]: !activeExample})}>
          <div className={classes.menuSection}>
            <Typography variant="h4">Editor Examples</Typography>
            <ExampleMenu onClick={handleExampleClick} />
          </div>
          <div className={classes.menuSection}>
            <Typography variant="h4">Flow Explorer</Typography>
            <ExplorerMenu onClick={handleExplorerClick} />
          </div>
        </div>
        <main className={classes.content}>
          {activeExample ? (
            <>
              <Editor editorId={editorId} />
              <div className={classes.buttons}>
                <Button onClick={handleCancelEditorClick}>Cancel</Button>
                <EditorPreviewButton editorId={editorId} />
              </div>
            </>
          ) : (
            <Typography variant="h4">
              <p>Get started by selecting an editor example on the left.</p>
              <p>Alternatively, use the Flow Explorer to drill into your flows to find and manage your resources.</p>
            </Typography>
          )}

        </main>
      </div>
      <EditorDrawer />
      <ResourceDrawer />
    </>
  );
}
