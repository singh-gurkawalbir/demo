import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { isString } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import FilterPanel from './FilterPanel';
import Spinner from '../../../Spinner';
import { wrapSpecialChars } from '../../../../utils/jsonPaths';
import RefreshIcon from '../../../icons/RefreshIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

/**
 * TODO: Azhar to check and update the button styles
 */
const useStyles = makeStyles(theme => ({
  refreshFilters: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flexDirection: 'row !important',
  },
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    flexDirection: 'row !important',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
  heading: {
    paddingRight: theme.spacing(1),
  },
}));

export default function DynaNetSuiteLookupFilters(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    value,
    connectionId,
    data,
    options = {},
    onFieldChange,
    editorId,
    required,
    disabled,
  } = props;
  const { disableFetch, commMetaPath } = options;
  let rule = [];

  if (isString(value)) {
    try {
      rule = JSON.parse(value);
    } catch (ex) {
      // nothing
    }
  } else {
    rule = value;
  }

  const modifiedData = Array.isArray(data) ? data.map(wrapSpecialChars) : data;
  const handleEditorInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'netsuiteLookupFilter', {
        modifiedData,
        _init_rule: rule,
        rule,
      })
    );
  }, [dispatch, editorId, modifiedData, rule]);

  useEffect(() => {
    if (editorId) {
      handleEditorInit();
    }
    /**
     * TODO: fix dependencies
     * If we add editorId and handleEditorInit as dependencies this is causing re-render infinitely.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath)?.data;

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

  const handleRefreshFiltersClick = useCallback(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(
        actions.metadata.request(connectionId, commMetaPath, {
          refreshCache: true,
        })
      );
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

  if (!filters) {
    return (

      <Spinner centerAll />

    );
  }

  return (
    <>
      <div className={classes.refreshFilters}>
        <FormLabel disabled={disabled} required={required} >
          Refresh  search filters
        </FormLabel>
        <Button
          data-test="refreshLookupFilters"
          className={classes.refreshFiltersButton}
          variant="text"
          color="primary"
          onClick={handleRefreshFiltersClick}>
          <RefreshIcon />
        </Button>
      </div>
      <FilterPanel
        id={id}
        editorId={editorId}
        rule={rule}
        data={modifiedData}
        filters={filters}
        onFieldChange={onFieldChange}
      />
    </>
  );
}
