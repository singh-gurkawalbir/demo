import React, { useRef, useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd-cjs';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import {selectors} from '../../reducers';
import actions from '../../actions';
import DynaTypeableSelect from '../DynaForm/fields/DynaTypeableSelect';
import GripperIcon from '../icons/GripperIcon';
import LockIcon from '../icons/LockIcon';
import MappingConnectorIcon from '../icons/MappingConnectorIcon';
import ActionButton from '../ActionButton';
import TrashIcon from '../icons/TrashIcon';
import MappingSettingsButton from './Settings/SettingsButton';

const useStyles = makeStyles(theme => ({
  childHeader: {
    width: '46%',
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
  dragRow: {
    cursor: 'move',
    '& > div[class*="dragIcon"]': {
      visibility: 'hidden',
    },
    '&:hover': {
      '& > div[class*="dragIcon"]': {
        visibility: 'visible',
      },
    },
  },
  dragIcon: {
    background: 'none',
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
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
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 6,
    color: theme.palette.text.hint,
  },
  deleteBtn: {
    border: 'none',
    width: 0,
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: 38,
  },
}));
const emptyObject = {};
export default function MappingRow({
  disabled,
  onMove,
  index,
  importId,
  flowId,
  mappingKey,
  subRecordMappingId,
  isDraggable = false,
}) {
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
  } = mapping;
  const dispatch = useDispatch();
  const classes = useStyles();
  const ref = useRef(null);
  const generateFields = useSelector(state =>
    selectors.mappingGenerates(state, importId, subRecordMappingId)
  );

  const extractFields = useSelector(state =>
    selectors.mappingExtracts(state, importId, flowId, subRecordMappingId)
  );
  const lastModifiedRowKey = useSelector(state => selectors.mapping(state).lastModifiedRowKey);

  const [, drop] = useDrop({
    accept: 'MAPPING',
    hover(item) {
      if (!ref.current || !isDraggable) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'MAPPING', index, key: mappingKey },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),

    canDrag: isDraggable,
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));

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

      return;
    }

    if (lastModifiedRowKey !== mappingKey) {
      const _lastModifiedRowKey = mappingKey === undefined ? 'new' : mappingKey;

      dispatch(actions.mapping.updateLastFieldTouched(_lastModifiedRowKey));
    }
  },
  [dispatch, extract, generate, lastModifiedRowKey, mapping, mappingKey]
  );

  const handleExtractBlur = useCallback((_id, value) => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback((_id, value) => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handleFieldTouch = useCallback(() => {
    if (!lastModifiedRowKey || lastModifiedRowKey !== mappingKey) {
      const _lastModifiedRowKey = mappingKey === undefined ? 'new' : mappingKey;

      dispatch(actions.mapping.updateLastFieldTouched(_lastModifiedRowKey));
    }
  }, [dispatch, lastModifiedRowKey, mappingKey]);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.mapping.delete(mappingKey));
  }, [dispatch, mappingKey]);

  const extractValue = extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const disableDelete = !mappingKey || isRequired || isNotEditable || disabled;

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={classes.rowContainer}>
      <div className={clsx(classes.innerRow, { [classes.dragRow]: !disabled })}>
        <div className={classes.dragIcon}>
          <GripperIcon />
        </div>
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              isSubRecordMapping || isNotEditable || disabled,
          })}>
          <DynaTypeableSelect
            key={extractValue}
            id={`fieldMappingExtract-${index}`}
            labelName="name"
            valueName="id"
            value={extractValue}
            options={extractFields}
            disabled={isSubRecordMapping || isNotEditable || disabled}
            onBlur={handleExtractBlur}
            onTouch={handleFieldTouch}
          />

          {(isSubRecordMapping || isNotEditable) && (
            <span className={classes.lockIcon}>
              <LockIcon />
            </span>
          )}
        </div>
        <MappingConnectorIcon className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              isSubRecordMapping || isRequired || disabled,
          })}>
          <DynaTypeableSelect
            key={generate}
            id={`fieldMappingGenerate-${index}`}
            value={generate}
            labelName="name"
            valueName="id"
            options={generateFields}
            disabled={isSubRecordMapping || isRequired || disabled}
            onBlur={handleGenerateBlur}
            onTouch={handleFieldTouch}
          />
          {(isSubRecordMapping || isRequired) && (
            <Tooltip
              title={`${
                isSubRecordMapping
                  ? 'Subrecord mapping'
                  : 'This field is required by the application you are importing into'
              }`}
              placement="top">
              <span className={classes.lockIcon}>
                <LockIcon />
              </span>
            </Tooltip>
          )}
        </div>
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
          className={clsx({
            [classes.disableChildRow]: isSubRecordMapping,
          })}>
          <ActionButton
            data-test={`fieldMappingRemove-${index}`}
            aria-label="delete"
            disabled={disableDelete}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
