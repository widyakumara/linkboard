import * as Headless from "@headlessui/react";
import { clsx } from "clsx";
import * as React from "react";
import { XIcon } from "../icons/x";

export const MultiInput = React.forwardRef(function MultiInput(
  {
    className,
    onChange,
    value = [],
    onBlur,
    ...props
  }: {
    className?: string;
    onChange: (value: string[]) => void;
    value?: string[];
    onBlur?: (currentInputValue: string) => void;
  } & Omit<
    React.ComponentPropsWithoutRef<typeof Headless.Input>,
    "className" | "onChange" | "value" | "onBlur"
  >,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [inputValue, setInputValue] = React.useState("");
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag: string) => {
    if (tag.trim() !== "") {
      const newTags = [...value, tag.trim()];
      onChange(newTags);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (wrapperRef.current && e.target === wrapperRef.current) {
      inputRef.current?.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    addTag(inputValue);
    if (onBlur) {
      onBlur(inputValue);
    }
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleWrapperClick}
      className={clsx([
        className,
        "relative block w-full items-center",
        "rounded-lg border border-stone-950/10 dark:border-white/10",
        "focus-within:ring-2 focus-within:ring-blue-500",
        "p-1",
      ])}
    >
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <span
            key={index}
            className={clsx(
              "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
              "bg-stone-50 text-stone-700 ring-1 ring-inset ring-stone-900/10",
              "dark:bg-stone-500/10 dark:text-stone-400 dark:ring-stone-400/20"
            )}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <Headless.Input
          ref={inputRef}
          {...props}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          className={clsx([
            "flex-grow min-w-[80px]",
            "text-base/6 text-stone-950 placeholder:text-stone-500 sm:text-xs/5 dark:text-white",
            "border-0",
            "bg-transparent dark:bg-transparent",
            "focus:outline-none",
          ])}
        />
      </div>
    </div>
  );
});
