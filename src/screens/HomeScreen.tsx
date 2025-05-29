import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const domains = [
  { id: 'cloud-concepts', name: 'クラウドの概念' },
  { id: 'technology', name: 'テクノロジー' },
  { id: 'security', name: 'セキュリティ' },
  { id: 'billing-pricing', name: '請求と料金' }
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AWS CLF 試験対策アプリ</Text>
      <Text style={styles.subtitle}>23歳東京在住AWSエンジニア向け</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Quiz', { mode: 'single' })}
        >
          <Text style={styles.buttonText}>一問一答</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>分野別一問一答</Text>
        {domains.map((domain) => (
          <TouchableOpacity
            key={domain.id}
            style={styles.domainButton}
            onPress={() => navigation.navigate('Quiz', { 
              mode: 'domain', 
              domainFilter: domain.id 
            })}
          >
            <Text style={styles.buttonText}>{domain.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, styles.fullTestButton]}
          onPress={() => navigation.navigate('Quiz', { mode: 'full' })}
        >
          <Text style={styles.buttonText}>総合問題</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  domainButton: {
    backgroundColor: '#4d94ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  fullTestButton: {
    backgroundColor: '#003366',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
});
