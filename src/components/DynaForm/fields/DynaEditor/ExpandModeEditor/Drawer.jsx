import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import CodeEditor from '../../../../CodeEditor';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { isNewId } from '../../../../../utils/resource';
import SaveAndCloseButtonGroup from '../../../../SaveAndCloseButtonGroup';
import { FORM_SAVE_STATUS } from '../../../../../utils/constants';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';
import useHandleCancelBasic from '../../../../SaveAndCloseButtonGroup/hooks/useHandleCancelBasic';

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
  const [disableSave, setDisableSave] = useState(false);
  const isContentChanged = content !== value;
  const doneDisabled = isNewResource ? !isContentChanged : !isContentChanged || disableSave;
  // Selectors
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const resourceCommStatus = useSelector(state => selectors.commStatusPerPath(state, `/${resourceType}/${resourceId}`, 'put'));
  // Methods
  const handleSave = useCallback(() => {
    setDisableSave(true);
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
  }, [handleUpdate, handleClose, content]);

  const getStatus = () => {
    switch (resourceCommStatus) {
      case COMM_STATES.SUCCESS: return FORM_SAVE_STATUS.COMPLETE;
      case COMM_STATES.LOADING: return FORM_SAVE_STATUS.LOADING;
      case COMM_STATES.ERROR: return FORM_SAVE_STATUS.ERROR;
      default:
    }
  };
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
      setDisableSave(false);
    }
    if (resourceCommStatus === 'error') {
      setDisableSave(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceCommStatus]);
  const handleCancel = useHandleCancelBasic({isDirty: isContentChanged, onClose: handleClose, handleSave});

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
      <DrawerTitleBar disableClose={disableClose} backToParent onClose={handleClose} title={label} />
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
        {isNewResource ? (
          <>
            <Button
              data-test="saveContent"
              disabled={doneDisabled}
              className={classes.action}
              onClick={handleDone}
              variant="outlined"
              color="primary">
              Done
            </Button>
            <Button
              data-test="closeContent"
              className={classes.action}
              onClick={handleCancel}
              variant="text"
              color="primary">
              Cancel
            </Button>
          </>
        )
          : (
            <SaveAndCloseButtonGroup
              isDirty={isContentChanged}
              status={getStatus()}
              onSave={handleSave}
              onClose={handleCancel}
          />
          )}
      </div>
    </Drawer>
  );
}
