import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import BackButtonSvg from '@/components/svg/BackButton';

interface BackButtonProps {
  onPress?: () => void;
  destination?: string;
  width?: number;
  height?: number;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  destination, 
  width = 25, 
  height = 25 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (destination) {
        router.push(destination as any);
      } else {
        router.back();
      }
    }
  };
  

  return (
    <View style={styles.backArrowContainer}>
      <TouchableOpacity style={styles.backArrow} onPress={handlePress}>
        <BackButtonSvg width={width} height={height} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backArrowContainer: {
    position: "absolute",
    top: "6%",
    left: "3%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DEFCC7",
  },
  backArrow: {
    zIndex: 2,
  },
});

export default BackButton;
