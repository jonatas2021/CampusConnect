import * as React from "react"
import Svg, {
  SvgProps,
  G,
  Rect,
  Path,
  Defs,
  ClipPath,
  Pattern,
  Use,
  Image,
} from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={251}
    height={126}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Rect width={251} height={126} fill="#fff" rx={6} />
      <Path fill="url(#b)" d="M0 0h251v126H0z" />
    </G>
    <Rect width={250} height={125} x={0.5} y={0.5} stroke="#000" rx={5.5} />
    <Defs>
      <ClipPath id="a">
        <Rect width={251} height={126} fill="#fff" rx={6} />
      </ClipPath>
      <Pattern
        id="b"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <Use xlinkHref="#c" transform="matrix(.00438 0 0 .00872 -.147 -.206)" />
      </Pattern>
      <Image
        xlinkHref="data:image/png;base64,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"
        id="c"
        width={311}
        height={162}
        preserveAspectRatio="none"
      />
    </Defs>
  </Svg>
)
export default SvgComponent
