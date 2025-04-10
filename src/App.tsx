import { useState } from "react"
import { InputBlock } from "./components/InputBlock"
import { useExchange } from "./hooks/useExchange"

function App() {
  const {
    leftValue,
    rightValue,
    handleLeftChange,
    handleRightChange,
  } = useExchange()

  const [activeField, setActiveField] = useState<"left" | "right" | null>(null)

  const leftConfig = {
    min: 10000,
    max: 70000000,
    step: 100,
    currency: "RUB",
  }

  const rightConfig = {
    min: 100,
    max: 700000,
    step: 0.000001,
    currency: "USDT",
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:gap-8 max-w-5xl mx-auto">
      <InputBlock
        direction="left"
        currency={leftConfig.currency}
        min={leftConfig.min}
        max={leftConfig.max}
        step={leftConfig.step}
        value={leftValue}
        onChange={handleLeftChange}
        isActive={activeField === "left"}
        otherIsEditing={activeField === "right"}
        onFocus={() => setActiveField("left")}
        onBlur={() => setActiveField(null)}
      />

      <InputBlock
        direction="right"
        currency={rightConfig.currency}
        min={rightConfig.min}
        max={rightConfig.max}
        step={rightConfig.step}
        value={rightValue}
        onChange={handleRightChange}
        isActive={activeField === "right"}
        otherIsEditing={activeField === "left"}
        onFocus={() => setActiveField("right")}
        onBlur={() => setActiveField(null)}
      />
    </div>
  )
}

export default App
