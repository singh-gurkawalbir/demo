import React, { useMemo } from 'react';
import DynaSelect from './DynaSelect';
import { isNewId } from '../../../utils/resource';

const DEFAULT_ITEMS = [
  {
    value: 'Amazon-SP-API',
    label: 'Selling Partner API (SP-API)',
  },
  {
    value: 'Amazon-Hybrid',
    label: 'Hybrid Selling Partner API (SP-API and MWS)',
  },
];

export default function DynaAmazonmwsType(props) {
  const {resourceId} = props;
  const options = useMemo(() => {
    if (isNewId(resourceId)) {
      return [{
        items: DEFAULT_ITEMS,
      }];
    }

    return [{
      items: [...DEFAULT_ITEMS, {
        value: 'Amazon-MWS',
        label: 'Marketplace Web Service API (MWS)',
      }],
    }];
  }, [resourceId]);

  return (
    <DynaSelect {...props} options={options} />
  );
}
