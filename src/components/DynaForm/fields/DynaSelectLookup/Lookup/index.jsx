import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ManageLookup from '../../../../Lookup/Manage';
import EditorDrawer from '../../../../AFE/Drawer';

const useStyles = makeStyles({
  wrapper: {
    height: '100%',
    '& > div:first-child': {
      height: 'calc(100% - 62px)',
      padding: 0,
    },
  },
});

export default function Lookup({onSave, disabled, importId, flowId, lookups, ...props}) {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/lookups/edit');
  const {lookupName} = match.params;
  const value = (lookups || []).find(({ name}) => name === lookupName);

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
    <>
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
        showDynamicLookupOnly
      />
      <EditorDrawer />
    </>
  );
}
