import {css} from "@emotion/css"
import NoisePng from "../assets/noise.png"
import {createCns} from "./utils/classNames"

// global class names
export const gcn = createCns("Global", {
  elevateShadow: css`
    box-shadow: inset var(--shadow-size-up) var(--shadow-size-up) 0 0
        hsl(0, 0%, 100%, 0.25),
      inset var(--shadow-size-down) var(--shadow-size-down) 0 0
        hsl(0, 0%, 0%, 0.5);
  `,
  depressShadow: css`
    box-shadow: inset var(--shadow-size-up) var(--shadow-size-up) 0 0
        hsl(0, 0%, 0%, 0.5),
      inset var(--shadow-size-down) var(--shadow-size-down) 0 0
        hsl(0, 0%, 100%, 0.25);
  `,
  noiseBackground: css`
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: 0.1;
      background-size: 25rem;
      background-color: hsl(0, 0%, 0%);
      background-image: url(${NoisePng});
      image-rendering: pixelated;
    }
  `,
})
