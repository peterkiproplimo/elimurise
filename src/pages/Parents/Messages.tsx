import React from "react";

const Messages = ({ messages, user }) => {
  return (
    <div className="flex-grow h-full flex flex-col">
      {/* Header */}
      <div className="w-full h-15 p-1 bg-purple-600 dark:bg-gray-800 shadow-md rounded-xl rounded-bl-none rounded-br-none">
        <div className="flex p-2 align-middle items-center">
          <div className="border rounded-full border-white p-1/2">
            <img
              className="w-14 h-14 rounded-full"
              src={user.avatar}
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            <div className="text-md text-gray-50 font-semibold">
              {user.name}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="text-xs text-gray-50 ml-1">{user.status}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="w-full flex-grow bg-gray-100 dark:bg-gray-900 my-2 p-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === user.name ? "justify-end" : "items-end w-3/4"
            }`}
          >
            {msg.sender !== user.name && (
              <img
                className="w-8 h-8 m-3 rounded-full"
                src={msg.avatar}
                alt="avatar"
              />
            )}
            <div
              className={`p-3 mx-3 my-1 rounded-2xl sm:w-3/4 md:w-3/6 ${
                msg.sender === user.name
                  ? "bg-purple-500 text-gray-200 rounded-br-none"
                  : "bg-purple-300 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-bl-none"
              }`}
            >
              {/* {msg.sender !== user.name && (
                <div className="text-xs text-gray-600 dark:text-gray-200">
                  {msg.sender}
                </div>
              )} */}
              <div>{msg.message}</div>
              <div className="text-xs text-gray-400">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
    </div>
  );
};

export default Messages;
