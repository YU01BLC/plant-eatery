import { Box, Select } from '@chakra-ui/react';

// MonthSelectPropsの型定義
interface MonthSelectProps {
  selectedMonth: string;
  onChange: (selectedMonth: string) => void;
}

/**
 * 月を選択するためのセレクトボックスコンポーネント
 *
 * @param {object} props - プロパティオブジェクト
 * @param {string} props.selectedMonth - 現在選択されている月（表示用の文字列）
 * @param {(selectedMonth: string) => void} props.onChange - 月が変更されたときに呼び出されるコールバック関数
 * @returns {JSX.Element} 月を選択するためのセレクトボックスコンポーネント
 */
export default function MonthSelect({ selectedMonth, onChange }: MonthSelectProps) {
  // 月の選択肢
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <Box border='1px' borderRadius='md' borderColor='gray.600'>
      {/* 月を選択するセレクトボックス */}
      <Select h='30px' value={selectedMonth} onChange={(event) => onChange(event.target.value)}>
        {/* 月の選択肢をマップしてオプションを生成 */}
        {months.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ))}
      </Select>
    </Box>
  );
}
