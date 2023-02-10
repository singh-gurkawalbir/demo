import useLoadUIFields from '../../hooks/useLoadUIFields';

export default function LoadUIFields({ children, resourceId, resourceType, flowId }) {
  const isResourceLoaded = useLoadUIFields({ resourceId, resourceType, flowId });

  if (!isResourceLoaded) {
    return null;
  }

  return children || null;
}
