import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = { codes: {}, sessionInfo: {} }, action) => {
  const { type, secretCode, status, error, sessionInfo, secretCodeError, context } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MFA.SECRET_CODE.RECEIVED:
        draft.codes.secretCode = secretCode;
        break;
      case actionTypes.MFA.SECRET_CODE.ERROR:
        draft.codes.secretCodeError = secretCodeError;
        break;
      case actionTypes.MFA.QR_CODE.SHOW:
        draft.codes.showQrCode = true;
        break;
      case actionTypes.MFA.SECRET_CODE.SHOW:
        draft.codes.showSecretCode = true;
        break;
      case actionTypes.MFA.MOBILE_CODE.VERIFY:
        draft.codes.mobileCode = { status: 'requested' };
        break;
      case actionTypes.MFA.MOBILE_CODE.STATUS:
        draft.codes.mobileCode = { status, error };
        break;
      case actionTypes.MFA.MOBILE_CODE.RESET:
        delete draft.codes.mobileCode;
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
      case actionTypes.MFA.ADD_SETUP_CONTEXT:
        draft.context = context;
        break;
      case actionTypes.MFA.CLEAR_SETUP_CONTEXT:
        delete draft.context;
        break;
      case actionTypes.MFA.CLEAR:
        draft.codes = {};
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.showQrCode = state => !!state?.codes?.showQrCode;
selectors.showSecretCode = state => !!state?.codes?.showSecretCode;

selectors.isMobileCodeVerified = state => state?.codes?.mobileCode?.status === 'success';
selectors.isMobileCodeVerificationFailed = state => state?.codes?.mobileCode?.status === 'error';
selectors.mobileCodeError = state => state?.codes?.mobileCode?.error;

selectors.qrCode = state => state?.codes?.secretCode?.keyURI;
selectors.secretCode = state => state?.codes?.secretCode?.secret;
selectors.secretCodeError = state => state?.codes?.secretCodeError;

selectors.sessionInfoStatus = state => state?.sessionInfo?.status;
selectors.sessionInfo = state => state?.sessionInfo?.data;

selectors.getSetupContext = state => state?.context;
// #endregion
