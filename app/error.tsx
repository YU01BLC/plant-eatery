'use client';

import Image from 'next/image';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        height: '100vh',
        padding: '5%',
      }}
    >
      <div style={{ marginBottom: '20px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '10%' }}>エラーが発生しました!</h1>
        <p>
          時間をおいてから
          <button style={{ color: 'blue', fontWeight: '600' }} onClick={() => reset()}>
            再読み込み
          </button>
          を行ってください。
        </p>
        <p style={{ marginTop: '1em' }}>再読み込みを行っても解決しない場合は、お手数ですが管理者に連絡してください。</p>
        <p>Mail: bgc00magenta@gmail.com</p>
        <Image src='/sorry.png' width={'500'} height={'500'} art='apology image' />
      </div>
    </div>
  );
}
