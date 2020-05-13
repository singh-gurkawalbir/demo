import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
// import AddIcon from '../../icons/AddIcon';
// import EditIcon from '../../icons/EditIcon';
import DynaSelect from './DynaSelect';
import lookupUtil from '../../../utils/lookup';
import DynaMultiSelect from './DynaMultiSelect';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
  // dynaSelectMultiSelectActions: {
  //   flexDirection: 'row !important',
  //   display: 'flex',
  //   alignItems: 'flex-start',
  //   marginTop: theme.spacing(5),
  // },
  // menuItem: {
  //   maxWidth: '95%',
  //   textOverflow: 'ellipsis',
  //   overflow: 'hidden',
  // },
}));

export default function DynaSelectLookup(props) {
  const {
    // disabled,
    // value,
    resourceId,
    // flowId,
    multiselect,
  } = props;
  const classes = useStyles();
  const resource = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const lookups = lookupUtil.getLookupFromResource(resource);
  const lookupMap = lookups.map(l => ({ label: l.name, value: l.name }));
  // const selectedLookup = lookups.find(l => l.name === value);
  // const handleLookupUpdate = useCallback((isEdit, lookup) => {
  //   if (isEdit) {
  //     // handle Lookup edit
  //   } else {
  //     // handle lookup add
  //   }

  //   console.log('lookup add', lookup);
  // }, []);

  return (
    <div className={classes.root}>
      {multiselect ? (
        <DynaMultiSelect {...props} options={[{ items: lookupMap }]} />
      ) : (
        <DynaSelect {...props} options={[{ items: lookupMap }]} />
      )}
      {/* <div className={classes.dynaSelectMultiSelectActions}>
        <ActionButton
          disabled={disabled}
          data-test="addNewLookup"
          onClick={handleAddLookupClick}>
          <AddIcon />
        </ActionButton>

        <ActionButton
          disabled={disabled || !value}
          data-test="editLookup"
          onClick={handleEditLookupClick}>
          <EditIcon />
        </ActionButton>
      </div> */}
      {/* TODO */}

      {/* {mode === 'edit' && (
        <ManageLookupDialog
          id="edit-lookup"
          label="Edit lookup"
          resourceId={resourceId}
          resourceType="imports"
          flowId={flowId}
          showDynamicLookupOnly
          onSave={handleLookupUpdate}
          value={selectedLookup}
          onCancel={handleCancelLookup}
        />
      )}
      {mode === 'create' && (
        <ManageLookupDialog
          id="add-lookup"
          label="New lookup"
          resourceId={resourceId}
          resourceType="imports"
          flowId={flowId}
          showDynamicLookupOnly
          onSave={handleLookupUpdate}
          onCancel={handleCancelLookup}
        />
      )} */}
    </div>
  );
}
