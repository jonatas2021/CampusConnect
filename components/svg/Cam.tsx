import * as React from "react";
import Svg, {
  SvgProps,
  Path,
  Defs,
  Pattern,
  Use,
  Image,
} from "react-native-svg";
import { StyleProp, ViewStyle, Animated } from "react-native";

// Cria o componente AnimatedSvg
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const isViewStyle = (s: any): s is ViewStyle =>
  s !== null && s !== undefined && typeof s === "object";

const SvgComponent = (props: SvgProps & { style?: StyleProp<ViewStyle> }) => {
  const { style, ...restProps } = props;

  const extractedWidth = Array.isArray(style)
    ? style.find((s): s is ViewStyle => isViewStyle(s) && s.width !== undefined)
        ?.width
    : isViewStyle(style)
    ? style.width
    : undefined;

  const extractedHeight = Array.isArray(style)
    ? style.find(
        (s): s is ViewStyle => isViewStyle(s) && s.height !== undefined
      )?.height
    : isViewStyle(style)
    ? style.height
    : undefined;

  return (
    <AnimatedSvg
      width={(extractedWidth) as unknown as number}
      height={(extractedHeight) as unknown as number}
      fill="none"
      {...restProps}
    >
      <Path fill="url(#a)" d="M0 0h40v33.651H0z" />
      <Defs>
        <Pattern id="a" patternContentUnits="objectBoundingBox">
          <Use xlinkHref="#b" transform="matrix(.00935 0 0 .01111 .08 0)" />
        </Pattern>
        <Image
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEiElEQVR4nO2cy28cRRCHJya2E6QgyEIewAmJQ4BDQNwIKBzNI4Ek4gLnRKAEBIoJJ/MMJLz+DeCKOAIR76eCsbglIAUIshEXCJLXHPKhgrJYme3p2dnu3pne+qSVrNmdqpqfZ6u7umu2KAzDMAzDMAzDMAzDMIygANuBF4HvgGWGZ1ltHQe22b+r+EfkO4HfiIfY3j3WYgPXAReIz5/A9UVbAaaAk8Avay7sPHBC3vec/x7peLdoKypmGSdKzt1NetqZQvTOLeO847x1wAekR3yuK8YF4GFGx6FiHAAeCjSFq4v4frDIEeBq4G7gHZrBReBtYEZiK5oAsAF4DPhCp0nGv4gWnwOPAtPDinwt8K0aNtzMi1bD3Mkm8mBiD35na7oYJV3gFDAH3AfsAK4AJrVQkr9v0Pfm9LNyzig5Ukdoycmj4DRwELi8Rswi/iG1MQo+qyN0ijWItV+9mRAFhRZEMstZIC1/1Ak25bz2cWD9sAL3uYb1wNEaKWUFeFKnpfI6pse8NFXoM8DO0AL3uZabgbMDxHWsjw0R20ud4GLzFbAllJgVrmez5NCKsW3vc/62KifWCSwmXwKbKsRwCXAH8JqKtAT8pa8lPfYqcLt8toK9TcDXFeL7X7WoKaRVQp8BrvL43gg8Bfw6gN0lzasbPba3AN/XSB0ST2uEXvblZOAB4OchfPwIHPD4uMUzQK5oTm7tYPhEib8J4KWAi0ayMTtR4m+WCDRB6HnXFE5FfiuCzzddYmuFuZCj0DMlvkLdyf14ocTvvbkJfdpV8WlOjomkkf0lFaR807IR+mDJ7EIGr9jI4HqpI4ZHchG661ogqjplCsRsSSFTaUbRdKHfLylGBpknD8uiq6gBPsxB6DmHfan4UrPLEcszOQi912H/ddLziiOWfTkIvcNhv+oCT0g+ccRyYw5Cdxz2U+bnVRYdsVyZg9BTDvvBRvoB6DpimQ7lwIQeA6E7DvuWOhINhp+Sno9zHgz3OuzLzkhqTuY8vZtz2Jftp9Tc5ojl2RyEPlVSgsv2U8oSfCLnErwrHUQOH7LHl4qjjhg6utnbeqGdXfbaSHmO+Pzk2rTNaZnUt/B/QBfnYyG27x+XhX/hrhJfspEai+dK/O4J7awJQi94NmdlIzU0b3g2Z+Ux5uyEdg5IPWIfD5RGxMbznnaDSr10bRW6K80rHr/7h9xHPOfKyT0+bo3VtN4UodGuztLmRp2NzOrctyqL2qK7wWN7K/ADkWiS0KudpFWaHCWd7JKdEVm0VzFX9LWox16Wiq8sTfTYu6xik2M2QqMXnLJtd2tskYU6gaXgrC9nh0BzcrR00Uud4FLR1Xw8GUHgSZ1dJHtaq8lC986z7wn4sNCeGPPkHIReZV5//WBzjZg7unYRtKzOVehVVnT58mldmL9JhZzSV0eP7dMGmI9CrsKlFDr1c4Y58HubnpxtM7WenJWfRzAG43AdoadHOai0kG98v4rm+70OE7uayNfUEnnNnX1EmxJtgPyPC9qbcrj2nWwYhmEYhmEYhmEYhmEYhmEYhmEUbv4G6pEd2jecnNsAAAAASUVORK5CYII="
          id="b"
        />
      </Defs>
    </AnimatedSvg>
  );
};

export default SvgComponent;
