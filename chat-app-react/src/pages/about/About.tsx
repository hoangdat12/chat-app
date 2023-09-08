import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import './about.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='fixed top-6 right-6'>
        <Button
          text='Back to home'
          className='bg-blue-500 text-white px-4 sm:px-6 py-2 border-none'
          textSize='text-base sm:text-xl md:text-2xl'
          onClick={() => navigate('/')}
        />
      </div>
      <header className='masthead border-blue-500'>
        <p className='masthead-intro'>Hi, I'm</p>
        <h1 className='masthead-heading'>Hoang Dat!</h1>
      </header>
      <div className='w-full px-5 sm:px-6'>
        <div className='introduce intro'>
          <h1>Introduction</h1>
          <p>
            I'm a future Bacnk End developer who loves{' '}
            <span className='bold'>good design</span>,{' '}
            <span className='bold'>good food</span> and{' '}
            <span className='bold'>good people</span>. I am so excited about
            learning that make interactive webpage and design. I want to learn
            more in this field
          </p>
          <p>
            I love the web and all the awesome new technologies. I'm excited to
            learn a new things that make the web more beautiful, functional, and
            perfect.
          </p>

          <p>
            I love learning a new thing! Expecially in tech industries. I am so
            happy that I can learn at Thinkful and as student of Thinkful
            community!
          </p>
        </div>
        <div className='introduce where-Im-from'>
          <h1>Where I'm From</h1>
          <p>
            I'm from Hue. And now I live in Lien Chieu, Da Nang. I'm stuying{' '}
            <span className='bold'>
              Da Nang university of science and technologies.
            </span>{' '}
          </p>
        </div>
        <div className='introduce more-about-me'>
          <h1>More About Me</h1>
          <h2>What are your favorite hobbies?</h2>
          <p>
            My favorite hobby was playing football. But now I am enjoying most
            of my time with study coding!
          </p>
          <h2>What's your dream job?</h2>
          <p>
            My goal is that become a full stack developer, so that I can manage
            front-end side and back-end side as well. Before achieve that goal,
            I need to master back-end developer skills first!
          </p>
        </div>
      </div>
      <div className='content-footer bg-blue-500'>
        <p>Say hi to me on these social networks:</p>
        <ul className='social flex items-center justify-center my-4'>
          <li className='px-3 py-1 cursor-pointer'>
            <a href='https://github.com/hoangdat12' target='_blank'>
              Github
            </a>
          </li>
          <li className='px-3 py-1 cursor-pointer'>
            <a href='#' target='_blank'>
              Twitter
            </a>
          </li>
          <li className='px-3 py-1 cursor-pointer'>
            <a
              href='https://www.facebook.com/profile.php?id=100011693771182'
              target='_blank'
            >
              Facebook
            </a>
          </li>
        </ul>
        <p>
          Cover Image via <a href='http://www.unsplash.com'>Unsplash</a>
        </p>
      </div>
    </>
  );
};

export default About;
