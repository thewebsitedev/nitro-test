import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

test('renders first week text', () => {
  render(<App />);
  const weekText = screen.getByText(/Week 11, Year 2019/i);
  expect(weekText).toBeInTheDocument();
});

test('filter provides three options', () => {
  render(<App />);
  expect(screen.getAllByRole('option').length).toBe(3);
});

test('default filter option is week', () => {
  render(<App />);
  const select = screen.getByDisplayValue('Week');
  expect(select).toHaveClass('filter');
});

test('updates filtered posts on filter change', async () => {
  render(<App />);
  const filterSelect = screen.getByTestId('filter');

  // Change the filter to 'location'
  fireEvent.change(filterSelect, { target: { value: 'location' } });

  // Wait for the component to update based on the filter change
  await waitFor(() => {
    // Assuming you have headings or some identifiable text for each location group
    const sanFranciscoGroup = screen.getAllByText('San Francisco');

    // Check if the headings for each group are present
    expect(sanFranciscoGroup[0]).toHaveClass('posts-title')
  });
});