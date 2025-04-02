import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  Pattern,
  Use,
  Image,
} from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={38}
    height={42}
    fill="none"
    {...props}
  >
    <Path fill="url(#a)" d="M0 0h38v42H0z" />
    <Defs>
      <Pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <Use xlinkHref="#b" transform="matrix(.01228 0 0 .01111 -.053 0)" />
      </Pattern>
      <Image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACJklEQVR4nO3cMW4TQRiG4RVBOAXhAJAaKRdIR0ETKVGuQQek9EFAuUgKTmAQFfYZSCqqCBC4etHKjhSheHZtr79/dvZ7+vHOvl5t7N/KVpWZmZlZsYB94AL4CvxCYw5MgONqCIBDYEacP8BJNYAreRYYeRixWdwuclFubBb35JyUGRv4GRT096BiE+dVw5v8FzivSkGQ5bGHE5sg944/jNgE+W8P5ccmyAP7KDs2QVbspdzYBEnsp8zYBGnYU3mxCdJiX/nGTo06E2tCtDyf19l9g2wadSbWhVjjvPKJ3WbUmVgbYs3zaxP7OItRZ2JtlOcdx550EnPbUWdibZTxBueZij3fOmQXo87E2ij174XjLq/sTmI2HLzRNmv7wqFFHFrEoUUcWsShRRxaxKFFHFrEoUUcWsShRRxaxKFFHFrEoUUcWsShRRxaxKFFHFrEoUUcWsShRRxaxKFFHFrEoUUcWsShRRxaxKFFHHpIoYGDzB6M0rXbXEK/7Mmjfjb1JZfQpyvWvqcMb3MJ/XHF2hEwpd++AU9yCf0deJz4r9sp/Y38YueR1whde5N4jRHwrr7X9eAPZL2/z/XtQnIlbxD6ZtWnD2thzavhE7DnsLsPXfsAPHLs3YeuXQHPHHv3oWs/lk9GePDTiHUX+s41cAmcAUfAU0fu9orOTtZvMAWpckZBqpz14JtcPqPObXjUKeJRp4hHnUIedQp51GlmZmZmZlaV4R9HKiSqDI7QLgAAAABJRU5ErkJggg=="
        id="b"
        width={75}
        height={75}
        preserveAspectRatio="none"
      />
    </Defs>
  </Svg>
)
export default SvgComponent
