import { render, screen } from '@testing-library/react';
import Admin from '../page/admin';

test('Textタグにラップされている文言「Admin view」の表示確認', () => {
  render(<Admin />);
  const textElement = screen.getByText(/Admin view/i);
  expect(textElement).toBeInTheDocument();
});
