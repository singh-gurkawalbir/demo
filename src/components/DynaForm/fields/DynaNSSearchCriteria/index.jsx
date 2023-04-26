import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import SearchCriteriaDialog from './SearchCriteria/Dialog';
import FieldHelp from '../../FieldHelp';
import { OutlinedButton } from '../../../Buttons';

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
          connectionId={connectionId}
          commMetaPath={commMetaPath}
          filterKey={filterKey}
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
        <OutlinedButton
          data-test={id}
          color="secondary"
          className={classes.dynaNSbtn}
          onClick={handleEditorClick}>
          Launch
        </OutlinedButton>
      </div>
    </>
  );
}
