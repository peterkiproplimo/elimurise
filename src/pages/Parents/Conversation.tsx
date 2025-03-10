import React from "react";
import ConversationItem from "./ConversationItem";

interface ChatHead {
  _id: {
    chatPartnerId: string;
    chatPartnerModel: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ConversationProps {
  chatHeads: any[];
  onSelectChatHead: (parentId: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({
  chatHeads,
  onSelectChatHead,
}) => {
  return (
    <div className="p-1">
      {chatHeads.length > 0 ? (
        chatHeads.map((chat, index) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => onSelectChatHead(chat._id.chatPartnerId)}
            key={index}
          >
            <ConversationItem
              key={chat._id.chatPartnerId}
              message={chat.lastMessage}
              time={new Date(chat.lastMessageAt).toLocaleString()}
              name={chat._id.chatPartnerModel} // Replace with actual name if available
              active={chat.unreadCount > 0} // Mark as active if there are unread messages
              unreadCount={chat.unreadCount} // Pass unreadCount
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No conversations yet</p>
      )}
    </div>
  );
};

export default Conversation;
