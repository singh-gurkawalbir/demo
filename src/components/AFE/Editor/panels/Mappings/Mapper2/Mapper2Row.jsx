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
import { buildDrawerUrl, drawerPaths } from '../../../../../../utils/rightDrawer';
import { MAPPING_DATA_TYPES } from '../../../../../../utils/mapping';
import messageStore from '../../../../../../utils/messageStore';
import InfoIconButton from '../../../../../InfoIconButton';

const useStyles = makeStyles(theme => ({
  childHeader: {
    flex: 1,
    '&:first-child': {
      marginRight: theme.spacing(1),
    },
    '&>div': {
      width: '100%',
    },
    '&:nth-of-type(2)': {
      flex: 1,
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
  lockedIcon: {
    right: theme.spacing(5),
  },
  actionsMapping: {
    display: 'flex',
    alignItems: 'baseline',
    flex: 1,
  },
  deleteMapping: {
    visibility: 'hidden',
  },
  noExtractField: {
    '&>:last-child': {
      flex: 2,
    },
  },
  infoIcon: {
    marginRight: 0,
    padding: 0,
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

const getInfoMessage = (dataType, copySource) => {
  if (copySource === 'yes') {
    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      return 'Child fields are not displayed here because they vary by input record. For child fields to be added, select "No" for "Would you like to copy an object from the source record as-is?" in this row’s Settings.';
    } if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      return 'Child fields are not displayed here because they vary by input record. For child fields to be added, select "No" for "Would you like to copy an object array from the source record as-is?" in this row’s Settings.';
    }
  }

  return '';
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
  isRequired,
  isEmptyRow,
  hidden,
  children,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const { flowId, importId, lookup} = useSelector(state => {
    const mapping = selectors.mapping(state);
    const lookup = (lookupName && mapping.lookups?.find(lookup => lookup.name === lookupName)) || {};

    return {
      flowId: mapping.flowId,
      importId: mapping.importId,
      lookup,
    };
  }, shallowEqual);

  const hasChildren = !!children?.length;

  const handleDeleteClick = useCallback(() => {
    if (!hasChildren) {
      return dispatch(actions.mapping.v2.deleteRow(nodeKey));
    }
    confirmDialog({
      title: 'Confirm delete',
      message: messageStore('MAPPER2_DELETE_ROW_WARNING'),
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

    history.push(buildDrawerUrl({
      path: drawerPaths.MAPPINGS.V2_SETTINGS,
      baseUrl: history.location.pathname,
      params: { nodeKey, generate },
    }));
  }, [dispatch, history, nodeKey, generate]);

  const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
  const extractValue = combinedExtract || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const isLookup = !!lookupName;
  const isStaticLookup = !!(lookup.name && lookup.map);
  const isHardCodedValue = !!hardCodedValue;
  const isHandlebarExp = handlebarRegex.test(extractValue);
  const hideExtractField = dataType === MAPPING_DATA_TYPES.OBJECT && !extractValue && copySource === 'no';

  // this prop is used for object array tab view
  // where some children needs to be hidden
  if (hidden) return null;

  return (
    <div
      key={nodeKey}
      className={clsx(classes.innerRowRoot, {[classes.noExtractField]: hideExtractField})}>
      <div className={classes.childHeader}>
        <Mapper2Generates
          key={generate}
          id={`fieldMappingGenerate-${nodeKey}`}
          nodeKey={nodeKey}
          value={generate}
          disabled={generateDisabled || isRequired || disabled}
          dataType={dataType}
          onBlur={handleGenerateBlur}
          />
      </div>

      {hideExtractField ? null : (
        <div className={classes.childHeader}>
          <Mapper2ExtractsTypeableSelect
            key={extractValue}
            id={`fieldMappingExtract-${nodeKey}`}
            nodeKey={nodeKey}
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
      )}

      <div className={classes.actionsMapping}>
        <InfoIconButton
          className={classes.infoIcon}
          placement="bottom"
          info={getInfoMessage(dataType, copySource)} />

        {isStaticLookup && <RightIcon title="Static lookup" Icon={StaticLookupIcon} />}
        {(isLookup && !isStaticLookup) && <RightIcon title="Dynamic lookup" Icon={DynamicLookupIcon} />}
        {isHandlebarExp && !isLookup && <RightIcon title="Handlebars expression" Icon={HandlebarsExpressionIcon} />}
        {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
        {/* {isRequired && (
        <RightIcon
          title="This field is required by the application you are importing into"
          Icon={LockIcon} className={clsx({[classes.lockedIcon]: isLookup || isHandlebarExp || isHardCodedValue})} />
        )} */}
        <ActionButton
          data-test={`fieldMappingSettings-${nodeKey}`}
          disabled={disabled || !generate}
          tooltip={generate ? '' : 'Enter destination record field to configure settings'} // todo ashu
          placement="bottom-start"
          aria-label="settings"
          onClick={handleSettingsClick}
          key="settings">
          <SettingsIcon />
        </ActionButton>

        <ActionButton
          data-test={`fieldMappingAdd-${nodeKey}`}
          aria-label="add"
          onClick={addNewRowHandler}
          key="add_button"
          disabled={generateDisabled || disabled}>
          <AddIcon />
        </ActionButton>
        <ActionButton
          data-test={`fieldMappingRemove-${nodeKey}`}
          aria-label="delete"
          disabled={isEmptyRow || generateDisabled || isRequired || disabled}
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
