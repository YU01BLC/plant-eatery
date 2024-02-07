import create from 'zustand';

/**
 * MainCard コンポーネントの状態型
 */
type MainCardState = {
  imageFile: File[];
  date: string[];
  description: string[];
};

/**
 * SubCard コンポーネントの状態型
 */
type SubCardState = {
  subImageFile: File[];
  subDescription: string[];
};

/**
 * 共通の状態型
 */
type OtherState = {
  errorFlg: boolean;
};

/**
 * MainCard コンポーネントのアクション型
 */
type MainCardActions = {
  // 画像ファイルを設定する関数
  setImageFile: (newImageFile: File[]) => void;
  // 日付情報を設定する関数
  setDate: (newDate: string[]) => void;
  // 画像の説明を設定する関数
  setDescription: (newDescription: string[]) => void;
};

/**
 * SubCard コンポーネントのアクション型
 */
type SubCardActions = {
  // サブ画像ファイルを設定する関数
  setSubImageFile: (newImageFile: File[]) => void;
  // サブ画像の説明を設定する関数
  setSubDescription: (newSubDescription: string[]) => void;
};

/**
 * 共通のアクション型
 */
type OtherActions = {
  // エラーフラグを設定する関数
  setErrorFlg: (newErrorFlg: boolean) => void;
};

/**
 * MainCard コンポーネントのプロパティ型
 */
type MainCardProps = MainCardState & MainCardActions;

/**
 * SubCard コンポーネントのプロパティ型
 */
type SubCardProps = SubCardState & SubCardActions;

/**
 * 共通のプロパティ型
 */
type OtherProps = OtherState & OtherActions;

// MainCardの状態を管理するhook
export const useMainCardStore = create<MainCardProps>((set) => ({
  imageFile: [],
  date: [],
  description: [],
  setImageFile: (newImageFile) => set({ imageFile: newImageFile }),
  setDate: (newDate) => set({ date: newDate }),
  setDescription: (newDescription) => set({ description: newDescription }),
}));

// SubCardの状態を管理するhook
export const useSubCardStore = create<SubCardProps>((set) => ({
  subImageFile: [],
  subDescription: [],
  setSubImageFile: (newSubImageFile) => set({ subImageFile: newSubImageFile }),
  setSubDescription: (newSubDescription) => set({ subDescription: newSubDescription }),
}));

export const otherStore = create<OtherProps>((set) => ({
  errorFlg: false,
  setErrorFlg: (newErrorFlg) => set({ errorFlg: newErrorFlg }),
}));
