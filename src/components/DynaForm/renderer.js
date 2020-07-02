import React from 'react';
import { FieldWrapper } from 'react-forms-processor/dist';
import fields from './fields';

const wrapper = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 16,
};
const fieldStyle = {
  flexGrow: '1',
  textAlign: 'left',
  width: '100%',
};

function getRenderer(editMode, formFieldsMeta, resourceId, resourceType, proceedOnChange) {
  return function renderer(field) {
    // (field, onChange, onFieldFocus, onFieldBlur) => {
    const { id, fieldId, type } = field;
    const DynaField = fields[type];
    const fid = id || fieldId;
    const context = { resourceId, resourceType };

    if (!DynaField) {
      return <div>No mapped field for type: [{type}]</div>;
    }

    return (
    /* TODO: Dave. refactor to allow useClasses...
         Unable to add class in the makestyle because it is throwing and error that this
         function is not a react function neither hook so added inline. */

      <div key={fid} style={wrapper}>
        <div style={fieldStyle}>
          <FieldWrapper {...field}>
            <DynaField resourceContext={context} proceedOnChange={proceedOnChange} />
          </FieldWrapper>
        </div>
      </div>
    );
  };
}

export default getRenderer;
