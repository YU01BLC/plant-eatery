import { Authenticator } from '@aws-amplify/ui-react';
import {
  Avatar,
  Box,
  Button,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';

// AWS S3の設定
const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

/**
 * 管理画面コンポーネント
 * @returns {JSX.Element} 管理画面コンポーネント
 */
export default function Admin() {
  // モーダルの状態を管理するためのフック
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // ルーティングのためのフック
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * ファイルを選択するダイアログを開く
   */
  const fileUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  /**
   * 画像の選択時に実行されるハンドラー
   * @param {ChangeEvent<HTMLInputElement>} target - input要素の変更イベント
   */
  const handleImageChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { files } = target; // target オブジェクトからファイルの情報を取得
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prevImageFiles) => [...prevImageFiles, ...newFiles]); // 新たに選択されたファイルを既存の画像ファイル配列に追加
    }
  };

  /**
   * 画像情報を保存する
   * @param {string} imageId - 画像ID
   * @returns {Promise<void>} Promise
   */
  const saveImageInfo = async (imageId: string): Promise<void> => {
    // DynamoDBへの保存処理を実装予定
  };

  /**
   * 画像をアップロードする
   * @param {File} file - アップロードするファイル
   * @param {string} imageId - 画像ID
   * @returns {Promise<void>} Promise
   */
  const uploadImage = async (file: File, imageId: string): Promise<void> => {
    const params = {
      Bucket: config.bucketName ? config.bucketName : '',
      Key: imageId,
      ContentType: file.type,
      Body: file,
    };

    try {
      await s3.upload(params).promise(); // S3にファイルをアップロードするための非同期メソッド
      await saveImageInfo(imageId);
    } catch (error) {
      console.error('画像のアップロードに失敗しました', error);
    }
  };

  /**
   * 画像をアップロードするハンドラー
   */
  const handleImageUpload = async () => {
    if (imageFiles.length === 0) {
      console.error('画像を選択してください');
      return;
    }

    try {
      const uploads = imageFiles.map((file, index) => {
        const imageId = `image_id_${Date.now()}_${index}`;
        return uploadImage(file, imageId); // 画像名を渡す
      });

      await Promise.all(uploads); // uploads配列内の全ての非同期処理(全ての画像ファイルをS3にアップロード)完了を待機

      // Stateをリセット
      setImageFiles([]);
      console.log('画像がアップロードされました');
    } catch (error) {
      console.error('画像のアップロードに失敗しました', error);
    }
  };

  /**
   * サインアウトボタンがクリックされた時に実行されるハンドラー
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

            {/* 画像入力フォーム */}
            <VStack spacing={6} align='center' mt='4'>
              <Box>
                <Text cursor='pointer' textDecoration='underLine 1px' textUnderlineOffset='3px' onClick={fileUpload}>
                  ファイルを選択
                </Text>
                <Input type='file' display='none' ref={inputRef} onChange={handleImageChange} />
              </Box>
              <Box display='flex' mb='2'>
                <Text fontWeight='bold'>選択されたファイル:&ensp;</Text>
                {imageFiles[0] ? <Text>{imageFiles[0].name}</Text> : <Text>未選択</Text>}
              </Box>
              {imageFiles[0] && (
                <Box>
                  <Image
                    src={imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : ''}
                    alt={`image_name${String(imageFiles[0])}`}
                    w='300px'
                  />
                </Box>
              )}
              {/* 画像をアップロードするボタン */}
              <Button colorScheme='teal' onClick={handleImageUpload}>
                画像をアップロード
              </Button>
            </VStack>
          </>
        )}
      </Authenticator>
    </Box>
  );
}
