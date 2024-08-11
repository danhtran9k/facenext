type TSelected<Multi = false> = Multi extends true ? File[] : File;
type Mid = boolean | undefined;

type TBtn = React.ButtonHTMLAttributes<HTMLButtonElement>;

type TBtnProps = TBtn & {
  children?: React.ReactNode;
  accept: string;
  className?: string;
  btnCustom?: React.ReactNode;
  // onFileSelected: () => void;
};

type TSelectMulti = (selected: File[]) => void;
type TSelectSingle = (selected: File) => void;

export type BtnFileInputProps =
  | (TBtnProps & {
      isMultiple: true;
      onSelectedSingle?: never;
      onSelectedMulti: TSelectMulti;
      // onFileSelected: (selected: File[]) => void;
    })
  | (TBtnProps & {
      isMultiple?: false;
      onSelectedMulti?: never;
      onSelectedSingle: TSelectSingle;
      // onFileSelected: (selected: File) => void;
    });
