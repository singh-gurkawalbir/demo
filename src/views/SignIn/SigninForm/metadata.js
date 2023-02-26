
export default function getFieldMeta() {
  const fieldMeta = {

    fieldMap: {
      email: {
        id: 'email',
        name: 'email',
        type: 'signinemail',
        placeholder: 'Email*',
        required: true,
      },
      password: {
        id: 'password',
        name: 'password',
        required: true,
        type: 'signinpassword',
        inputType: 'password',
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
