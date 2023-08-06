import { render, screen } from '@testing-library/react';
import Index from '../page/index';

test('Textタグにラップされている文言「User view」の表示確認', () => {
  render(<Index />);
  const textElement = screen.getByText(/User view/i);
  expect(textElement).toBeInTheDocument();
});
