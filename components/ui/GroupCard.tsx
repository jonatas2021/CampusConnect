import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

type Props = {
  image: React.FC<SvgProps>; // Tipo correto para SVG
  title: string;
  description: string;
  link: string;
  buttonText: string; // Nova prop para o texto do botão
};

const GroupCard: React.FC<Props> = ({ image: ImageComponent, title, description, link, buttonText }) => {
  const handlePress = () => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.card}>
      {/* Renderiza o componente SVG */}
      <View style={styles.imageContainer}>
        <ImageComponent />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#92C36B', // Verde WhatsApp
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2A5A06',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default GroupCard;
