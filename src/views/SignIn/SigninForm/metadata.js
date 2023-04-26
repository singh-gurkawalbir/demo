import messageStore from '../../../utils/messageStore';

export default function getFieldMeta({email, isSessionExpired}) {
  const fieldMeta = {

    fieldMap: {
      email: {
        id: 'email',
        name: 'email',
        type: 'signupemail',
        defaultDisabled: !!isSessionExpired,
        placeholder: 'Email*',
        required: true,
        defaultValue: isSessionExpired ? email : undefined,
        errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Email'}),
      },
      password: {
        id: 'password',
        name: 'password',
        required: true,
        type: 'signinpassword',
        inputType: 'password',
        placeholder: 'Password*',
        hidePasswordIcon: true,
      },

      forgotPassword: {
        id: 'forgotPassword',
        name: 'forgotPassword',
        type: 'forgotpassword',
        label: 'Forgot password?',
      },

    },
    layout: {
      fields: [
        'email',
        'password',
        'forgotPassword',
      ],
    },
  };

  return fieldMeta;
}
