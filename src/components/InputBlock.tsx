import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Decimal from "decimal.js";
import classNames from "classnames";

interface InputBlockProps {
  direction: "left" | "right";
  currency: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  isActive: boolean;
  otherIsEditing: boolean;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
}

const percentOptions = [25, 50, 75, 100];

export const InputBlock = ({
  currency,
  min,
  max,
  step,
  value,
  onChange,
  isActive,
  otherIsEditing,
  onFocus,
  onBlur,
  disabled = false,
}: InputBlockProps) => {
  const [localValue, setLocalValue] = useState<string>(String(value));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setLocalValue(String(value));
    }
  }, [value, isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      validateAndApplyValue();
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValue, isActive]);

  const validateAndApplyValue = () => {
    const decimal = new Decimal(localValue || 0);

    if (decimal.isNaN() || decimal.lessThan(min) || decimal.greaterThan(max)) {
      setLocalValue(String(min));
      onChange(min);
      return;
    }

    const stepped = decimal.div(step).floor().mul(step).toNumber();
    setLocalValue(String(stepped));
    onChange(stepped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndApplyValue();
      e.currentTarget.blur();
    }
  };

  const inputClass = classNames("bg-transparent outline-none w-fit text-4xl font-bold", {
    "input-pending": !isActive && otherIsEditing,
  });

  const handlePercentClick = (percent: number) => {
    const decimalValue = new Decimal(max).mul(percent).div(100);
    const stepped = decimalValue.div(step).floor().mul(step).toNumber();
    setLocalValue(String(stepped));
    onChange(stepped);
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${width + 15}px`;
    }
  }, [localValue]);

  return (
    <div className="w-full flex flex-col gap-2 p-4  ">
      <div className="input-block text-3xl font-bold flex items-baseline gap-1 relative w-full pb-2 border-b mb-3 border-gray-300">
        {/* Скрытый span для измерения ширины */}
        <span ref={spanRef} className="absolute top-0 left-0 invisible whitespace-pre font-bold text-4xl ">
          {localValue || "0"}
        </span>

        <input
          ref={inputRef}
          type="number"
          className={inputClass}
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={() => {
            onBlur();
            validateAndApplyValue();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ width: "auto" }}
        />

        <span className="text-blue-600 text-3xl font-semibold">{currency}</span>
      </div>

      <div className="flex justify-between gap-2 w-full ">
        {percentOptions.map((p) => {
          const percent = new Decimal(value).minus(min).div(new Decimal(max).minus(min)).mul(100).toNumber();

          const fill = Math.min(Math.max((percent - (p - 25)) / 25, 0), 1) * 100;

          return (
            <button
              key={p}
              onClick={() => handlePercentClick(p)}
              className="relative p-4 rounded-full border text-sm font-semibold w-full overflow-hidden group transition-all h-4"
              disabled={disabled}
            >
              {/* синий фон-заливка */}
              <div
                className="absolute inset-0 bg-blue-500 z-0 transition-all duration-300"
                style={{ width: `${fill}%` }}
              />

              {/* белый текст (на синем фоне) */}
              <span
                className="absolute inset-0 flex items-center justify-center z-10 text-white transition-all duration-300"
                style={{
                  clipPath: `inset(0 ${100 - fill}% 0 0)`, // показываем только залитую часть текста
                }}
              >
                {p}%
              </span>

              {/* чёрный текст (на белом фоне) */}
              <span
                className="absolute inset-0 flex items-center justify-center z-10 text-gray-800/50 transition-all duration-300"
                style={{
                  clipPath: `inset(0 0 0 ${fill}%)`, // показываем оставшуюся часть текста
                }}
              >
                {p}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
