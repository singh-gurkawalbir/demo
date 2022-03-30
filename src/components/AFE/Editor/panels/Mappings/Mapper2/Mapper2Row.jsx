import React, { useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActionButton from '../../../../../ActionButton';
import TrashIcon from '../../../../../icons/TrashIcon';
import AddIcon from '../../../../../icons/AddIcon';
import StaticLookupIcon from '../../../../../icons/StaticLookupIcon';
import HandlebarsExpressionIcon from '../../../../../icons/HandlebarsExpressionIcon';
import DynamicLookupIcon from '../../../../../icons/DynamicLookupIcon';
import HardCodedIcon from '../../../../../icons/HardCodedIcon';
import SettingsIcon from '../../../../../icons/SettingsIcon';
import Mapper2ExtractsTypeableSelect from './Source/Mapper2ExtractsTypeableSelect';
import {selectors} from '../../../../../../reducers';
import Mapper2Generates from './Destination/Mapper2Generates';
import actions from '../../../../../../actions';
import useConfirmDialog from '../../../../../ConfirmDialog';
import RawHtml from '../../../../../RawHtml';

const useStyles = makeStyles(theme => ({
  childHeader: {
    '&:first-child': {
      marginRight: theme.spacing(1),
    },
  },
  innerRowRoot: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
    '&:hover': {
      '&>div:last-child': {
        '&>button:last-child': {
          visibility: 'visible',
        },
      },
    },
  },
  lockIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.hint,
    height: theme.spacing(3),
  },
  actionsMapping: {
    display: 'flex',
    alignItems: 'baseline',
  },
  deleteMapping: {
    visibility: 'hidden',
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
  copySource = 'no',
  generate,
  hardCodedValue,
  dataType,
  lookupName,
  disabled,
  generateDisabled,
  isEmptyRow,
  hidden,
  children,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const {
    flowId,
    importId,
    lookup} = useSelector(state => {
    const e = selectors.mapping(state);
    const lookup = (lookupName && e.lookups?.find(lookup => lookup.name === lookupName)) || {};

    return {
      flowId: e.flowId,
      importId: e.importId,
      lookup,
    };
  }, shallowEqual);

  const hasChildren = children?.length;

  const handleDeleteClick = useCallback(() => {
    if (!hasChildren) {
      return dispatch(actions.mapping.v2.deleteRow(nodeKey));
    }
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this parent record row? All its child rows will be deleted as well.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            dispatch(actions.mapping.v2.deleteRow(nodeKey));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [hasChildren, confirmDialog, dispatch, nodeKey]);

  const addNewRowHandler = useCallback(() => {
    dispatch(actions.mapping.v2.addRow(nodeKey));
  }, [dispatch, nodeKey]);

  const onDataTypeChange = useCallback(e => {
    const newDataType = e.target.value;

    if ((dataType === 'object' || dataType === 'objectarray') &&
    newDataType !== 'object' && newDataType !== 'objectarray') {
      const message = `Since only an "object" or "[object]" data type can have child rows, 
      all of this parent record row's child rows will be deleted when your selected data type is applied. 
      <br><br>Are you sure you want to continue?</br></br>`;

      confirmDialog({
        title: 'Confirm data type selection',
        message: <RawHtml html={message} />,
        buttons: [
          {
            label: 'Confirm',
            onClick: () => {
              dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType));
    }
  }, [confirmDialog, dataType, dispatch, nodeKey]);

  const handleBlur = useCallback((field, value) => {
    dispatch(actions.mapping.v2.patchField(field, nodeKey, value));
  }, [dispatch, nodeKey]);

  const handleExtractBlur = useCallback(value => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback(value => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handleSettingsClick = useCallback(() => {
    dispatch(actions.mapping.v2.updateActiveKey(nodeKey));
    history.push(`${history.location.pathname}/settings/v2/${nodeKey}/${generate}`);
  }, [dispatch, history, nodeKey, generate]);

  const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isStaticLookup = !!(lookup.name && lookup.map);
  const isHardCodedValue = !!hardCodedValue;
  const isHandlebarExp = handlebarRegex.test(extractValue);

  if (hidden) return null;

  return (
    <div
      key={nodeKey}
      className={classes.innerRowRoot}>

      <div className={classes.childHeader}>
        <Mapper2Generates
          isLoggable
          key={generate}
          id={`fieldMappingGenerate-${nodeKey}`}
          value={generate}
          disabled={disabled}
          generateDisabled={generateDisabled}
          dataType={dataType}
          onBlur={handleGenerateBlur}
          onDataTypeChange={onDataTypeChange}
          />

      </div>
      {dataType === 'object' && !extractValue && copySource === 'no' ? null : (
        <>
          <div className={classes.childHeader}>
            <Mapper2ExtractsTypeableSelect
              isLoggable
              key={extractValue}
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
        <ActionButton
          data-test={`fieldMappingSettings-${nodeKey}`}
          disabled={disabled || !generate}
          aria-label="settings"
          onClick={handleSettingsClick}
          key="settings">
          <SettingsIcon />
        </ActionButton>

        <ActionButton onClick={addNewRowHandler} disabled={generateDisabled || disabled}>
          <AddIcon />
        </ActionButton>
        <ActionButton
          data-test={`fieldMappingRemove-${nodeKey}`}
          aria-label="delete"
          disabled={isEmptyRow || generateDisabled || disabled}
          onClick={handleDeleteClick}
          key="delete_button"
          className={classes.deleteMapping}>
          <TrashIcon />
        </ActionButton>
      </div>
    </div>
  );
});

export default Mapper2Row;
