import React, { useMemo, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import AddIcon from '../../../icons/AddIcon';
import EditIcon from '../../../icons/EditIcon';
import ActionButton from '../../../ActionButton';
import ConditionalLookupDrawer from './ConditionalLookup/Drawer';
import actions from '../../../../actions';

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
  const { id, value, resourceId, flowId, disabled, onFieldChange, staticLookupCommMetaPath, extractFields, picklistOptions } = props;
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const lookups = useSelector(state => {
    const {lookups} = selectors.mapping(state);

    return lookups.filter(({_isConditional}) => !!_isConditional);
  }, shallowEqual);
  const lookupMap = useMemo(
    () => lookups.map(l => ({ label: l.name, value: l.name })),
    [lookups]
  );
  const handleAddLookupClick = useCallback(
    () => {
      history.push(`${match.url}/conditionalLookup/add`);
    },
    [history, match.url],
  );
  const handleEditLookupClick = useCallback(
    () => {
      history.push(`${match.url}/conditionalLookup/edit/${value}`);
    },
    [history, match.url, value],
  );
  const handleSave = useCallback(
    (isEdit, val) => {
      if (isEdit) {
        dispatch(actions.mapping.editLookup({oldLookupName: value, newLookup: val}));
      } else {
        dispatch(actions.mapping.addLookup({newLookup: val}));
      }
      onFieldChange(id, val.name);
    },
    [dispatch, id, onFieldChange, value],
  );

  return (
    <>
      <div className={classes.root}>
        <DynaSelect {...props} options={[{ items: lookupMap }]} />
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
        resourceId={resourceId}
        resourceType="imports"
        flowId={flowId}
        onSave={handleSave}
        staticLookupCommMetaPath={staticLookupCommMetaPath}
        extractFields={extractFields}
        picklistOptions={picklistOptions}
      />
    </>
  );
}
