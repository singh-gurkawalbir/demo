import React from 'react';
import { useGetTableContext } from '../../../../../CeligoTable/TableContext';
import ResourceLink from '../../../../../ResourceLink';

export const thisIntegrationRefsMetadata = {
  rowKey: 'flowId',
  useColumns: () => [
    {
      key: 'flowName',
      heading: 'Name',
      isLoggable: true,
      Value: ({ rowData: r }) => {
        const { onClose } = useGetTableContext();

        return <ResourceLink name={r.flowName} resourceType="flows" id={r.flowId} onClick={onClose} />;
      },
    },
  ],
};

export const otherIntegrationRefsMetadata = {
  rowKey: 'flowId',
  useColumns: () => [
    {
      key: 'integrationName',
      heading: 'Integration name',
      isLoggable: true,
      Value: ({rowData: r}) => {
        const { onClose, integrationId } = useGetTableContext();

        return (
          <ResourceLink
            integrationId={integrationId}
            name={r.integrationName}
            resourceType="integrations"
            id={r.integrationId}
            onClick={onClose}
          />
        );
      },
    },
    {
      key: 'flowName',
      heading: 'Flow name',
      isLoggable: true,
      Value: ({rowData: r}) => {
        const { onClose, integrationId } = useGetTableContext();

        return (
          <ResourceLink
            integrationId={integrationId}
            name={r.flowName}
            resourceType="flows"
            id={r.flowId}
            onClick={onClose}
           />
        );
      },
    },
  ],
};
