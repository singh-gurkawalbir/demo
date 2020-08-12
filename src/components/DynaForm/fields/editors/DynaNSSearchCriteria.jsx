import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import SearchCriteriaDialog from '../../../AFE/SearchCriteria/Dialog';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles({
  dynaNSSearchCriteriaWrapper: {
    width: '100%',
  },
  dynaNSbtn: {
    maxWidth: 100,
  },
  dynaFormLabel: {
    marginBottom: 0,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
  dynaNsSearchLabelWrapper: {
    display: 'flex',
  },
});

export default function DynaNSSearchCriteria(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    value = [],
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

  const { data: savedSearches, status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey);

  const onFetch = useCallback(shouldRefreshCache => {
    dispatch(actions.metadata.request(connectionId, commMetaPath, { refreshCache: shouldRefreshCache }));
  }, [commMetaPath, connectionId, dispatch]);

  useEffect(() => {
    if (recordType) onFetch();
  }, [onFetch, recordType]);

  const handleSave = (shouldCommit, _value) => {
    if (shouldCommit) {
      onFieldChange(id, _value);
    }
  };

  return (
    <>
      {showEditor && (
        <SearchCriteriaDialog
          title="Additional search criteria"
          id={`searchCriteria-${id}-${resourceId}`}
          value={value}
          fieldOptions={{
            fields: savedSearches,
            status,
            valueName: 'value',
            labelName: 'label',
          }}
          onSave={handleSave}
          onRefresh={onFetch}
          onClose={handleEditorClick}
          disabled={disabled}
        />
      )}
      <div className={classes.dynaNSSearchCriteriaWrapper}>
        <div className={classes.dynaNsSearchLabelWrapper}>
          <FormLabel className={classes.dynaFormLabel}>
            Additional search criteria
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaNSbtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
    </>
  );
}
