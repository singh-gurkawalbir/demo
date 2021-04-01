import React, {useMemo} from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';

const emptyArr = [];
export default function DynaLicenseEdition(props) {
  const { connectorId } = props;
  const editions = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.twoDotZero?.editions || emptyArr);

  const options = useMemo(() => editions.map(edition => ({
    label: edition.displayName || edition._id,
    value: edition._id,
  })), [editions]);

  if (!editions.length) return null;

  return (
    <DynaSelect
      {...props} options={[{ items: options || [] }]}

  />
  );
}
