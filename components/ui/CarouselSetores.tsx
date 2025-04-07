import React, { useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewabilityConfig,
  ViewToken,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import CopyButton from "@/components/svg/CopyButton";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

interface CarouselProps {
  data: Array<{
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    image: React.ComponentType<any>;
    email: string; // Novo campo para email
  }>;
}

const CarouselItem = ({ item }: { item: any }) => {
  const ImageComponent = item.image;
  return (
    <View style={[styles.carouselItem, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.imageContainer}>
        {ImageComponent ? (
          <ImageComponent style={styles.image} />
        ) : (
          <Text style={styles.errorMessage}>Imagem não disponível</Text>
        )}
      </View>
      <View style={styles.separator} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const Carousel: React.FC<CarouselProps> = ({ data}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {}, [])
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / screenWidth);
      setCurrentIndex(newIndex);
      scrollX.setValue(offsetX);
    },
    []
  );

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(Number(viewableItems[0].index));
      }
    },
    []
  );

  const renderDots = () =>
    data.map((_, index) => {
      const dotWidth = scrollX.interpolate({
        inputRange: [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        outputRange: [10, 45, 10],
        extrapolate: "clamp",
      });

      const dotColor = scrollX.interpolate({
        inputRange: [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        outputRange: ["#A9A9A9", "#2A5A06", "#A9A9A9"],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={index}
          style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
        />
      );
    });

  // ➡️ Enviar email
  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o app de email.");
    });
  };

  // ➡️ Copiar email para a área de transferência
  const handleCopyEmail = async (email: string) => {
    await Clipboard.setStringAsync(email);
    Alert.alert(
      "Copiado!",
      "O email foi copiado para a área de transferência."
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <CarouselItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.paginationContainer}>{renderDots()}</View>

      {/* Renderiza os botões apenas no último slide */}
      {currentIndex === data.length - 1 && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSendEmail(data[currentIndex].email)}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Entrar em contato</Text>
                <MaterialIcons name="email" size={32} color="#fff" style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCopyEmail(data[currentIndex].email)}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Copiar Email</Text>
                <CopyButton style={styles.copyButton} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  carouselItem: {
    width: screenWidth,
    alignItems: "center",
    justifyContent: "flex-start", // Mude para "flex-start" para evitar empurrar o conteúdo para baixo
    padding: "5%",
  },
  imageContainer: {
    width: "100%", // Para ocupar toda a largura do contêiner
    justifyContent: 'center', // Centraliza a imagem verticalmente
    alignItems: "center", // Centraliza a imagem horizontalmente
  },
  image: {
    width: "100%",
    height: "50%", // Ajuste a altura conforme necessário
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: 'center', // Centraliza o texto
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    textAlign: "center",
    color: "#3C3939",
    marginBottom: "2%",
  },
  description: {
    fontSize: RFValue(14),
    color: "#3C3939",
    marginBottom: "30%",
  },
  paginationContainer: {
    position: "absolute",
    width: "100%",
    bottom: "5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: "1%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "35%", // Ajuste para que fique sobre os dots
    width: "80%",
    alignItems: "center",
    alignContent: 'center',
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza os botões horizontalmente
    width: '100%',
  },
  button: {
    width: "80%", // Para o botão ocupar toda a largura
    height: RFValue(40),
    paddingVertical: "4%",
    backgroundColor: "#2A5A06",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: "5%", // Adiciona espaço entre os botões
    alignSelf: 'center',
    justifyContent: "center"
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center', // Alinha o texto e o ícone verticalmente
    justifyContent: 'center', // Centraliza o conteúdo dentro do botão
    width: '100%',
  },
  copyButton: {
    marginLeft: 10, // Espaço entre o botão e o texto
    transform: [{ scale: 0.8 }], // Diminui proporcionalmente o tamanho

  },
  buttonText: {
    fontSize: RFValue(14),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#263238",
    marginBottom: '10%',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: RFValue(14),
  },
  icon: {
    marginLeft: 10, // Espaço entre o botão e o texto
  }
});

export default Carousel;
