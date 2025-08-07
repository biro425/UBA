import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { UserActivity, StepActivity, CarbonReductionActivity, Feedback, Message } from './types';
import { GeminiService } from './gptService';
import styles from './styles';
import personaProfessor from './persona_50_60_professor.json';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Ask anything and get feedback on your actions.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ecoPoints, setEcoPoints] = useState(1250);

  
  const apiKey = 'AIzaSyCyiqzOqCghRXwTrfuhf7F8Ho_dB8KQ6AA';

  
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    if (!apiKey) return;
    setIsLoading(true);
    const geminiService = new GeminiService(apiKey);
    try {
      const result = await geminiService.analyzePersonaChat({}, [...messages, userMessage]);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: result.summary,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "죄송합니다. 답변을 가져올 수 없습니다.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 피드백 버튼 클릭 시 persona와 채팅 로그 기반 Gemini 피드백
  const handleFeedback = async () => {
    if (!apiKey) return;
    setIsLoading(true);
    const geminiService = new GeminiService(apiKey);
    try {
      const result = await geminiService.analyzePersonaChat(personaProfessor.persona, messages);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: '[feedback]\n' + result.summary,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "[피드백] 죄송합니다. 피드백을 가져올 수 없습니다.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Green Mint</Text>
          <Text style={styles.headerSubtitle}>Analysis</Text>
          <View style={styles.ecoPointsBadge}>
            <Text style={styles.ecoPointsText}>{ecoPoints.toLocaleString()} EcoPoints</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 70,
            left: 20,
            zIndex: 10,
            width: 44,
            height: 44,
            backgroundColor: '#fff',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          onPress={handleFeedback}
        >
          <Image source={require('./assets/an_icon.png')} style={{ width: 32, height: 32 }} />
        </TouchableOpacity>

        <View style={styles.contentArea}>
          <ScrollView style={styles.chatContainer}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.isUser
                    ? { ...styles.userMessage, alignSelf: 'flex-end', marginLeft: '5%' }
                    : { ...styles.botMessage, alignSelf: 'flex-start', backgroundColor: '#4CAF50', marginRight: '5%' },
                ]}
              >
                <Text style={[styles.messageText, !msg.isUser && { color: '#fff' }]}>{msg.text}</Text>
              </View>
            ))}
            {isLoading && <Text style={styles.loading}>Generating answer...</Text>}
          </ScrollView>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="your questions save the earth!"
              multiline
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} onPress={sendMessage}>
              <Image source={require('./assets/se_icon.png')} style={{ width: 32, height: 32 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
