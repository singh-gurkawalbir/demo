/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import TextArea from './TextArea';

export default function Field({ fieldMeta, onClick, value, isMapped }) {
  if (!fieldMeta || !fieldMeta.details) {
    return (
      <>
        <td />
        <td />
      </>
    );
  }

  let input;

  if (fieldMeta.details.type === 'textarea') {
    input = (
      <TextArea
        fieldMeta={fieldMeta}
        onClick={onClick}
        value={value}
        isMapped={isMapped}
      />
    );
  } else if (fieldMeta.details.type === 'boolean') {
    input = (
      <input
        type="checkbox"
        name={fieldMeta.details.name}
        onClick={onClick}
        checked={!!value}
        className={isMapped ? 'celigoAutoMatched' : ''}
      />
    );
  } else if (fieldMeta.details.type === 'date') {
    input = (
      <input
        name={fieldMeta.details.name}
        size="12"
        onClick={onClick}
        value={value}
        className={isMapped ? 'celigoAutoMatched' : ''}
      />
    );
  } else if (fieldMeta.details.type === 'picklist') {
    input = (
      <span>
        <select
          name={fieldMeta.details.name}
          onClick={onClick}
          value={value}
          className={isMapped ? 'celigoAutoMatched' : ''}>
          {fieldMeta.details.picklistValues.map(plv => (
            <option key={plv.value} value={plv.value}>
              {plv.label}
            </option>
          ))}
        </select>
      </span>
    );
  } else if (
    fieldMeta.details.type === 'reference' &&
    fieldMeta.details.referenceTo.indexOf('User') > -1
  ) {
    input = 'Current User';
  } else {
    input = (
      <input
        name={fieldMeta.details.name}
        size="20"
        onClick={onClick}
        value={value}
        className={isMapped ? 'celigoAutoMatched' : ''}
      />
    );
  }

  return (
    <>
      <td className="labelCol">
        <label>{fieldMeta.details.label}</label>
      </td>
      <td
        className={
          fieldMeta.numItemsInRow === 1 ? 'data2Col' : 'dataCol col02'
        }>
        <div className="requiredInput">
          {fieldMeta.details.type !== 'boolean' &&
            !fieldMeta.details.nillable &&
            (fieldMeta.details.type !== 'reference' ||
              fieldMeta.details.referenceTo.indexOf('User') === -1) && (
              <div className="requiredBlock" />
          )}
          {input}
        </div>
      </td>
    </>
  );
}
