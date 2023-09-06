import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';

import AWS from 'aws-sdk';
import { Authenticator } from '@aws-amplify/ui-react';
import MonthSelect from '../components/adminParts/months';
import SignOutModal from '../components/adminParts/signOutModal';
import { StarIcon } from '@chakra-ui/icons';
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
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const [description, setDescription] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [mainImageFlg, setMainImageFlg] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const subInputRef = useRef<HTMLInputElement | null>(null);
  const [rating, setRating] = useState<number>(1);

  /**
   * スター評価がクリックされた時に実行されるハンドラー
   * @param {number} index - クリックされたスターのインデックス
   */
  const handleStarClick = (index: number) => {
    setRating(index);
    // サーバーに送信する処理を追加予定
  };

  /**
   * ファイルを選択するダイアログを開く
   */
  const fileUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  /**
   * ファイルを選択するダイアログを開く
   */
  const subFileUpload = () => {
    if (subInputRef.current) {
      subInputRef.current.click();
    }
  };

  /**
   * 画像の選択時に実行されるハンドラー
   * @param {ChangeEvent<HTMLInputElement>} target - input要素の変更イベント
   */
  const handleImageChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { files } = target; // target オブジェクトからファイルの情報を取得
    if (files) {
      const newFile = Array.from(files);
      setImageFile((prevImageFile) => [...prevImageFile, ...newFile]); // 新たに選択されたファイルを既存の画像ファイル配列に追加
      setMainImageFlg(true);
    }
  };

  /**
   * 画像の選択時に実行されるハンドラー
   * @param {ChangeEvent<HTMLInputElement>} target - input要素の変更イベント
   */
  const handleAddSubImage = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { files } = target; // target オブジェクトからファイルの情報を取得
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prevImageFiles) => [...prevImageFiles, ...newFiles]); // 新たに選択されたファイルを既存の画像ファイル配列に追加
    }
  };

  /**
   * 画像説明の変更ハンドラー
   * @param {string} text - 画像の説明テキスト
   */
  const handleDescriptionChange = (text: string) => {};

  /**
   * サブ画像の説明の変更ハンドラー
   * @param {number} index - サブ画像のインデックス
   * @param {string} subText - サブ画像の説明テキスト
   */
  const handleAddSubDescription = (index: number, subText: string) => {};

  /**
   * 日付の変更ハンドラー
   * @param {string} dates - 新しい日付情報
   */
  const handleDateChange = (dates: string) => {};

  /**
   * 画像の削除ハンドラー
   */
  const handleImageDelete = () => {
    setImageFile([]);
    setImageFiles([]);
    setMainImageFlg(false);
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
    if (imageFile.length === 0) {
      console.error('画像を選択してください');
      return;
    }

    try {
      const parentImageId = `plant/${Date.now()}`;
      await uploadImage(imageFile[0], parentImageId); // 親画像をアップロード

      const uploads = imageFiles.map((file, index) => {
        const childImageId = `plant/sub/${Date.now()}_${index}`;
        return uploadImage(file, childImageId); // 子画像をアップロード
      });

      await Promise.all(uploads);

      setImageFile([]);
      setImageFiles([]);
      console.log('画像がアップロードされました');
    } catch (error) {
      console.error('画像のアップロードに失敗しました', error);
    }
  };

  return (
    <Box my='4'>
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
            </VStack>
            <SignOutModal isOpen={isOpen} onClose={onClose} />
            {/* 画像入力フォーム */}
            <VStack spacing={6} align='center' mt='4'>
              <Box w='100%'>
                <Card size='md' mx='4' boxShadow='dark-lg' mb='3'>
                  <CardBody>
                    <Box display='flex' mb='3'>
                      <Text fontWeight='bold'>メイン画像:&ensp;</Text>
                      {imageFile[0] ? (
                        <Button colorScheme='orange' size='xs' onClick={handleImageDelete}>
                          画像を削除
                        </Button>
                      ) : (
                        <>
                          <Button type='submit' colorScheme='teal' size='xs' onClick={fileUpload}>
                            画像を選択
                          </Button>
                          <Input type='file' display='none' ref={inputRef} onChange={handleImageChange} />
                        </>
                      )}
                    </Box>
                    <Box>
                      <Box display={{ md: 'flex' }} mb='3'>
                        <Text fontWeight='bold'>ファイル名:&ensp;</Text>
                        <Text>{imageFile.length > 0 ? imageFile[0].name : '未選択'}</Text>
                      </Box>
                      <Box display={{ md: 'flex' }} mb='3' alignItems='center'>
                        <Text fontWeight='bold'>評価:&ensp;</Text>
                        <Box display='flex'>
                          {Array(5)
                            .fill('')
                            .map((_, i) => (
                              <StarIcon
                                key={i}
                                boxSize={5}
                                mr='0.5'
                                color={i < rating ? 'yellow.500' : 'gray.400'}
                                onClick={() => handleStarClick(i + 1)}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                        </Box>
                      </Box>
                      <Box display={{ md: 'flex' }} alignItems='center' mb='3'>
                        <Text fontWeight='bold'>日付:&ensp;</Text>
                        <Box display='flex' alignItems='center'>
                          <MonthSelect
                            selectedMonth={date[0] || '1'}
                            onChange={(selectedMonth) => handleDateChange(selectedMonth)}
                          />
                          <Text px='2'>~</Text>
                          <MonthSelect
                            selectedMonth={date[1] || '2'}
                            onChange={(selectedMonth) => handleDateChange(selectedMonth)}
                          />
                        </Box>
                      </Box>
                      {imageFile[0] && (
                        <Box mb='3'>
                          <Image
                            src={URL.createObjectURL(imageFile[0])}
                            alt={`plant/${String(imageFile[0].name)}`}
                            w='400px'
                          />
                        </Box>
                      )}
                      <Text fontWeight='bold'>画像説明:</Text>
                      <Textarea
                        placeholder='画像の説明を入力'
                        value={description[0] || ''}
                        onChange={(event) => handleDescriptionChange(event.target.value)}
                        borderColor='gray.600'
                        borderRadius='md'
                        px={3}
                        py={2}
                      />
                    </Box>
                  </CardBody>

                  {imageFiles.map((item, index) => (
                    <CardBody key={index}>
                      <Box>
                        <Box display={{ md: 'flex' }}>
                          <Text fontWeight='bold'>ファイル名:&ensp;</Text>
                          <Text mb='3'>{imageFiles.length > 0 ? imageFiles[index].name : '未選択'}</Text>
                        </Box>
                        <Box mb='3'>
                          <Image
                            src={URL.createObjectURL(item)}
                            alt={`plant/sub/${String(imageFiles[0].name)}`}
                            m='0 auto'
                            w='300px'
                          />
                        </Box>
                        <Text fontWeight='bold'>画像説明:</Text>
                        <Textarea
                          placeholder='画像の説明を入力'
                          value={description[0] || ''}
                          onChange={(event) => handleAddSubDescription(0, event.target.value)}
                          borderColor='gray.600'
                          borderRadius='md'
                          px={3}
                          py={2}
                        />
                      </Box>
                    </CardBody>
                  ))}
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing='2'>
                      <Button colorScheme='teal' onClick={subFileUpload} isDisabled={!mainImageFlg}>
                        サブ画像追加
                      </Button>
                      <Input type='file' display='none' ref={subInputRef} onChange={handleAddSubImage} />
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </Box>
              {/* 画像をアップロードするボタン */}
              <Button type='submit' colorScheme='teal' onClick={handleImageUpload} isDisabled={!mainImageFlg}>
                画像をアップロード
              </Button>
            </VStack>
          </>
        )}
      </Authenticator>
    </Box>
  );
}
