/* global describe, test, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePageCardContainer from '.';

const values = 'test';
const isDragInProgress = false;
const isTileDragged = false;
const isDrag = true;
const isTileNotDragged = true;

describe('Testing HomePageCardContainer Component', () => {
  test('should render the same text passed into props when tile is not in drag in progress and not dragged', async () => {
    const {container} = render(<HomePageCardContainer isDragInProgress={isDragInProgress} isTileDragged={isTileDragged} >{values}</HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.mouseEnter(value);
    const svgEl = container.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
    fireEvent.mouseLeave(value);
    expect(svgEl).not.toBeInTheDocument();
  });

  test('should render the same text passed into props when tile is dragged', async () => {
    const {container} = render(<HomePageCardContainer isDragInProgress={isDrag} isTileDragged={isTileNotDragged}> {values} </HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.drag(value);
    const svgEl = container.querySelector("[viewBox='0 0 24 24']");

    expect(svgEl).toBeInTheDocument();
  });
  test('should render the same text passed into props when tile is drag in progress and not completely dragged', async () => {
    const {container} = render(<HomePageCardContainer isDragInProgress={isDrag} isTileDragged={isTileDragged}> {values} </HomePageCardContainer>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
    fireEvent.mouseEnter(value);
    const svgEl = container.querySelector("[id='dragHandle']");

    expect(svgEl).toBeInTheDocument();
  });
});

