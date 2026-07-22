export interface StickyCardLayoutSide {
  x?: number;
  y?: number;
  right?: number;
  w?: number;
  h?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  z?: number;
  align?: "left" | "center" | "right";
  maxWidth?: number;
}

export interface StickyCard {
  projectTitle: string;
  image?: string;
  video?: string;
  technologies: string;
  href?: string;

  layout?: {
    mobile?: {
      title?: StickyCardLayoutSide;
      tech?: StickyCardLayoutSide;
      media?: StickyCardLayoutSide;
    };
    air?: {
      title?: StickyCardLayoutSide;
      tech?: StickyCardLayoutSide;
      media?: StickyCardLayoutSide;
    };
    tablet?: {
      title?: StickyCardLayoutSide;
      tech?: StickyCardLayoutSide;
      media?: StickyCardLayoutSide;
    };
    desktop?: {
      title?: StickyCardLayoutSide;
      tech?: StickyCardLayoutSide;
      media?: StickyCardLayoutSide;
    };
  };
}
