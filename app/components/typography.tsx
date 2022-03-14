import clsx from "clsx";
import React, { ReactNode } from "react";

const fontSizes = {
  h1: "text-2xl font-bold", // 24px
  h2: "text-xl font-bold", // 20px
  h3: "text-lg font-bold", // 18px
  h4: "text-sm font-bold", // 14px
};

const titleColors = {
  light: "text-white",
  dark: "text-primary",
};

type TitleProps = {
  as?: React.ElementType;
  variant?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

const Title = ({
  as,
  variant = "dark",
  children,
  size,
  className,
}: TitleProps & { size: keyof typeof fontSizes }) => {
  const Tag = as ?? size;
  return (
    <Tag className={clsx(fontSizes[size], titleColors[variant], className)}>
      {children}
    </Tag>
  );
};

const H1 = (props: TitleProps) => {
  return <Title {...props} size="h1" />;
};

const H2 = (props: TitleProps) => {
  return <Title {...props} size="h2" />;
};

const H3 = (props: TitleProps) => {
  return <Title {...props} size="h3" />;
};

const H4 = (props: TitleProps) => {
  return <Title {...props} size="h4" />;
};

const paragraphSizes = {
  1: "text-base font-normal", // 16px
  2: "text-sm font-normal", // 14px
  3: "text-xs font-semibold tracking-wider", // 12px
};

const paragraphColors = {
  light: "text-white",
  dark: "text-secondary",
};

type ParagraphProps = {
  size: "1" | "2" | "3";
  as?: React.ElementType;
  variant?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

const Paragraph = ({
  as = "p",
  variant = "dark",
  size,
  className,
  ...rest
}: ParagraphProps) => {
  return React.createElement(as, {
    className: clsx(paragraphSizes[size], paragraphColors[variant], className),
    ...rest,
  });
};

export { H1, H2, H3, H4, Paragraph };
