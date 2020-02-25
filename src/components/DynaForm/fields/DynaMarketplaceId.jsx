import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DynaSelect from './DynaSelect';

export default function DynaMarketplaceId(props) {
  const { resourceId, resourceType } = props;
  const [referencesRequested, setReferencesRequested] = useState(false);
  const hasDependencies = useSelector(state => {
    const referencesUsed = selectors.resourceReferences(state) || [];

    return referencesUsed.some(reference =>
      ['exports', 'imports'].includes(reference.resourceType)
    );
  });
  const dispatch = useDispatch();

  useEffect(() => () => dispatch(actions.resource.clearReferences()), [
    dispatch,
  ]);

  useEffect(() => {
    if (!referencesRequested) {
      dispatch(
        actions.resource.requestReferences(resourceType, resourceId, {
          ignoreError: true,
        })
      );
      setReferencesRequested(true);
    }
  }, [dispatch, referencesRequested, resourceId, resourceType]);

  return <DynaSelect {...props} type="select" disabled={hasDependencies} />;
}
