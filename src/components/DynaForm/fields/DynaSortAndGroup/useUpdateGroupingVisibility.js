import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useFormContext from '../../../Form/FormContext';
import { finalSuccessMediaType } from '../../../../utils/resource';
import { useSelectorMemo } from '../../../../hooks';

const sortAndGroupId = 'groupByFields';
export default function useUpdateGroupingVisibility({formKey, resourceId, resourceType}) {
  const dispatch = useDispatch();
  const formValues = useFormContext(formKey)?.value;
  const connection = useSelectorMemo(selectors.makeResourceSelector, 'connections', formValues['/_connectionId']);

  const exportMediaType = finalSuccessMediaType(formValues, connection);
  const parseStrategy = formValues['/parsers']?.[0]?.rules?.['V0_json'];

  const isHTTPExport = useSelector(state => {
    const resource = selectors.resourceData(state, resourceType, resourceId)?.merged;

    return resource?.adaptorType === 'HTTPExport';
  });

  useEffect(() => {
    if (!isHTTPExport) return;

    // update visibility of sort and group field based on the media type
    if (exportMediaType === 'json') {
      dispatch(actions.form.forceFieldState(formKey)(sortAndGroupId, { visible: true}));
    } else if (exportMediaType === 'xml' && !parseStrategy) {
      dispatch(actions.form.forceFieldState(formKey)(sortAndGroupId, { visible: true}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(sortAndGroupId, { visible: false}));
    }
  }, [isHTTPExport, dispatch, exportMediaType, formKey, parseStrategy]);

  return null;
}
