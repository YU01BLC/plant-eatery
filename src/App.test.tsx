import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('パス「/admin」アクセス時に`Adminコンポーネント`が表示されること', () => {
  // テスト用のメモリルーターを作成し、初期エントリーとして'/admin'を設定する
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <App />
    </MemoryRouter>
  );
});

test('パス「/Admin」以外のアクセス時に`Indexコンポーネント`が表示されること', () => {
  // テスト用のメモリルーターを作成し、初期エントリーとして'/random-path'を設定する
  render(
    <MemoryRouter initialEntries={['/random-path']}>
      <App />
    </MemoryRouter>
  );
});
