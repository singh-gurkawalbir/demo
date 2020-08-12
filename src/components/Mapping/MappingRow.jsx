import React, { useRef, useCallback, useMemo } from 'react';
import { Tooltip } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd-cjs';
import {selectors} from '../../reducers';
import actions from '../../actions';
import DynaTypeableSelect from '../DynaForm/fields/DynaTypeableSelect';
import GripperIcon from '../icons/GripperIcon';
import LockIcon from '../icons/LockIcon';
import MappingConnectorIcon from '../icons/MappingConnectorIcon';
import ActionButton from '../ActionButton';
import TrashIcon from '../icons/TrashIcon';
import MappingSettings from '../AFE/ImportMappingSettings/MappingSettingsField';
import { adaptorTypeMap } from '../../utils/resource';

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
    disabled,
    onMove,
    onDrop,
    index,
    resourceId,
    flowId,
    subRecordMappingId,
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
  const dispatch = useDispatch();
  const classes = useStyles();
  const ref = useRef(null);
  const importRes = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const {adaptorType} = importRes;
  // todo: remove after mapping settings refactor
  const application = adaptorTypeMap[adaptorType];
  // todo subrecord
  const generateFields = useSelector(state =>
    selectors.mappingGenerates(state, resourceId)
  );
  const nsRecordType = useSelector(state =>
    selectors.mappingNSRecordType(state, resourceId, subRecordMappingId)
  );

  const extractFields = useSelector(state =>
    selectors.mappingExtracts(state, resourceId, flowId)
  );
  const {lookups, lastModifiedRowKey} = useSelector(state => selectors.mapping(state));
  const updateLookupHandler = (lookupOps = []) => {
    let lookupsTmp = [...lookups];
    // Here lookupOPs will be an array of lookups and actions. Lookups can be added and delted simultaneously from settings.

    lookupOps.forEach(({ isDelete, obj }) => {
      if (isDelete) {
        lookupsTmp = lookupsTmp.filter(lookup => lookup.name !== obj.name);
      } else {
        const index = lookupsTmp.findIndex(lookup => lookup.name === obj.name);

        if (index !== -1) {
          lookupsTmp[index] = obj;
        } else {
          lookupsTmp.push(obj);
        }
      }
    });

    dispatch(actions.mapping.updateLookup(lookupsTmp));
  };

  // TODO: refact
  const options = useMemo(() => {
    const {_connectionId: connectionId, name: resourceName} = importRes;

    return {
      flowId,
      connectionId,
      resourceId,
      resourceName,
      isGroupedSampleData: !!(extractFields && Array.isArray(extractFields)),
      // eslint-disable-next-line camelcase
      isComposite: adaptorType === 'NetSuiteDistributedImport' === adaptorType && importRes?.netsuite_da?.operation === 'addupdate',
      sObjectType: adaptorType === 'SalesforceImport' && importRes?.salesforce?.sObjectType,
      recordType: nsRecordType,
    };
  }, [adaptorType, extractFields, flowId, importRes, nsRecordType, resourceId]);
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
    field => (id, value) => {
      // check if value changes or user entered something in new row
      if (field === 'extract' && value.indexOf('_child_') > -1) {
        dispatch(actions.mapping.checkForSFSublistExtractPatch(key, value));

        return;
      }

      if ((!key && value) || (key && mapping[field] !== value)) {
        if (key && value === '') {
          if (
            (field === 'extract' && generate === '') ||
            (field === 'generate' &&
              extract === '' &&
              !('hardCodedValue' in mapping))
          ) {
            dispatch(actions.mapping.delete(key));

            return;
          }
        }
        dispatch(actions.mapping.patchField(field, key, value));

        return;
      }

      if (lastModifiedRowKey !== key) {
        const _lastModifiedRowKey = key === undefined ? 'new' : key;

        dispatch(actions.mapping.updateLastFieldTouched(_lastModifiedRowKey));
      }
    },
    [dispatch, extract, generate, key, lastModifiedRowKey, mapping]
  );

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.mapping.delete(key));
  }, [dispatch, key]);
  const handleSettingsSave = useCallback(
    (id, value) => {
      dispatch(actions.mapping.patchSettings(key, value));
    },
    [dispatch, key]
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
            triggerBlurOnTouch
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
            triggerBlurOnTouch
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
          {/* TODO refactor MappingSettings pending */}
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
