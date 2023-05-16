import React, { useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import Help from '../../../../../Help';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import RefreshIcon from '../../../../../icons/RefreshIcon';
import CeligoDivider from '../../../../../CeligoDivider';
import ExpandRowsIcon from '../../../../../icons/ExpandRowsIcon';
import CollapseRowsIcon from '../../../../../icons/CollapseRowsIcon';
import ActionGroup from '../../../../../ActionGroup';
import OutputFormatsList from './OutputFormatsList';
import MoreActions from './MoreActions';
import SearchIcon from '../../../../../icons/SearchIcon';
import Mapper2Filter from '../../../panels/Mappings/Mapper2/Mapper2Filter';
import { message } from '../../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    '& > .MuiButtonBase-root': {
      padding: 0,
    },
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function MapperPanelTitle({editorId, title, helpKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const searchKey = useSelector(state => selectors.searchKey(state));
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

  const isFilterApplied = useSelector(state => {
    const mapper2Filter = selectors.mapper2Filter(state);

    return !isEmpty(mapper2Filter) && !mapper2Filter.includes('all');
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
    dispatch(actions.mapping.v2.searchTree(''));
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
          title={title}
          helpKey={helpKey}
          sx={{margin: 0.5}}
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

        <CeligoDivider position="right" />
        <Mapper2Filter />

        {(searchKey === undefined) && (
          <Tooltip title={isFilterApplied ? message.AFE_EDITOR_PANELS_INFO.FILTER_APPLIED : ''} placement="bottom">
            {/* This span is needed to render the tooltip correctly */}
            <span>
              <IconButton
                disabled={isFilterApplied}
                size="small"
                date-test="showSearch"
                onClick={handleToggleSearch} >
                <SearchIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <MoreActions importId={importId} disabled={disabled} />

      </ActionGroup>
    </div>
  );
}
