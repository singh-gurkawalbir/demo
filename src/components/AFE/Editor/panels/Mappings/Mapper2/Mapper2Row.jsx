import React, { useCallback } from 'react';
import { Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
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
import { MAPPING_DATA_TYPES, isMapper2HandlebarExpression, getCombinedExtract, getExtractDataType } from '../../../../../../utils/mapping';
import { message } from '../../../../../../utils/messageStore';
import TabRow from './TabbedRow';
import { getMappingsEditorId } from '../../../../../../utils/editor';

const useStyles = makeStyles(theme => ({
  childHeader: {
    flex: 1,
    minWidth: theme.spacing(38),
    maxWidth: theme.spacing(38),
    '&:first-child': {
      marginRight: theme.spacing(1),
    },
    '&>div': {
      width: '100%',
      border: '3px solid transparent',
    },
    '&:nth-of-type(2)': {
      '&>div': {
        border: 'none',
        flexDirection: 'row',
      },
      flex: 1,
      '& .MuiFilledInput-multiline': {
        minHeight: theme.spacing(5),
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      },
    },
  },
  childHeaderLarge: {
    minWidth: theme.spacing(50),
    maxWidth: theme.spacing(50),
  },
  innerRowRoot: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
    '&:hover': {
      '&>div>div:last-child': {
        '&>button:last-child': {
          visibility: 'visible',
        },
      },
    },
  },
  lockIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.hint,
    height: 22,
  },
  lockedIcon: {
    right: theme.spacing(5),
  },
  actionsMapping: {
    display: 'flex',
    alignItems: 'center',
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
  rowActionButton: {
    alignItems: 'baseline',
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

const Mapper2Row = React.memo(props => {
  const {
    nodeKey,
    isTabNode,
    extractsArrayHelper,
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
    sourceDataType,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const { importId, lookup} = useSelector(state => {
    const mapping = selectors.mapping(state);
    const lookup = (lookupName && mapping.lookups?.find(lookup => lookup.name === lookupName)) || {};

    return {
      importId: mapping.importId,
      lookup,
    };
  }, shallowEqual);
  const editorLayout = useSelector(state => selectors.editorLayout(state, getMappingsEditorId(importId)));
  const mapper2Filter = useSelector(selectors.mapper2Filter);

  const isFilterApplied = !isEmpty(mapper2Filter) && !mapper2Filter.includes('all');
  const hasChildren = !!children?.length;

  const handleDeleteClick = useCallback(() => {
    if (!hasChildren) {
      return dispatch(actions.mapping.v2.deleteRow(nodeKey));
    }
    confirmDialog({
      title: 'Confirm delete',
      message: message.MAPPER2.DELETE_ROW_WARNING,
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

  const handleBlur = useCallback((field, value, selectedExtractJsonPath) => {
    dispatch(actions.mapping.v2.patchField(field, nodeKey, value, undefined, selectedExtractJsonPath));
  }, [dispatch, nodeKey]);

  const handleExtractBlur = useCallback((value, jsonPath) => {
    handleBlur('extract', value, jsonPath);
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

  const extractValue = getCombinedExtract(extractsArrayHelper).join(',') || extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  // check if the extract array helper has any node
  // and fetch the data types for the same
  const extractDataTypes = getExtractDataType(extractsArrayHelper);

  // extractDataTypes will be the one which will be passed down hence add source datatype if available
  if (sourceDataType && extractDataTypes.length === 0) {
    extractDataTypes.push(sourceDataType);
  }
  const isLookup = !!lookupName;
  const isStaticLookup = !!(lookup.name && lookup.map);
  const isHardCodedValue = hardCodedValue !== undefined;
  const isHandlebarExp = isMapper2HandlebarExpression(extractValue, hardCodedValue);
  const hideExtractField = dataType === MAPPING_DATA_TYPES.OBJECT && !extractValue && copySource === 'no';

  // this prop is used for object array tab view
  // where some children needs to be hidden
  if (hidden) return null;

  // object array data types will have tabbed row node
  // in case of multiple extracts
  if (isTabNode) {
    return <TabRow {...props} />;
  }

  return (
    <div
      key={nodeKey}
      className={clsx(classes.innerRowRoot, {[classes.noExtractField]: hideExtractField})}>
      <div className={clsx(classes.childHeader, {[classes.childHeaderLarge]: editorLayout === 'compactRow'})}>
        <Mapper2Generates
          key={generate}
          id={`fieldMappingGenerate-${nodeKey}`}
          nodeKey={nodeKey}
          value={generate}
          disabled={isFilterApplied || generateDisabled || isRequired || disabled}
          dataType={dataType}
          onBlur={handleGenerateBlur}
          isRequired={isRequired}
          />
      </div>

      {hideExtractField ? null : (
        <div className={clsx(classes.childHeader, {[classes.childHeaderLarge]: editorLayout === 'compactRow'})}>
          <Mapper2ExtractsTypeableSelect
            key={extractValue}
            id={`fieldMappingExtract-${nodeKey}`}
            nodeKey={nodeKey}
            value={extractValue}
            disabled={isFilterApplied || (isLookup && !isStaticLookup) || disabled}
            dataType={dataType}
            sourceDataType={extractDataTypes}
            onBlur={handleExtractBlur}
            isDynamicLookup={isLookup && !isStaticLookup}
            isHardCodedValue={isHardCodedValue}
            isHandlebarExp={isHandlebarExp}
            editorLayout={editorLayout}
            displaySourceDataType
            />
        </div>
      )}

      <div className={classes.actionsMapping}>
        {isStaticLookup && <RightIcon title="Static lookup" Icon={StaticLookupIcon} />}
        {(isLookup && !isStaticLookup) && <RightIcon title="Dynamic lookup" Icon={DynamicLookupIcon} />}
        {isHandlebarExp && !isLookup && <RightIcon title="Handlebars expression" Icon={HandlebarsExpressionIcon} />}
        {isHardCodedValue && !isLookup && <RightIcon title="Hard-coded" Icon={HardCodedIcon} />}
        <Tooltip
          placement="bottom"
          title={(!generate && !generateDisabled) ? 'Enter destination field to configure settings' : ''}>
          {/* this div needs to be added to render the tooltip correctly when settings is disabled */}
          <div>
            <ActionButton
              data-test={`fieldMappingSettings-${nodeKey}`}
              disabled={isFilterApplied || disabled || !generate}
              aria-label="settings"
              onClick={handleSettingsClick}
              key="settings"
              className={classes.rowActionButton}>
              <SettingsIcon />
            </ActionButton>
          </div>
        </Tooltip>

        <ActionButton
          data-test={`fieldMappingAdd-${nodeKey}`}
          aria-label="add"
          onClick={addNewRowHandler}
          key="add_button"
          disabled={isFilterApplied || generateDisabled || disabled}
          className={classes.rowActionButton}>
          <AddIcon />
        </ActionButton>

        <Tooltip
          placement="bottom"
          title={isRequired ? 'This field is required by the application you are importing into' : ''}>
          {/* this div needs to be added to render the tooltip correctly when delete is disabled */}
          <div>
            <ActionButton
              data-test={`fieldMappingRemove-${nodeKey}`}
              aria-label="delete"
              disabled={isFilterApplied || isEmptyRow || generateDisabled || isRequired || disabled}
              onClick={handleDeleteClick}
              key="delete_button"
              className={classes.deleteMapping}>
              <TrashIcon />
            </ActionButton>
          </div>
        </Tooltip>

      </div>
    </div>
  );
});

export default Mapper2Row;
