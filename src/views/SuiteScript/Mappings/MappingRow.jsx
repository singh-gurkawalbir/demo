import React, { useRef, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd-cjs';
import TrashIcon from '../../../components/icons/TrashIcon';
import ActionButton from '../../../components/ActionButton';
import MappingConnectorIcon from '../../../components/icons/MappingConnectorIcon';
import GripperIcon from '../../../components/icons/GripperIcon';
import Settings from './Settings/Button';
import * as selectors from '../../../reducers';
import suiteScriptMappingUtil from '../../../utils/suiteScriptMapping';
import DynaTypeableSelect from '../../../components/DynaForm/fields/DynaTypeableSelect';

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
  topHeading: {
    fontFamily: 'Roboto500',
  },
}));

export default function MappingRow(props) {
  const {
    id,
    mapping,
    onFieldUpdate,
    disabled,
    updateLookupHandler,
    patchSettings,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    // application,
    onDelete,
    onMove,
    onDrop,
    index,
    importType,
    isDraggable = false,
  } = props;
  const {
    key,
    extract,
    generate,
    hardCodedValueTmp,
  } = mapping || {};
  const classes = useStyles();
  const ref = useRef(null);

  const {data: importData} = useSelector(state => selectors.suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId}));
  const {data: flowSampleData} = useSelector(state => selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId}));

  const generateFields = useMemo(() => {
    console.log('*************', importData);
    const formattedFields = suiteScriptMappingUtil.getFormattedGenerateData(
      importData,
      importType
    );
    return formattedFields.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });
  }, [importData, importType]);

  const extractFields = useMemo(() => {
    const formattedFields = [];
    if (flowSampleData) {
      flowSampleData.forEach(extract => {
        formattedFields.push({
          id: extract.id,
          name: extract.name
        });
        if (extract.type === 'select') {
          formattedFields.push({
            id: `${extract.id}.internalid`,
            name: `${extract.name} (InternalId)`
          });
        }
      });
    }
    return formattedFields.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });
  }, [flowSampleData]);


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
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            id={`fieldMappingExtract-${index}`}
            labelName="name"
            valueName="id"
            value={extract || hardCodedValueTmp}
            options={extractFields}
            disabled={disabled}
            onBlur={handleBlur('extract')}
          />
        </div>
        <MappingConnectorIcon className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            id={`fieldMappingGenerate-${index}`}
            value={generate}
            labelName="name"
            valueName="id"
            options={generateFields}
            disabled={disabled}
            onBlur={handleBlur('generate')}
          />
        </div>
        <div>
          <Settings
            id={`fieldMappingSettings-${index}`}
            onSave={handleSettingsSave}
            value={mapping}
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
            flowId={flowId}
            updateLookup={updateLookupHandler}
            disabled={disabled}
            extractFields={extractFields}
            generateFields={generateFields}
          />
        </div>
        <div
          key="delete_button"
          >
          <ActionButton
            data-test={`fieldMappingRemove-${index}`}
            aria-label="delete"
            disabled={disabled}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
