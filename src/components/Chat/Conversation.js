import React from 'react'
import ConversationItem from './ConversationItem';

const Conversation = () => {

    const data = [
        {name:'Rey Jhon', time:'just now', message: 'Hey there! Are you finish creating the chat app?', active: true, unread: 2, online: true},
        {name:'Cherry Ann', time:'12:00', message: 'Hello? Are you available tonight?', unread: 0, online: false},
        {name:'Lalaine', time:'yesterday', message: 'I\'m thinking of resigning', unread: 1, online: true},
        {name:'Princess', time:'1 day ago', message: 'I found a job :)', unread: 0, online: false},
        {name:'Charm', time:'1 day ago', message: 'Can you get me some chocolates?', unread: 0, online: true},
        {name:'Garen', time:'1 day ago', message: 'I\'m the bravest of all kind', unread: 0, online: false},
    ]

    return (
        <div className="space-y-2">
            {data.map((item, index) => (
                <ConversationItem 
                    key={index}
                    message={item.message}
                    time={item.time} 
                    name={item.name} 
                    active={item.active}
                    unread={item.unread}
                    online={item.online}
                />
            ))}
        </div>
    )
}

export default Conversation
