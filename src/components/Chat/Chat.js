import React from 'react'
import Conversation from './Conversation';
import Messages from './Messages';
import Lucide from '../base-components/Lucide';

const Chat = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Sidebar */}
                <div className="w-20 bg-gradient-to-b from-blue-600 to-purple-600 text-white h-full flex flex-col items-center justify-between py-6">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 cursor-pointer">
                            <Lucide icon="MessageCircle" className="w-6 h-6" />
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 cursor-pointer">
                            <Lucide icon="Home" className="w-6 h-6" />
                        </div>
                        <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center relative">
                            <Lucide icon="MessageSquare" className="w-6 h-6" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 cursor-pointer">
                            <Lucide icon="Users" className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 cursor-pointer">
                        <Lucide icon="Settings" className="w-6 h-6" />
                    </div>
                </div>

                {/* Conversations Panel */}
                <div className="w-80 h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50">
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Messages
                                </h1>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 cursor-pointer shadow-lg">
                                    <Lucide icon="Plus" className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lucide icon="Search" className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                    placeholder="Search conversations..."
                                />
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                                    Recent Conversations
                                </h2>
                                <Conversation/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 h-full">
                    <Messages/>
                </div>
            </div>
        </div>
    )
}

export default Chat
