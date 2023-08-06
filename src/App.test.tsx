import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Textタグにラップされている文言「Hello World」の表示確認', () => {
  render(<App />);
  const textElement = screen.getByText('Hello World');
  expect(textElement).toBeInTheDocument();
});
