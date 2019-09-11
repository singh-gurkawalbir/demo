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
  SEARCH_PARAMETER_TYPES,
} from '../../../../utils/assistant';

const SearchParamsModal = props => {
  const {
    fieldMeta,
    defaultValuesForDeltaExport,
    handleClose,
    id,
    onFieldChange,
    value,
    paramsType,
  } = props;
  const { fields, fieldSets, fieldDetailsMap } = convertToReactFormFields({
    fieldMeta,
    defaultValuesForDeltaExport,
    value,
    paramsType,
  });

  function onSaveClick(formValues) {
    const updatedFormValues = updateFormValues({
      formValues,
      fieldDetailsMap,
      paramsType,
    });

    onFieldChange(id, updatedFormValues);
    handleClose();
  }

  return (
    <ModalDialog show handleClose={handleClose}>
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
            <Button onClick={handleClose} size="small" variant="contained">
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
  const {
    label,
    value,
    onFieldChange,
    id,
    fieldMeta,
    paramsType,
    defaultValuesForDeltaExport,
    required,
  } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

  return (
    <Fragment>
      {showSearchParamsModal && (
        <SearchParamsModal
          id={id}
          fieldMeta={fieldMeta}
          defaultValuesForDeltaExport={defaultValuesForDeltaExport}
          value={value}
          paramsType={paramsType}
          onFieldChange={onFieldChange}
          handleClose={() => {
            setShowSearchParamsModal(false);
          }}
        />
      )}
      <Button
        variant="contained"
        onClick={() => setShowSearchParamsModal(true)}>
        {label || paramsType === SEARCH_PARAMETER_TYPES.BODY
          ? 'Configure Body Parameters'
          : 'Configure Search Parameters'}{' '}
        {required ? '*' : ''}
      </Button>
      <FormHelperText error={!isValid}>
        {!isValid ? 'Please enter required parameters' : ''}
      </FormHelperText>
    </Fragment>
  );
}
