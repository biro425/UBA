import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { UserActivity, StepActivity, CarbonReductionActivity, Feedback, Message } from './types';
import { GeminiService } from './gptService';
import styles from './styles';
import personaProfessor from './persona_50_60_professor.json';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hello! I'm your Green Mint Analysis assistant. Tell me about your daily activities and I'll give you eco-friendly feedback.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ecoPoints, setEcoPoints] = useState(1250);

  // Set API key as a constant (replace with your actual Gemini API key)
  const apiKey = '';

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
  };

  const analyzeWithCamera = async () => {
    if (!apiKey) {
      Alert.alert('API Key Required', 'Please set your Gemini API key in the code.');
      return;
    }
    setIsLoading(true);
    const geminiService = new GeminiService(apiKey);
    try {
      const result = await geminiService.analyzePersonaChat(personaProfessor.persona, messages);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: result.summary,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
      // Add eco points for analysis
      setEcoPoints(prev => prev + 50);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry, I couldn't analyze your activities right now. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      {/* Content Area */}
      <View style={styles.contentArea}>
        <ScrollView style={styles.chatContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {isLoading && <Text style={styles.loading}>Analyzing with Green Mint...</Text>}
        </ScrollView>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.inputRow}>
          {/* Analysis Button (Camera Icon) */}
          <TouchableOpacity style={styles.analysisButton} onPress={analyzeWithCamera}>
            <View style={styles.analysisIcon} />
            <Text style={styles.analysisText}>ANALYSIS</Text>
          </TouchableOpacity>

          {/* Input Field */}
          <TextInput
            style={styles.inputField}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="your questions save the earth!"
            multiline
          />

          {/* Camera Button */}
          <TouchableOpacity style={styles.cameraButton}>
            <Text style={{ color: '#fff', fontSize: 16 }}>📷</Text>
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✈️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
