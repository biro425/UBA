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
  const [showFeedbackSummary, setShowFeedbackSummary] = useState(false); // 피드백 요약 보기 상태
  const [isListOpen, setIsListOpen] = useState(true); // 리스트 펼침/접힘 상태
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false); // analyze 피드백 모달 상태
  const [analyzeFeedback, setAnalyzeFeedback] = useState(''); // analyze 피드백 텍스트
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  
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
      // 프롬프트 없이 유저 메시지만 전달
      const result = await geminiService.callGeminiAPI(chatInput);
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

  // 피드백 버튼 클릭 시 피드백 요약 화면으로 전환
  const handleFeedback = () => {
    setShowFeedbackSummary(true);
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
        {/* 피드백 버튼 (피드백 요약 화면이 아닐 때만 보임) */}
        {!showFeedbackSummary && (
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
        )}

        {/* 피드백 요약 화면 */}
        {showFeedbackSummary ? (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {/* 상단 카드 (more만 토글) */}
            <View
              style={{
                width: '92%',
                backgroundColor: '#21c87a',
                borderRadius: 16,
                marginTop: 24,
                padding: 0,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 8,
              }}
            >
              {/* 배경 그라데이션 및 배터리 아이콘 */}
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }}>
                {/* 배터리 아이콘 (왼쪽 상단, 반투명) */}
                <Image source={require('./assets/an_icon.png')} style={{ position: 'absolute', left: 12, top: 12, width: 60, height: 60, opacity: 0.12 }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 14, paddingBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 1 }}>Wasted Energy</Text>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 1 }}>CO₂ generated: 10kg</Text>
                  <Text style={{ color: '#eafff3', fontSize: 11, marginTop: 4 }}>you wasted more energy than 25% of people</Text>
                </View>
                <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginLeft: 8, marginTop: 2 }}>
                  <Text style={{ color: '#21c87a', fontWeight: 'bold', fontSize: 12 }}>Aug. 4 - Aug.8</Text>
                </View>
              </View>
              <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 6, marginTop: 0, flexDirection: 'column', alignItems: 'center' }} onPress={() => setIsListOpen((prev) => !prev)}>
                <Text style={{ color: '#fff', fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 13 }}>more</Text>
              </TouchableOpacity>
            </View>
            {/* 리스트 (펼침/접힘) */}
            {isListOpen && (
              <View style={{ width: '92%', marginTop: 18, marginBottom: 100 }}>
                {[1,2,3,4].map((_, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, borderWidth: 1, borderColor: '#e6e6e6' }}>
                    <Image source={require('./assets/an_icon.png')} style={{ width: 32, height: 32, marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>Left your device on</Text>
                      <Text style={{ color: '#21c87a', fontSize: 13, marginTop: 2 }}>CO₂ generated: 2.5kg</Text>
                    </View>
                    <Text style={{ color: '#888', fontSize: 13 }}>Today</Text>
                  </View>
                ))}
              </View>
            )}
            {/* 하단 버튼들 - 항상 하단에 고정, 비율 맞춤 */}
            <View style={{ position: 'absolute', bottom: 24, left: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '4%' }}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 0, paddingVertical: 0, marginRight: 8, height: 48, justifyContent: 'center', borderWidth: 1, borderColor: '#e6e6e6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2 }}
                onPress={() => setShowFeedbackSummary(false)}
              >
                <Image source={require('./assets/an_icon.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={{ color: '#21c87a', fontWeight: 'bold', fontSize: 16 }}>chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 2, marginLeft: 8, backgroundColor: '#21c87a', borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center' }}
                onPress={async () => {
                  setShowAnalyzeModal(true);
                  setAnalyzeLoading(true);
                  setAnalyzeError('');
                  setAnalyzeFeedback('');
                  try {
                    const geminiService = new GeminiService(apiKey);
                    const result = await geminiService.analyzePersonaChat(personaProfessor.persona, messages);
                    setAnalyzeFeedback(result.summary);
                  } catch (e) {
                    setAnalyzeError('피드백을 가져오는 데 실패했습니다.');
                  } finally {
                    setAnalyzeLoading(false);
                  }
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>ANALYZE</Text>
              </TouchableOpacity>
            </View>

            {/* Analyze 피드백 모달 (하단 슬라이드업) */}
            {showAnalyzeModal && (
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#21c87a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center', height: 320, zIndex: 100 }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 12 }}>overall comment</Text>
                <View style={{ flex: 1, width: '100%' }}>
                  {analyzeLoading ? (
                    <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: '500', marginBottom: 16 }}>Analyzing...</Text>
                  ) : analyzeError ? (
                    <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: '500', marginBottom: 16 }}>{analyzeError}</Text>
                  ) : (
                    <ScrollView style={{ maxHeight: 200 }}>
                      <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', fontWeight: '500', marginBottom: 16 }}>{analyzeFeedback || '피드백이 없습니다.'}</Text>
                    </ScrollView>
                  )}
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10, marginTop: 8 }}
                  onPress={() => setShowAnalyzeModal(false)}
                >
                  <Text style={{ color: '#21c87a', fontWeight: 'bold', fontSize: 16 }}>Back to tracking</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
        // 기존 챗봇 UI
        <>
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
        </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
