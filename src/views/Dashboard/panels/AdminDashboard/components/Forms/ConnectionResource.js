import React from 'react';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import DynaForm from '../../../../../../components/DynaForm';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../../reducers';

const fieldMeta = {
  fieldMap: {
    Type: {
      id: 'filterFlow',
      name: 'Filter',
      type: 'select',
      placeholder: 'Please Select type',
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      options: [
        {
          items: [
            { label: 'Online', value: 'online' },
            { label: 'Offline', value: 'offline' },
          ],
        },
      ],
      defaultValue: 'online',
      noApi: true,
    },
  },
  layout: {
    fields: ['Type'],
  },
};

const ConnectionResource = props => {
  const formKey = 'ConnectionType';

  const formValues = useSelector(
    state => selectors.formValueTrimmed(state, formKey),
    shallowEqual
  );
  const result = { ...formValues };

  const filterVal = result.Filter;

  props.func(filterVal);

  useFormInitWithPermissions({ formKey, fieldMeta });

  return (
    <DynaForm data-testid="dyna-form" formKey={formKey} />
  );
};

export default ConnectionResource;
