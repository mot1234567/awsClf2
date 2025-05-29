import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { Question, RootStackParamList } from '../types';

import sampleQuestions from '../data/sampleQuestions.json';

type BookmarksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Bookmarks'>;

export default function BookmarksScreen() {
  const navigation = useNavigation<BookmarksScreenNavigationProp>();
  const { questionHistory, isLoading } = useAppContext();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const questions = (sampleQuestions as Question[]).filter(question => {
        const history = questionHistory[question.id];
        return history && history.bookmarked;
      });
      
      setBookmarkedQuestions(questions);
    }
  }, [questionHistory, isLoading]);

  const startBookmarkedQuiz = () => {
    if (bookmarkedQuestions.length > 0) {
      navigation.navigate('Quiz', { mode: 'bookmarked' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>データを読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ブックマークした問題</Text>
        <Text style={styles.count}>{bookmarkedQuestions.length}問</Text>
      </View>

      {bookmarkedQuestions.length > 0 ? (
        <>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startBookmarkedQuiz}
          >
            <Text style={styles.startButtonText}>ブックマーク問題を解く</Text>
          </TouchableOpacity>

          <FlatList
            data={bookmarkedQuestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.questionCard}
                onPress={() => navigation.navigate('Quiz', { 
                  mode: 'single',
                  questionId: item.id
                })}
              >
                <Text style={styles.questionText} numberOfLines={2}>
                  {item.question}
                </Text>
                <View style={styles.questionMeta}>
                  <Text style={styles.domainText}>{item.domain}</Text>
                  <Text style={styles.difficultyText}>{
                    item.difficulty === 'easy' ? '簡単' :
                    item.difficulty === 'medium' ? '普通' : '難しい'
                  }</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            ブックマークした問題はありません。
          </Text>
          <Text style={styles.emptySubText}>
            問題画面で星マークをタップすると、ブックマークに追加されます。
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#0066cc',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domainText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
