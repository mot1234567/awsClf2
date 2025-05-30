import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';

export default function ContactScreen() {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const mailto = `mailto:moto0605_yyy@yahoo.co.jp?subject=${encodeURIComponent('お問い合わせ')}&body=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(mailto);
    if (supported) {
      await Linking.openURL(mailto);
    } else {
      Alert.alert('エラー', 'メールアプリを開けませんでした');
    }
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
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>メールを送信</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    height: 150,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
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
