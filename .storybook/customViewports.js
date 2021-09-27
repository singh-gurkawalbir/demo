import React from 'react';

//  export default function customViewPort(name, size){
//     const {width, height} = size;
//     return {
//         name:{
//             name: name,
//             styles:{
//                 width: `${width}px`,
//                 height: `${height}px`,
//             }
//         }
       
//     }
// }


const customViewports = {
    Small: {
      name: 'small',
      styles: {
        width: '1024px',
        height: '1200px',
      },
    },
    Medium: {
      name: 'medium',
      styles: {
        width: '1260px',
        height: '1200px',
      },
    },
    xLarge: {
      name: 'large',
      styles: {
        width: '1900px',
        height: '1200px',
      },
    },
  };

  export default customViewports;

