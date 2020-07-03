import Button from '@material-ui/core/Button';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles, ButtonGroup } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

import RefreshableTreeComponent from './RefreshableTreeComponent';
import ModalDialog from '../../../../components/ModalDialog';


const useStyles = makeStyles(theme => ({
  refrencedFieldWrapper: {
    flexDirection: 'row !important',
  },
  dynatreeAddBtn: {
    minWidth: 'unset',
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  container: {
    height: '92%',
    overflowY: 'auto'
  },
  btnGroup: {

  },

}));

const emptyObj = {};
export default function SalesforceSubListDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();


  const [selectedValues, setSelectedValues] = useState([]);
  const {relationshipName, sObjectType, ssLinkedConnectionId} = useSelector(state => {
    const abcd = selectors.suiteScriptMappings(state);
    const {sfSubListExtractFieldName, ssLinkedConnectionId, integrationId, flowId} = abcd;
    const {data} = selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId});
    const childRelationshipField = data && data.find(field => field.value === sfSubListExtractFieldName);
    const {relationshipName, childSObject: sObjectType} = childRelationshipField;
    return {relationshipName, sObjectType, ssLinkedConnectionId} || emptyObj;
  }, shallowEqual);

  const handleClose = useCallback(() => {
    dispatch(actions.suiteScript.mapping.setSFSubListFieldName(undefined));
  }, [dispatch]);
  const handleSave = useCallback(() => {
    const extractList = selectedValues.map(val => {
      const index = val.indexOf('.');
      return `${val.substring(0, index)}[*].${val.substring(index + 1)}`;
    });
    dispatch(actions.suiteScript.mapping.patchExtractList(extractList));
  }, [dispatch, selectedValues]);
  return (
    <ModalDialog show onClose={handleClose}>
      <div>Select sub fields</div>
      <div className={classes.container}>
        <RefreshableTreeComponent
          ssLinkedConnectionId={ssLinkedConnectionId}
          connectionId="SALESFORCE_CONNECTION"
          selectedRelationshipName={relationshipName}
          selectedReferenceTo={sObjectType}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      </div>

      <div className={classes.btnGroup}>
        <ButtonGroup>
          <Button
            data-test="addSelected"
            variant="outlined"
            color="primary"
            onClick={handleSave}>
            Add Selected
          </Button>
          <Button data-test="closeReferencedFieldsDialog" onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </ModalDialog>
  );
}
