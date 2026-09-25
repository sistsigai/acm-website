import React from 'react';

const CopyrightFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className='cpoy-cont'>
        <div className='Copyrights'>
          <h2>© {currentYear} SIST ACM SIGAI STUDENT CHAPTER</h2>
          <p>
            Website developed by ADITYA SAI TEJA B |
            Designed by MANISRI VENKATESH |
            Backend development: BHUVANESH and DEVENDRA REDDY | 
            Maintained by BERSIN S and RAM PRADEEP
          </p>
        </div>
      </div>
    </>
  );
};

export default CopyrightFooter;