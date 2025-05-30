import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';

export default function ContactScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const mailto = `mailto:moto0605_yyy@yahoo.co.jp?subject=${encodeURIComponent('お問い合わせ')}&body=${encodeURIComponent(message)}`;
    Linking.openURL(mailto).catch(() => {
      Alert.alert('メールアプリを開けませんでした');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>お問い合わせ内容</Text>
      <TextInput
        style={styles.input}
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="お問い合わせ内容を入力してください"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>送信</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    textAlignVertical: 'top'
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
