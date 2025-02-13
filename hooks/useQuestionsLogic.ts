import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function useQuestionsLogic() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);

  const backToCarousel = () => {
    router.push('/screens/Carousel');
  };

  const handleResponse = (answer: string) => {
    setResponse(answer);
    router.push('/screens/Hello');
  };

  return { response, backToCarousel, handleResponse };
}
