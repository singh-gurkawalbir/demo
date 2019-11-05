import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

export default function TemplateCrumb({ templateId }) {
  const dispatch = useDispatch();
  const template = useSelector(state =>
    selectors.marketplaceTemplate(state, templateId)
  );

  useEffect(() => {
    if (!template) {
      dispatch(actions.marketplace.requestTemplates());
    }
  }, [dispatch, template]);

  return template ? template.name : 'Template';
}
