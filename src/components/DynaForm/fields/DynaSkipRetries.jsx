import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaCheckbox from './checkbox/DynaCheckbox';

export default function DynaSkipRetries(props) {
  let pageGenerator;
  const { flowId, resourceId } = props;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    pageGenerator = flow.pageGenerators.find(pg => pg._exportId === resourceId);
  }

  if (!flowId) {
    return null;
  }

  return (
    <DynaCheckbox
      {...props}
      value={!!(pageGenerator && pageGenerator.skipRetries)}
    />
  );
}
