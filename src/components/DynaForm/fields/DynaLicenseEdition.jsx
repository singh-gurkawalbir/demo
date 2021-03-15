import React from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';

export default function DynaLicenseEdition(props) {
  const { connectorId } = props;
  const editions = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.twoDotZero?.editions);

  if (!editions) return null;

  const options = editions.map(edition => ({
    label: edition.displayName || edition._id,
    value: edition._id,
  }));

  return (
    <DynaSelect
      {...props} options={[{ items: options || [] }]}

  />
  );
}
