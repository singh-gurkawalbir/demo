import { deepClone } from 'fast-json-patch/lib/core';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import DynaSelect from '../DynaSelect';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import ActionButton from '../../../ActionButton';
import LookupDrawer from './Lookup/Drawer';
import ManageLookupDrawer from '../../../drawer/Lookup';
import lookupUtil from '../../../../utils/lookup';
import useFormContext from '../../../Form/FormContext';
import EllipsisActionMenu from '../../../EllipsisActionMenu';
import ActionGroup from '../../../ActionGroup';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  actions: {
    marginTop: theme.spacing(4),
  },

}));

const actionsMenu = [
  {
    action: 'managelokups',
    label: 'Manage lookups',
  }];

export default function DynaSelectLookup(props) {
  const { id, value, importId, flowId, disabled, onFieldChange, adaptorType, formKey} = props;
  const formContext = useFormContext(formKey);

  const lookups = lookupUtil.getLookupFromFormContext(formContext, adaptorType);
  const dynamicLookups = lookups.filter(lookup => !lookup.map);
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const lookupOptions = useMemo(() => [{ items: dynamicLookups.map(l => ({ label: l.name, value: l.name })) }], [dynamicLookups]);

  const handleAddLookupClick = useCallback(
    () => {
      history.push(buildDrawerUrl({ path: drawerPaths.LOOKUPS.ADD, baseUrl: match.url }));
    },
    [history, match.url],
  );
  const handleEditLookupClick = useCallback(
    () => {
      history.push(buildDrawerUrl({
        path: drawerPaths.LOOKUPS.EDIT,
        baseUrl: match.url,
        params: { lookupName: value },
      }));
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
      history.replace(buildDrawerUrl({
        path: drawerPaths.LOOKUPS.EDIT,
        baseUrl: match.url,
        params: { lookupName: newValue.name },
      }));
    },
    [adaptorType, history, id, lookups, match.url, onFieldChange, value],
  );
  const handleManageLookupsSave = useCallback(
    lookups => {
      const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

      onFieldChange(lookupFieldId, lookups);
    },
    [adaptorType, onFieldChange],
  );
  const handleManageLookupsClick = useCallback(() => {
    history.push(buildDrawerUrl({ path: drawerPaths.LOOKUP.ROOT, baseUrl: match.url }));
  }, [history, match.url]);

  return (
    <>
      <div className={classes.root}>
        <DynaSelect {...props} options={lookupOptions} />
        <ActionGroup className={classes.actions}>
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
          <EllipsisActionMenu actionsMenu={actionsMenu} onAction={handleManageLookupsClick} />
        </ActionGroup>
      </div>
      <ManageLookupDrawer
        disabled={disabled}
        id={id}
        lookups={lookups}
        resourceId={importId}
        resourceType="imports"
        flowId={flowId}
        hideBackButton={false}
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
