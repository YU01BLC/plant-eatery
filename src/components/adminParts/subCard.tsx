import { Box, CardBody, Image, Text, Textarea } from '@chakra-ui/react';
import { ChangeEvent, useContext, useRef } from 'react';

import { SubCardContext } from '../../page/admin';

interface Props {
  index: number;
  item: File;
}
/**
 * サブカードコンポーネント
 * @returns {JSX.Element} サブカードコンポーネント
 */
export default function SubCard({ index, item }: Props) {
  const { subImageFile, subDescription } = useContext(SubCardContext);

  /**
   * サブ画像の説明の変更ハンドラー
   * @param {number} num - サブ画像のインデックス
   * @param {string} subDescriptions - サブ画像の説明
   */
  const handleAddSubDescription = (num: number, subDescriptions: string) => {};

  return (
    <CardBody>
      <Box>
        <Box display={{ md: 'flex' }}>
          <Text fontWeight='bold'>ファイル名:&ensp;</Text>
          <Text mb='3'>{subImageFile.length > 0 ? subImageFile[index].name : '未選択'}</Text>
        </Box>
        <Box mb='3'>
          <Image
            src={URL.createObjectURL(item)}
            alt={`plant/sub/${String(subImageFile[0].name)}`}
            m='0 auto'
            w='300px'
          />
        </Box>
        <Text fontWeight='bold'>画像説明:</Text>
        <Textarea
          placeholder='画像の説明を入力'
          value={subDescription[0] || ''}
          onChange={(event) => handleAddSubDescription(0, event.target.value)}
          borderColor='gray.600'
          borderRadius='md'
          px={3}
          py={2}
        />
      </Box>
    </CardBody>
  );
}
