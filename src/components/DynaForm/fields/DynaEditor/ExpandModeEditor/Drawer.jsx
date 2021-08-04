import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '../../../../CodeEditor';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { isNewId } from '../../../../../utils/resource';
import SaveAndCloseButtonGroupAuto from '../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useFormOnCancelContext from '../../../../FormOnCancelContext';
import { getFormSaveStatusFromCommStatus } from '../../../../../utils/editor';

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

/**
 * Drawer opens for the editor based on passed editorProps
 * saveProps - Props needed to enable saving the resource with the patchKey passed
 * Actions: Done, Close -- Incase of a new resource
 * Save, Save&Close, Close -- Incase of an existing resource
 * Used for scriptContent now. Once we get proper use cases, this need to be refactored
 */
export default function EditorDrawer(props) {
  const { handleClose, label, editorProps, saveProps } = props;
  const { id, value, mode, disabled, handleUpdateOnDrawerSave, handleUpdate } = editorProps;
  const { resourceId, resourceType, patchKey} = saveProps;
  const isNewResource = isNewId(resourceId);
  // Hooks used
  const classes = useStyles();
  const dispatch = useDispatch();
  // Local state variables
  const [content, setContent] = useState(value);
  const [closeOnSave, setCloseOnSave] = useState(false);
  const isContentChanged = content !== value;
  // Selectors
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const resourceCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/${resourceType}/${resourceId}`, 'put'));
  // Methods
  const handleSave = useCallback(() => {
    const patchSet = [
      {
        op: 'replace',
        path: patchKey,
        value: content,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged(resourceType, resourceId, 'value'));
    handleUpdateOnDrawerSave(content);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, handleUpdateOnDrawerSave]);
  const handleDone = useCallback(() => {
    handleUpdate(content);
    handleClose();
  }, [handleUpdate, content, handleClose]);

  const handleSaveClick = isNewResource ? handleDone : handleSave;
  const disableClose = resourceCommStatus === COMM_STATES.LOADING;

  // useEffect
  useEffect(() => {
    setContent(value);
  }, [value]);

  useEffect(() => {
    if (resourceCommStatus === 'success') {
      if (closeOnSave) {
        handleClose();
        setCloseOnSave(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceCommStatus]);
  const {setCancelTriggered} = useFormOnCancelContext(id);
  const onClose = isNewResource ? handleClose : setCancelTriggered;

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
      <DrawerTitleBar disableClose={disableClose} backToParent onClose={onClose} title={label} />
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
        {
          isNewResource ? (
            <>
              <Button
                data-test="saveContent"
                disabled={!isContentChanged}
                className={classes.action}
                onClick={handleDone}
                variant="outlined"
                color="primary">
                Done
              </Button>
              <Button
                data-test="closeContent"
                className={classes.action}
                onClick={handleClose}
                variant="text"
                color="primary">
                Cancel
              </Button>
            </>
          )
            : (
              <SaveAndCloseButtonGroupAuto
                isDirty={isContentChanged}
                status={getFormSaveStatusFromCommStatus(resourceCommStatus)}
                onSave={handleSaveClick}
                onClose={handleClose}
                shouldHandleCancel
                asyncKey={id}
              />
            )
        }
      </div>
    </Drawer>
  );
}
