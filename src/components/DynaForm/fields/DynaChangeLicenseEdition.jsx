import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';

export default function DynaChangeLicenseEdition(props) {
  const { connectorId, editionId } = props;
  const editions = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.twoDotZero?.editions || []);

  const options = useMemo(() => {
    const { order } = editions.find(edition => edition._id === editionId) || {};

    return editions.filter(edition => edition.order > order).map(edition => ({
      label: edition.displayName || edition._id,
      value: edition._id,
    }));
  }, [editions, editionId]);

  if (!editions.length) return null;

  return (
    <DynaSelect
      {...props} options={[{ items: options || [] }]} disabled={!options.length}
    />
  );
}
