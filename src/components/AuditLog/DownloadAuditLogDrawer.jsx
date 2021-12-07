import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import DynaForm from '../DynaForm';
import useFormContext from '../Form/FormContext';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import {OutlinedButton, TextButton} from '../Buttons';
import ActionGroup from '../ActionGroup';
import actions from '../../actions';

const fieldMeta = {
  fieldMap: {
    fromDate: {
      id: 'fromDate',
      name: 'fromDate',
      type: 'date',
      label: 'From',
      closeOnSelect: true,
    },
    toDate: {
      id: 'toDate',
      name: 'toDate',
      type: 'date',
      label: 'To',
      closeOnSelect: true,
    },
  },
};

const INVALID_DATE = 'Invalid date';

function DownloadAuditLogs({ onClose, resourceType, resourceId, childId }) {
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const formContext = useFormContext(formKey);
  const [isValidForm, setIsValidForm] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const values = formContext.value || {};
    const { fromDate, toDate } = values;

    if (fromDate === INVALID_DATE || toDate === INVALID_DATE) {
      setIsValidForm(false);
    } else {
      setIsValidForm(true);
    }
  }, [formContext.value]);

  const handleDownload = useCallback(
    () => {
      const { value: formValues = {} } = formContext || {};
      const fromDate = formValues.fromDate && moment(formValues.fromDate).startOf('day').toISOString();
      const toDate = formValues.toDate && moment(formValues.toDate).endOf('day').toISOString();

      if (fromDate && toDate && fromDate > toDate) {
        return enqueueSnackbar({
          message: 'Invalid date range',
          variant: 'error',
        });
      }
      dispatch(actions.auditLogs.download(
        {
          resourceType,
          resourceId,
          childId,
          filters: { fromDate, toDate },
        }
      ));
      onClose();
    },
    [formContext, dispatch, resourceType, resourceId, childId, onClose, enqueueSnackbar],
  );

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          <OutlinedButton
            data-test="downloadErrors"
            disabled={!isValidForm}
            onClick={handleDownload}>
            Download
          </OutlinedButton>
          <TextButton data-test="cancelDownload" onClick={onClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}
export default function DownloadAuditLogDrawer({ resourceType, resourceId, childId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path="download"
      variant="temporary"
      width="small"
      hideBackButton>

      <DrawerHeader title="Download audit logs" />

      <DownloadAuditLogs
        resourceType={resourceType}
        childId={childId}
        resourceId={resourceId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
