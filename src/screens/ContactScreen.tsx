import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';

export default function ContactScreen() {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const url = `mailto:moto0605_yyy@yahoo.co.jp?subject=${encodeURIComponent('お問い合わせ')}&body=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('メールアプリを開けませんでした');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>お問い合わせ内容</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="ご質問やご要望を入力してください"
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>送信</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
