import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash';
import ToggleButton from '@mui/material/ToggleButton';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import SearchCriteriaEditor from '.';
import FullScreenOpenIcon from '../../../../icons/FullScreenOpenIcon';
import FullScreenCloseIcon from '../../../../icons/FullScreenCloseIcon';
import SaveAndCloseButtonGroupAuto from '../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { FORM_SAVE_STATUS } from '../../../../../constants';

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

const emptyObject = {};

export default function SearchCriteriaDialog(props) {
  const {
    id,
    title = 'Search Criteria',
    value = [],
    onSave,
    onClose,
    disabled,
    onRefresh,
    width = '80vw',
    height = '50vh',
    connectionId,
    commMetaPath,
    filterKey,
  } = props;
  const classes = useStyles();
  const [fullScreen, setFullScreen] = useState(false);
  const { searchCriteria } = useSelector(state =>
    selectors.searchCriteria(state, id)
  );

  // when search criteria dialog is opened, save button should be disabled
  const [disableSave, setDisableSave] = useState(true);
  const [saveStatus, setSaveStatus] = useState();
  const invalidFields = useMemo(() => {
    const result = {};

    searchCriteria?.forEach((criteria, index) => {
      if (!criteria.field) {
        result[index] = [...(result[index] || []), 'field'];
      }
      if (!criteria.operator) {
        result[index] = [...(result[index] || []), 'operator'];
      }
      if (criteria.operator !== 'isempty' && criteria.operator !== 'isnotempty' && !criteria.searchValue) {
        result[index] = [...(result[index] || []), 'searchValue'];
      }
      if (criteria.showFormulaField && !criteria.formula) {
        result[index] = [...(result[index] || []), 'formula'];
      }
      if (criteria.searchValue2Enabled && !criteria.searchValue2) {
        result[index] = [...(result[index] || []), 'searchValue2'];
      }
    });
    if (isEmpty(result)) {
      return emptyObject;
    }

    return result;
  }, [searchCriteria]);

  const handleSave = useCallback(() => {
    if (onSave) {
      if (searchCriteria && searchCriteria.length) {
        const _criteria = searchCriteria.map(s => {
          const { searchValue2Enabled, rowIdentifier, showFormulaField, ...sc } = s;

          return sc;
        });

        onSave(true, _criteria);
      } else onSave(true, []);
      // When save completes, disable the save button
      setDisableSave(true);
      setSaveStatus(FORM_SAVE_STATUS.COMPLETE);
    }
  }, [onSave, searchCriteria]);

  const size = fullScreen ? { height } : { height, width };
  const handleFullScreenClick = () => setFullScreen(!fullScreen);

  return (
    <Dialog
      fullScreen={fullScreen}
      open
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
          disabled={disabled}
          onRefresh={onRefresh}
          connectionId={connectionId}
          commMetaPath={commMetaPath}
          filterKey={filterKey}
          invalidFields={invalidFields}
          setDisableSave={setDisableSave}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <SaveAndCloseButtonGroupAuto
          isDirty={!disableSave && isEmpty(invalidFields)}
          onSave={handleSave}
          onClose={onClose}
          status={saveStatus}
          shouldHandleCancel
          asyncKey={id}
        />
      </DialogActions>
    </Dialog>
  );
}
