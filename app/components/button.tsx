import clsx from "clsx";

type ButtonProps = {
  variant: "purple" | "blue" | "navy" | "red";
  type: "button" | "submit";
  children: React.ReactNode;
  as?: "button" | "a";
};

const Button = ({ variant, children }: ButtonProps) => {
  return <button className="">{children}</button>;
};

export { Button };
