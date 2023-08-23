import { useState } from 'react';
import myAxios from '../../ultils/myAxios';
import useEnterListener from '../../hooks/useEnterEvent';
import { useCountDown } from '../../hooks/useCountDown';
import Button from '../button/Button';
import { useNavigate } from 'react-router-dom';

const HelpForm = () => {
  const [helpData, setHelpData] = useState({
    problem: '',
    describe: '',
    email: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagValue, setTagValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { problem, describe, email } = helpData;
    if (!problem || !describe || !email) {
      setErrorMessage('Please fill out the form before submitting!');
      return;
    } else {
      const data = {
        problem,
        describe,
        email,
        tags,
      };
      const res = await myAxios.post('/report', data);
      if (res.status === 200 || res.status === 201) {
        // redirect
        navigate('/help/success');
      } else {
        setErrorMessage('Have some error, please try again!');
      }
    }
  };

  const handleAddTag = () => {
    setTags((prev) => [tagValue, ...prev]);
    setTagValue('');
  };

  const handleDeleteTag = (tag: string) => {
    setTags((prev) => prev.filter((data) => data !== tag));
  };

  useEnterListener(handleAddTag, tagValue);

  useCountDown(
    errorMessage !== '',
    () => setErrorMessage(''),
    errorMessage,
    5000
  );

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div className='flex flex-col'>
        <label htmlFor='list' className='text-lg font-semibold text-gray-600'>
          What list are you looking for ?
        </label>
        <input
          type='text'
          className='outline-none border-none px-4 py-2 rounded-lg bg-[#f7f9f8]'
          id='list'
          value={helpData.problem}
          onChange={(e: any) =>
            setHelpData({
              ...helpData,
              problem: e?.target?.value,
            })
          }
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor='tags' className='text-lg font-semibold text-gray-600'>
          Please Few Primary Tags ?
        </label>
        <div className='w-full'>
          <input
            type='text'
            className='outline-none border-none px-4 py-2 rounded-lg bg-[#f7f9f8] w-full'
            id='tags'
            value={tagValue}
            onChange={(e: any) => {
              setTagValue(e?.target?.value);
            }}
          />
          {tags.length !== 0 && (
            <div className='flex gap-2 mt-2'>
              {tags.map((tag, idx) => (
                <div key={idx}>
                  <span className='bg-[#e6e7e6] px-3 py-1 rounded'>{tag}</span>
                  <span
                    onClick={() => handleDeleteTag(tag)}
                    className='text-sm cursor-pointer p-1 rounded-full'
                  >
                    x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <label
          htmlFor='describe'
          className='text-lg font-semibold text-gray-600'
        >
          Please desribe your list needs ?
        </label>
        <textarea
          className='outline-none border-none px-4 py-2 rounded-lg bg-[#f7f9f8]'
          id='describe'
          rows={5}
          value={helpData.describe}
          onChange={(e: any) =>
            setHelpData({
              ...helpData,
              describe: e?.target?.value,
            })
          }
        ></textarea>
      </div>

      <div className='flex flex-col'>
        <label htmlFor='tags' className='text-base font-semibold text-gray-600'>
          Enter your Email so we can help you solve the problem
        </label>
        <input
          type='text'
          className='outline-none border-none px-4 py-2 rounded-lg bg-[#f7f9f8]'
          id='email'
          value={helpData.email}
          onChange={(e: any) =>
            setHelpData({
              ...helpData,
              email: e?.target?.value,
            })
          }
        />
      </div>

      <div>
        <Button
          text='Submit'
          className='bg-blue-500 text-white border-none outline-none py-2 mt-4 w-full'
          textSize='text-lg'
        />
        {errorMessage !== '' && (
          <span className='text-red-500 text-xs'>{errorMessage}</span>
        )}
      </div>
    </form>
  );
};

export default HelpForm;
