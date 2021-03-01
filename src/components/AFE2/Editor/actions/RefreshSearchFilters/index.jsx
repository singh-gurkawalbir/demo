import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import Spinner from '../../../../Spinner';
import RefreshIcon from '../../../../icons/RefreshIcon';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import SpinnerWrapper from '../../../../SpinnerWrapper';

const useStyles = makeStyles(theme => ({
  refreshFiltersButton: {
    minWidth: 0,
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function RefreshSearchFilters({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {resourceType, formKey, resourceId, fieldId} = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return {resourceType: e.resourceType,
      formKey: e.formKey,
      resourceId: e.resourceId,
      flowId: e.flowId,
      fieldId: e.fieldId};
  }, shallowEqual);

  const connectionId = useSelector(state => {
    const { merged: resourceData} = selectors.resourceData(state, resourceType, resourceId);

    return resourceData?._connectionId;
  });

  const fieldState = useSelector(state => selectors.fieldState(state, formKey, fieldId));
  const {required, options = {}} = fieldState || {};

  const { disableFetch, commMetaPath } = options;

  const filters = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath)?.data;

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);
  useEffect(() => {
    if (filters) {
      dispatch(actions._editor.patchFeatures(editorId, { filters }));
    }
  }, [dispatch, editorId, filters]);

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
      <SpinnerWrapper>
        <Spinner color="primary" />
      </SpinnerWrapper>
    );
  }

  return (
    <>
      <div>
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
    </>
  );
}
