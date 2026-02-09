
import React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: number | string;
  px?: number | string;
  py?: number | string;
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  bg?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  width?: string | number;
  height?: string | number;
  display?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  overflow?: 'hidden' | 'auto' | 'visible';
  zIndex?: number;
  children?: React.ReactNode;
  as?: React.ElementType;
  // aspect prop added to support aspect-ratio styling
  aspect?: string;
}

export const Box: React.FC<BoxProps> = ({ 
  children, 
  p, px, py, 
  m, mx, my,
  bg, 
  border,
  borderRadius,
  shadow,
  width,
  height,
  display,
  position,
  overflow,
  zIndex,
  aspect,
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const getSpace = (val: number | string | undefined) => 
    typeof val === 'number' ? `${val * 10}px` : val;

  const style: React.CSSProperties = {
    padding: getSpace(p),
    paddingLeft: getSpace(px),
    paddingRight: getSpace(px),
    paddingTop: getSpace(py),
    paddingBottom: getSpace(py),
    margin: getSpace(m),
    marginLeft: getSpace(mx),
    marginRight: getSpace(mx),
    marginTop: getSpace(my),
    marginBottom: getSpace(my),
    backgroundColor: bg,
    border,
    borderRadius,
    boxShadow: shadow,
    width,
    height,
    display,
    position,
    overflow,
    zIndex,
    // mapping aspect prop to aspectRatio CSS property to fix styles
    aspectRatio: aspect,
  };

  return (
    <Component className={`flow-box ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
};
