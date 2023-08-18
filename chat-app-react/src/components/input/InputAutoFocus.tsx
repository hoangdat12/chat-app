import { Dispatch, FC, SetStateAction } from 'react';
import useEnterListener from '../../hooks/useEnterEvent';

export interface IProps {
  newNameGroup: string;
  setNewNameGroup: Dispatch<SetStateAction<string>>;
  inputRef: any;
  handlerEnter: () => void;
}

const InputAutoFocus: FC<IProps> = ({
  newNameGroup,
  setNewNameGroup,
  inputRef,
  handlerEnter,
}) => {
  useEnterListener(handlerEnter, newNameGroup);

  return (
    <input
      type='text'
      className={`outline-none bg-transparent`}
      value={newNameGroup}
      onChange={(e) => setNewNameGroup(e.target.value)}
      ref={inputRef}
      autoFocus
    />
  );
};

export default InputAutoFocus;
