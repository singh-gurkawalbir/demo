import React, { useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import SearchCriteriaEditor from '.';
import FullScreenOpenIcon from '../../icons/FullScreenOpenIcon';
import FullScreenCloseIcon from '../../icons/FullScreenCloseIcon';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    paddingBottom: 0,
  },
  toolbarContainer: {
    display: 'flex',
    padding: theme.spacing(1, 2),
    alignItems: 'center',
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
    border: 'none',
  },
  actions: {
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
}));

export default function SearchCriteriaDialog(props) {
  const {
    id,
    title = 'Search Criteria',
    value = [],
    onSave,
    onClose,
    disabled,
    width = '80vw',
    height = '50vh',
    fieldOptions = {},
  } = props;
  const classes = useStyles();
  const [fullScreen, setFullScreeen] = useState(false);
  const { searchCriteria } = useSelector(state =>
    selectors.searchCriteria(state, id)
  );
  const handleSave = useCallback(() => {
    if (onSave) {
      if (searchCriteria && searchCriteria.length) {
        const _criteria = searchCriteria.map(s => {
          const { searchValue2Enabled, rowIdentifier, ...sc } = s;

          return sc;
        });

        onSave(true, _criteria);
      } else onSave(true, []);
    }
  }, [onSave, searchCriteria]);

  const handleSaveAndClose = useCallback(() => {
    handleSave();
    onClose();
  }, [handleSave, onClose]);

  const size = fullScreen ? { height } : { height, width };
  const handleFullScreenClick = () => setFullScreeen(!fullScreen);

  return (
    <Dialog
      fullScreen={fullScreen}
      open
      onClose={onClose}
      scroll="paper"
      maxWidth={false}>
      <div className={classes.toolbarContainer}>
        <div className={classes.toolbarItem}>
          <Typography variant="h3">{title}</Typography>
        </div>
        <div className={classes.toggleContainer}>
          <ToggleButton
            data-test="toggleEditorSize"
            className={classes.fullScreen}
            value="max"
            onClick={handleFullScreenClick}
            selected={fullScreen}>
            {fullScreen ? <FullScreenCloseIcon /> : <FullScreenOpenIcon />}
          </ToggleButton>
        </div>
      </div>
      <DialogContent
        style={size}
        className={classes.dialogContent}
        key={`${id}-${fullScreen ? 'lg' : 'sm'}`}>
        <SearchCriteriaEditor
          editorId={id}
          value={value}
          fieldOptions={fieldOptions}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          variant="outlined"
          data-test="saveEditor"
          disabled={disabled}
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          data-test="saveEditor"
          disabled={disabled}
          color="secondary"
          onClick={handleSaveAndClose}>
          Save & close
        </Button>
        <Button
          variant="text"
          color="primary"
          data-test="closeEditor"
          onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
