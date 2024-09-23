import React from "react";
import ChatMessages from "../chat/ChatMessages";
import { NextPage } from "next";
import 'katex/dist/katex.min.css';

const ChatPage: NextPage = () => {
  return <ChatMessages />;
};

export default ChatPage;