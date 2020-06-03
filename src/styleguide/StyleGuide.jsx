import React from 'react';
// Import default implementation from react-styleguidist using the full path
// eslint-disable-next-line import/no-extraneous-dependencies
import DefaultStyleGuide from 'react-styleguidist/lib/client/rsg-components/StyleGuide';
import FontStager from '../components/FontStager';

// export default function StyleGuideRenderer({ classes, title, homepageUrl, children }) {
export default function StyleGuide({ children }, ...props) {
  // console.log(props); // nothing there!
  // we need title, toc, sections, etc...
  return (
  <>
    <FontStager />
    <DefaultStyleGuide
      {...props}>
      {children}
    </DefaultStyleGuide>
  </>
  );
}
