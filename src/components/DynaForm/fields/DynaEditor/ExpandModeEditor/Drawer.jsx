import { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import CodeEditor from '../../../../../components/CodeEditor';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import * as selectors from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  editorContainer: {
    borderBottom: '1px solid rgb(0,0,0,0.1)',
    height: `calc(100% - ${50}px)`,
    width: '100%',
  },
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
  },
  footer: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
  action: {
    marginRight: theme.spacing(0.5),
  },
}));

// Drawer to show full view of editor with actions - Save, Save&Close and close as per new design
// Unlike existing modal behavior, content gets saved only when user clicks on Save/Save&Close
// Save, Save&Close buttons are disabled until user makes any change
export default function EditorDrawer(props) {
  const { handleClose, label, editorProps } = props;
  const { id, value, mode, disabled, handleUpdate } = editorProps;
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [content, setContent] = useState();
  const isContentChanged = content !== undefined;
  // #region methods
  const handleSave = useCallback(() => {
    handleUpdate(content);
  }, [content, handleUpdate]);
  const handleSaveAndClose = useCallback(() => {
    handleSave();
    handleClose();
  }, [handleClose, handleSave]);

  // #endregion methods
  return (
    <Drawer
      anchor="right"
      open
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.fullWidthDrawerClose]: !drawerOpened,
          [classes.fullWidthDrawerOpen]: drawerOpened,
        }),
      }}>
      <DrawerTitleBar backToParent onClose={handleClose} title={label} />
      <div className={classes.editorContainer}>
        <CodeEditor
          name={id}
          value={value}
          mode={mode}
          readOnly={disabled}
          onChange={setContent}
        />
      </div>
      <div className={classes.footer}>
        <Button
          data-test="saveContent"
          disabled={!isContentChanged}
          className={classes.action}
          onClick={handleSave}
          variant="outlined"
          color="primary">
          Save
        </Button>
        <Button
          data-test="saveAndCloseContent"
          className={classes.action}
          disabled={!isContentChanged}
          onClick={handleSaveAndClose}
          variant="outlined"
          color="secondary">
          Save &amp; close
        </Button>
        <Button
          data-test="closeContent"
          className={classes.action}
          onClick={handleClose}
          variant="text"
          color="primary">
          close
        </Button>
      </div>
    </Drawer>
  );
}
