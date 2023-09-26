import { Box, Button, CardBody, Image, Input, Text, Textarea } from '@chakra-ui/react';
import { ChangeEvent, useContext, useRef, useState } from 'react';

import { MainCardContext } from '../../page/admin';
import MonthSelect from '../adminParts/months';
import { StarIcon } from '@chakra-ui/icons';

/**
 * メインカードコンポーネント
 * @returns {JSX.Element} メインカードコンポーネント
 */
export default function MainCard() {
  const {
    imageFile,
    date,
    description,
    handleImageDelete,
    errorFlg,
    setImageFile,
    setDate,
    setDescription,
    setMainImageFlg,
    setErrorFlg,
  } = useContext(MainCardContext);

  const inputRef = useRef<HTMLInputElement | null>(null);
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
   * 画像説明の変更ハンドラー
   * @param {string} descriptions - 画像の説明
   */
  const handleDescriptionChange = (text: string) => {
    if (text === '') {
      setErrorFlg(true);
    } else {
      setErrorFlg(false);
    }
    setDescription([text]);
  };

  /**
   * 日付の変更ハンドラー
   * @param {string} dates - 新しい日付情報
   */
  const handleDateChange = (dates: string[]) => {
    setDate(dates);
  };

  return (
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
        <Box mb='3' display={{ md: 'flex' }} alignItems='center'>
          <Text fontWeight='bold'>日付:&ensp;</Text>
          <Box display='flex' alignItems='center'>
            {/* MonthSelectコンポーネントを使用して月を選択 */}
            <MonthSelect
              selectedMonth={date[0]}
              onChange={(selectedMonth) => handleDateChange([selectedMonth, date[1]])}
            />
            <Text px='2'>~</Text>
            <MonthSelect
              selectedMonth={date[1]}
              onChange={(selectedMonth) => handleDateChange([date[0], selectedMonth])}
            />
          </Box>
        </Box>
        {imageFile[0] && (
          <Box mb='3'>
            <Image src={URL.createObjectURL(imageFile[0])} alt={`plant/${String(imageFile[0].name)}`} w='400px' />
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
        {errorFlg && (
          <Text color='red' fontSize='13px' mt='1'>
            説明文は必須です。
          </Text>
        )}
      </Box>
    </CardBody>
  );
}
