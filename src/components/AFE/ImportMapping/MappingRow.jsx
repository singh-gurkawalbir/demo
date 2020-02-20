import { useRef } from 'react';
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
import ArrowUpIcon from '../../icons/ArrowUpIcon';

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
      background: theme.palette.secondary.lightest,
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
    handleFieldUpdate,
    generateFields,
    disabled,
    index,
    updateLookupHandler,
    patchSettings,
    application,
    options,
    getLookup,
    handleDelete,
    onMove,
    isDraggable = false,
  } = props;
  const classes = useStyles();
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'MAPPING',
    drop(item) {
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
    item: { type: 'MAPPING', index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));

  // generateFields and extractFields are passed as an array of field names
  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={classes.rowContainer}
      key={mapping.index}>
      <div className={clsx(classes.innerRow, { [classes.dragRow]: !disabled })}>
        <div className={classes.dragIcon}>
          <ArrowUpIcon />
        </div>
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              mapping.isSubRecordMapping || mapping.isNotEditable || disabled,
          })}>
          <DynaTypeableSelect
            key={id}
            id={`fieldMappingExtract-${mapping.index}`}
            labelName="name"
            valueName="id"
            value={mapping.extract || mapping.hardCodedValueTmp}
            options={extractFields}
            disabled={
              mapping.isSubRecordMapping || mapping.isNotEditable || disabled
            }
            onBlur={(id, value) => {
              handleFieldUpdate(mapping, 'extract', value);
            }}
          />

          {(mapping.isSubRecordMapping || mapping.isNotEditable) && (
            <span className={classes.lockIcon}>
              <LockIcon />
            </span>
          )}
        </div>
        <MappingConnectorIcon className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
              mapping.isSubRecordMapping || mapping.isRequired || disabled,
          })}>
          <DynaTypeableSelect
            key={id}
            id={`fieldMappingGenerate-${mapping.index}`}
            value={mapping.generate}
            labelName="name"
            valueName="id"
            options={generateFields}
            disabled={
              mapping.isSubRecordMapping || mapping.isRequired || disabled
            }
            onBlur={
              (id, value) => {
                handleFieldUpdate(mapping, 'generate', value);
              }
              // handleGenerateUpdate(mapping)
            }
          />
          {(mapping.isSubRecordMapping || mapping.isRequired) && (
            <Tooltip
              title={`${
                mapping.isSubRecordMapping
                  ? 'Subrecord mapping'
                  : 'This field is required by the application you are importing to'
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
            [classes.disableChildRow]: mapping.isSubRecordMapping,
          })}>
          <MappingSettings
            id={`fieldMappingSettings-${mapping.index}`}
            onSave={(id, evt) => {
              patchSettings(mapping.index, evt);
            }}
            value={mapping}
            options={options}
            generate={mapping.generate}
            application={application}
            updateLookup={updateLookupHandler}
            disabled={disabled}
            lookup={
              mapping && mapping.lookupName && getLookup(mapping.lookupName)
            }
            extractFields={extractFields}
            generateFields={generateFields}
          />
        </div>
        <div
          key="delete_button"
          className={clsx({
            [classes.disableChildRow]: mapping.isSubRecordMapping,
          })}>
          <ActionButton
            data-test={`fieldMappingRemove-${mapping.index}`}
            aria-label="delete"
            disabled={mapping.isRequired || mapping.isNotEditable || disabled}
            onClick={() => {
              handleDelete(mapping.index);
            }}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
