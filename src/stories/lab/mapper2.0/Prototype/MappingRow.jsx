import React, { useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { Tooltip, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import CeligoSelect from '../../../../components/CeligoSelect';
import DynaTypeableSelect from '../../../../components/DynaForm/fields/DynaTypeableSelect';
import ActionButton from '../../../../components/ActionButton';
import TrashIcon from '../../../../components/icons/TrashIcon';
import AddIcon from '../../../../components/icons/AddIcon';
import LookupIcon from '../../../../components/icons/LookupLetterIcon';
import HardCodedIcon from '../../../../components/icons/HardCodedIcon';
import MappingSettingsButton from '../../../../components/Mapping/Settings/SettingsButton';
import {findNode, DATA_TYPES} from './util';
import {useTreeContext} from './TreeContext';

const useStyles = makeStyles(theme => ({
  childHeader: {
    // width: '46%',
    '& > div': {
      width: '100%',
    },
  },
  dataType: {
    position: 'absolute',
    width: 'auto !important',
    right: 0,
    border: 'none',
    backgroundColor: 'transparent',
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      display: 'none',
    },
  },
  innerRow12: {
    marginLeft: theme.spacing(2),
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

const extractFields = [];
const generateFields = [];

export default function MappingRow({
  disabled,
  index,
  importId,
  flowId,
  rowData,
  subRecordMappingId,
}) {
  const classes = useStyles();
  const { treeData, setTreeData } = useTreeContext();

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

  const newTreeData = useMemo(() => [...treeData], [treeData]);

  const {nodeSubArray, nodeIndexInSubArray} = useMemo(() => {
    let ar;
    let i;

    findNode(newTreeData, mappingKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });

    return {nodeSubArray: ar, nodeIndexInSubArray: i};
  }, [mappingKey, newTreeData]);

  // all these functions logic would be handled in data layer
  // the goal is to update the 'treeData' so it gets rendered again
  const handleDeleteClick = useCallback(() => {
    nodeSubArray.splice(nodeIndexInSubArray, 1);

    setTreeData(newTreeData);
  }, [nodeSubArray, nodeIndexInSubArray, newTreeData, setTreeData]);

  const addNewRowHandler = useCallback(() => {
    nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
      key: nanoid(),
      dataType: 'string',
    });

    setTreeData(newTreeData);
  }, [nodeSubArray, nodeIndexInSubArray, newTreeData, setTreeData]);

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;
    const currRow = nodeSubArray[nodeIndexInSubArray];

    currRow.dataType = newDataType;

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
      setTreeData(newTreeData);
    }
  }, [newTreeData, nodeIndexInSubArray, nodeSubArray, setTreeData]);

  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isHardCodedValue = !!hardCodedValue;

  return (
    <div className={classes.innerRow12}>
      <div
        className={clsx(classes.childHeader, classes.mapField, {
          [classes.disableChildRow]:
              disabled,
        })}>
        <DynaTypeableSelect
          isLoggable
          key={generate}
          id={`fieldMappingGenerate-${index}`}
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
          {DATA_TYPES.map(opt => (
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

            <DynaTypeableSelect
              isLoggable
              key={extractValue}
              id={`fieldMappingExtract-${index}`}
              labelName="name"
              valueName="id"
              value={extractValue}
              options={extractFields}
              disabled={isSubRecordMapping || isNotEditable || disabled}
              onBlur={() => {}}
              onTouch={() => {}}
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
            dataTest={`fieldMappingSettings-${index}`}
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
            data-test={`fieldMappingRemove-${index}`}
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
}
