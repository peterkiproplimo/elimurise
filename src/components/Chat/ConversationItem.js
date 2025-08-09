import React from 'react'

const ConversationItem = ({active, time, name, message, unread, online}) => {
    return (
        <div className={`group p-3 rounded-xl transition-all duration-200 cursor-pointer ${
            active 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
        }`}>
            <div className="flex items-center space-x-3">
                {/* Avatar with online status */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" 
                            alt="avatar"
                        />
                    </div>
                    {online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-semibold truncate ${
                            active 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : 'text-gray-900 dark:text-white'
                        }`}>
                            {name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {time}
                        </span>
                    </div>
                    <p className={`text-sm truncate ${
                        active 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400'
                    }`}>
                        {message}
                    </p>
                </div>

                {/* Unread badge */}
                {unread > 0 && (
                    <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                                {unread > 9 ? '9+' : unread}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConversationItem
