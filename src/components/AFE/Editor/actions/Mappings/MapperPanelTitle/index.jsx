import React, { useCallback } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Help from '../../../../../Help';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import RefreshIcon from '../../../../../icons/RefreshIcon';
import TextButton from '../../../../../Buttons/TextButton';
import CeligoDivider from '../../../../../CeligoDivider';
import ExpandRowsIcon from '../../../../../icons/ExpandRowsIcon';
import CollapseRowsIcon from '../../../../../icons/CollapseRowsIcon';
import ActionGroup from '../../../../../ActionGroup';
import Spinner from '../../../../../Spinner';
import OutputFormatsList from './OutputFormatsList';
import MoreActions from './MoreActions';
import SearchIcon from '../../../../../icons/SearchIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  actions: {
    '& > .MuiButtonBase-root': {
      padding: 0,
    },
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
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const isSearchVisible = useSelector(state => selectors.isSearchVisible(state));
  const {mappingVersion, flowId, importId} = useSelector(state => {
    const mapping = selectors.mapping(state);

    return {
      mappingVersion: mapping.version,
      flowId: mapping.flowId,
      importId: mapping.importId,
    };
  }, shallowEqual);

  const isExtractsLoading = useSelector(state => {
    const extractStatus = selectors.getSampleDataContext(state, {
      flowId,
      resourceId: importId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).status;

    return extractStatus === 'requested';
  });

  const handleRefreshFlowDataClick = useCallback(() => {
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
  }, [dispatch, flowId, importId]);

  const handleToggleRows = useCallback(shouldExpand => {
    dispatch(actions.mapping.v2.toggleRows(shouldExpand));
  }, [dispatch]);

  // to toggle if SearchBar to be shown
  const handleToggleSearch = useCallback(() => {
    dispatch(actions.mapping.v2.toggleSearch());
  }, [dispatch]);

  // return the old title if its not mapper2 view
  if (mappingVersion !== 2) {
    return title;
  }

  return (
    <div className={classes.wrapper}>
      <OutputFormatsList disabled={disabled} />
      {helpKey && (
        <Help
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
      <ActionGroup position="right" className={classes.actions}>

        <TextButton
          data-test="refreshExtracts"
          startIcon={isExtractsLoading ? (
            <Spinner size="small" />
          ) : <RefreshIcon />}
          disabled={disabled}
          onClick={handleRefreshFlowDataClick}
          className={classes.refresh}
          size="small"
          >
          Refresh fields
        </TextButton>
        <CeligoDivider position="right" />

        <Tooltip title="Expand all rows" placement="bottom">
          <IconButton
            size="small"
            date-test="expandAll"
            onClick={() => handleToggleRows(true)}>
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

        {!isSearchVisible && (
        <>
          <CeligoDivider position="right" />
          <IconButton
            size="small"
            date-test="showSearch"
            onClick={handleToggleSearch} >
            <SearchIcon />
          </IconButton>
        </>
        )}

        <MoreActions importId={importId} disabled={disabled} />

      </ActionGroup>
    </div>
  );
}
