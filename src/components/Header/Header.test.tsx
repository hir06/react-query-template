import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';

describe('Header', () => {
  test('renders App header with the given name', () => {
    render(<Header appName='welcome world' />);
    expect(screen.getByText('welcome world')).toBeInTheDocument();
  });
});