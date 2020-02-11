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

export default function DynaNetSuiteSubRecords(props) {
  const { resourceContext, connectionId, options = {} } = props;
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
          if (importDoc.netsuite_da.mapping.fields) {
            subrecordsFromMappings = subrecordsFromMappings.concat(
              importDoc.netsuite_da.mapping.fields
                .filter(
                  fld => fld.subRecordMapping && fld.subRecordMapping.recordType
                )
                .map(fld => ({
                  fieldId: fld.subRecordMapping._id,
                  recordType: fld.subRecordMapping.recordType,
                  jsonPath: fld.subRecordMapping.jsonPath,
                }))
            );
          }

          if (importDoc.netsuite_da.mapping.lists) {
            importDoc.netsuite_da.mapping.lists.forEach(list => {
              if (list.fields) {
                subrecordsFromMappings = subrecordsFromMappings.concat(
                  list.fields
                    .filter(
                      fld =>
                        fld.subRecordMapping && fld.subRecordMapping.recordType
                    )
                    .map(fld => ({
                      fieldId: fld.subRecordMapping._id,
                      recordType: fld.subRecordMapping.recordType,
                      jsonPath: fld.subRecordMapping.jsonPath,
                    }))
                );
              }
            });
          }
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
  const match = useRouteMatch();
  const handleDeleteClick = useCallback(
    fieldId => {
      console.log(`handleDeleteClick fieldId ${fieldId}`);
      const updatedSubrecords = subrecords.filter(sr => sr.fieldId !== fieldId);

      console.log(
        `handleDeleteClick updatedSubrecords ${JSON.stringify(
          updatedSubrecords
        )}`
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
    [dispatch, resourceId, subrecords]
  );

  return (
    <Fragment>
      <SubRecordDrawer
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
            <span>{sr.fieldId}</span>
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
