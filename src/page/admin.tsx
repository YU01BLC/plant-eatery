import { useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Heading,
  Button,
  VStack,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

/**
 * 管理画面コンポーネント
 * @returns {JSX.Element} 管理画面コンポーネント
 */
export default function Admin() {
  // モーダルの状態を管理するためのフック
  const { isOpen, onOpen, onClose } = useDisclosure();
  // ルーティングのためのフック
  const navigate = useNavigate();

  /**
   * サインアウト実行ハンドラ
   * @returns {void}
   */
  const handleSignOut = async () => {
    try {
      // サインアウトモーダルを閉じる
      onClose();
      // AWS Amplifyのサインアウトを実行
      await Auth.signOut();
      // clientページへリダイレクト
      navigate('/');
    } catch (error) {
      // エラーハンドリング
      console.error('SignOut failed:', error);
    }
  };

  return (
    <Box mt='2'>
      {/* Amplify Authenticatorでユーザー認証を行う */}
      <Authenticator hideSignUp={true}>
        {({ user }) => (
          <>
            {/* ヘッダータイトル */}
            <Heading as='h1' size='lg' textAlign='center' position='relative'>
              Admin view
            </Heading>
            {/* サインインユーザー情報表示 */}
            <VStack position='absolute' right='4' top='2'>
              <Box textAlign='right'>
                <Box display='flex' mr='2'>
                  {/* ユーザーアバター */}
                  <Avatar size='sm' bg='teal.500' mr='1.5' />
                  {/* 認証ユーザー名 */}
                  <Text
                    pt='0.5'
                    fontWeight='bold'
                    textDecoration='underLine 1px'
                    textUnderlineOffset='3px'
                    cursor='pointer'
                    // ユーザー名クリック時にサインアウトモーダルを開く
                    onClick={onOpen}
                  >
                    {user?.username}
                  </Text>
                </Box>
              </Box>
              {/* サインアウト確認モーダル */}
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
            </VStack>
          </>
        )}
      </Authenticator>
    </Box>
  );
}
