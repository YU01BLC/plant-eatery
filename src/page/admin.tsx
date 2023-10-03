import { Authenticator } from '@aws-amplify/ui-react';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardFooter,
  Divider,
  Heading,
  Input,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import AWS from 'aws-sdk';
import React, { ChangeEvent, createContext, useRef, useState } from 'react';
import MainCard from '../components/adminParts/mainCard';
import SignOutModal from '../components/adminParts/signOutModal';
import SubCard from '../components/adminParts/subCard';
import { config } from '../config/config';

/** AWS S3の設定 */
const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

/**
 * MainCard コンポーネントのプロパティ型
 * @typedef {Object} MainCardProps
 * @property {File[]} imageFile - メイン画像のファイル
 * @property {string[]} date - 日付情報
 * @property {string[]} description - 画像の説明
 * @property {Function} handleImageDelete - 画像の削除ハンドラー
 * @property {Function} setImageFile - 画像ファイルを設定する関数
 * @property {Function} setDate - 日付情報を設定する関数
 * @property {Function} setDescription - 画像の説明を設定する関数
 */
type MainCardProps = {
  imageFile: File[];
  date: string[];
  description: string[];
  errorFlg: boolean;
  handleImageDelete: () => void;
  setImageFile: React.Dispatch<React.SetStateAction<File[]>>;
  setDate: React.Dispatch<React.SetStateAction<string[]>>;
  setDescription: React.Dispatch<React.SetStateAction<string[]>>;
  setErrorFlg: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * SubCard コンポーネントのプロパティ型
 * @typedef {Object} SubCardProps
 * @property {File[]} subImageFile - サブ画像のファイル
 * @property {string[]} subDescription - サブ画像の説明
 */
type SubCardProps = {
  subImageFile: File[];
  subDescription: string[];
  setSubDescription: React.Dispatch<React.SetStateAction<string[]>>;
  setErrorFlg: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * MainCard コンテキスト
 * @type {React.Context<MainCardProps>}
 */
export const MainCardContext = createContext<MainCardProps>({
  imageFile: [],
  date: [],
  description: [],
  errorFlg: false,
  handleImageDelete: () => {},
  setImageFile: () => {},
  setDate: () => {},
  setDescription: () => {},
  setErrorFlg: () => {},
});

/**
 * SubCard コンテキスト
 * @type {React.Context<SubCardProps>}
 */
export const SubCardContext = createContext<SubCardProps>({
  subImageFile: [],
  subDescription: [],
  setSubDescription: () => {},
  setErrorFlg: () => {},
});

/**
 * 管理画面コンポーネント
 * @returns {JSX.Element} 管理画面コンポーネント
 */
export default function Admin() {
  /** mainCardState */
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [date, setDate] = useState<string[]>(['1', '2']);
  const [description, setDescription] = useState<string[]>([]);
  /** subCardState */
  const [subImageFile, setSubImageFile] = useState<File[]>([]);
  const [subDescription, setSubDescription] = useState<string[]>([]);
  /** otherState */
  const [errorFlg, setErrorFlg] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const subInputRef = useRef<HTMLInputElement | null>(null);

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
  const handleAddSubImage = ({ target }: ChangeEvent<HTMLInputElement>) => {
    // target オブジェクトからファイルの情報を取得
    const { files } = target;
    if (files) {
      const newFiles = Array.from(files);
      // 新たに選択されたファイルを既存の画像ファイル配列に追加
      setSubImageFile((prevImageFiles) => [...prevImageFiles, ...newFiles]);
    }
  };

  /**
   * 画像の削除ハンドラー
   */
  const handleImageDelete = () => {
    setImageFile([]);
    setSubImageFile([]);
    setErrorFlg(true);
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
   * @throws {Error} 画像のアップロードに失敗した場合
   */
  const uploadImage = async (file: File, imageId: string): Promise<void> => {
    const params = {
      Bucket: config.bucketName ? config.bucketName : '',
      Key: imageId,
      ContentType: file.type,
      Body: file,
    };

    try {
      // S3にファイルをアップロードするための非同期メソッド
      await s3.upload(params).promise();
      await saveImageInfo(imageId);
    } catch (error) {
      throw new Error(`画像のアップロードに失敗しました。${error as string}`);
    }
  };

  /**
   * ステートを初期化するハンドラー
   */
  const handleInitializeState = () => {
    setImageFile([]);
    setSubImageFile([]);
    setDescription(['']);
    setSubDescription(['']);
    // console.log('画像がアップロードされました'); 後続対応にてモーダル表示処理追加予定
  };

  /**
   * 画像をアップロードするハンドラー
   * @throws {Error} 画像のアップロードに失敗した場合
   */
  const handleImageUpload = async () => {
    if (imageFile.length === 0 || description.length === 0) {
      setErrorFlg(true);
      return;
    }

    try {
      const parentImageId = `plant/${Date.now()}`;
      // 親画像をアップロード
      await uploadImage(imageFile[0], parentImageId);
      const uploads = subImageFile.map((file, index) => {
        const childImageId = `plant/sub/${Date.now()}_${index}`;
        // 子画像をアップロード
        return uploadImage(file, childImageId);
      });
      await Promise.all(uploads);
      handleInitializeState();
    } catch (error) {
      throw new Error(`画像のアップロードに失敗しました。${error as string}`);
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
                  <MainCardContext.Provider
                    value={{
                      imageFile,
                      date,
                      description,
                      errorFlg,
                      handleImageDelete,
                      setImageFile,
                      setDate,
                      setDescription,
                      setErrorFlg,
                    }}
                  >
                    <MainCard />
                  </MainCardContext.Provider>

                  {subImageFile.map((item, index) => (
                    <SubCardContext.Provider
                      key={index}
                      value={{
                        subImageFile,
                        subDescription,
                        setSubDescription,
                        setErrorFlg,
                      }}
                    >
                      <SubCard index={index} item={item} />
                    </SubCardContext.Provider>
                  ))}
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing='2'>
                      <Button colorScheme='teal' onClick={subFileUpload} isDisabled={!imageFile[0]}>
                        サブ画像追加
                      </Button>
                      <Input type='file' display='none' ref={subInputRef} onChange={handleAddSubImage} />
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </Box>
              {/* 画像をアップロードするボタン */}
              <Button
                type='submit'
                colorScheme='teal'
                onClick={handleImageUpload}
                isDisabled={!imageFile[0] || !description[0] || errorFlg}
              >
                画像をアップロード
              </Button>
            </VStack>
          </>
        )}
      </Authenticator>
    </Box>
  );
}
