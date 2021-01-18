import React, { useRef, useCallback, useState } from 'react';
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
import LookupIcon from '../icons/LookupLetterIcon';
import MultiFieldIcon from '../icons/MultiFieldIcon';
import HardCodedIcon from '../icons/HardCodedIcon';
import ActionButton from '../ActionButton';
import TrashIcon from '../icons/TrashIcon';
import MappingSettingsButton from './Settings/SettingsButton';

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
  dragRow: {
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
    cursor: 'move',
    background: 'none',
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
    top: 6,
    color: theme.palette.text.hint,
  },
  lockedIcon: {
    right: 40,
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
    lookupName,
  } = mapping;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);
  const generateFields = useSelector(state =>
    selectors.mappingGenerates(state, importId, subRecordMappingId)
  );
  const extractFields = useSelector(state =>
    selectors.mappingExtracts(state, importId, flowId, subRecordMappingId)
  );

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
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'MAPPING', index, key: mappingKey },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  });
  const opacity = isDragging ? 0.2 : 1;

  drop(preview(ref));

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
    setIsActive(true);
  }, []);
  const handleOnMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
  const isLookup = !!lookupName;
  const isMultiField = handlebarRegex.test(extract);
  const isHardCodedValue = !!hardCodedValue;
  const extractValue = extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const disableDelete = !mappingKey || isRequired || isNotEditable || disabled;

  return (
    <div
      ref={ref}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      style={{ opacity }}
      className={classes.rowContainer}>
      <div className={clsx(classes.innerRow, { [classes.dragRow]: !disabled })}>
        <div className={classes.dragIcon} ref={drag}>
          <GripperIcon />
        </div>
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              isSubRecordMapping || isNotEditable || disabled,
          })}>
          <DynaTypeableSelect
            data-public
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
        <span className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              isSubRecordMapping || isRequired || disabled,
          })}>
          <DynaTypeableSelect
            data-public
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
          {isLookup && <RightIcon title="Lookup" Icon={LookupIcon} />}
          {isMultiField && <RightIcon title="Multi-field" Icon={MultiFieldIcon} />}
          {isHardCodedValue && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
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
                [classes.hide]: !isActive,
              })}>
              <TrashIcon />
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
