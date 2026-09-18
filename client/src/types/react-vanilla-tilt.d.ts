declare module "react-vanilla-tilt" {
  import * as React from "react";

  export interface TiltOptions {
    max?: number;
    scale?: number;
    speed?: number;
    glare?: boolean;
    "max-glare"?: number;
  }

  export interface TiltProps
    extends React.HTMLAttributes<HTMLDivElement> {
    options?: TiltOptions;
    children?: React.ReactNode;
  }

  const Tilt: React.FC<TiltProps>;
  export default Tilt;
}
