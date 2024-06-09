import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useCallback, useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {colors} from '../../utils/theme/colors';
import {GiftedChat} from 'react-native-gifted-chat';
import {io} from 'socket.io-client';
import {testURL} from '../../ApiBaseURL';
import {showSnackBar} from '../../core/redux/actions';

const Chat = () => {
  const {user} = useSelector(state => state.auth);
  const [socket, setSocket] = useState('');
  const route = useRoute();
  const patient = route.params?.patient;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [chatID, setChatID] = useState('');
  const [message, setMessage] = useState('');

  const GiftedChatform = messages => {
    var result = [];
    if (messages.length > 0) {
      result = messages.map(message => {
        return {
          _id: message?._id,
          text: message?.text,
          createdAt: message?.createdAt,
          user: {
            _id: message?.senderId?._id,
            name: message?.senderId?.name,
            avatar: 'https://placeimg.com/140/140/any',
          },
        };
      });
    } else {
      result = [];
    }
    console.log(result, 'messages GiftedChatform');

    return result.reverse();
  };

  useEffect(() => {
    const newSocket = io('https://teaching-boar-newly.ngrok-free.app');
    setSocket(newSocket);
    createChat();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // receive message
  useEffect(() => {
    if (!socket) return;
    console.log(socket, 'socket when getmessage');
    console.log(chatID, 'chatID in get message');
    socket.on('getMessage', res => {
      console.log(res.chatID, 'res.chatID in get message');
      // if (chatID == res.chatID) {

      setMessages(res.messages);
      console.log(res, 'GOTTEN MESSAGE');
      // }
    });

    // return () => {
    //   socket.off("getMessage");
    // };
  }, [socket, messages]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('addNewUser', user._id);

    return () => {};
  }, [socket]);

  const createChat = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Cookie',
      'connect.sid=s%3A3SwBRJET-BmQOhnot22X8PU6rjA3qnsZ.wSfSkAd5%2FMd911p2IhdYzB9knfdIV0sImIHyAkD5xeU',
    );

    var raw = JSON.stringify({
      secondId: user?.userType == 'patient' ? user?.careTaker : patient?._id,
      firstId: user?._id,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch(`${testURL}chat/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          showSnackBar({visible: true, text: result.message});
        } else {
          setMessages(GiftedChatform(result.messages));
          setChatID(result.chatId);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const sendMessage = async messages => {
    if (!chatID)
      return showSnackBar({
        visible: true,
        text: 'Something went wrong please reload the page',
      });
    // setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Cookie',
      'connect.sid=s%bc1qre8jdw2azrg6tf49wmp652w00xltddxmpk98xp.gX40cJAadnong%2B4EHZ39RG6j1JCTQ%2Fw3ldWmM25W5NY',
    );
    var raw = JSON.stringify({
      chatId: chatID,
      senderId: user?._id,
      text: messages[0]?.text,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch(`${testURL}message/`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // setLoader(false);
        if (result.error) {
          setMessage('');
          return showSnackBar({
            visible: true,
            text: `something went wrong message not sent`,
          });
        } else {
          setMessage('');
          socket.emit('sendMessage', {
            messages: GiftedChatform(result.messages),
            recieverID:
              user?.userType == 'patient' ? user?.careTaker : patient?._id,
            chatID,
          });
          //   [{"_id": "f55b85ce-1306-4e55-9e61-9803eacad71d", "createdAt": 2024-03-21T20:29:11.464Z, "text": "Hi", "user": {"_id": 1}}]
          setMessages([...GiftedChatform(result.messages)]);
        }
      })
      .catch(error => {
        setMessage('');
        console.log('error', error);
        // setLoader(false);
      });
  };

  return (
    <>
      <Header title={`Chat`} />
      {/* <Container> */}
      <GiftedChat
        messages={messages}
        onSend={messages => sendMessage(messages)}
        messagesContainerStyle={{color: 'red'}}
        user={{
          _id: user?._id,
          name: user?.name,
          // avatar: auth?.currentUser?.photoURL
        }}
        textInputProps={{
          style: {color: 'black', marginLeft: 5, width: '80%'},
        }}
        renderAvatar={null}
      />
      {/* </Container> */}
    </>
  );
};

export default Chat;
