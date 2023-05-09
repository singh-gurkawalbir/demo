import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import DynaForm from '../../..';
import actions from '../../../../../actions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import DynaSubmit from '../../../DynaSubmit';
import getFormFieldMetadata from './util';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../../drawer/Right/DrawerFooter';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import ActionGroup from '../../../../ActionGroup';
import customCloneDeep from '../../../../../utils/customCloneDeep';

function SubRecordDrawer(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { fieldId } = match.params;
  const { resourceContext, flowId, connectionId, recordType } = props;
  const recordTypeObj = useSelector(state =>
    selectors
      .metadataOptionsAndResources(state, {
        connectionId,
        commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes`,
        filterKey: 'suitescript-recordTypes',
      })
      .data.find(record => record.value === recordType)
  );
  const recordTypeLabel = recordTypeObj && recordTypeObj.label;
  const subrecordFields =
    recordTypeObj &&
    recordTypeObj.subRecordConfig &&
    recordTypeObj.subRecordConfig.map(f => ({
      ...f,
      value: f.id,
      label: f.name,
      subRecordJsonPathLabel:
        f.subRecordJsonPathLabel || 'Path to node that contains items data',
    }));
  const subrecords = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceContext.resourceId
  // eslint-disable-next-line camelcase
  )?.merged?.netsuite_da?.subrecords;
  const fieldMeta = getFormFieldMetadata(
    recordTypeLabel,
    subrecords,
    subrecordFields,
    fieldId,
    flowId,
    resourceContext.resourceId
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSubmit = useCallback(
    formValues => {
      const jsonPathFieldId = `jsonPath_${formValues.fieldId.replace(
        '[*].',
        '_sublist_'
      )}`;
      const updatedFormValues = {
        fieldId: `${formValues.fieldId}`,
        jsonPath: formValues[jsonPathFieldId],
      };
      const recordType = subrecordFields.find(
        fld => fld.value === formValues.fieldId
      ).subRecordType;

      updatedFormValues.recordType = recordType;

      const updatedSubrecords = customCloneDeep(subrecords || []);

      if (fieldId) {
        const srIndex = updatedSubrecords.findIndex(
          sr => sr.fieldId === fieldId
        );

        if (srIndex > -1) {
          updatedSubrecords[srIndex] = { ...updatedFormValues, fieldId };
        }
      } else {
        updatedSubrecords.push(updatedFormValues);
      }

      dispatch(
        actions.resource.patchStaged(
          resourceContext.resourceId,
          [
            {
              op: 'replace',
              path: '/netsuite_da/subrecords',
              value: updatedSubrecords,
            },
          ],
        )
      );
      history.goBack();

      // onSubmit(updatedFormValues);
    },
    [
      dispatch,
      fieldId,
      history,
      resourceContext.resourceId,
      subrecordFields,
      subrecords,
    ]
  );
  const formKey = useFormInitWithPermissions({
    fieldMeta,
  });

  return (
    <>
      <DrawerHeader title={fieldId ? 'Edit subrecord import' : 'Add subrecord import'} />
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ActionGroup>
          <DynaSubmit
            formKey={formKey}
            data-test="save-subrecord"
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <TextButton
            data-test="cancel-subrecord"
            onClick={handleClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}

export default function SubRecordDrawerRoute(props) {
  return (
    <RightDrawer path={[drawerPaths.NS_SUB_RECORD.EDIT, drawerPaths.NS_SUB_RECORD.ADD]} height="tall">
      <SubRecordDrawer {...props} />
    </RightDrawer>
  );
}
