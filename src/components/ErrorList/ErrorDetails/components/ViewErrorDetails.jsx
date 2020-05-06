import { useMemo } from 'react';
import { formatErrorDetails } from '../../../../utils/errorManagement';
import CodeEditor from '../../../../components/CodeEditor';

export default function ViewErrorDetails({ details }) {
  const errorDetails = useMemo(() => formatErrorDetails(details), [details]);

  return <CodeEditor value={errorDetails} mode="text" readOnly />;
}
