import { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
} from '@material-ui/core';
// TODO: Azhar, please fix these icons message
import ToggleButton from '@material-ui/lab/ToggleButton';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { preSaveValidate } from './util';
import * as selectors from '../../../reducers';
import CloseIcon from '../../icons/CloseIcon';
import mappingUtil from '../../../utils/mapping';
import FullScreenOpenIcon from '../../icons/FullScreenOpenIcon';
import FullScreenCloseIcon from '../../icons/FullScreenCloseIcon';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    paddingBottom: 0,
  },
  toolbarContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(2),
    display: 'flex',
  },
  actionContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(2),
    display: 'flex',
    marginRight: theme.spacing(2),
  },
  toolbarItem: {
    flex: '1 1 auto',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fullScreen: {
    marginLeft: theme.spacing(2),
  },
  actions: {
    marginRight: theme.spacing(3) - 2,
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
}));

export default function MappingDialog(props) {
  const {
    children,
    id,
    open = true,
    action,
    title,
    width = '80vw',
    height = '70vh',
    noMappingHeight = '20vh',
    onClose,
    onSave,
  } = props;
  const classes = useStyles();
  const [fullScreen, setFullScreen] = useState(props.fullScreen || false);
  const {
    mappings,
    lookups,
    adaptorType,
    application,
    generateFields,
    visible: showMappings,
  } = useSelector(state => selectors.mapping(state, id));
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleSave = shouldClose => {
    if (!preSaveValidate({ mappings, enquesnackbar })) {
      return;
    }

    let _mappings = mappings.map(
      ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
    );

    _mappings = mappingUtil.generateMappingsForApp({
      mappings: _mappings,
      generateFields,
      appType: application,
    });

    onSave({
      mappings: _mappings,
      lookups,
      adaptorType,
    });

    if (shouldClose) {
      onClose();
    }
  };

  const handleFullScreenClick = () => setFullScreen(!fullScreen);
  let size;

  if (showMappings) size = fullScreen ? { height } : { height, width };
  else size = { height: noMappingHeight };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => onClose()}
      scroll="paper"
      maxWidth={false}>
      <div className={classes.toolbarContainer}>
        <div className={classes.toolbarItem}>
          <Typography variant="h5">{title}</Typography>
        </div>
        <div className={classes.actionContainer}>
          {/* it expects field to be a component to render */}
          {action}
        </div>
        <div className={classes.toggleContainer}>
          <ToggleButton
            data-test="toggleMappingEditorSize"
            className={classes.fullScreen}
            value="max"
            onClick={handleFullScreenClick}
            selected={fullScreen}>
            {fullScreen ? <FullScreenCloseIcon /> : <FullScreenOpenIcon />}
          </ToggleButton>
        </div>
        <IconButton
          aria-label="Close"
          data-test="closeImportMapping"
          className={classes.closeButton}
          onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent style={size} className={classes.dialogContent}>
        {children}
      </DialogContent>
      {showMappings && (
        <DialogActions className={classes.actions}>
          <Button
            color="primary"
            data-test="saveImportMapping"
            onClick={() => handleSave()}>
            Save
          </Button>
          <Button
            variant="outlined"
            data-test="saveAndCloseImportMapping"
            color="primary"
            onClick={() => handleSave(true)}>
            Save and Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
