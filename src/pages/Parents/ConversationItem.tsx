import React from "react";

interface ConversationItemProps {
  active: boolean;
  time: string;
  name: string;
  message: string;
  unreadCount: number; // Added unreadCount prop
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  active,
  time,
  name,
  message,
  unreadCount,
}) => {
  const _class = active ? "bg-gray-200" : "bg-white";

  return (
    <div>
      <div
        className={`conversation-item p-1 dark:bg-gray-700 hover:bg-gray-200 m-1 rounded-md ${_class}`}
      >
        <div className="flex items-center p-2 cursor-pointer">
          {/* Avatar */}
          <div className="w-7 h-7 m-1 relative">
            <img
              className="rounded-full"
              src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
              alt="avatar"
            />
            {/* Unread badge on avatar */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Chat Content */}
          <div className="flex-grow p-2">
            <div className="flex justify-between text-md">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {/* {name} */}
                Class Manager
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-300">
                {time}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 w-40 truncate">
              {message}
            </div>
          </div>

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <div className="ml-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
