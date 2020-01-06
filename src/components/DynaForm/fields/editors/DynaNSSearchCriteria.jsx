import { useEffect, useState, Fragment, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import SearchCriteriaDialog from '../../../AFE/SearchCriteria/Dialog';

export default function DynaNSSearchCriteria(props) {
  const {
    id,
    onFieldChange,
    value = [],
    label,
    resourceId,
    connectionId,
    disabled,
    filterKey,
    options = {},
  } = props;
  const { recordType, commMetaPath } = options;
  const dispatch = useDispatch();
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const { data: savedSearches } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey,
    })
  );
  const handleFetchResource = useCallback(() => {
    dispatch(actions.metadata.request(connectionId, commMetaPath));
  }, [commMetaPath, connectionId, dispatch]);

  useEffect(() => {
    if (recordType) handleFetchResource();
  }, [handleFetchResource, recordType]);

  const handleClose = (shouldCommit, _value) => {
    if (shouldCommit) {
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
          fieldOptions={{
            fields: savedSearches,
            valueName: 'value',
            labelName: 'label',
          }}
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
