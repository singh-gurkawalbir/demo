import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import MessageWithLink from '../../../MessageWithLink';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { SHOPIFY_OAUTH_CONNECTION_VIEW_INSTRUCTIONS_LINK } from '../../../../constants';

export default function DynaShopifyHeaderLink(props) {
  const { isHeader, resourceId, resourceType, messageText } = props;
  const isInstallMode = useSelectorMemo(selectors.isNewConnectionId, resourceType, resourceId);
  const link = useSelector(state => selectors.getShopifyStoreLink(state, resourceId));
  const { http, _connectorId, offline } = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId) || {};

  return (http?.auth?.type !== 'oauth' ||
  (_connectorId && offline && isInstallMode)) ? (
    <MessageWithLink
      type="bold"
      variant={isHeader ? 'info' : 'warning'}
      message={messageText}
      linkText="Continue at the Shopify App Store"
      link={link}
      instructionsLink={SHOPIFY_OAUTH_CONNECTION_VIEW_INSTRUCTIONS_LINK}
     />
    ) : null;
}
