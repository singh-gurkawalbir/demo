import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { emptyList } from '../../../../constants';
import errorMessageStore from '../../../../utils/errorStore';
import messageStore from '../../../../utils/messageStore';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import DynaSelect from '../DynaSelect';

export default function DynaSelectAliasResource({ options = {}, ...props}) {
  const dispatch = useDispatch();
  const { aliasResourceType } = options;
  const { id, formKey, aliasContextResourceId, aliasContextResourceType, value } = props;
  const resourceList = useSelector(state => selectors.aliasResources(state, aliasResourceType, aliasContextResourceType, aliasContextResourceId) || emptyList);
  const selectOptions = useMemo(() => ([{
    items: resourceList.map(res => ({
      label: res.name,
      value: res._id,
    })),
  }]), [resourceList]);

  useEffect(() => {
    if (!resourceList.length && !value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages: errorMessageStore('NO_ALIAS_RESOURCE_MESSAGE', {
          label: MODEL_PLURAL_TO_LABEL[aliasResourceType].toLowerCase(),
          resourceType: aliasResourceType,
        }),
      }));

      return;
    }

    if (resourceList.length && !value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages: messageStore('REQUIRED_MESSAGE'),
      }));

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
  }, [dispatch, formKey, id, resourceList, value, aliasResourceType]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaSelect {...props} options={selectOptions} />
  );
}
