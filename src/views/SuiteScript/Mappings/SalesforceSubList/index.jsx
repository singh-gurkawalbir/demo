
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { FilledButton, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshableTreeComponent from './RefreshableTreeComponent';
import ModalDialog from '../../../../components/ModalDialog';
import ActionGroup from '../../../../components/ActionGroup';

const useStyles = makeStyles(theme => ({
  refrencedFieldWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dynatreeAddBtn: {
    minWidth: 'unset',
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  container: {
    height: '92%',
  },
  btnGroup: {

  },

}));

const emptyObj = {};

export default function SalesforceSubListDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedValues, setSelectedValues] = useState([]);
  const salesforceConnectionId = useSelector(state => {
    const {
      ssLinkedConnectionId, integrationId, flowId,
    } = selectors.suiteScriptMapping(state);
    const flow = selectors.suiteScriptFlowDetail(state,
      {
        integrationId,
        ssLinkedConnectionId,
        flowId,
      });

    if (flow?.import?.type === 'salesforce') {
      return flow.import._connectionId;
    }
    if (flow?.export?.type === 'salesforce') {
      return flow.export._connectionId;
    }
  });

  const {relationshipName, sObjectType, ssLinkedConnectionId, relationshipType} = useSelector(state => {
    const abcd = selectors.suiteScriptMapping(state);
    const {sfSubListExtractFieldName, ssLinkedConnectionId, integrationId, flowId} = abcd;
    const {data} = selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId});
    const childRelationshipField = data && data.find(field => field.value === sfSubListExtractFieldName);
    const {relationshipName, childSObject: sObjectType, type: relationshipType} = childRelationshipField;

    return {relationshipName, sObjectType, ssLinkedConnectionId, relationshipType} || emptyObj;
  }, shallowEqual);

  const handleClose = useCallback(() => {
    dispatch(actions.suiteScript.mapping.setSFSubListFieldName(undefined));
  }, [dispatch]);
  const handleSave = useCallback(() => {
    const extractList = selectedValues.map(val => {
      if (relationshipType === 'childFieldRelationship') {
        return val;
      }
      const index = val.indexOf('.');

      return `${val.substring(0, index)}[*].${val.substring(index + 1)}`;
    });

    dispatch(actions.suiteScript.mapping.patchExtractList(extractList));
  }, [dispatch, relationshipType, selectedValues]);

  return (
    <ModalDialog show onClose={handleClose}>
      <div>Select sub fields</div>
      <div className={classes.container}>
        <RefreshableTreeComponent
          ssLinkedConnectionId={ssLinkedConnectionId}
          connectionId={salesforceConnectionId}
          selectedRelationshipName={relationshipName}
          selectedReferenceTo={sObjectType}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      </div>

      <div className={classes.btnGroup}>
        <ActionGroup>
          <FilledButton
            data-test="addSelected"
            onClick={handleSave}>
            Add Selected
          </FilledButton>
          <TextButton
            data-test="closeReferencedFieldsDialog"
            onClick={handleClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </div>
    </ModalDialog>
  );
}
