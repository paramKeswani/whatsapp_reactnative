import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function Dashboard({ route }) {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();
        const userData = usersSnapshot.docs.map((docs) => ({
          id: docs.id,
          ...docs.data(),
        }));
        setUsers(userData);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDocument = await firestore().collection('users').doc(currentUser.uid).get();
          setUserName(userDocument.data()?.name || '');
        }
      } catch (error) {
        console.log('Error fetching user name:', error);
      }
    };

    if (isFocused) {
      fetchUsers();
      fetchUserName();
    }
  }, [isFocused]);

  const navigateToChat = (userId, userName) => {
    navigation.navigate('ChatScreen', {
      userId,
      userName,
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20%',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', margin: 10, color: '#fff' }}>Home</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 24, color: '#fff', margin: 10 }}>Welcome, {userName}!</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ fontSize: 24, color: '#43A047', margin: 10, fontWeight: 'bold' }}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#ADD8E6',
          padding: 5,
          borderTopRightRadius: 100,
          position: 'absolute',
          top: '20%',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToChat(item.id, item.name)}
              style={{
                marginBottom: 5,
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(1238,128,128,0)']} style={{ padding: 15, borderRadius: 30 }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
