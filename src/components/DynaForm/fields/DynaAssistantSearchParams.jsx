import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { isObject, isArray } from 'lodash';
import ModalDialog from '../../ModalDialog';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';

const getParamValue = (data, value = {}, paramsType) => {
  let dataIn = data;

  if (!isObject(dataIn)) {
    dataIn = {
      id: dataIn,
    };
  }

  let toReturn;

  if (value) {
    if (Object.prototype.hasOwnProperty.call(value, dataIn.id)) {
      toReturn = value[dataIn.id];

      if (paramsType === 'body') {
        if (dataIn.fieldType === 'select' && isArray(toReturn)) {
          [toReturn] = toReturn;
        }
      }

      if (
        paramsType === 'query' &&
        dataIn.fieldType === 'multiselect' &&
        isArray(toReturn)
      ) {
        // wrap item inside array as multiselect expects item by default an array @BugFix : 8896
        toReturn = [toReturn];
      }

      return toReturn;
    }

    if (paramsType === 'query') {
      if (dataIn.id.indexOf('[') > 0) {
        const prefix = dataIn.id.substr(0, dataIn.id.indexOf('['));

        if (Object.prototype.hasOwnProperty.call(value, prefix)) {
          return value[prefix][dataIn.id.substr(dataIn.id.indexOf('['))];
        }
      }
    } else if (paramsType === 'body') {
      const keyParts = dataIn.id.split('.');

      toReturn = value[keyParts[0]];

      for (let i = 1; toReturn && i < keyParts.length; i += 1) {
        toReturn = toReturn[keyParts[i]];
      }

      if (dataIn.fieldType === 'select' && isArray(toReturn)) {
        [toReturn] = toReturn;
      }

      return toReturn;
    }
  }

  return undefined;
};

const convertToFields = (fieldMeta = [], value = {}, paramsType) => {
  const fields = [];

  fieldMeta.forEach(field => {
    if (field.readOnly) {
      return true;
    }

    let { fieldType } = field;

    if (fieldType === 'input') {
      fieldType = 'text';
    }

    if (
      !['multiselect', 'select', 'text', 'textarea', 'checkbox'].includes(
        fieldType
      )
    ) {
      fieldType = 'text';
    }

    fields.push({
      id: field.id,
      name: field.id,
      label: field.name,
      type: fieldType,
      required: !!field.required,
      placeholder: field.placeholder,
      defaultValue:
        getParamValue({ id: field.id, fieldType }, value, paramsType) ||
        field.defaultValue,
      options: [{ items: field.options }],
      helpText: field.description,
    });
  });

  return fields;
};

const SearchParamsModal = props => {
  const {
    fieldMeta,
    handleClose,
    id,
    onFieldChange,
    value,
    paramsType,
  } = props;
  const updatedFields = convertToFields(fieldMeta, value, paramsType);

  function onSaveClick(formValues) {
    onFieldChange(id, formValues);
    handleClose();
  }

  return (
    <ModalDialog show handleClose={handleClose}>
      <Fragment>
        <span>Search Parameters</span>
      </Fragment>
      <Fragment>
        <DynaForm fieldMeta={{ fields: updatedFields }}>
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
  const { label, value, onFieldChange, id, fieldMeta, paramsType } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);

  return (
    <Fragment>
      {showSearchParamsModal && (
        <SearchParamsModal
          id={id}
          fieldMeta={fieldMeta}
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
        {label || paramsType === 'body'
          ? 'Configure Body Parameters'
          : 'Configure Search Parameters'}
      </Button>
    </Fragment>
  );
}
