import clsx from 'clsx';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
import Editor from '../../components/AFE2/Editor';
import FullScreenOpenIcon from '../../components/icons/FullScreenOpenIcon';
import ExampleMenu from './ExampleMenu';
import ExplorerMenu from './ExplorerMenu';
import EditorDrawer from '../../components/AFE2/Drawer';
import ResourceDrawer from '../../components/drawer/Resource';
import ExportExampleButton from './ExportExampleButton';
import ActionsRibbon from '../../components/AFE2/Drawer/ActionsRibbon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: `calc(100% - ${theme.pageBarHeight + theme.appBarHeight}px)`,
  },
  leftNav: {
    width: 300,
    overflowY: 'auto',
    padding: theme.spacing(3),
    border: `solid 0 ${theme.palette.secondary.lightest}`,
    borderRightWidth: 1,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  leftNavExpanded: {
    width: 600,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    flexGrow: 1,
  },
  menuSection: {
    marginBottom: theme.spacing(2),
  },
  playgroundRibbon: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Editors() {
  const classes = useStyles();
  const history = useHistory();
  const [editorId, setEditorId] = useState();

  const handleFullScreen = () => {
    history.push(`/playground/editor/${editorId}`);
    setEditorId();
  };

  const handleEditorChange = newEditorId => {
    setEditorId(newEditorId);
  };

  const handleCancelEditorClick = () => { setEditorId(); };

  return (
    <>
      <CeligoPageBar title="Developer playground">
        <ExportExampleButton editorId={editorId} />
        {editorId && (
          <Tooltip title="Fullscreen mode" placement="right">
            <IconButton onClick={handleFullScreen} size="small">
              <FullScreenOpenIcon />
            </IconButton>
          </Tooltip>
        )}

      </CeligoPageBar>
      <div className={classes.root}>
        <div className={clsx(classes.leftNav, {[classes.leftNavExpanded]: !editorId})}>
          <div className={classes.menuSection}>
            <Typography variant="h4">Editor Examples</Typography>
            <ExampleMenu onEditorChange={handleEditorChange} />
          </div>
          <div className={classes.menuSection}>
            <Typography variant="h4">Integration Explorer</Typography>
            <ExplorerMenu onEditorChange={handleEditorChange} />
          </div>
        </div>
        <main className={classes.content}>
          {editorId ? (
            <>
              <ActionsRibbon editorId={editorId} className={classes.playgroundRibbon} />

              <Editor editorId={editorId} />
              <div>
                <Button onClick={handleCancelEditorClick}>Cancel</Button>
              </div>
            </>
          ) : (
            <Typography variant="h4">
              <p>Get started by selecting an editor example on the left.</p>
              <p>Alternatively, use the Integration Explorer to drill into your flows to find and manage your resources.</p>
            </Typography>
          )}

        </main>
      </div>
      <EditorDrawer hideSave />
      <ResourceDrawer />
    </>
  );
}
