import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { signOut } from 'aws-amplify/auth';
import { redirect } from 'next/navigation';

// Propsの型定義
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * サインアウトモーダルコンポーネント
 *
 * @param {object} props - プロパティオブジェクト
 * @param {boolean} props.isOpen - モーダルが表示されているかどうか
 * @param {() => void} props.onClose - モーダルを閉じるためのコールバック関数
 * @returns {JSX.Element} サインアウトモーダルコンポーネント
 */
export default function SignOutModal({ isOpen, onClose }: Props) {
  /**
   * サインアウトボタンがクリックされた時に実行されるハンドラー
   */
  const handleSignOut = async () => {
    try {
      // サインアウトモーダルを閉じる
      onClose();
      // AWS Amplifyのサインアウトを実行
      await signOut();
      // clientページへリダイレクト
      redirect('/');
    } catch (error) {
      // エラーハンドリング
      throw new Error(`サインアウトに失敗しました。${error as string}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>サインアウトしますか？</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* サインアウトの説明 */}
          <Text>サインアウトを行いクライアント画面にリダイレクトします。</Text>
          {/* 注意書き */}
          <Text color='gray' fontSize='12px' pt='2'>
            ※ 管理画面アクセス時に再度サインインを求められます。
          </Text>
        </ModalBody>
        {/* モーダルフッター */}
        <ModalFooter>
          {/* キャンセルボタン */}
          <Button variant='ghost' mr={3} onClick={onClose}>
            キャンセル
          </Button>
          {/* サインアウトボタン */}
          <Button colorScheme='teal' onClick={handleSignOut}>
            サインアウト
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
