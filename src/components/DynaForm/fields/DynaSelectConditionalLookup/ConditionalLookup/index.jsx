import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../../../reducers';
import ManageLookup from '../../../../Lookup/Manage';

const useStyles = makeStyles({
  wrapper: {
    height: '100%',
    '& > div:first-child': {
      height: 'calc(100% - 62px)',
      padding: 0,
    },
  },
});

const emptySet = {};
export default function ConditionalLookup({onSave, disabled, importId, flowId, ...props}) {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');
  const {lookupName} = match.params;
  const value = useSelector(state => {
    if (!lookupName) {
      return emptySet;
    }
    const {lookups = []} = selectors.mapping(state);

    const val = lookups.find(({isConditionalLookup, name}) => isConditionalLookup && name === lookupName);

    return val || emptySet;
  }, shallowEqual);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSave = useCallback((id, val) => {
    onSave(isEdit, val);
    handleClose();
  }, [handleClose, isEdit, onSave]);

  if (isEdit && !value?.name) {
    return null;
  }

  return (
    <ManageLookup
      className={classes.wrapper}
      onSave={handleSave}
      value={value}
      onCancel={handleClose}
      disabled={disabled}
      resourceId={importId}
      resourceType="imports"
      flowId={flowId}
      {...props}
      />
  );
}
