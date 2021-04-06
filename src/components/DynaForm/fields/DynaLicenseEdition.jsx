import React, {useMemo, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { isNewId } from '../../../utils/resource';

const emptyArr = [];
export default function DynaLicenseEdition(props) {
  const { connectorId, resourceId, id, formKey } = props;

  const isNewLicense = isNewId(resourceId);
  const dispatch = useDispatch();
  const editions = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.twoDotZero?.editions || emptyArr);

  const options = useMemo(() => editions.map(edition => ({
    label: edition.displayName || edition._id,
    value: edition._id,
  })), [editions]);

  useEffect(() => {
    if (editions.length && isNewLicense) {
      dispatch(actions.form.forceFieldState(formKey)(id, {required: true}));
    }
  }, [dispatch, editions.length, formKey, id, isNewLicense]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  if (!editions.length) return null;

  return (
    <DynaSelect
      {...props} options={[{ items: options || [] }]}

  />
  );
}
