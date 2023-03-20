import React, { useCallback, useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import TrashIcon from '../../../components/icons/TrashIcon';
import ActionButton from '../../../components/ActionButton';
import { selectors } from '../../../reducers';
import DynaTypeableSelect from '../../../components/DynaForm/fields/DynaTypeableSelect';
import actions from '../../../actions';
import MappingSettingsButton from './Settings/SettingsButton';
import SortableHandle from '../../../components/Sortable/SortableHandle';

const useStyles = makeStyles(theme => ({
  childHeader: {
    // width: '46%',
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    // width: '40%',
    flex: 1,
  },
  disableChildRow: {
    cursor: 'not-allowed',
    '& > div > div > div': {
      background: theme.palette.background.paper2,
    },
    '& > button': {
      background: theme.palette.background.paper2,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  hide: {
    display: 'none',
  },
  deleteBtn: {
    border: 'none',
    width: 0,
  },
  mappingIcon: {
    background: theme.palette.secondary.lightest,
    width: 16,
    height: 1,
    display: 'flex',
    alignItems: 'center',
  },
  actionsMapping: {
    display: 'flex',
    minWidth: 36,
    maxWidth: 64,
  },
  deleteMappingRow: {
    width: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  rowContainer: {
    '&:hover': {

    },
  },
}));
const emptySet = [];
const emptyObject = {};

export default function MappingRow(props) {
  const {
    index,
    mappingKey,
    disabled,
    isDragInProgress = false,
    isRowDragged = false,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showGripper, setShowGripper] = useState(false);
  const {
    mapping = emptyObject,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    subRecordMappingId,
  } = useSelector(state => {
    const {
      mappings,
      ssLinkedConnectionId,
      integrationId,
      flowId,
      subRecordMappingId,
    } = selectors.suiteScriptMapping(state);
    const mapping = mappings.find(({key}) => key === mappingKey);

    return {
      mapping,
      ssLinkedConnectionId,
      integrationId,
      flowId,
      subRecordMappingId,
    };
  }, shallowEqual);

  const {
    extract,
    generate,
    hardCodedValue,
  } = mapping;

  const generateFields = useSelector(state => selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}).data);
  const extractFields = useSelector(state => selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId})).data;

  const handleBlur = useCallback((field, value) => {
    dispatch(actions.suiteScript.mapping.patchFieldRequest(field, mappingKey, value));
  }, [dispatch, mappingKey]);

  const handleExtractBlur = useCallback((_id, value) => {
    if (value.indexOf('_child_') > -1) {
      dispatch(actions.suiteScript.mapping.checkForSFSublistExtractPatch(mappingKey, value));
    } else {
      handleBlur('extract', value);
    }
  }, [dispatch, handleBlur, mappingKey]);

  const handleGenerateBlur = useCallback((_id, value) => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handleFieldTouch = useCallback(() => {
    dispatch(actions.suiteScript.mapping.updateLastFieldTouched(mappingKey));
  }, [dispatch, mappingKey]);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.suiteScript.mapping.delete(mappingKey));
  }, [dispatch, mappingKey]);

  const handleOnMouseEnter = useCallback(() => {
    if (!isDragInProgress) {
      setShowGripper(true);
    }
  }, [isDragInProgress]);
  const handleOnMouseLeave = useCallback(() => {
    setShowGripper(false);
  }, []);

  useEffect(() => {
    if (isRowDragged) {
      setShowGripper(true);
    }
  }, [isRowDragged]);
  const extractValue = extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const disableDelete = !mappingKey || disabled;

  // generateFields and extractFields are passed as an array of field names
  return (
    <div
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className={classes.rowContainer}>
      <div className={classes.innerRow}>
        <SortableHandle isVisible={showGripper} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            key={extractValue}
            id={`fieldMappingExtract-${index}`}
            labelName="name"
            valueName="id"
            value={extractValue}
            options={extractFields || emptySet}
            disabled={disabled}
            onBlur={handleExtractBlur}
            onTouch={handleFieldTouch}
          />
        </div>
        <span className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            key={generate}
            id={`fieldMappingGenerate-${index}`}
            value={generate}
            labelName="name"
            valueName="id"
            options={generateFields}
            disabled={disabled}
            onBlur={handleGenerateBlur}
            onTouch={handleFieldTouch}
          />
        </div>
        <div className={classes.actionsMapping}>
          <div>
            <MappingSettingsButton
              id={`fieldMappingSettings-${index}`}
              mappingKey={mappingKey}
          />
          </div>
          <div
            key="delete_button"
            className={classes.deleteMappingRow}
            >
            <ActionButton
              data-test={`fieldMappingRemove-${index}`}
              aria-label="delete"
              disabled={disableDelete}
              onClick={handleDeleteClick}
              className={clsx(classes.deleteBtn, {
                [classes.hide]: !showGripper,
              })}>
              <TrashIcon />
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
