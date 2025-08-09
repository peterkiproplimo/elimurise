import React from 'react'
import Lucide from '../base-components/Lucide';

const Messages = () => {
    return (
        <div className="h-full flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" 
                                alt="avatar"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rey Jhon A. Baquirin
                        </h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                            <Lucide icon="Phone" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                            <Lucide icon="Video" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                            <Lucide icon="MoreVertical" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Incoming Message */}
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" 
                            alt="avatar"
                        />
                    </div>
                    <div className="max-w-xs lg:max-w-md">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                            <p className="text-gray-900 dark:text-gray-100 text-sm">
                                Hey there! Are you finish creating the chat app?
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Rey Jhon A. Baquirin
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                1 day ago
                            </span>
                        </div>
                    </div>
                </div>

                {/* Outgoing Message */}
                <div className="flex items-start justify-end space-x-3">
                    <div className="max-w-xs lg:max-w-md">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl rounded-br-md px-4 py-3">
                            <p className="text-white text-sm">
                                Hello! How can I help you?
                            </p>
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                just now
                            </span>
                            <Lucide icon="CheckCheck" className="w-3 h-3 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Another Outgoing Message */}
                <div className="flex items-start justify-end space-x-3">
                    <div className="max-w-xs lg:max-w-md">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl rounded-br-md px-4 py-3">
                            <p className="text-white text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                2 min ago
                            </span>
                            <Lucide icon="CheckCheck" className="w-3 h-3 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Incoming Message */}
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                        <img 
                            className="w-full h-full object-cover" 
                            src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png" 
                            alt="avatar"
                        />
                    </div>
                    <div className="max-w-xs lg:max-w-md">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                            <p className="text-gray-900 dark:text-gray-100 text-sm">
                                Hello po ang pogi niyo :)
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Rey Jhon A. Baquirin
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                just now
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
                        <Lucide icon="Smile" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 relative">
                        <input 
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            placeholder="Type your message..."
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-all duration-200 cursor-pointer">
                                <Lucide icon="Paperclip" className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 cursor-pointer shadow-lg">
                        <Lucide icon="Send" className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
