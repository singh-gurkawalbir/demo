export function getParamValue(fieldId, values = {}) {
  console.log('getParamValue fie ', fieldId, values);
  let paramValue;

  if (values) {
    if (Object.prototype.hasOwnProperty.call(values, fieldId)) {
      paramValue = values[fieldId];
    } else {
      const keyParts = fieldId.split('.');
      console.log('getParamValue keyParts ', keyParts);


      paramValue = values[keyParts[0]];

      console.log('getParamValue paramValue ', paramValue);

      for (let i = 1; paramValue && i < keyParts.length; i += 1) {
        paramValue = paramValue[keyParts[i]];
        console.log('getParamValue paramValue2 ', paramValue);
      }
    }
  }

  return paramValue;
}

export function convertToReactFormFields({apiMethodMetadata, value = {}}) {
  const { paramsDefaultValues = {} } = apiMethodMetadata;
  const fields = [];
  const fieldMap = {};
  apiMethodMetadata && apiMethodMetadata.params.forEach(p => {
    let inputType = 'text';
    let options = [];
    if (p?.selectOptions?.length > 0) {
      inputType = 'select';
    } else if (p.type === 'date') {
      inputType = 'date';
    }
    if (inputType === 'select') {
      const defaultOption = p.selectOptions.find(opt => !opt.id);
      if (defaultOption && !paramsDefaultValues[p.id]) {
        paramsDefaultValues[p.id] = defaultOption.label;
      }
      options = [
        {
          items: p.selectOptions.map(opt => ({
            label: opt.label,
            value: opt.id || opt.label,
          })),
        },
      ];
    }
    const fieldDef = {
      id: p.id,
      name: p.id,
      label: p.label,
      type: inputType,
      value: getParamValue(p.id, value),
      defaultValue: paramsDefaultValues[p.id],
      required: !!p.isRequired,
    };
    if (fieldDef.type === 'select') {
      fieldDef.options = options;
    } else if (fieldDef.type === 'date') {
      fieldDef.format = p.dateFormat;
    }

    fields.push(fieldDef);
    fieldMap[fieldDef.id] = fieldDef;
  });
  return {
    fieldMap,
    layout: {
      fields: fields.map(field => field.id),
    },
  };
}
