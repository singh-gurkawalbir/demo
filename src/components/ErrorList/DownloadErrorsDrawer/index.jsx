import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {FilledButton, TextButton} from '@celigo/fuse-ui';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import ActionGroup from '../../ActionGroup';
import { selectors } from '../../../reducers';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import { drawerPaths } from '../../../utils/rightDrawer';

const fieldMeta = {
  fieldMap: {
    fromDate: {
      id: 'fromDate',
      name: 'fromDate',
      type: 'date',
      label: 'From',
      closeOnSelect: true,
      disableFuture: true,
    },
    toDate: {
      id: 'toDate',
      name: 'toDate',
      type: 'date',
      label: 'To',
      closeOnSelect: true,
      disableFuture: true,
    },
  },
};

const INVALID_DATE = 'Invalid date';
const VALID_ERROR_TYPES = ['open', 'resolved'];

function DownloadErrors({ flowId, resourceId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const {type: errorType} = match.params || {};
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const formContext = useFormContext(formKey);
  const [isValidForm, setIsValidForm] = useState(true);
  const {flowJobId, occuredAt, resolvedAt} = useSelector(state => selectors.filter(state, errorType === 'resolved' ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN));

  useEffect(() => {
    const values = formContext.value || {};
    const { fromDate, toDate } = values;

    if (fromDate === INVALID_DATE || toDate === INVALID_DATE) {
      setIsValidForm(false);
    } else {
      setIsValidForm(true);
    }
  }, [formContext.value]);

  const onClose = useCallback(() => history.goBack(), [history]);

  const handleDownload = useCallback(
    () => {
      const { value: formValues = {} } = formContext || {};
      let fromDate = formValues.fromDate && moment(formValues.fromDate).startOf('day').toISOString();
      let toDate = formValues.toDate && moment(formValues.toDate).endOf('day').toISOString();

      // Here flow job id will be presenet only if errors gets opened from child jobs in run history
      if (flowJobId) {
        if (!fromDate) {
          fromDate = errorType === 'resolved' ? resolvedAt.startDate : occuredAt.startDate;
        }
        if (!toDate && errorType !== 'resolved') {
          toDate = occuredAt.endDate;
        }
      }

      if (fromDate && toDate && fromDate > toDate) {
        return enqueueSnackbar({
          message: 'Invalid date range',
          variant: 'error',
        });
      }
      dispatch(actions.errorManager.flowErrorDetails.download(
        {
          flowId,
          resourceId,
          isResolved: errorType === 'resolved',
          filters: { fromDate, toDate, flowJobId },
        }
      ));
      onClose();
    },
    [formContext, flowJobId, dispatch, flowId, resourceId, errorType, onClose, resolvedAt?.startDate, occuredAt?.startDate, occuredAt?.endDate, enqueueSnackbar],
  );

  if (!VALID_ERROR_TYPES.includes(errorType)) {
    onClose();

    return null;
  }

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          <FilledButton
            data-test="downloadErrors"
            disabled={!isValidForm}
            onClick={handleDownload}>
            Download
          </FilledButton>
          <TextButton data-test="cancelDownload" onClick={onClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
    </>
  );
}
export default function DownloadErrorsDrawer({ flowId, resourceId }) {
  return (
    <RightDrawer
      path={drawerPaths.ERROR_MANAGEMENT.V2.DOWNLOAD_ERRORS}
      width="small">
      <DrawerHeader title="Download errors" />
      <DownloadErrors
       // TODO: @Raghu, this is not ideal..pls take to @Dave for details.
       // It would be best if the error form and buttons were
       // two separate components so that the DrawerContent and DrawerFooter components could
       // be user here directly instead of being children of the DownloadErrors component.
        flowId={flowId}
        resourceId={resourceId} />
    </RightDrawer>
  );
}
