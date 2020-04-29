import { useRef, useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd-cjs';
import MappingSettings from '../ImportMappingSettings/MappingSettingsField';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import TrashIcon from '../../icons/TrashIcon';
import ActionButton from '../../ActionButton';
import LockIcon from '../../icons/LockIcon';
import MappingConnectorIcon from '../../icons/MappingConnectorIcon';
import GripperIcon from '../../icons/GripperIcon';

const useStyles = makeStyles(theme => ({
  child: {
    '& + div': {
      width: '100%',
    },
  },
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
    overflow: 'hidden',
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
    top: 10,
    color: theme.palette.text.hint,
  },

  deleteBtn: {
    border: 'none',
    width: 0,
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: theme.spacing(6),
  },
  topHeading: {
    fontFamily: 'Roboto500',
  },
}));

export default function MappingRow(props) {
  const {
    id,
    mapping,
    extractFields,
    onFieldUpdate,
    generateFields,
    disabled,
    updateLookupHandler,
    patchSettings,
    application,
    options,
    lookups,
    onDelete,
    onMove,
    onDrop,
    index,
    isDraggable = false,
  } = props;
  const {
    key,
    isSubRecordMapping,
    isRequired,
    isNotEditable,
    extract,
    generate,
    hardCodedValueTmp,
  } = mapping || {};
  const classes = useStyles();
  const ref = useRef(null);
  // isOver is set to true when hover happens over component
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
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'MAPPING', index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: dropResult => {
      if (dropResult) {
        onDrop();
      }
    },

    canDrag: isDraggable,
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));

  const handleBlur = useCallback(
    type => (id, value) => {
      onFieldUpdate(mapping, type, value);
    },
    [mapping, onFieldUpdate]
  );
  const handleDeleteClick = useCallback(() => {
    onDelete(key);
  }, [onDelete, key]);
  const handleSettingsSave = useCallback(
    (id, evt) => {
      patchSettings(key, evt);
    },
    [patchSettings, key]
  );

  // generateFields and extractFields are passed as an array of field names
  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={classes.rowContainer}
      key={id}>
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
            id={`fieldMappingExtract-${index}`}
            labelName="name"
            valueName="id"
            value={extract || hardCodedValueTmp}
            options={extractFields}
            disabled={isSubRecordMapping || isNotEditable || disabled}
            onBlur={handleBlur('extract')}
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
            id={`fieldMappingGenerate-${index}`}
            value={generate}
            labelName="name"
            valueName="id"
            options={generateFields}
            disabled={isSubRecordMapping || isRequired || disabled}
            onBlur={handleBlur('generate')}
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
          <MappingSettings
            id={`fieldMappingSettings-${index}`}
            onSave={handleSettingsSave}
            value={mapping}
            options={options}
            generate={generate}
            application={application}
            updateLookup={updateLookupHandler}
            disabled={disabled}
            lookups={lookups}
            extractFields={extractFields}
            generateFields={generateFields}
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
            disabled={isRequired || isNotEditable || disabled}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
