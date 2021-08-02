import { deepClone } from 'fast-json-patch/lib/core';
import { IconButton } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DynaSelect from '../DynaSelect';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import ActionButton from '../../../ActionButton';
import LookupDrawer from './Lookup/Drawer';
import ManageLookupDrawer from '../../../drawer/Lookup';
import lookupUtil from '../../../../utils/lookup';
import useFormContext from '../../../Form/FormContext';
import EllipsisIcon from '../../../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  actions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(4),
  },

}));
export default function DynaSelectLookup(props) {
  const { id, value, importId, flowId, disabled, onFieldChange, adaptorType, formKey} = props;
  const formContext = useFormContext(formKey);

  const lookups = lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const lookupOptions = useMemo(() => [{ items: lookups.map(l => ({ label: l.name, value: l.name })) }], [lookups]);

  const handleAddLookupClick = useCallback(
    () => {
      history.push(`${match.url}/lookups/add`);
    },
    [history, match.url],
  );
  const handleEditLookupClick = useCallback(
    () => {
      history.push(`${match.url}/lookups/edit/${value}`);
    },
    [history, match.url, value],
  );
  const handleSave = useCallback(
    (isEdit, newValue) => {
      if (isEdit) {
        const lookupIndex = lookups.findIndex(item => item.name === value);

        if (lookupIndex === -1) {
          return;
        }

        const modifiedLookups = [...lookups];

        modifiedLookups.splice(lookupIndex, 1);
        modifiedLookups.splice(lookupIndex, 0, newValue);
        const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

        onFieldChange(lookupFieldId, modifiedLookups);
      } else {
        const modifiedLookup = deepClone(lookups);

        modifiedLookup.push(newValue);
        const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

        onFieldChange(lookupFieldId, modifiedLookup);
      }
      onFieldChange(id, newValue.name);
    },
    [adaptorType, id, lookups, onFieldChange, value],
  );
  const handleManageLookupsSave = useCallback(
    lookups => {
      const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

      onFieldChange(lookupFieldId, lookups);
    },
    [adaptorType, onFieldChange],
  );
  const handleMoreClick = useCallback(() => {
    history.push(`${match.url}/lookup`);
  }, [history, match.url]);

  return (
    <>
      <div className={classes.root}>
        <DynaSelect {...props} options={lookupOptions} />
        <div className={classes.actions} >
          <ActionButton
            data-test="addNewConditionalLookup"
            onClick={handleAddLookupClick}>
            <AddIcon />
          </ActionButton>
          <ActionButton
            data-test="addEditConditionalLookup"
            disabled={!value}
            onClick={handleEditLookupClick}>
            <EditIcon />
          </ActionButton>
          <IconButton
            data-test="openActionsMenu"
            aria-label="more"
            aria-haspopup="true"
            size="small"
            onClick={handleMoreClick}>
            <EllipsisIcon />
          </IconButton>
        </div>
      </div>

      <ManageLookupDrawer
        disabled={disabled}
        id={id}
        lookups={lookups}
        resourceId={importId}
        resourceType="imports"
        flowId={flowId}
        onSave={handleManageLookupsSave} />

      <LookupDrawer
        disabled={disabled}
        importId={importId}
        flowId={flowId}
        onSave={handleSave}
        lookups={lookups}
      />
    </>
  );
}
