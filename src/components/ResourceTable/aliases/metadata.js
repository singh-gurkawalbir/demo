import React from 'react';
import AliasResourceName from './cells/AliasResourceName';
import AliasName from './cells/AliasName';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

export default {
  useColumns: () => [
    {
      key: 'aliasId',
      heading: 'Alias ID',
      Value: ({rowData: r}) => <AliasName alias={r.alias} description={r.description} />,
    },
    {
      key: 'name',
      heading: 'Resource Name',
      Value: ({rowData: r}) => <AliasResourceName id={r._resourceId} resourceType={r.resourceType} />,
    },
    {
      key: 'type',
      heading: 'Resource Type',
      Value: ({rowData: r}) => MODEL_PLURAL_TO_LABEL[r.resourceType],
      orderBy: 'type',
    },
  ],
};
