import { EMAIL_REGEX } from '../../../constants';

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
            message: 'Please enter your first and last name.',
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
            message: 'Please enter a valid email address.',
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
          type: 'text',
          inputType: 'password',
          placeholder: 'Enter new password *',
          noApi: true,
          validWhen: {
            custom: ({value, allFields}) => {
              const validPassword = /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value) && value.length > 10 && value.length < 256;

              if (!validPassword) {
                return 'Password should contain at least one uppercase, one number, is at least 10 characters long and not greater than 256 characters.';
              }
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
          type: 'text',
          inputType: 'password',
          placeholder: 'Confirm new password *',
          noApi: true,
          validWhen: {
            custom: ({value, allFields}) => {
              const validPassword = /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value) && value.length > 10 && value.length < 256;

              if (!validPassword) {
                return 'Password should contain at least one uppercase, one number, is at least 10 characters long and not greater than 256 characters.';
              }
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
      consent: {
        id: 'consent',
        name: 'consent',
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
        'consent',
      ],
    },
  };

  return fieldMeta;
}

