import React from 'react';
import { useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';
import { SHOPIFY_STORE_NAME_FOR_BASIC_AUTH_HELP_LINK, SHOPIFY_STORE_NAME_FOR_OAUTH_HELP_LINK } from '../../../../constants';

export default function DynaShopifyStoreName(props) {
  const { showHelpLink } = props;
  const authType = useSelector(state => selectors.fieldState(state, props.formKey, 'http.auth.type'))?.value;
  const helpLink = authType === 'basic'
    ? SHOPIFY_STORE_NAME_FOR_BASIC_AUTH_HELP_LINK
    : SHOPIFY_STORE_NAME_FOR_OAUTH_HELP_LINK;

  return (
    <DynaText {...props} helpLink={showHelpLink ? helpLink : ''} />
  );
}
