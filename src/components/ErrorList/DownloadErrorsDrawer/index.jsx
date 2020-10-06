import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router-dom';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import ButtonGroup from '../../ButtonGroup';
import useFormContext from '../../Form/FormContext';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import RightDrawer from '../../drawer/Right';

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
  layout: {
    fields: ['fromDate', 'toDate'],
  },
};

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(1),
    position: 'absolute',
    bottom: 120,
    height: 60,
    width: '90%',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));
const INVALID_DATE = 'Invalid date';
const VALID_ERROR_TYPES = ['open', 'resolved'];

function DownloadErrors({ flowId, resourceId, onClose }) {
  const match = useRouteMatch();
  const {type: errorType} = match.params || {};
  const dispatch = useDispatch();
  const classes = useStyles();
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
    <div>
      <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
      <div className={classes.footer}>
        <ButtonGroup>
          <Button
            variant="outlined"
            color="primary"
            data-test="downloadErrors"
            disabled={!isValidForm}
            onClick={handleDownload}>
            Download
          </Button>
          <Button data-test="cancelDownload" onClick={onClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
export default function DownloadErrorsDrawer({ flowId, resourceId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path="download/:type"
      title="Download errors"
      variant="temporary"
      width="small"
      hideBackButton>
      <DownloadErrors
        flowId={flowId}
        resourceId={resourceId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
