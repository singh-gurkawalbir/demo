import { Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import * as selectors from '../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/TrashIcon';
import ActionButton from '../../../../components/ActionButton';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import {
  getNetSuiteSubrecordLabel,
  getNetSuiteSubrecordImports,
} from '../../../../utils/resource';

export default function DynaNetSuiteSubRecords(props) {
  const {
    resourceContext,
    connectionId,
    options = {},
    onFieldChange,
    id,
    defaultValue,
    value,
    flowId,
  } = props;
  const { resourceId } = resourceContext;
  const { recordType } = options;
  const { subrecords, subrecordsFromMappings, hasNetsuiteDa } = useSelector(
    state => {
      const { merged: importDoc } = selectors.resourceData(
        state,
        'imports',
        resourceId
      );
      let subrecords;
      let subrecordsFromMappings = [];
      let hasNetsuiteDa = false;

      if (importDoc && importDoc.netsuite_da) {
        hasNetsuiteDa = true;
        ({ subrecords } = importDoc.netsuite_da);

        if (!subrecords && importDoc.netsuite_da.mapping) {
          subrecordsFromMappings = getNetSuiteSubrecordImports(importDoc);
        }
      }

      return { hasNetsuiteDa, subrecords, subrecordsFromMappings };
    },
    (left, right) => {
      left &&
        right &&
        (left.subrecords === right.subrecords ||
          (left.subrecords &&
            right.subrecords &&
            left.subrecords.length === right.subrecords.length));
    }
  );
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (!subrecords && subrecordsFromMappings) {
      const patchSet = [];

      if (!hasNetsuiteDa) {
        patchSet.push({
          op: 'add',
          path: `/netsuite_da`,
          value: {},
        });
      }

      patchSet.push({
        op: 'add',
        path: `/netsuite_da/subrecords`,
        value: subrecordsFromMappings,
      });

      dispatch(
        actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE)
      );
    }
  }, [dispatch, hasNetsuiteDa, resourceId, subrecords, subrecordsFromMappings]);

  useEffect(() => {
    if (subrecords && JSON.stringify(subrecords) !== JSON.stringify(value)) {
      onFieldChange(id, subrecords);
    }
  }, [defaultValue, id, onFieldChange, subrecords, value]);
  const match = useRouteMatch();
  const handleDeleteClick = useCallback(
    fieldId => {
      confirmDialog({
        title: 'Confirm',
        message: 'Are you sure you want to remove this subrecord import?',
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              const updatedSubrecords = subrecords.filter(
                sr => sr.fieldId !== fieldId
              );

              dispatch(
                actions.resource.patchStaged(
                  resourceId,
                  [
                    {
                      op: 'replace',
                      path: `/netsuite_da/subrecords`,
                      value: updatedSubrecords,
                    },
                  ],
                  SCOPES.VALUE
                )
              );
            },
          },
        ],
      });
    },
    [confirmDialog, dispatch, resourceId, subrecords]
  );

  return (
    <Fragment>
      <SubRecordDrawer
        resourceContext={resourceContext}
        flowId={flowId}
        importId={resourceId}
        connectionId={connectionId}
        recordType={recordType}
      />
      Subrecord imports{' '}
      <Link to={`${match.url}/subrecords`}>Add subrecord</Link>
      <br />
      {subrecords &&
        subrecords.map(sr => (
          <div key={sr.fieldId}>
            <span>{getNetSuiteSubrecordLabel(sr.fieldId, sr.recordType)}</span>
            <ActionButton
              fontSize="small"
              data-test="edit-subrecord"
              component={Link}
              to={`${match.url}/subrecords/${sr.fieldId}`}>
              <EditIcon />
            </ActionButton>
            <ActionButton
              fontSize="small"
              data-test="delete-subrecord"
              onClick={() => handleDeleteClick(sr.fieldId)}>
              <DeleteIcon />
            </ActionButton>
          </div>
        ))}
    </Fragment>
  );
}
