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
  BackHandler, 
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

interface CarouselProps {
  data: Array<{
    id: string;
    title: string;
    description: string;
    backgroundColor: string;
    image: React.ComponentType<any>;
  }>;
}

const CarouselItem = ({ item }: { item: any }) => {
  const ImageComponent = item.image;
  return (
    <View style={[styles.carouselItem, { backgroundColor: item.backgroundColor }]}>
      {ImageComponent ? (
        <ImageComponent style={styles.image} />
      ) : (
        <Text style={styles.errorMessage}>Imagem não disponível</Text>
      )}
      <View style={styles.separator} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Sair do App", "Você realmente quer sair?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Sim",
            onPress: () => BackHandler.exitApp()
          }
        ]);
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => backHandler.remove(); // Remove o listener ao sair da tela
    }, [])
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
      scrollX.setValue(offsetX); // Evita pequenos deslocamentos inesperados
    },
    []
  );

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Garante que um item seja considerado "visto" ao menos 50%
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

  const handleButtonPress = () => {
    router.push("/Screens/Hello"); // Caso não haja nome, volta para a tela inicial
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

      {/* Renderiza o botão apenas no último slide */}
      {currentIndex === data.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Vamos lá!</Text>
        </TouchableOpacity>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: "5%",
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    textAlign: "center",
    color: "#3C3939",
    marginBottom: "2%",
  },
  description: {
    fontSize: RFValue(12),
    textAlign: "left",
    color: "#3C3939",
    marginBottom: "30%",
  },
  paginationContainer: {
    position: "absolute",
    width: "100%",
    bottom: "15%",
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
  button: {
    position: "absolute",
    bottom: "5%",
    left: "10%",
    width: "80%",
    paddingVertical: "3%",
    backgroundColor: "#2A5A06",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(14),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  separator: {
    width: "100%",  // Ajuste conforme necessário
    height: 2,    // Espessura da linha
    backgroundColor: "#263238",  // Preto
    marginBottom: '10%',  // Espaço acima e abaixo da linha
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: RFValue(14),
  },
});

export default Carousel;
