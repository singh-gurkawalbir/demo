// /* global describe, test, expect */
// import reducer, * as selectors from './';
// import actions from '../../actions';

// describe(`profile reducer`, () => {
//   test('should store the new profile.', () => {
//     const mockProfile = 'the profile!';
//     const state = reducer(undefined, actions.profile.received(mockProfile));

//     expect(state.profile).toEqual(mockProfile);
//   });

//   test('should replace existing profile with a new one.', () => {
//     const mockProfile1 = 'the profile!';
//     const mockProfile2 = 'the other profile!';
//     let state;

//     state = reducer(state, actions.profile.received(mockProfile1));
//     expect(state.profile).toEqual(mockProfile1);

//     state = reducer(state, actions.profile.received(mockProfile2));
//     expect(state.profile).toEqual(mockProfile2);
//   });
// });

// describe('theme reducers', () => {
//   describe(`SET_THEME action`, () => {
//     test('should set the theme on first dispatch', () => {
//       const theme = 'fancy';
//       const state = reducer(undefined, actions.setTheme(theme));

//       expect(state.themeName).toEqual(theme);
//     });

//     test('should replace theme on subsequent dispatches', () => {
//       const theme1 = 'fancy';
//       const theme2 = 'simple';
//       let state;

//       state = reducer(state, actions.setTheme(theme1));
//       expect(state.themeName).toEqual(theme1);

//       state = reducer(state, actions.setTheme(theme2));
//       expect(state.themeName).toEqual(theme2);
//     });
//   });
// });

// describe('session selectors', () => {
//   describe(`avatarUrl`, () => {
//     test('should return undefined if no profile exists', () => {
//       expect(selectors.avatarUrl(undefined)).toBeUndefined();
//       expect(selectors.avatarUrl({})).toBeUndefined();
//     });

//     test('should return correct url if profile exists', () => {
//       const mockProfile = { emailHash: '123' };
//       const state = reducer(undefined, actions.profile.received(mockProfile));

//       expect(selectors.avatarUrl(state)).toEqual(
//         'https://secure.gravatar.com/avatar/123?d=mm&s=55'
//       );
//     });
//   });

//   describe(`userTheme`, () => {
//     test('should return default theme if no profile exists', () => {
//       expect(selectors.userTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
//     });

//     test('should return correct theme when set.', () => {
//       const theme = 'my theme';
//       const state = reducer(undefined, actions.setTheme(theme));

//       expect(selectors.userTheme(state)).toEqual(theme);
//     });
//   });
// });
