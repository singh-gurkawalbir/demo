import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import messageStore from '../../../../constants/messages';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { emptyList } from '../../../../utils/constants';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import DynaSelect from '../DynaSelect';

export default function DynaSelectAliasResource({ options = {}, ...props}) {
  const dispatch = useDispatch();
  const { aliasResourceType } = options;
  const { id, formKey, required, aliasContextResourceId, aliasContextResourceType } = props;
  const resourceList = useSelectorMemo(selectors.makeAliasResources, aliasResourceType, aliasContextResourceType, aliasContextResourceId) || emptyList;
  const selectOptions = useMemo(() => ([{
    items: resourceList.map(res => ({
      label: res.name,
      value: res._id,
    })),
  }]), [resourceList]);

  useEffect(() => {
    if (!required) return;

    if (resourceList.length) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: messageStore('NO_ALIAS_RESOURCE_MESSAGE', {
        label: MODEL_PLURAL_TO_LABEL[aliasResourceType].toLowerCase(),
        resourceType: aliasResourceType,
      }),
    }));
  }, [dispatch, formKey, id, resourceList, required, aliasResourceType]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaSelect {...props} options={selectOptions} />
  );
}
