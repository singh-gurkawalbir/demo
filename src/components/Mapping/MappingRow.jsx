import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import {selectors} from '../../reducers';
import actions from '../../actions';
import DynaTypeableSelect from '../DynaForm/fields/DynaTypeableSelect';
import LockIcon from '../icons/LockIcon';
import LookupIcon from '../icons/LookupLetterIcon';
import MultiFieldIcon from '../icons/MultiFieldIcon';
import HardCodedIcon from '../icons/HardCodedIcon';
import ActionButton from '../ActionButton';
import TrashIcon from '../icons/TrashIcon';
import MappingSettingsButton from './Settings/SettingsButton';
import SortableHandle from '../Sortable/SortableHandle';
import {handlebarRegex} from '../../utils/mapping';

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
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.text.hint,
  },
  lockedIcon: {
    right: theme.spacing(5),
  },
  deleteBtn: {
    border: 'none',
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
  autoMapDivider: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1.5, 2),
  },
  autoMapDividerLine: {
    borderTop: `1px dashed ${theme.palette.secondary.light}`,
    margin: theme.spacing(0, 1.25),
    height: 1,
    flexGrow: 1,
  },
  hasLockHardCodeIcons: {
    '& .MuiFilledInput-multiline': {
      paddingRight: theme.spacing(8),
    },
  },
}));
const emptyObject = {};

export default function MappingRow({
  disabled,
  index,
  importId,
  flowId,
  rowData,
  subRecordMappingId,
  menuPortalStyle,
  menuPortalTarget,
  isDragInProgress = false,
  isRowDragged = false,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [showGripper, setShowGripper] = useState(false);

  const { key: mappingKey } = rowData;
  const mapping = useSelector(state => {
    const {mappings} = selectors.mapping(state);
    const mapping = mappings.find(({key}) => key === mappingKey);

    return mapping || emptyObject;
  }, shallowEqual);
  // not destructuring above due to condition check below "'hardCodedValue' in mapping".hardCodedValue can be undefined/null
  const {
    isSubRecordMapping,
    isRequired,
    isNotEditable,
    extract,
    generate,
    hardCodedValue,
    lookupName,
  } = mapping;

  const generateFields = useSelector(state =>
    selectors.mappingGenerates(state, importId, subRecordMappingId)
  );
  const isAutoSuggestionStartRow = useSelector(state => {
    const {startKey} = selectors.autoMapper(state);

    return !!(startKey && startKey === mappingKey);
  });
  const extractFields = useSelector(state =>
    selectors.mappingExtracts(state, importId, flowId, subRecordMappingId)
  );
  const handleBlur = useCallback((field, value) => {
    // check if value changes or user entered something in new row
    if ((!mappingKey && value) || (mappingKey && mapping[field] !== value)) {
      if (mappingKey && value === '') {
        if (
          (field === 'extract' && !generate) ||
            (field === 'generate' &&
              !extract &&
              !('hardCodedValue' in mapping))
        ) {
          dispatch(actions.mapping.delete(mappingKey));

          return;
        }
      }
      dispatch(actions.mapping.patchField(field, mappingKey, value));
    }
  },
  [dispatch, extract, generate, mapping, mappingKey]
  );

  const RightIcon = ({title, Icon, className}) => (
    <Tooltip
      title={title}
      placement="bottom">
      <span className={clsx(classes.lockIcon, className)}>
        <Icon />
      </span>
    </Tooltip>
  );

  const handleExtractBlur = useCallback((_id, value) => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback((_id, value) => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handleFieldTouch = useCallback(() => {
    dispatch(actions.mapping.updateLastFieldTouched(mappingKey));
  }, [dispatch, mappingKey]);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.mapping.delete(mappingKey));
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

  const isLookup = !!lookupName;
  const isMultiField = handlebarRegex.test(extract);
  const isHardCodedValue = !!hardCodedValue;
  const extractValue = extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const disableDelete = !mappingKey || isRequired || isNotEditable || disabled;
  const showAutoMapDivider = isAutoSuggestionStartRow && !isDragInProgress;

  return (
    <>
      { showAutoMapDivider && (
        <div className={classes.autoMapDivider}>
          <div className={classes.autoMapDividerLine} />
          <Typography variant="caption">New mappings</Typography>
          <div className={classes.autoMapDividerLine} />
        </div>
      )}
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className={classes.rowContainer}>
        <div className={classes.innerRow}>
          <SortableHandle isVisible={showGripper} />
          <div
            className={clsx(classes.childHeader, classes.mapField, {
              [classes.disableChildRow]:
              isSubRecordMapping || isNotEditable || disabled,
            })}>
            <DynaTypeableSelect
              isLoggable
              key={extractValue}
              id={`fieldMappingExtract-${index}`}
              labelName="name"
              valueName="id"
              value={extractValue}
              options={extractFields}
              disabled={isSubRecordMapping || isNotEditable || disabled}
              onBlur={handleExtractBlur}
              onTouch={handleFieldTouch}
              menuPortalStyle={menuPortalStyle}
              menuPortalTarget={menuPortalTarget}
          />

            {(isSubRecordMapping || isNotEditable) && (
            <span className={classes.lockIcon}>
              <LockIcon />
            </span>
            )}
          </div>
          <span className={classes.mappingIcon} />
          <div
            className={clsx(classes.childHeader, classes.mapField, {
              [classes.disableChildRow]:
              isSubRecordMapping || isRequired || disabled,
            }, {[classes.hasLockHardCodeIcons]: isLookup || isMultiField || isHardCodedValue})}>
            <DynaTypeableSelect
              isLoggable
              key={generate}
              id={`fieldMappingGenerate-${index}`}
              value={generate}
              labelName="name"
              valueName="id"
              options={generateFields}
              disabled={isSubRecordMapping || isRequired || disabled}
              onBlur={handleGenerateBlur}
              onTouch={handleFieldTouch}
              menuPortalStyle={menuPortalStyle}
              menuPortalTarget={menuPortalTarget}
          />
            {isLookup && <RightIcon title="Lookup" Icon={LookupIcon} />}
            {isMultiField && !isLookup && <RightIcon title="Multi-field" Icon={MultiFieldIcon} />}
            {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
            {(isSubRecordMapping || isRequired) && (
            <RightIcon
              title={`${
                isSubRecordMapping
                  ? 'Subrecord mapping'
                  : 'This field is required by the application you are importing into'
              }`}
              Icon={LockIcon} className={clsx({[classes.lockedIcon]: isLookup || isMultiField || isHardCodedValue})} />
            )}
          </div>
          <div className={classes.actionsMapping}>
            <div
              className={clsx({
                [classes.disableChildRow]: isSubRecordMapping,
              })}>
              <MappingSettingsButton
                dataTest={`fieldMappingSettings-${index}`}
                mappingKey={mappingKey}
                disabled={disabled}
                subRecordMappingId={subRecordMappingId}
                importId={importId}
                flowId={flowId}
          />
            </div>
            <div
              key="delete_button"
              className={clsx(classes.deleteMappingRow, {
                [classes.disableChildRow]: isSubRecordMapping,
              })}>
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
    </>
  );
}
