import React from 'react';

const CopyrightFooter: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        .cpoy-cont {
          background: linear-gradient(45deg, #F5F7F6, #5CA0F2);
          background-size: 300% 300%;
          animation: gradientShift 12s ease-in-out infinite;
          padding: 20px;
          text-align: center;
          width: 100%;
          margin-top: auto; 
        }

        .Copyrights { color: #000; }
        .Copyrights h2 { 
            font-size: 20px; 
            margin-bottom: 10px;
            font-weight: 600; 
            text-transform: uppercase; 
        }
        .Copyrights p {
          font-size: 0.85rem;
          margin: 5px 0;
          font-weight: 600;
          line-height: 1.6;
        }
      `}</style>

      <div className='cpoy-cont'>
        <div className='Copyrights'>
          <h2>© 2025 SIST ACM SIGAI STUDENT CHAPTER</h2>
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