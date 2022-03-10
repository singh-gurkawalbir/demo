import React, { useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import ActionButton from '../../../../../ActionButton';
import TrashIcon from '../../../../../icons/TrashIcon';
import AddIcon from '../../../../../icons/AddIcon';
import StaticLookupIcon from '../../../../../icons/StaticLookupIcon';
import HandlebarsExpressionIcon from '../../../../../icons/HandlebarsExpressionIcon';
import DynamicLookupIcon from '../../../../../icons/DynamicLookupIcon';
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
  nodeKey,
  combinedExtract,
  extract,
  generate,
  hardCodedValue,
  dataType,
  lookupName,
  disabled,
  generateDisabled,
  isEmptyRow,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {flowId,
    importId, subRecordMappingId, lookup} = useSelector(state => {
    const e = selectors.mapping(state);
    const lookup = (lookupName && e.lookups?.find(lookup => lookup.name === lookupName)) || {};

    return {
      flowId: e.flowId,
      importId: e.importId,
      subRecordMappingId: e.subRecordMappingId,
      lookup,
    };
  }, shallowEqual);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.mapping.v2.deleteRow(nodeKey));
  }, [dispatch, nodeKey]);

  const addNewRowHandler = useCallback(() => {
    dispatch(actions.mapping.v2.addRow(nodeKey));
  }, [dispatch, nodeKey]);

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;

    dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType));
  }, [dispatch, nodeKey]);

  const handleBlur = useCallback((field, value) => {
    dispatch(actions.mapping.v2.patchField(field, nodeKey, value));
  }, [dispatch, nodeKey]);

  const handleExtractBlur = useCallback(value => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback(value => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isStaticLookup = !!(lookup.name && lookup.map);
  const isHardCodedValue = !!hardCodedValue;
  const isHandlebarExp = handlebarRegex.test(extract);

  return (
    <div
      key={nodeKey}
      className={classes.innerRowRoot}>

      <div className={classes.childHeader}>
        <Mapper2Generates
          isLoggable
          key={`fieldMappingGenerate-${nodeKey}`}
          id={`fieldMappingGenerate-${nodeKey}`}
          value={generate}
          disabled={disabled}
          generateDisabled={generateDisabled}
          dataType={dataType}
          onBlur={handleGenerateBlur}
          onDataTypeChange={onDataTypeChange}
          />

      </div>
      {dataType === 'object' && !extractValue ? null : (
        <>
          <div className={classes.childHeader}>
            <Mapper2ExtractsTypeableSelect
              isLoggable
              key={`fieldMappingExtract-${nodeKey}`}
              id={`fieldMappingExtract-${nodeKey}`}
              value={extractValue}
              disabled={disabled}
              dataType={dataType}
              importId={importId}
              flowId={flowId}
              onBlur={handleExtractBlur}
              isLookup={isLookup}
              isHardCodedValue={isHardCodedValue}
              isHandlebarExp={isHandlebarExp}
            />
          </div>
        </>
      )}

      <div className={classes.actionsMapping}>
        {isStaticLookup && <RightIcon title="Static lookup" Icon={StaticLookupIcon} />}
        {(isLookup && !isStaticLookup) && <RightIcon title="Dynamic lookup" Icon={DynamicLookupIcon} />}
        {isHandlebarExp && !isLookup && <RightIcon title="Handlebars expression" Icon={HandlebarsExpressionIcon} />}
        {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
        <div>
          <MappingSettingsButton
            dataTest={`fieldMappingSettings-${nodeKey}`}
            mappingKey={nodeKey}
            disabled={disabled}
            subRecordMappingId={subRecordMappingId}
            importId={importId}
            flowId={flowId}
          />
        </div>

        <ActionButton onClick={addNewRowHandler} disabled={generateDisabled || disabled}>
          <AddIcon />
        </ActionButton>
        <div
          key="delete_button"
          className={classes.deleteMapping}>
          <ActionButton
            data-test={`fieldMappingRemove-${nodeKey}`}
            aria-label="delete"
            disabled={isEmptyRow || generateDisabled || disabled}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
});

export default Mapper2Row;
