import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import ActionButton from '../../../ActionButton';
import ConditionalLookupDrawer from './ConditionalLookup/Drawer';
import actions from '../../../../actions';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

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
export default function DynaSelectConditionalLookup(props) {
  const { id, value, importId, flowId, disabled, onFieldChange, staticLookupCommMetaPath, extractFields, picklistOptions } = props;
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const lookupOptions = useSelector(state => {
    const {lookups = []} = selectors.mapping(state);

    const conditionalLookups = lookups.filter(({isConditionalLookup}) => !!isConditionalLookup);

    return [{ items: conditionalLookups.map(l => ({ label: l.name, value: l.name })) }];
  }, isEqual);

  const handleAddLookupClick = useCallback(
    () => {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.CONDITIONAL_LOOKUP.ADD,
        baseUrl: match.url,
      }));
    },
    [history, match.url],
  );
  const handleEditLookupClick = useCallback(
    () => {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.CONDITIONAL_LOOKUP.EDIT,
        baseUrl: match.url,
        params: { lookupName: value },
      }));
    },
    [history, match.url, value],
  );
  const handleSave = useCallback(
    (isEdit, oldValue, newValue) => {
      if (isEdit) {
        dispatch(actions.mapping.updateLookup({oldValue, newValue, isConditionalLookup: true}));
      } else {
        dispatch(actions.mapping.addLookup({value: newValue, isConditionalLookup: true}));
      }
      onFieldChange(id, newValue.name);
    },
    [dispatch, id, onFieldChange],
  );

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
        </div>
      </div>
      <ConditionalLookupDrawer
        disabled={disabled}
        importId={importId}
        flowId={flowId}
        onSave={handleSave}
        staticLookupCommMetaPath={staticLookupCommMetaPath}
        extractFields={extractFields}
        picklistOptions={picklistOptions}
      />
    </>
  );
}
