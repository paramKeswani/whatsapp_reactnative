 
import React,{useEffect,useState} from "react";
import { View, Platform,KeyboardAvoidingView,Text } from "react-native";
import{
    Bubble,
    GiftedChat
} from "react-native-gifted-chat";
import  firestore from "@react-native-firebase/firestore";
import auth from  "@react-native-firebase/auth";
import {useNavigation , useRoute} from "@react-navigation/native";
import {formatTimestamp } from "./helper";
import { LinearGradient } from "expo-linear-gradient";

export default function ChatScreen(){

    const[messages,setMessages] = useState([]);
    const {userId , userName } = useRoute().params;
    const currentUser = auth().currentUser;
    const navigation  = useNavigation();

    useEffect (() =>{
        const chatId = [currentUser.uid , userId].sort().join("_");

        const chatReference = firestore().collection("chats").doc(chatId);

        const unsubscribe  = chatReference.onSnapshot((snapshot) =>
        {
            if(snapshot.exists)
                {
                    const chatData = snapshot.data();
                    setMessages(chatData.messages);
                }

        });

        return () => unsubscribe();

        const onSend = async (newMessages = [])=>
            {
                const chatId = [currentUser.uid,userId].sort().join("_");
                const chatreference = firestore().app.collection("chats").doc(chatId);
                const formattedmessages = newMessages.map((message) =>(
                    {
                        ...message,
                        createdAt : new Date(message.createdAt),
    
                    }
    
    
                ));
    
                try{
                    await chatReference.set(
                        {
                            messages : GiftedChat.append(messages , formattedmessages),
                        },
                        {merge : true }
    
                    );
                }
                catch(error)
                {
                    console.log("error updating messages ",error);
    
                }
            };
    


    },[userId , currentUser.uid]);

    // const onSend = async (newMessages = [])=>
    //     {
    //         const chatId = [currentUser.uid,userId].sort().join("_");
    //         const chatreference = firestore().app.collection("chats").doc(chatId);
    //         const formattedmessages = newMessages.map((message) =>(
    //             {
    //                 ...message,
    //                 createdAt : new Date(message.createdAt),

    //             }


    //         ));

    //         try{
    //             await chatReference.set(
    //                 {
    //                     messages : GiftedChat.append(messages , formattedmessages),
    //                 },
    //                 {merge : true }

    //             );
    //         }
    //         catch(error)
    //         {
    //             console.log("error updating messages ",error);

    //         }
    //     };

        const renderBubble = (props) =>
            {
                const{currentmessage} = props;
                const isReceived =  currentmessage.user._id !== currentUser.uid ;

                return (
                    <Bubble
                    {...props}
                    wrapperStyle = {{
                        right :{
                            backgroundColor:"#4CAF50",
                        },

                        left : {
                            backgroundColor:"#2196F3",
                            marginLeft : isReceived ? 0 : 10 ,


                        },


                    }}

                    containerStyle = {{
                        left:{
                            marginLeft : isReceived ? -40 : 0,
                        },


                    }}
                    />
                );

            };


            const renderChatFooter = () => 
            {
                return <View style={{height:20}}/> ;
            };

            return (
                <LinearGradient colors={["#000", "#FFF"]} style={{ flex: 1 }}>
                <GiftedChat
                  messages={messages}
                  onSend={(newMessages) => onSend(newMessages)}
                  user={{ _id: currentUser.uid, name: currentUser.displayName }}
                  renderTime={(props) => (
                    <View style={props.containerStyle}>
                      <Text
                        style={{
                          marginHorizontal: 1,
                          marginBottom: 5,
                          fontSize: 10,
                          color: props.position === "left" ? "black" : "white",
                        }}
                      >
                        {
                          props.currentMessage.createdAt instanceof Date ?
                            props.currentMessage.createdAt.toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }) :
                            formatTimestamp(props.currentMessage.createdAt)
                        }
                      </Text>
                    </View>
                  )}
                  renderDay = {()=>null}
                  renderBubble = {renderBubble}
                  renderChatFooter = {renderChatFooter}
                  placeholder="Type a message..."
                  textInputStyle = {{color:"white"}}
                  renderUsernameOnMessage
                  conatinerStyle = {{

                    backgroundColor :"black",
                    padding :5,
                    height:70,
                    multiline :true,
                  }}




                  
                />
                {Platform.OS === "android" && <KeyboardAvoidingView behaviour="padding"/>}
              </LinearGradient>
             

            );
        }