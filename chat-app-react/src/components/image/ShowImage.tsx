const ShowImage = () => {
  return (
    <div className='fixed flex items-center justify-center top-0 right-0 bottom-0 left-0 px-4 bg-blackOverlay z-[1002]'>
      <img
        src='https://images.pexels.com/photos/17379363/pexels-photo-17379363/free-photo-of-sunlit-rock-on-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        alt=''
        style={{
          maxHeight: '90vh',
          minHeight: '250px',
          maxWidth: '100vh',
          minWidth: '200px',
        }}
        className='rounded-xl'
      />
      {/* <img
        src='https://images.pexels.com/photos/16697128/pexels-photo-16697128/free-photo-of-woman-in-dress-posing-in-canyon.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        alt=''
        style={{
          maxHeight: '90vh',
          minHeight: '250px',
          maxWidth: '200vh',
          minWidth: '200px',
        }}
        className='rounded-xl'
      /> */}
    </div>
  );
};

export default ShowImage;
