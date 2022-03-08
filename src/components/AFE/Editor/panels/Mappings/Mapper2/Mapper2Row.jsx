import React, { useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { Tooltip, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useSelector, shallowEqual } from 'react-redux';
import CeligoSelect from '../../../../../CeligoSelect';
import DynaTypeableSelect from '../../../../../DynaForm/fields/DynaTypeableSelect';
import ActionButton from '../../../../../ActionButton';
import TrashIcon from '../../../../../icons/TrashIcon';
import AddIcon from '../../../../../icons/AddIcon';
import LookupIcon from '../../../../../icons/LookupLetterIcon';
import HardCodedIcon from '../../../../../icons/HardCodedIcon';
import MappingSettingsButton from '../../../../../Mapping/Settings/SettingsButton';
import {findNode, DATA_TYPES_OPTIONS} from '../../../../../../utils/mapping';
import Mapper2ExtractsTypeableSelect from './Mapper2ExtractsTypeableSelect';
import {selectors} from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  childHeader: {
    // width: '46%',
  },
  dataType: {
    border: 'none',
    backgroundColor: 'transparent',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    width: 100,
    marginLeft: theme.spacing(1),
    zIndex: theme.zIndex.drawer,
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
    '& .MuiSelect-selectMenu': {
      paddingRight: 12,
    },
  },
  innerRow12: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  mapField: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    // width: '40%',
    alignItems: 'center',
    '& .MuiFilledInput-multiline': {
      borderColor: theme.palette.secondary.lightest,
    },
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
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
    marginLeft: theme.spacing(1),
    color: theme.palette.text.hint,
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
  deleteBtn: {
    border: 'none',
    width: 0,
  },
  textBox: {
    '&>.MuiFormControl-root': {
      width: '100%',
    },
    '&>.MuiInputBase-root': {
      marginLeft: '-104px',
    },
  },
  textLabel: {
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderRadius: 2,
  },
}));

const RightIcon = ({title, Icon, className}) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={title}
      placement="bottom">
      <div className={clsx(classes.lockIcon, className)}>
        <Icon />
      </div>
    </Tooltip>
  );
};

const generateFields = [];

const Mapper2Row = React.memo(({
  disabled,
  rowData,

}) => {
  const classes = useStyles();
  const treeData = useSelector(state => selectors.mappingTreeData(state));

  const {
    key: mappingKey,
    isSubRecordMapping,
    isRequired,
    isNotEditable,
    combinedExtract,
    extract,
    generate,
    hardCodedValue,
    dataType,
    lookupName,
  } = rowData;
  const {flowId,
    importId, subRecordMappingId} = useSelector(state => {
    const e = selectors.mapping(state);

    return {
      flowId: e.flowId,
      importId: e.resourceId,
      subRecordMappingId: e.subRecordMappingId,
    };
  }, shallowEqual);
  const newTreeData = useMemo(() => [...treeData], [treeData]);

  const {nodeSubArray, nodeIndexInSubArray} = useMemo(() => {
    let ar;
    let i;

    findNode(newTreeData, 'key', mappingKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });

    return {nodeSubArray: ar, nodeIndexInSubArray: i};
  }, [mappingKey, newTreeData]);

  // all these functions logic would be handled in data layer
  // the goal is to update the 'treeData' so it gets rendered again
  const handleDeleteClick = useCallback(() => {
    nodeSubArray.splice(nodeIndexInSubArray, 1);

    // setTreeData(newTreeData);
  }, [nodeSubArray, nodeIndexInSubArray]);

  const addNewRowHandler = useCallback(() => {
    const currRow = nodeSubArray[nodeIndexInSubArray];

    nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
      key: nanoid(),
      parentKey: currRow.parentKey,
      parentExtract: currRow.parentExtract,
      dataType: 'string',
    });

    // setTreeData(newTreeData);
  }, [nodeSubArray, nodeIndexInSubArray]);

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;
    const currRow = nodeSubArray[nodeIndexInSubArray];

    currRow.dataType = newDataType;
    currRow.expanded = true;

    if (newDataType === 'object' || newDataType === 'objectarray') {
      if (isEmpty(currRow.children)) {
        currRow.children = [{
          key: nanoid(),
          parentKey: currRow.key,
          parentExtract: currRow.extract,
          dataType: 'string',
        }];
      }
      // todo: what if newDataType is changed back to primitive
      // should we remove the children??
      // setTreeData(newTreeData);
    }
  }, [nodeIndexInSubArray, nodeSubArray]);

  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isHardCodedValue = !!hardCodedValue;

  return (
    <div
      key={mappingKey}
      className={classes.innerRow12}>
      <div
        className={clsx(classes.childHeader, classes.mapField, {
          [classes.disableChildRow]:
              disabled,
        })}>
        <DynaTypeableSelect
          isLoggable
          key={`fieldMappingGenerate-${mappingKey}`}
          id={`fieldMappingGenerate-${mappingKey}`}
          value={generate}
          labelName="name"
          valueName="id"
          options={generateFields}
          disabled={isSubRecordMapping || isRequired || disabled}
          onBlur={() => {}}
          onTouch={() => {}}
          />
        <CeligoSelect
          className={classes.dataType}
          onChange={onDataTypeChange}
          displayEmpty
          value={dataType || 'string'}
              >
          {DATA_TYPES_OPTIONS.map(opt => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.label}
            </MenuItem>
          ))}
        </CeligoSelect>
      </div>
      {dataType === 'object' && !extract ? null : (
        <>
          <span className={classes.mappingIcon} />
          <div
            className={clsx(classes.childHeader, classes.mapField, {
              [classes.disableChildRow]:
              disabled,
            })}>

            <Mapper2ExtractsTypeableSelect
              isLoggable
              key={`fieldMappingExtract-${mappingKey}`}
              id={`fieldMappingExtract-${mappingKey}`}
              value={extractValue}
              disabled={isSubRecordMapping || isNotEditable || disabled}
              dataType={dataType}
              importId={importId}
              flowId={flowId}
            />
          </div>
        </>
      )}

      <div className={classes.actionsMapping}>
        {isLookup && <RightIcon title="Lookup" Icon={LookupIcon} />}
        {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
        <div
          className={clsx({
            [classes.disableChildRow]: false,
          })}>
          <MappingSettingsButton
            dataTest={`fieldMappingSettings-${mappingKey}`}
            mappingKey={mappingKey}
             // disabled={disabled}
            subRecordMappingId={subRecordMappingId}
            importId={importId}
            flowId={flowId}
          />

        </div>
        <ActionButton onClick={addNewRowHandler}>
          <AddIcon />
        </ActionButton>
        <div
          key="delete_button"
          className={classes.deleteMappingRow}>
          <ActionButton
            data-test={`fieldMappingRemove-${mappingKey}`}
            aria-label="delete"
             // disabled={disableDelete}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
},

(prevProps, nextProps) => {
  if (isEqual(prevProps, nextProps)) return true;

  return false;
});

export default Mapper2Row;
