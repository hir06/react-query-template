import React from 'react';
import './Header.scss';

type Props = {
  appName: string;
  className?: string;
};

const Header: React.FC<Props> = ({ appName, className }) => {

  return (
    <div className={`${className} header`}>
     <h1>{appName}</h1>
    </div>
  );
};

export default Header;
