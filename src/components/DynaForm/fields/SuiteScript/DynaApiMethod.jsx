import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import sift from 'sift';
import * as selectors from '../../../../reducers';
import DynaSelect from '../DynaSelect';

export default function DynaApiMethod(props) {
  const { ssLinkedConnectionId, _connectionId, filters, ...rest } = props;
  const apiMethods = useSelector(state => {
    const connection = selectors.suiteScriptResource(state, {
      resourceType: 'connections',
      id: _connectionId,
      ssLinkedConnectionId,
    });
    let options = [];

    if (connection && connection.apiMethods) {
      options = connection.apiMethods;

      if (filters) {
        options = options.filter(sift(filters));
      }
    }

    return options.map(opt => ({ label: opt.label, value: opt.id }));
  }, shallowEqual);

  return (
    <DynaSelect {...rest} options={[{ items: apiMethods || [] }]} />
  );
}
