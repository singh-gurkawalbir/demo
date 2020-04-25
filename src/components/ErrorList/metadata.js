import Retry from './actions/Retry';
import SelectError from './components/SelectError';
import SelectAllErrors from './components/SelectAllErrors';

export default function({ resourceId, flowId }) {
  return {
    columns: [
      {
        headerValue: function SelectAll() {
          return <SelectAllErrors resourceId={resourceId} flowId={flowId} />;
        },
        heading: 'Select All',
        value: function Select(error) {
          return (
            <SelectError
              resourceId={resourceId}
              flowId={flowId}
              error={error}
            />
          );
        },
      },
      {
        heading: 'Message',
        value: r => r.message,
      },
      { heading: 'Source', value: r => r.source },
      {
        heading: 'Code',
        value: r => r.code,
      },
      {
        heading: 'Time stamp',
        value: r => r.occurredAt,
      },
    ],
    rowActions: () => [Retry],
  };
}
