/* global describe, expect, beforeEach, test */
import { selectors } from '.';

describe('Form fields state validation test cases', () => {
  const formKey = 'new-abcd';

  describe('httpPagingValidationError test cases', () => {
    const pagingFieldsToValidate = ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'];
    const pagingMethodsToValidate = {
      page: /.*{{.*export\.http\.paging\.page.*}}/,
      skip: /.*{{.*export\.http\.paging\.skip.*}}/,
      token: /.*{{.*export\.http\.paging\.token.*}}/,
    };
    let state;

    beforeEach(() => {
      state = {
        session: {
          form: {
            [formKey]: {
              fields: {
                'http.paging.method': {value: 'skip'},
                'http.relativeURI': {value: '/orders'},
                'http.body': {value: {}},
              },
            },
          },
        },
      };
    });
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpPagingValidationError()).toBeUndefined();
      expect(selectors.httpPagingValidationError()).toBeUndefined();
      expect(selectors.httpPagingValidationError(state, formKey)).toBeUndefined();
    });
    test('should return undefined if the validation criteria is correctly met for skip method', () => {
      state.session.form[formKey].fields['http.relativeURI'].value = '/orders?skip={{export.http.paging.skip}}';
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toBeUndefined();
    });
    test('should return undefined if the validation criteria is correctly met for token method', () => {
      state.session.form[formKey].fields['http.paging.method'].value = 'token';
      state.session.form[formKey].fields['http.body'].value = '{abc: {{substring export.http.paging.token}}}';
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toBeUndefined();
    });
    test('should return the error message for passed paging method if validation criteria fails', () => {
      expect(selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate)).toEqual('The paging method selected must use {{export.http.paging.skip}} in either the relative URI or HTTP request body.');
    });
  });

  describe('httpDeltaValidationError test cases', () => {
    const deltaFieldsToValidate = ['http.relativeURI', 'http.body'];
    let state;

    beforeEach(() => {
      state = {
        session: {
          form: {
            [formKey]: {
              fields: {
                type: {value: 'delta'},
                'http.relativeURI': {value: '/orders'},
                'http.body': {value: {}},
              },
            },
          },
        },
      };
    });
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpDeltaValidationError()).toBeUndefined();
      expect(selectors.httpDeltaValidationError(state, formKey)).toBeUndefined();
    });
    test('should return undefined if export type is not delta', () => {
      state.session.form[formKey].fields.type.value = 'once';
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toBeUndefined();
    });
    test('should return undefined if validation criteria is met for delta export type', () => {
      state.session.form[formKey].fields['http.body'].value = '{send: {{dateFormat lastExportDateTime}}}';
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toBeUndefined();
    });
    test('should return the error message if validation criteria is not met', () => {
      expect(selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate)).toEqual('Delta exports must use {{lastExportDateTime}} in either the relative URI or HTTP request body.');
    });
  });
});
