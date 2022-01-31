import React from 'react';
import { MemoryRouter } from 'react-router-dom';

export default function withRouter(Story, context) {
  return (
    <MemoryRouter>
      <Story {...context} />
    </MemoryRouter>
  );
}
