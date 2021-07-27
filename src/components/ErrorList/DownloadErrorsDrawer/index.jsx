import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router-dom';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import FilledButton from '../../Buttons/FilledButton';
import ActionGroup from '../../ActionGroup';
import TextButton from '../../Buttons/TextButton';

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
const VALID_ERROR_TYPES = ['open', 'resolved'];

function DownloadErrors({ flowId, resourceId, onClose }) {
  const match = useRouteMatch();
  const {type: errorType} = match.params || {};
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const formContext = useFormContext(formKey);
  const [isValidForm, setIsValidForm] = useState(true);

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
      dispatch(actions.errorManager.flowErrorDetails.download(
        {
          flowId,
          resourceId,
          isResolved: errorType === 'resolved',
          filters: { fromDate, toDate },
        }
      ));
      onClose();
    },
    [dispatch, flowId, resourceId, errorType, onClose, formContext, enqueueSnackbar],
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
  const history = useHistory();
  const match = useRouteMatch();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path="download/:type"
      variant="temporary"
      width="small"
      hideBackButton>

      <DrawerHeader title="Download errors" />

      <DownloadErrors
       // TODO: @Raghu, this is not ideal..pls take to @Dave for details.
       // It would be best if the error form and buttons were
       // two separate components so that the DrawerContent and DrawerFooter components could
       // be user here directly instead of being children of the DownloadErrors component.
        flowId={flowId}
        resourceId={resourceId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
