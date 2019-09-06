import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { isObject, isArray, each, isNaN, last } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';

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

const convertToFields = (
  fieldMeta = [],
  defaultValuesForDeltaExport = {},
  value = {},
  paramsType
) => {
  const fields = [];
  const fieldDetailsMap = {};
  let fieldIndex = 0;
  const paramValues = { ...value };

  fieldMeta.forEach(field => {
    if (field.type === 'repeat' && field.indexed) {
      const fieldValue = [];

      each(value, (v, k) => {
        if (
          k &&
          k.startsWith(field.id) &&
          k.split('.').length > 1 &&
          !isNaN(parseInt(last(k.split('.')), 10))
        ) {
          fieldValue.push(v);
        }
      });
      paramValues[field.id] = fieldValue;
    }
  });

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

    fieldIndex += 1;

    /** There are some issues with forms processor if field id/name contains special chars like . and [] */
    const fieldId = `field${fieldIndex}`;

    fieldDetailsMap[fieldId] = {
      id: field.id,
      type: field.type,
      indexed: field.indexed,
    };

    const paramValue = getParamValue(
      { id: field.id, fieldType },
      paramValues,
      paramsType
    );
    let { defaultValue } = field;

    if (
      paramValue === undefined &&
      Object.prototype.hasOwnProperty.call(
        defaultValuesForDeltaExport,
        field.id
      )
    ) {
      defaultValue = defaultValuesForDeltaExport[field.id];
    }

    fields.push({
      id: fieldId,
      name: fieldId,
      label: field.name,
      type: fieldType,
      required: !!field.required,
      placeholder: field.placeholder,
      defaultValue:
        getParamValue({ id: field.id, fieldType }, paramValues, paramsType) ||
        defaultValue,
      options: [
        {
          items: field.options
            ? field.options.map(opt => ({
                label: opt,
                value: opt,
              }))
            : [],
        },
      ],
      helpText: field.description,
    });
  });

  return { fields, fieldDetailsMap };
};

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
  const { fields, fieldDetailsMap } = convertToFields(
    fieldMeta,
    defaultValuesForDeltaExport,
    value,
    paramsType
  );

  function onSaveClick(formValues) {
    let updatedFormValues = {};

    Object.keys(formValues).forEach(key => {
      let value = formValues[key];
      const { id, type, indexed } = fieldDetailsMap[key];

      if (type === 'repeat' && indexed && value && value.length > 0) {
        value = isArray(value) ? value : value.split(',');
        value.forEach((v, i) => {
          updatedFormValues[`${id}.${i + 1}`] = v;
        });
      } else {
        if (type === 'array') {
          // IO-1776
          if (value && !isArray(value)) {
            value = value.split(',');
          }
        } else if (type === 'csv') {
          if (isArray(value)) {
            value = value.join(',');
          }
        } else if (type === 'integer') {
          if (value) {
            try {
              value = parseInt(value, 10);
            } catch (ex) {
              // do nothing
            }
          }
        }

        if (value || value === false) {
          // allow any truthy and boolean false
          updatedFormValues[id] = value;
        }
      }
    });

    if (paramsType === 'body') {
      let keyParts;
      let objTemp;
      const toReturn = {};

      Object.keys(updatedFormValues).forEach(key => {
        const value = updatedFormValues[key];

        if (value || value === false) {
          // allow booleans
          keyParts = key.split('.');
          objTemp = toReturn;
          let i = 0;

          for (i = 0; i < keyParts.length - 1; i += 1) {
            if (!Object.prototype.hasOwnProperty.call(objTemp, keyParts[i])) {
              objTemp[keyParts[i]] = {};
            }

            objTemp = objTemp[keyParts[i]];
          }

          objTemp[keyParts[i]] = value;
        }
      });

      updatedFormValues = toReturn;
    }

    onFieldChange(id, updatedFormValues);
    handleClose();
  }

  return (
    <ModalDialog show handleClose={handleClose}>
      <Fragment>
        <span>Search Parameters</span>
      </Fragment>
      <Fragment>
        <DynaForm fieldMeta={{ fields }}>
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
  } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);

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
        {label || paramsType === 'body'
          ? 'Configure Body Parameters'
          : 'Configure Search Parameters'}
      </Button>
    </Fragment>
  );
}
