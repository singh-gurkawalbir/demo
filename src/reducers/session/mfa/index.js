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
      case actionTypes.AUTH.VALIDATE_SESSION:
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
      case actionTypes.MFA.SESSION_INFO.CLEAR:
        delete draft.sessionInfo;
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

selectors.mfaSessionInfoStatus = state => state?.sessionInfo?.status;
selectors.sessionInfo = state => state?.sessionInfo?.data;
selectors.isMFASetupIncomplete = state => {
  if (!state || !state.sessionInfo || !state.sessionInfo.data) return false;
  const { mfaVerified, mfaRequired, mfaSetupRequired } = state.sessionInfo.data;

  // when setup is required and it is not verified, then mfa setup is incomplete
  return mfaSetupRequired && mfaRequired && !mfaVerified;
};

selectors.isMFAVerificationRequired = state => {
  if (!state || !state.sessionInfo || !state.sessionInfo.data) return false;
  const { mfaVerified, mfaRequired, mfaSetupRequired } = state.sessionInfo.data;

  // when setup is not required and it is not verified, then mfa verufucation is needed
  return !mfaSetupRequired && mfaRequired && !mfaVerified;
};

selectors.isMFAResolved = state => {
  if (!state || !state.sessionInfo || !state.sessionInfo.data) return false;
  const {authenticated, mfaVerified, mfaRequired } = state.sessionInfo.data;

  return authenticated && (!mfaRequired || (mfaRequired && mfaVerified));
};
selectors.isUserAuthenticated = state => {
  if (!state || !state.sessionInfo || !state.sessionInfo.data) return false;
  const { mfaSetupRequired } = state.sessionInfo.data;
  const isMFAResolved = selectors.isMFAResolved(state);

  return isMFAResolved && !mfaSetupRequired;
};
selectors.agreeTOSAndPPRequired = state => {
  if (!state || !state.sessionInfo || !state.sessionInfo.data) return false;
  const { agreeTOSAndPP = false } = state.sessionInfo.data;
  const isMFAResolved = selectors.isMFAResolved(state);

  return isMFAResolved && agreeTOSAndPP === false;
};

selectors.getSetupContext = state => state?.context;
// #endregion
