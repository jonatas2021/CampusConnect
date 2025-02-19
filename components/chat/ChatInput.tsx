import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ChatInputProps {
  onSend: (message: string) => void;
  // Extend this interface later for LLM integration if needed.
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const textInputRef = useRef<TextInput>(null);

  // Request media library permissions on mount.
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to pick an image.');
      }
    })();
  }, []);

  const handleSend = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSend(trimmedText);
      setText('');
      // Refocus the text input after sending.
      textInputRef.current?.focus();
    }
  }, [text, onSend]);

  const openImagePicker = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected image:', result.assets[0].uri);
        // Optionally, pass the image URI to the parent component.
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'There was an error selecting the image.');
    }
  }, []);

  // When the emoji button is pressed, refresh the keyboard.
  // While it's not possible to programmatically force the native keyboard into emoji mode,
  // this trick (blurring then refocusing) can help the keyboard re-open in its last-used mode.
  const openEmojiKeyboard = useCallback(() => {
    if (textInputRef.current) {
      textInputRef.current.blur();
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.camIconContainer} onPress={openImagePicker}>
          <MaterialCommunityIcons name="camera" style={styles.cam} />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escreva um comentário"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.emojiButton} onPress={openEmojiKeyboard}>
            <MaterialCommunityIcons name="emoticon-outline" color="#888" size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSend} activeOpacity={0.7}>
          <MaterialCommunityIcons name="send" color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#2A5224',
    alignItems: 'center',
  },
  camIconContainer: {
    width: 40,
    marginRight: 8,
  },
  cam: {
    color: '#fff',
    fontSize: 40,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 42,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  emojiButton: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#66bb6a',
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
  },
});
