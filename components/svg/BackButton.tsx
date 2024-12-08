import Svg, { Path } from "react-native-svg"
import { SvgProps } from "react-native-svg"

interface imageProps extends SvgProps {}

const SvgComponent = (props: imageProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 14"
    {...props}
  >
    <Path
      fill="#000"
      d="M15.813 7a.938.938 0 0 1-.938.938H3.391l4.025 4.024a.94.94 0 1 1-1.328 1.328L.463 7.665a.937.937 0 0 1 0-1.328L6.088.712A.939.939 0 1 1 7.416 2.04L3.39 6.062h11.484a.937.937 0 0 1 .938.938Z"
    />
  </Svg>
)
export default SvgComponent
