import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { isEmpty } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import {
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
} from '../../../../utils/assistant';

const SearchParamsModal = props => {
  const { paramMeta, onClose, id, onFieldChange, value } = props;
  const { fieldMap, layout, fieldDetailsMap } = convertToReactFormFields({
    paramMeta,
    value,
  });

  function onSaveClick(formValues) {
    const updatedValues = updateFormValues({
      formValues,
      fieldDetailsMap,
      paramLocation: paramMeta.paramLocation,
    });

    onFieldChange(id, updatedValues);
    onClose();
  }

  return (
    <ModalDialog show onClose={onClose}>
      <Fragment>
        <span>Search Parameters</span>
      </Fragment>
      <Fragment>
        <DynaForm
          fieldMeta={{
            fieldMap,
            layout,
          }}>
          <div>
            <Button
              onClick={onClose}
              size="small"
              variant="contained"
              color="secondary">
              Cancel
            </Button>
            <DynaSubmit onClick={onSaveClick}>Save</DynaSubmit>
          </div>
        </DynaForm>
      </Fragment>
    </ModalDialog>
  );
};

export default function DynaAssistantSearchParams(props) {
  let { label } = props;
  const { value, onFieldChange, id, paramMeta = {}, required } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

  if (!label) {
    label =
      paramMeta.paramLocation === PARAMETER_LOCATION.BODY
        ? 'Configure Body Parameters'
        : 'Configure Search Parameters';
  }

  return (
    <Fragment>
      {showSearchParamsModal && (
        <SearchParamsModal
          id={id}
          paramMeta={paramMeta}
          value={value}
          onFieldChange={onFieldChange}
          onClose={() => {
            setShowSearchParamsModal(false);
          }}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowSearchParamsModal(true)}>
        {label} {required && !isValid ? '*' : ''}
      </Button>

      {!isValid && (
        <FormHelperText error={!isValid}>
          {!isValid ? 'Please enter required parameters' : ''}
        </FormHelperText>
      )}
    </Fragment>
  );
}
