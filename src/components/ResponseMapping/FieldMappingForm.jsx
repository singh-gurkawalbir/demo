import React from 'react';
import { useSelector } from 'react-redux';
import {selectors} from '../../reducers';
import MappingRow from './MappingRow';

const emptyObject = {};
export default function FieldMappingForm(props) {
  const mappings = useSelector(state => selectors.responseMapping(state).mappings);
  const emptyRowIndex = mappings.length;

  return (
    <>
      <div>
        {mappings.map(({key}, index) => (
          <MappingRow
            key={key}
            mappingKey={key}
            index={index}
            {...props}
          />
        ))}
      </div>
      <MappingRow
        key={`newMappingRow-${emptyRowIndex}`}
        mapping={emptyObject}
        index={emptyRowIndex}
        {...props}
      />
    </>
  );
}
