import React from 'react';
import { useSelector } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';

/*
 * This component is a wrapper on DynaSelectResource
 * It updates sift filter option , by adding filter to remove existing pg/pps from a flow
 */
export default function DynaSelectFlowResource(props) {
  const { flowResourceType, options, flowId, ...rest } = props;
  const { filter, visible = true, label, ...otherOptions } = options;
  const resourceIdsToFilter = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);
    const { pageProcessors = [], pageGenerators = [], routers = [] } = flow || {};
    const exportIds = [];
    const importIds = [];

    if (routers.length) {
      routers.forEach(router => {
        (router.branches || []).forEach(branch => {
          (branch.pageProcessors || []).forEach(pp => {
            if (pp._importId) {
              importIds.push(pp._importId);
            } else if (pp._exportId) {
              exportIds.push(pp._exportId);
            }
          });
        });
      });
    }

    // For imports go through pps and extract list of import ids
    if (props.resourceType === 'imports') {
      if (routers.length) return importIds;

      return pageProcessors
        .filter(pp => !!pp._importId)
        .map(pp => pp._importId);
    }

    // For exports , check for lookup and based on that extract from either pp/pg
    if (flowResourceType === 'pg') {
      return pageGenerators
        .filter(pg => !!pg._exportId)
        .map(pg => pg._exportId);
    }

    return routers.length ? exportIds : pageProcessors.filter(pp => !!pp._exportId).map(pp => pp._exportId);
  });
  const updatedFilter = {
    ...filter,
    $and: [
      ...filter.$and,
      { _id: { ...filter._id, $nin: resourceIdsToFilter } },
    ],
  };
  const updatedOptions = {
    ...otherOptions,
    filter: updatedFilter,
  };

  if (!visible) {
    return null;
  }

  return (
    <DynaSelectResource
      {...rest}
      options={updatedOptions}
      label={label || props.label}
      hideOnEmptyList
      isSelectFlowResource
    />
  );
}
