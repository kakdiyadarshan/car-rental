import React from 'react';

const Message = ({ variant = 'info', children }) => {
  return (
    <div style={{
      padding: '10px',
      margin: '10px 0',
      backgroundColor: variant === 'danger' ? '#f8d7da' : '#d1ecf1',
      color: variant === 'danger' ? '#721c24' : '#0c5460',
      borderRadius: '5px'
    }}>
      {children}
    </div>
  );
};

export default Message;