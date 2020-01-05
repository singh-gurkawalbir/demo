import { useEffect, useState, Fragment, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import SearchCriteriaDialog from '../../../AFE/SearchCriteria/Dialog';

export default function DynaNetsuiteSearchCriteria(props) {
  const {
    id,
    onFieldChange,
    value = {},
    label,
    resourceId,
    connectionId,
    recordType,
    disabled,
    options = {},
  } = props;
  const dispatch = useDispatch();
  const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}/searchFilters?&includeJoinFilters=true`;
  const { disableFetch: disableOptionsLoad } = options;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const {
    // status,
    data: savedSearches,
  } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey: 'webservices-searchFilters',
    })
  );
  // console.log('status', status);
  const handleFetchResource = useCallback(() => {
    dispatch(actions.metadata.request(connectionId, commMetaPath));
  }, [commMetaPath, connectionId, dispatch]);

  useEffect(() => {
    if (!savedSearches && !disableOptionsLoad) handleFetchResource();
  }, [disableOptionsLoad, handleFetchResource, savedSearches]);

  const handleClose = (shouldCommit, _value) => {
    if (shouldCommit) {
      // console.log('_value', _value);
      onFieldChange(id, _value);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <SearchCriteriaDialog
          title="Search Criteria"
          id={`searchCriteria-${id}-${resourceId}`}
          value={value}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <Button
        data-test={id}
        variant="contained"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
