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
    width={60}
    height={33}
    fill="none"
    {...props}
  >
    <Path fill="url(#a)" d="M0 0h60v33H0z" />
    <Defs>
      <Pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <Use xlinkHref="#b" transform="matrix(.00611 0 0 .01111 .225 0)" />
      </Pattern>
      <Image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACV0lEQVR4nO3cW27TQBhAYadSy0UsoDvkshECD1CJIpWn7oEHxAYQArZBC0iIWwU8HmRlhKzUTpzwe0pmzpHyklgT9+vUlsdWm8bMzMzMOgEHwAPgHDgD5u173W0soAS73DxibOuUZvJyH7rbWEDpcLHc+4ixbf2h4353G4s7Gc7TzPZkaGZmZrbb4VpHNui5ax15oM9d68gDfeZaRx7ouWsdeaAPXOswMzOzfAF7ek8LfAM4Br6l15P2PdHjoY96LlgeCR0P/bEH+pPQ8dC9CS30bsZAV71fxYXQQhcVzmihiwpntNBFhTNa6KLCGS10UeGM/r+hgb2q78qwuGPyDPgJfAYeAteioNux0l2YdvzfwClwq6ktFsjLvRjC3gQ6IbdjLXfa1BQwAy4G7Hqxx0KvQCbN7LoOI8CPIbw+7DHQa5BJv9xZU1PA4xUgl7DXQY9AbjtqdqHIPzvGwfzFXgW96VhBh77ZzjxTwQZAKz7PhgzcBE6AX+l1EvpsyZTPVDAeapvPwpDTvj7tGf84YuxVz1SE/a8MxmFvUxhy2s+vPd/xZacuf1k80f88EPklcD14H6d1yAEdjB2OXBR0EPYkyMVB/yP2ZMhFQm+JPSlysdAbYk+OXDT0SOwsyMVDr8HOhlwF9AB2VuRqoJewsyNXBd25XA+7rN6kqqCvMqEzJXSmhM6U0JkSOlNCFwQ99LCLwfdI6NeKDvYqEvre8PdU353oNYZ31ZNe7g2wHwadsA+Btz1fVjPyYShyB3sfuNselyo9QV6kn/12+Ew2MzMzMzNrrqg/bFh+fjo5fd0AAAAASUVORK5CYII="
        id="b"
        width={90}
        height={90}
        preserveAspectRatio="none"
      />
    </Defs>
  </Svg>
)
export default SvgComponent
