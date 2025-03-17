import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const Messages = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = localStorage.getItem("authToken");


    useEffect(() => {
        axios.get('http://localhost:8080/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);


    useEffect(() => {
        if (selectedUser) {
            axios.get(`http://localhost:8080/feedbacks/history?from=${userId}&to=${selectedUser.value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    const chatHistory = response.data.map((feedback) => ({
                        position: feedback.from.id === selectedUser.value ? 'left' : 'right',
                        type: 'text',
                        text: feedback.message,
                        date: new Date(feedback.timestamp),
                    }));
                    setMessages(chatHistory);
                })
                .catch((error) => console.error('Error fetching chat history:', error));
        }
    }, [selectedUser, userId]);

    const handleSend = (e) => {
        if (input.trim() && selectedUser) {
            const newMessage = {
                from: userId,
                toIds: [selectedUser.value],
                message: input,
            };


            axios.post('http://localhost:8080/feedbacks', newMessage, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    const newMessages = response.data.map((feedback) => ({
                        position: 'right',
                        type: 'text',
                        text: feedback.message,
                        date: new Date(feedback.timestamp),
                    }));
                    setMessages((prevMessages) => [...prevMessages, ...newMessages]); // Append new message
                    setInput('');
                })
                .catch((error) => console.error('Error sending message:', error));
        }
    };

    return (
        <div style={{ width: '100vh', margin: '0 auto', padding: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <Select
                    options={users.map((user) => ({ value: user.id, label: user.name }))}
                    isMulti={false}
                    value={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="Alege cui să trimiți mesaj sau scrie numele aici..."
                />
            </div>
            <div style={{ height: '45vh',  overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                <MessageList
                    className="message-list"
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Scrie mesajul aici..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    multiline={false}
                    rightButtons={<Button text="Trimite" onClick={handleSend} />}
                />
            </div>
        </div>
    );
};

export default Messages;
