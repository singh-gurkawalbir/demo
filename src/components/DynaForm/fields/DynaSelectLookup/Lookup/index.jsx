import React, { useCallback, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ManageLookup from '../../../../drawer/Lookup/Manage';
import { LOOKUP_FORM_KEY } from '../../../../../constants';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../../drawer/Right/DrawerFooter';
import SaveButtonGroup from '../../../../drawer/Lookup/Manage/SaveButtonGroup';

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
  const [remountCount, setRemountCount] = useState(0);
  const value = (lookups || []).find(({ name}) => name === lookupName);

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSave = useCallback((id, val) => {
    setRemountCount(remountCount => remountCount + 1);
    onSave(isEdit, val);
  }, [isEdit, onSave]);

  if (isEdit && !value?.name) {
    return null;
  }

  return (
    <>
      <DrawerContent>
        <ManageLookup
          className={classes.wrapper}
          value={value}
          onCancel={handleClose}
          disabled={disabled}
          resourceId={importId}
          resourceType="imports"
          flowId={flowId}
          {...props}
          showDynamicLookupOnly
          formKey={LOOKUP_FORM_KEY}
          remountCount={remountCount}
      />
      </DrawerContent>
      <DrawerFooter>
        <SaveButtonGroup
          parentOnSave={handleSave}
          value={value}
          onCancel={handleClose}
          disabled={disabled}
          resourceId={importId}
          resourceType="imports"
          formKey={LOOKUP_FORM_KEY}
      />
      </DrawerFooter>
    </>
  );
}
