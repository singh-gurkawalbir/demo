import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import moment from 'moment';
import ModalDialog from '../../../../ModalDialog';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../DynaForm';
import ButtonGroup from '../../../../ButtonGroup';
import useFormContext from '../../../../Form/FormContext';

const fieldMeta = {
  fieldMap: {
    fromDate: {
      id: 'fromDate',
      name: 'fromDate',
      type: 'date',
      label: 'From',
      closeOnSelect: true,
      validWhen: { isNot: { values: ['Invalid date'], message: '' } },
    },
    toDate: {
      id: 'toDate',
      name: 'toDate',
      type: 'date',
      label: 'To',
      closeOnSelect: true,
      validWhen: { isNot: { values: ['Invalid date'] } },
    },
  },
  layout: {
    fields: ['fromDate', 'toDate'],
  },
};

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(1),
  },
}));

export default function DownloadErrorsModal({flowId, resourceId, onClose, isResolved}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const formKey = useFormInitWithPermissions({ fieldMeta });
  const formContext = useFormContext(formKey);

  const handleDownload = useCallback(
    () => {
      const { value: formValues = {} } = formContext || {};
      const fromDate = formValues.fromDate && moment(formValues.fromDate).toISOString();
      const toDate = formValues.toDate && moment(formValues.toDate).toISOString();

      dispatch(actions.errorManager.flowErrorDetails.download({flowId, resourceId, isResolved, filters: { fromDate, toDate } }));
      onClose();
    },
    [dispatch, flowId, resourceId, isResolved, onClose, formContext],
  );

  return (
    <ModalDialog show onClose={onClose}>
      <div> Download errors </div>
      <div>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <div className={classes.footer}>
          <ButtonGroup>
            <Button
              variant="outlined"
              color="primary"
              data-test="downloadErrors"
              disabled={!formContext.isValid}
              onClick={handleDownload}>
              Download
            </Button>
            <Button data-test="cancelDownload" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </ModalDialog>
  );
}
