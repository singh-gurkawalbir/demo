import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import {
  convertToReactFormFields,
} from './util';
import ErroredMessageComponent from '../ErroredMessageComponent';
import FieldHelp from '../../FieldHelp';
import * as selectors from '../../../../reducers';


const useStyles = makeStyles(theme => ({
  dynaAssSearchParamsWrapper: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  dynaAssistantbtn: {
    marginRight: theme.spacing(0.5),
  },
  dynaAssistantFormLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));
const ApiParametersModal = props => {
  const {
    apiMethodMetadata,
    onClose,
    id,
    onFieldChange,
    value,
  } = props;
  const fieldMeta = convertToReactFormFields({
    apiMethodMetadata,
    value,
  });

  function onSaveClick(formValues) {
    onFieldChange(id, formValues);
    onClose();
  }

  return (
    <ModalDialog show onClose={onClose}>
      <span>API parameters</span>
      <DynaForm fieldMeta={fieldMeta}>
        <div>
          <DynaSubmit onClick={onSaveClick}>Save</DynaSubmit>
          <Button
            data-test="cancelSearchParams"
            onClick={onClose}
            variant="text"
            color="primary">
            Cancel
          </Button>
        </div>
      </DynaForm>
    </ModalDialog>
  );
};

export default function DynaApiParameters(props) {
  const classes = useStyles();
  const { value, onFieldChange, id, required, apiMethod, _connectionId, ssLinkedConnectionId } = props;
  const [showApiParametersModal, setShowApiParametersModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

  const apiMethodMetadata = useSelector(state => {
    const connection = selectors.suiteScriptResource(state, {
      resourceType: 'connections',
      id: _connectionId,
      ssLinkedConnectionId,
    });

    return connection?.apiMethods?.find(m => m.id === apiMethod);
  }, shallowEqual);


  return (
    <>
      {showApiParametersModal && (
        <ApiParametersModal
          {...props}
          id={id}
          apiMethodMetadata={apiMethodMetadata}
          value={value}
          onFieldChange={onFieldChange}
          onClose={() => {
            setShowApiParametersModal(false);
          }}
        />
      )}
      <div className={classes.dynaAssSearchParamsWrapper}>
        <FormLabel className={classes.dynaAssistantFormLabel}>
          Define API parameters
        </FormLabel>

        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaAssistantbtn}
          onClick={() => setShowApiParametersModal(true)}>
          {'Launch'} {required && !isValid ? '*' : ''}
        </Button>
        <FieldHelp {...props} />
      </div>
      <ErroredMessageComponent
        isValid={isValid}
        description=""
        errorMessages="Please enter required parameters"
      />
    </>
  );
}
