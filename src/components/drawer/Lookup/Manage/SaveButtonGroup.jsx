import React, { useCallback } from 'react';
import shortid from 'shortid';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { emptyObject } from '../../../../utils/constants';
import ActionGroup from '../../../ActionGroup';
import { TextButton } from '../../../Buttons';

export default function SaveButtonGroup({ value, formKey, disabled, onCancel, resourceType, resourceId, parentOnSave }) {
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const isEdit = !!value.name;

  const submitHandler = useCallback(formVal => {
    let lookupObj = {};
    const lookupTmp = {};

    if (isEdit) {
      lookupTmp.name = value.name;
    } else {
      lookupTmp.name = shortid.generate();
    }

    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(resource.adaptorType)) {
      if (formVal._mode === 'dynamic') {
        lookupTmp.recordType = formVal._recordType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
      } else {
        lookupTmp.map = {};
        formVal._mapList?.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else if (resource.adaptorType === 'SalesforceImport') {
      if (formVal._mode === 'dynamic') {
        lookupTmp.whereClause = formVal._whereClause;
        lookupTmp.sObjectType = formVal._sObjectType;
        lookupTmp.resultField = formVal._resultField;
        lookupTmp.expression = formVal._expression;
      } else {
        lookupTmp.map = {};
        formVal._mapList?.forEach(obj => {
          if (obj.import && obj.export) lookupTmp.map[obj.export] = obj.import;
        });
      }

      lookupObj = lookupTmp;
    } else {
      if (formVal._mode === 'static') {
        lookupObj.map = {};
        formVal._mapList?.forEach(obj => {
          lookupObj.map[obj.export] = obj.import;
        });
      } else {
        lookupObj.query = formVal._query;
        lookupObj.method = formVal._method;
        lookupObj.relativeURI = formVal._relativeURI;
        lookupObj.body = formVal._body;
        lookupObj.postBody = formVal._body;
        lookupObj.extract = formVal._extract;
      }

      switch (formVal._failRecord) {
        case 'disallowFailure':
          lookupObj.allowFailures = false;
          delete lookupObj.default;
          break;
        case 'useEmptyString':
          lookupObj.allowFailures = true;
          lookupObj.default = '';
          break;
        case 'useNull':
          lookupObj.allowFailures = true;
          lookupObj.default = null;
          break;
        case 'default':
          lookupObj.allowFailures = true;
          lookupObj.default = formVal._default;
          break;
        default:
      }
    }
    lookupObj.name = formVal._name;

    return lookupObj;
  }, [isEdit, resource.adaptorType, value.name]);

  const handleSubmitAndClose = useCallback(formVal => {
    const lookupObj = submitHandler(formVal);

    parentOnSave(isEdit, lookupObj, true);
  }, [isEdit, parentOnSave, submitHandler]);
  const handleSubmit = useCallback(formVal => {
    const lookupObj = submitHandler(formVal);

    parentOnSave(isEdit, lookupObj);
  }, [isEdit, parentOnSave, submitHandler]);

  return (
    <ActionGroup>
      <DynaSubmit
        formKey={formKey}
        disabled={disabled}
        data-test="saveLookupForm"
        onClick={handleSubmit}>
        Save
      </DynaSubmit>
      <DynaSubmit
        formKey={formKey}
        data-test="saveAndCloseLookupForm"
        color="secondary"
        onClick={handleSubmitAndClose}
        disabled={disabled} >
        Save & close
      </DynaSubmit>
      <TextButton
        data-test="cancelLookupForm"
        onClick={onCancel}>
        Cancel
      </TextButton>
    </ActionGroup>
  );
}

