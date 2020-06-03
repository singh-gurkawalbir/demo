import React from 'react';
import FontStager from '../components/FontStager';
// Import default implementation from react-styleguidist using the full path
import DefaultStyleGuide from 'react-styleguidist/lib/client/rsg-components/StyleGuide';

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
