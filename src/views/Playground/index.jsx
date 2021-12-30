import clsx from 'clsx';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
import Editor from '../../components/AFE/Editor';
import FullScreenOpenIcon from '../../components/icons/FullScreenOpenIcon';
import loadable from '../../utils/loadable';
import retry from '../../utils/retry';
import EditorDrawer from '../../components/AFE/Drawer';
import ResourceDrawer from '../../components/drawer/Resource';
import ActionsRibbon from '../../components/AFE/Drawer/ActionsRibbon';
import { TextButton } from '../../components/Buttons';

const ExampleMenu = loadable(() =>
  retry(() => import(/* webpackChunkName: 'ExampleMenu' */ './ExampleMenu'))
);
const ExplorerMenu = loadable(() =>
  retry(() => import(/* webpackChunkName: 'ExplorerMenu' */ './ExplorerMenu'))
);
const ExportExampleButton = loadable(() =>
  retry(() => import(/* webpackChunkName: 'ExportExampleButton' */ './ExportExampleButton'))
);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    height: `calc(100% - ${theme.pageBarHeight + theme.appBarHeight}px)`,
    gridTemplateColumns: '25% 75%',
  },
  leftNav: {
    overflowY: 'auto',
    padding: theme.spacing(3),
    border: `solid 0 ${theme.palette.secondary.lightest}`,
    borderRightWidth: 1,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  rootExpanded: {
    gridTemplateColumns: '35% 65%',
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

      <div className={clsx(classes.root, {[classes.rootExpanded]: !editorId})}>
        <div className={classes.leftNav}>
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
                <TextButton onClick={handleCancelEditorClick}>Cancel</TextButton>
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
