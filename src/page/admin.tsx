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
import React, { ChangeEvent, createContext, useRef, useState } from 'react';

import AWS from 'aws-sdk';
import { Authenticator } from '@aws-amplify/ui-react';
import MainCard from '../components/adminParts/mainCard';
import MonthSelect from '../components/adminParts/months';
import SignOutModal from '../components/adminParts/signOutModal';
import { StarIcon } from '@chakra-ui/icons';
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
 * @property {Function} setMainImageFlg - メイン画像が設定されていることを判別するフラグ関数
 */
type MainCardProps = {
  imageFile: File[];
  date: string[];
  description: string[];
  handleImageDelete: () => void;
  setImageFile: React.Dispatch<React.SetStateAction<File[]>>;
  setDate: React.Dispatch<React.SetStateAction<string[]>>;
  setDescription: React.Dispatch<React.SetStateAction<string[]>>;
  setMainImageFlg: React.Dispatch<React.SetStateAction<boolean>>;
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
};

/**
 * MainCard コンテキスト
 * @type {React.Context<MainCardProps>}
 */
export const MainCardContext = createContext<MainCardProps>({
  imageFile: [],
  date: [],
  description: [],
  handleImageDelete: () => {},
  setImageFile: () => {},
  setDate: () => {},
  setDescription: () => {},
  setMainImageFlg: () => {},
});

/**
 * SubCard コンテキスト
 * @type {React.Context<SubCardProps>}
 */
export const SubCardContext = createContext<SubCardProps>({
  subImageFile: [],
  subDescription: [],
});

/**
 * 管理画面コンポーネント
 * @returns {JSX.Element} 管理画面コンポーネント
 */
export default function Admin() {
  /** mainCardState */
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const [description, setDescription] = useState<string[]>([]);
  /** subCardState */
  const [subImageFile, setSubImageFile] = useState<File[]>([]);
  const [subDescription, setSubDescription] = useState<string[]>([]);
  /** otherState */
  const [mainImageFlg, setMainImageFlg] = useState<boolean>(false);

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
    const { files } = target; // target オブジェクトからファイルの情報を取得
    if (files) {
      const newFiles = Array.from(files);
      setSubImageFile((prevImageFiles) => [...prevImageFiles, ...newFiles]); // 新たに選択されたファイルを既存の画像ファイル配列に追加
    }
  };

  /**
   * 画像の削除ハンドラー
   */
  const handleImageDelete = () => {
    setImageFile([]);
    setSubImageFile([]);
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

      const uploads = subImageFile.map((file, index) => {
        const childImageId = `plant/sub/${Date.now()}_${index}`;
        return uploadImage(file, childImageId); // 子画像をアップロード
      });

      await Promise.all(uploads);

      setImageFile([]);
      setSubImageFile([]);
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
                  <MainCardContext.Provider
                    value={{
                      imageFile,
                      date,
                      description,
                      handleImageDelete,
                      setImageFile,
                      setDate,
                      setDescription,
                      setMainImageFlg,
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
                      }}
                    >
                      <SubCard index={index} item={item} />
                    </SubCardContext.Provider>
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
