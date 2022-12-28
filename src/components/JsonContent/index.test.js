
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import JsonContent from '.';

describe('jsonContent UI tests', () => {
  test('should render the json content in object form', () => {
    const props = {json: '{"name":"John", "age":30, "car":null}'};

    renderWithProviders(<JsonContent {...props} />);
    expect(screen.queryByText('{"name":"John", "age":30, "car":null}')).toBeNull();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/30/i)).toBeInTheDocument();
  });
  test('should render empty DOM when Json is not passed', () => {
    const {utils} = renderWithProviders(<JsonContent />);

    expect(utils.container).toContainHTML('<div class="makeStyles-jsonPrettier-2"><pre class="__json-pretty-error__"></pre></div>');
  });
});
