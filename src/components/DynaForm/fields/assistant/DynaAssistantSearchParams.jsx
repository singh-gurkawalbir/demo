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
  const { fields, fieldSets, fieldDetailsMap } = convertToReactFormFields({
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
            fields,
            fieldSets,
          }}>
          <div>
            <Button onClick={onClose} size="small" variant="contained">
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
  const { label, value, onFieldChange, id, paramMeta = {}, required } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

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
        onClick={() => setShowSearchParamsModal(true)}>
        {label || paramMeta.paramLocation === PARAMETER_LOCATION.BODY
          ? 'Configure Body Parameters'
          : 'Configure Search Parameters'}{' '}
        {required && !isValid ? '*' : ''}
      </Button>
      <FormHelperText error={!isValid}>
        {!isValid ? 'Please enter required parameters' : ''}
      </FormHelperText>
    </Fragment>
  );
}
