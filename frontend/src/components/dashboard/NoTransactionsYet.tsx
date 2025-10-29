import React from 'react';
import { Image } from 'react-bootstrap';
import oopsIllustration from '../../assets/ilustrasi2.png'; 

const NoTransactionsYet: React.FC = () => {
  return (
    <div className="text-center p-4">
      <Image src={oopsIllustration} alt="No transactions" fluid style={{ maxWidth: '200px', marginBottom: '1.5rem' }} />
    </div>
  );
};

export default NoTransactionsYet;