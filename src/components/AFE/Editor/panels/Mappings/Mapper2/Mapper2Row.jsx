import React, { useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import ActionButton from '../../../../../ActionButton';
import TrashIcon from '../../../../../icons/TrashIcon';
import AddIcon from '../../../../../icons/AddIcon';
import LookupIcon from '../../../../../icons/LookupLetterIcon';
import HardCodedIcon from '../../../../../icons/HardCodedIcon';
import MappingSettingsButton from '../../../../../Mapping/Settings/SettingsButton';
import Mapper2ExtractsTypeableSelect from './Mapper2ExtractsTypeableSelect';
import {selectors} from '../../../../../../reducers';
import Mapper2Generates from './Mapper2Generates';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  childHeader: {
    // width: '46%',
  },
  innerRowRoot: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  lockIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.hint,
  },
  actionsMapping: {
    display: 'flex',
    minWidth: 36,
    maxWidth: 64,
  },
  deleteMapping: {
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

const Mapper2Row = React.memo(({
  rowData,
}) => {
  const classes = useStyles();

  const {
    key,
    combinedExtract,
    extract,
    generate,
    hardCodedValue,
    dataType,
    lookupName,
    disabled,
  } = rowData;
  const dispatch = useDispatch();
  const {flowId,
    importId, subRecordMappingId} = useSelector(state => {
    const e = selectors.mapping(state);

    return {
      flowId: e.flowId,
      importId: e.importId,
      subRecordMappingId: e.subRecordMappingId,
    };
  }, shallowEqual);

  // const newTreeData = useMemo(() => [...treeData], [treeData]);

  // const {nodeSubArray, nodeIndexInSubArray} = useMemo(() => {
  //   let ar;
  //   let i;

  //   findNode(newTreeData, 'key', key, (item, index, arr) => {
  //     ar = arr;
  //     i = index;
  //   });

  //   return {nodeSubArray: ar, nodeIndexInSubArray: i};
  // }, [key, newTreeData]);

  // all these functions logic would be handled in data layer
  // the goal is to update the 'treeData' so it gets rendered again
  const handleDeleteClick = useCallback(() => {
    // nodeSubArray.splice(nodeIndexInSubArray, 1);
    dispatch(actions.mapping.v2.deleteRow(key));
    // setTreeData(newTreeData);
  }, [dispatch, key]);

  const addNewRowHandler = useCallback(() => {
    // const currRow = nodeSubArray[nodeIndexInSubArray];

    // nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
    //   key: nanoid(),
    //   parentKey: currRow.parentKey,
    //   parentExtract: currRow.parentExtract,
    //   dataType: 'string',
    // });
    dispatch(actions.mapping.v2.addRow(key));
    // setTreeData(newTreeData);
  }, [dispatch, key]);

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;
    // const currRow = nodeSubArray[nodeIndexInSubArray];

    // currRow.dataType = newDataType;
    // currRow.expanded = true;

    // if (newDataType === 'object' || newDataType === 'objectarray') {
    //   if (isEmpty(currRow.children)) {
    //     currRow.children = [{
    //       key: nanoid(),
    //       parentKey: currRow.key,
    //       parentExtract: currRow.extract,
    //       dataType: 'string',
    //     }];
    //   }
    //   // todo: what if newDataType is changed back to primitive
    //   // should we remove the children??
    //   // setTreeData(newTreeData);
    // }

    dispatch(actions.mapping.v2.updateDataType(key, newDataType));
  }, [dispatch, key]);

  const handleBlur = useCallback((field, value) => {
    dispatch(actions.mapping.v2.patchField(field, key, value));
  }, [dispatch, key]);

  const handleExtractBlur = useCallback(value => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback(value => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isHardCodedValue = !!hardCodedValue;

  return (
    <div
      key={key}
      className={classes.innerRowRoot}>

      <div className={classes.childHeader}>
        <Mapper2Generates
          isLoggable
          key={`fieldMappingGenerate-${key}`}
          id={`fieldMappingGenerate-${key}`}
          value={generate}
          disabled={disabled}
          dataType={dataType}
          onBlur={handleGenerateBlur}
          onDataTypeChange={onDataTypeChange}
          />

      </div>
      {dataType === 'object' && !extract ? null : (
        <>
          <div className={classes.childHeader}>
            <Mapper2ExtractsTypeableSelect
              isLoggable
              key={`fieldMappingExtract-${key}`}
              id={`fieldMappingExtract-${key}`}
              value={extractValue}
              disabled={disabled}
              dataType={dataType}
              importId={importId}
              flowId={flowId}
              onBlur={handleExtractBlur}
            />
          </div>
        </>
      )}

      <div className={classes.actionsMapping}>
        {isLookup && <RightIcon title="Lookup" Icon={LookupIcon} />}
        {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
        <div>
          <MappingSettingsButton
            dataTest={`fieldMappingSettings-${key}`}
            mappingKey={key}
            disabled={disabled}
            subRecordMappingId={subRecordMappingId}
            importId={importId}
            flowId={flowId}
          />
        </div>

        <ActionButton onClick={addNewRowHandler} disabled={disabled}>
          <AddIcon />
        </ActionButton>
        <div
          key="delete_button"
          className={classes.deleteMapping}>
          <ActionButton
            data-test={`fieldMappingRemove-${key}`}
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
},

(prevProps, nextProps) => {
  if (isEqual(prevProps, nextProps)) return true;

  return false;
});

export default Mapper2Row;
