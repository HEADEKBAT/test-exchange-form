import { useEffect, useState } from "react"
import Decimal from "decimal.js"
import { calculateExchange } from "../api/exchangeApi"

export const useExchange = () => {
  const [price, setPrice] = useState<[string, string]>(["1", "1"])
  const [leftValue, setLeftValue] = useState<number>(10000)
  const [rightValue, setRightValue] = useState<number>(0)
  const [activeSide, setActiveSide] = useState<"left" | "right">("left")

  // При первом монтировании вызываем calculateExchange
  useEffect(() => {
    const init = async () => {
      const response = await calculateExchange({ inAmount: 10000, outAmount: null })

      if (response?.price) {
        setPrice(response.price as [string, string])

        // также сразу обновим второй инпут на основе ответа
        setRightValue(Number(response.outAmount))
      }
    }

    init()
  }, [])

  const handleLeftChange = (val: number) => {
    setActiveSide("left")
    setLeftValue(val)

    const rate = new Decimal(price[0]) // RUB → USDT
    const result = new Decimal(val).div(rate).toFixed(6)
    setRightValue(Number(result))
  }

  const handleRightChange = (val: number) => {
    setActiveSide("right")
    setRightValue(val)

    const rate = new Decimal(price[0]) // RUB → USDT
    const result = new Decimal(val).mul(rate).toFixed(0)
    setLeftValue(Number(result))
  }

  return {
    leftValue,
    rightValue,
    handleLeftChange,
    handleRightChange,
    activeSide,
  }
}
