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
} from "react-native";
import { useRouter } from "expo-router";

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
      <ImageComponent style={styles.image} />
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
        <TouchableOpacity style={styles.button} onPress={() => router.push("/questions")}>
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
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3C3939",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#3C3939",
    marginBottom: 20,
  },
  paginationContainer: {
    position: "absolute",
    width: "100%",
    bottom: 150,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  button: {
    position: "absolute",
    bottom: 50,
    left: "10%",
    width: "80%",
    paddingVertical: 12,
    backgroundColor: "#2A5A06",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Carousel;
