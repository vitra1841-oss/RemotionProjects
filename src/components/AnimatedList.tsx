import React from 'react';

interface AnimatedListProps {
  children: React.ReactNode[];
  stagger?: number;
  delay?: number;
  renderItem: (item: React.ReactNode, index: number, delay: number) => React.ReactNode;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  stagger = 5,
  delay = 0,
  renderItem,
}) => {
  return (
    <>
      {children.map((child, index) => renderItem(child, index, delay + index * stagger))}
    </>
  );
};
