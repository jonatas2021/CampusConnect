import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={68}
    height={68}
    fill="none"
    {...props}
  >
    <Path
      fill="#DEFCC7"
      d="M60.444 0H7.556C3.4 0 0 3.4 0 7.556v52.888C0 64.6 3.4 68 7.556 68h52.888C64.6 68 68 64.6 68 60.444V7.556C68 3.4 64.6 0 60.444 0ZM41.556 52.889H15.11v-7.556h26.445v7.556Zm11.333-15.111H15.11v-7.556h37.78v7.556Zm0-15.111H15.11V15.11h37.78v7.556Z"
    />
  </Svg>
)
export default SvgComponent
