export default function getFieldMeta({email, token, csrf} = {}) {
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'signupname',
        placeholder: 'Name*',
        required: true,
        noApi: true,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'signupemail',
        placeholder: 'Business email*',
        defaultValue: email,
        required: true,
        noApi: true,
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
      password: {
        id: 'password',
        name: 'password',
        required: true,
        type: 'text',
        inputType: 'password',
        placeholder: 'Enter new password *',
        noApi: true,
        validWhen: {
          matchesRegEx: {
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{10,256}$',
            message: 'Password should contain at least one uppercase, one number, is at least 10 characters long and not greater than 256 characters',
          },
        },
      },
      confirmPassword: {
        id: 'confirmPassword',
        required: true,
        name: 'confirmPassword',
        type: 'text',
        inputType: 'password',
        placeholder: 'Confirm new password *',
        noApi: true,
        validWhen: {
          matchesRegEx: {
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{10,256}$',
            message: 'Password should contain at least one uppercase, one number, is at least 10 characters long and not greater than 256 characters',
          },
        },
      },
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
        value: csrf,
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
        'password',
        'confirmPassword',
        'consent',
      ],
    },
  };

  return fieldMeta;
}

