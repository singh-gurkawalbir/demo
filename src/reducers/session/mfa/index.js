import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, secretCode, status, error, sessionInfo, secretCodeError, qrCodeError } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MFA.SECRET_CODE.RECEIVED:
        draft.secretCode = secretCode;
        break;
      case actionTypes.MFA.SECRET_CODE.ERROR:
        draft.secretCodeError = secretCodeError;
        delete draft.showSecretCode;
        delete draft.secretCode;
        break;
      case actionTypes.MFA.QR_CODE.ERROR:
        draft.qrCodeError = qrCodeError;
        delete draft.showQrCode;
        break;

      case actionTypes.MFA.QR_CODE.SHOW:
        draft.showQrCode = true;
        break;
      case actionTypes.MFA.SECRET_CODE.SHOW:
        draft.showSecretCode = true;
        break;
      case actionTypes.MFA.MOBILE_CODE.VERIFY:
        draft.mobileCode = { status: 'requested' };
        break;
      case actionTypes.MFA.MOBILE_CODE.STATUS:
        draft.mobileCode = { status, error };
        break;
      case actionTypes.MFA.MOBILE_CODE.RESET:
        delete draft.mobileCode;
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
        delete draft.mobileCode;
        delete draft.secretCode;
        delete draft.showSecretCode;
        delete draft.qrCode;
        delete draft.showQrCode;
        delete draft.secretCodeError;
        delete draft.qrCodeError;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.showQrCode = state => !!state?.showQrCode;
selectors.showSecretCode = state => !!state?.showSecretCode;

selectors.isMobileCodeVerified = state => state?.mobileCode?.status === 'success';
selectors.isMobileCodeVerificationFailed = state => state?.mobileCode?.status === 'error';
selectors.mobileCodeError = state => state?.mobileCode?.error;

selectors.qrCode = state => state?.secretCode?.keyURI;
selectors.secretCode = state => state?.secretCode?.secret;
selectors.secretCodeError = state => state?.secretCodeError;

selectors.sessionInfoStatus = state => state?.sessionInfo?.status;
selectors.sessionInfo = state => state?.sessionInfo?.data;
// #endregion
