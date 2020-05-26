import { useEffect, useState, Fragment, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import SearchCriteriaDialog from '../../../AFE/SearchCriteria/Dialog';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dynaNSSearchCriteriaWrapper: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  dynaNSbtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaFormLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

export default function DynaNSSearchCriteria(props) {
  const classes = useStyles();
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
  const onFetch = useCallback(() => {
    dispatch(actions.metadata.request(connectionId, commMetaPath));
  }, [commMetaPath, connectionId, dispatch]);

  useEffect(() => {
    if (recordType) onFetch();
  }, [onFetch, recordType]);

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
          title="Additional search criteria"
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
      <div className={classes.dynaNSSearchCriteriaWrapper}>
        <FormLabel className={classes.dynaFormLabel}>
          Additional search criteria:
        </FormLabel>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaNSbtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
        {/* TODO (Aditya): we need to add the helptext for the upload file */}

        <FieldHelp {...props} helpText={label} />
      </div>
    </Fragment>
  );
}
