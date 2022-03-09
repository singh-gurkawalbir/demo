import React, { useCallback } from 'react';
import { IconButton, Tooltip, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Help from '../../../../Help';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import RefreshIcon from '../../../../icons/RefreshIcon';
import TextButton from '../../../../Buttons/TextButton';
import CeligoDivider from '../../../../CeligoDivider';
import ExpandRowsIcon from '../../../../icons/ExpandRowsIcon';
import CollapseRowsIcon from '../../../../icons/CollapseRowsIcon';
import CeligoSelect from '../../../../CeligoSelect';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import { ROWS_AS_INPUT_OPTIONS, RECORD_AS_INPUT_OPTIONS, getInputOutputFormat } from '../../../../../utils/mapping';
import ActionGroup from '../../../../ActionGroup';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  dropdown: {
    border: 'none',
    fontFamily: 'Roboto400',
    fontSize: 14,
  },
  actions: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  refresh: {
    fontFamily: 'Roboto400',
    fontSize: 14,
  },
}));

export default function MapperPanelTitle({editorId, title, helpKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {mappingVersion, flowId, importId, isGroupedSampleData, isGroupedOutput} = useSelector(state => {
    const mapping = selectors.mapping(state) || {};

    return {
      mappingVersion: mapping.version,
      flowId: mapping.flowId,
      importId: mapping.importId,
      isGroupedSampleData: mapping.isGroupedSampleData,
      isGroupedOutput: mapping.isGroupedOutput,
    };
  }, shallowEqual);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const isExtractsLoading = useSelector(state => {
    const extractStatus = selectors.getSampleDataContext(state, {
      flowId,
      resourceId: importId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).status;

    return extractStatus === 'requested';
  });

  const handleRefreshFlowDataClick = useCallback(
    () => {
      const refreshCache = true;

      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          importId,
          'imports',
          'importMappingExtract',
          refreshCache
        )
      );
    }, [dispatch, flowId, importId]
  );

  const handleToggleRows = useCallback(shouldExpand => {
    dispatch(actions.mapping.v2.toggleRows(shouldExpand));
  }, [dispatch]);

  const changeOutputFormat = useCallback(e => {
    const {value} = e.target;

    dispatch(actions.mapping.v2.toggleOutput(value.endsWith('row') ? 'rows' : 'record'));
  }, [dispatch]);

  // return the old title if its not mapper2 view
  if (mappingVersion !== 2) {
    return title;
  }

  return (
    <div className={classes.wrapper}>
      Destination record structure
      {helpKey && (
        <Help
          title="Destination record structure"
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
      <ActionGroup position="right" className={classes.actions}>
        <CeligoSelect
          className={classes.dropdown}
          displayEmpty
          disabled={disabled}
          IconComponent={ArrowDownIcon}
          value={getInputOutputFormat(isGroupedSampleData, isGroupedOutput)}
          onChange={changeOutputFormat}
          >
          {(isGroupedSampleData ? ROWS_AS_INPUT_OPTIONS : RECORD_AS_INPUT_OPTIONS).map(({label, value}) => (
            <MenuItem
              key={value}
              value={value} >
              {label}
            </MenuItem>
          ))}
        </CeligoSelect>

        <CeligoDivider position="right" />

        <TextButton
          data-test="refreshExtracts"
          startIcon={isExtractsLoading ? (
            <Spinner size="small" />
          ) : <RefreshIcon />}
          disabled={disabled}
          onClick={handleRefreshFlowDataClick}
          className={classes.refresh}
          >
          Refresh fields
        </TextButton>
        <CeligoDivider position="right" />

        <Tooltip title="Expand all rows" placement="bottom">
          <IconButton
            size="small"
            date-test="expandAll"
            onClick={() => handleToggleRows(true)} >
            <ExpandRowsIcon />
          </IconButton>
        </Tooltip >

        <Tooltip title="Collapse all rows" placement="bottom">
          <IconButton
            size="small"
            date-test="collapseAll"
            onClick={() => handleToggleRows(false)} >
            <CollapseRowsIcon />
          </IconButton>
        </Tooltip>
      </ActionGroup>
    </div>
  );
}
