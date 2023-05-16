import React from 'react';
import { FilledButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import useClearAsyncStateOnUnmount from '../../../SaveAndCloseButtonGroup/hooks/useClearAsyncStateOnUnmount';
import useTriggerCancelFromContext from '../../../SaveAndCloseButtonGroup/hooks/useTriggerCancelFromContext';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import OAuthAndCancel from './OAuthAndCancel';
import useHandleCancel from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancel';

const CloseButtonComponent = ({ formKey, onCancel, className }) => {
  useClearAsyncStateOnUnmount(formKey);
  const handleCancelWithWarning = useHandleCancel({formKey, onClose: onCancel });

  useTriggerCancelFromContext(formKey, handleCancelWithWarning);

  return (
    <FilledButton
      className={className}
      onClick={onCancel}
    >
      Close
    </FilledButton>
  );
};

export default function ShopifyOauthButtonGroup(props) {
  const {
    className,
    onCancel,
    formKey,
    resourceType,
    resourceId,
  } = props;

  const isInstallMode = useSelectorMemo(selectors.isNewConnectionId, resourceType, resourceId);
  const { http, _connectorId, offline } = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId) || {};

  if (http?.auth?.type !== 'oauth' ||
    (_connectorId && offline && isInstallMode)) {
    return (
      <CloseButtonComponent
        className={className}
        onCancel={onCancel}
        formKey={formKey}
      />
    );
  }

  return (
    <OAuthAndCancel
      {...props}
    />
  );
}
