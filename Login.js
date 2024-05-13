import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [confirm, setConfirm] = useState(null);  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
     const confirmation =  await auth().signInWithEmailAndPassword(email, password);
     setConfirm(confirmation); 
     Alert.alert("Login Successfull");
    } catch (error) {
        Alert.alert("Login Unsuccessfull",error.message);
        
    }

    const user = userCredential.user;

    const userDocument = await firestore().collection('users').doc(user.uid).get();

    if(userDocument.exists)
      {
          navigation.navigate("Dashboard");
      }
      else {
        navigation.navigate("Detail",{uid:user.uid});
      }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default App;