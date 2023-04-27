
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import HomePageCardContainer from '.';
import { renderWithProviders } from '../../../test/test-utils';

const values = 'test';
const isDragInProgress = false;
const isTileDragged = false;
const isDrag = true;
const isTileNotDragged = true;

describe('testing HomePageCardContainer Component', () => {
  test('should render the same text passed into props when tile is not in drag in progress and not dragged', async () => {
    renderWithProviders(<HomePageCardContainer isDragInProgress={isDragInProgress} isTileDragged={isTileDragged} >{values}</HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.mouseEnter(value);
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    fireEvent.mouseLeave(value);
    expect(svgEl).not.toBeInTheDocument();
  });

  test('should render the same text passed into props when tile is dragged', async () => {
    renderWithProviders(<HomePageCardContainer isDragInProgress={isDrag} isTileDragged={isTileNotDragged}> {values} </HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.drag(value);
    const svgEl = document.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
  });
  test('should render the same text passed into props when tile is drag in progress and not completely dragged', async () => {
    renderWithProviders(<HomePageCardContainer isDragInProgress={isDrag} isTileDragged={isTileDragged}> {values} </HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.mouseEnter(value);
    const svgEl = document.querySelector("[id='dragHandle']");

    expect(svgEl).toBeInTheDocument();
  });
});

