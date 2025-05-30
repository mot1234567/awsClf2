import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';

export default function ContactScreen() {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim().length === 0) {
      Alert.alert('エラー', 'お問い合わせ内容を入力してください。');
      return;
    }

    const url = `mailto:moto0605_yyy@yahoo.co.jp?subject=${encodeURIComponent('お問い合わせ')}&body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('エラー', 'メールアプリを開けませんでした。');
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
        placeholder="ご質問やご要望を入力してください"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>送信</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
