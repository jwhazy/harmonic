import { HTMLProps, InputHTMLAttributes } from "react";
import clsxm from "../utils/clsxm";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
  className?: string;
};

function Input({ children, ...props }: Props & HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsxm(
        "h-10 w-full rounded-xl border border-zinc-600 bg-zinc-800 py-2 px-3 text-white transition focus:border-transparent focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-600",
        props.className
      )}
    />
  );
}

export default Input;
