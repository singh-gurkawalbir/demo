import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';
import { SHOPIFY_STORE_NAME_FOR_BASIC_AUTH_HELP_LINK, SHOPIFY_STORE_NAME_FOR_OAUTH_HELP_LINK, SHOPIFY_STORE_NAME_FOR_TOKEN_HELP_LINK } from '../../../../constants';
import { isNewId } from '../../../../utils/resource';

export default function DynaShopifyStoreName(props) {
  const linkToType = {
    basic: SHOPIFY_STORE_NAME_FOR_BASIC_AUTH_HELP_LINK,
    oauth: SHOPIFY_STORE_NAME_FOR_OAUTH_HELP_LINK,
    token: SHOPIFY_STORE_NAME_FOR_TOKEN_HELP_LINK,
  };
  const { showHelpLink } = props;
  const authType = useSelector(state => selectors.fieldState(state, props.formKey, 'http.auth.type'))?.value;
  let helpLink = linkToType[authType];

  if (!isNewId(props.resourceId) && authType === 'oauth') {
    helpLink = '';
  }

  return (
    <DynaText {...props} helpLink={showHelpLink ? helpLink : ''} />
  );
}
