import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, secretCode, status, error, sessionInfo, secretCodeError, qrCodeError } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MFA.RECEIVED_SECRET_CODE:
        draft.secretCode = secretCode;
        break;
      case actionTypes.MFA.SECRET_CODE_ERROR:
        draft.secretCodeError = secretCodeError;
        delete draft.showSecretCode;
        delete draft.secretCodeShownAt;
        break;
      case actionTypes.MFA.QR_CODE_ERROR:
        draft.qrCodeError = qrCodeError;
        delete draft.showQrCode;
        delete draft.qrCodeShownAt;
        break;

      case actionTypes.MFA.SHOW_QR_CODE:
        draft.showQrCode = true;
        draft.qrCodeShownAt = new Date().toISOString();
        break;
      case actionTypes.MFA.SHOW_SECRET_CODE:
        draft.showSecretCode = true;
        draft.secretCodeShownAt = new Date().toISOString();
        break;
      case actionTypes.MFA.MOBILE_CODE.VERIFY:
        draft.mobileCode = { status: 'requested' };
        break;
      case actionTypes.MFA.MOBILE_CODE.STATUS:
        draft.mobileCode = { status, error };
        break;
      case actionTypes.MFA.SESSION_INFO.REQUEST:
        draft.sessionInfo = {
          status: 'requested',
        };
        break;
      case actionTypes.MFA.SESSION_INFO.RECEIVED:
        draft.sessionInfo = {
          status: 'received',
          data: sessionInfo,
        };
        break;
      case actionTypes.MFA.CLEAR:
        draft.mobileCode = {};
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isQrCodeExpired = state => state?.showQrCode && (new Date() - state?.qrCodeShownAt > 30);
selectors.isSecretCodeExpired = state => state?.showQrCode && (new Date() - state?.qrCodeShownAt > 30);

selectors.showQrCode = state => state?.showQrCode;
selectors.showSecretCode = state => state?.showSecretCode;
selectors.showQrCodeError = state => state?.showQrCodeError;
selectors.showSecretCodeError = state => state?.showSecretCodeError;

selectors.mobileCodeStatus = state => state?.mobileCode?.status;
selectors.mobileCodeError = state => state?.mobileCode?.error;

selectors.qrCode = state => state?.secretCode?.keyURI;
selectors.secretCode = state => state?.secretCode?.secret;

selectors.sessionInfoStatus = state => state?.sessionInfo?.status;
selectors.sessionInfo = state => state?.sessionInfo?.data;
// #endregion
