type TSelectMulti = (selected: File[]) => void;
type TSelectSingle = (selected: File) => void;

type TBtn = React.ButtonHTMLAttributes<HTMLButtonElement>;

type TBtnProps = {
  children?: React.ReactNode;
  accept: string;
  className?: string;
  btnCustom?: React.ReactNode;
};

type BtnFileInputPropsMulti = {
  isMultiple: true;
  onFileSelected: TSelectMulti;
};

type BtnFileInputPropsSingle = {
  isMultiple?: false;
  onFileSelected: TSelectSingle;
};

export type TFileInput = TBtnProps &
  (BtnFileInputPropsMulti | BtnFileInputPropsSingle);
