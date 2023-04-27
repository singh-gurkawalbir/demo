import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { emptyList } from '../../../../constants';
import messageStore from '../../../../utils/messageStore';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import DynaSelect from '../DynaSelect';

export default function DynaSelectAliasResource(props) {
  const dispatch = useDispatch();
  const { id, formKey, aliasContextResourceId, aliasContextResourceType, value } = props;
  const aliasResourceType = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};

    return formContext?.value?.aliasResourceType;
  });
  const resourceList = useSelector(state => selectors.aliasResources(state, aliasResourceType, aliasContextResourceType, aliasContextResourceId) || emptyList);
  const selectOptions = useMemo(() => ([{
    items: resourceList.map(res => {
      const result = {
        label: res.name,
        value: res._id,
      };

      if (aliasResourceType === 'connections') {
        return ({
          ...result,
          connInfo: {
            httpConnectorId: res?.http?._httpConnectorId,
            httpConnectorApiId: res?.http?._httpConnectorApiId,
            httpConnectorVersionId: res?.http?._httpConnectorVersionId,
          },
        });
      }

      return result;
    }),
  }]), [resourceList, aliasResourceType]);

  useEffect(() => {
    if (!resourceList.length && !value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {
        isValid: false,
        errorMessages: messageStore('NO_ALIAS_RESOURCE_MESSAGE', {
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
