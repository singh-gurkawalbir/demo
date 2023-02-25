import messageStore from '../../../utils/messageStore';

export default function getFieldMeta() {
  const fieldMeta = {

    fieldMap: {
      email: {
        id: 'email',
        name: 'email',
        type: 'signinemail',
        placeholder: 'Email*',
        required: true,
        errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Email'}),
      },

      password: {
        id: 'password',
        name: 'password',
        required: true,
        type: 'signinpassword',
        inputType: 'password',
        errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Password'}),
        placeholder: 'Enter new password *',
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
