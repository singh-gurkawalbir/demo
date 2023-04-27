import { EMAIL_REGEX } from '../../../constants';
import messageStore, { message } from '../../../utils/messageStore';

export default function getFieldMeta({email, token, _csrf, skipPassword} = {}) {
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        placeholder: 'Name *',
        required: true,
        noApi: true,
        validWhen: {
          matchesRegEx: {
            pattern: '\\w+\\s\\w+',
            message: message.USER_SIGN_IN.INVALID_FIRST_LAST_NAME,
          },
        },
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'text',
        placeholder: 'Business email *',
        defaultValue: email,
        readOnly: true,
        required: true,
        noApi: true,
        validWhen: {
          matchesRegEx: {
            pattern: EMAIL_REGEX,
            message: message.USER_SIGN_IN.INVALID_EMAIL,
          },
        },
      },
      company: {
        id: 'company',
        name: 'company',
        type: 'text',
        placeholder: 'Company',
        noApi: true,
      },
      role: {
        id: 'role',
        name: 'role',
        type: 'text',
        placeholder: 'Role',
        noApi: true,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        placeholder: 'Phone',
        noApi: true,
      },
      ...(skipPassword ? { } : {
        password: {
          id: 'password',
          name: 'password',
          required: true,
          type: 'signinpassword',
          inputType: 'password',
          errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'New password'}),
          placeholder: 'Enter new password *',
          noApi: true,
          validWhen: {
            custom: ({value, allFields}) => {
              const confirmPassword = allFields.find(f => f.id === 'confirmPassword');

              if (confirmPassword.value && value !== confirmPassword.value) return 'Passwords should match';
            },
          },
        },
      }),
      ...(skipPassword ? { } : {
        confirmPassword: {
          id: 'confirmPassword',
          required: true,
          name: 'confirmPassword',
          type: 'signinpassword',
          inputType: 'password',
          errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Confirm new password'}),
          placeholder: 'Confirm new password *',
          noApi: true,
          validWhen: {
            custom: ({value, allFields}) => {
              const password = allFields.find(f => f.id === 'password');

              if (password.value && value !== password.value) return 'Passwords should match';
            },
          },
        },
      }),
      token: {
        id: 'token',
        type: 'hidden',
        name: 'token',
        value: token,
      },
      _csrf: {
        id: '_csrf',
        type: 'hidden',
        name: '_csrf',
        value: _csrf,
      },
      agreeTOSAndPP: {
        id: 'agreeTOSAndPP',
        name: 'agreeTOSAndPP',
        type: 'signupconsent',
        required: true,
        label: 'Changes required',
      },
    },
    layout: {
      fields: [
        'name',
        'email',
        'company',
        'role',
        'phone',
        ...(!skipPassword ? ['password', 'confirmPassword'] : []),
        'agreeTOSAndPP',
      ],
    },
  };

  return fieldMeta;
}

