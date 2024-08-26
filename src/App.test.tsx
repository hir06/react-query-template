import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Invitation For Partners Events', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home component/i);
  expect(linkElement).toBeInTheDocument();
});
