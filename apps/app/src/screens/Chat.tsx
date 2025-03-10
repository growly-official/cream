import React from 'react';
import { useMultichainMagicInit } from '@/core';
import { ChatPage } from '@/ui';
import { useParams } from 'react-router';
import type { UUID } from '@elizaos/core';

const Chat: React.FC<any> = () => {
  useMultichainMagicInit();
  const { agentId } = useParams<{ agentId: UUID }>();

  if (!agentId) return <div>No data.</div>;

  return (
    <div className="py-3 px-4 rounded-xl flex flex-col max-w-[80rem] shadow-xl w-full h-[100vh] bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
      <ChatPage agentId={agentId} />
    </div>
  );
};

export default Chat;
