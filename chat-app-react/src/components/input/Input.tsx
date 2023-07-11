import { FC, useState } from 'react';
import { IParticipant } from '../../ultils/interface';
import { useAppDispatch } from '../../app/hook';
import { changeUsernameOfConversation } from '../../features/conversation/conversationSlice';
import { useParams } from 'react-router-dom';

export interface IInputProp {
  defaultValue: string;
  participant: IParticipant;
}

const Input: FC<IInputProp> = ({ defaultValue, participant }) => {
  const [value, setValue] = useState(defaultValue);
  const dispatch = useAppDispatch();
  const { conversationId } = useParams();
  const handleBlur = () => {
    if (value !== defaultValue && conversationId) {
      const data = {
        conversationId,
        newUsernameOfParticipant: {
          ...participant,
          userName: value,
        },
      };
      dispatch(changeUsernameOfConversation(data));
    }
  };

  return (
    <input
      type='text'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      className='w-full border outline-none p-2'
    />
  );
};

export default Input;
