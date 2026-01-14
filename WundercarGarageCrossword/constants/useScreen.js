import { useWindowDimensions } from 'react-native';

export function useScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 360;
  const isMediumPhone = width >= 360 && width < 414;
  const isLargePhone = width >= 414;

  const w06 = width * 0.06;

  return {
    width,
    height,
    isSmallPhone,
    isMediumPhone,
    isLargePhone,
    w06,
  };
}
