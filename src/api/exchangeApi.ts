// 📌 Мок-данные, имитирующие реальный ответ API
const MOCK_EXCHANGE_RESPONSE = {
    inAmount: 1,
    outAmount: 15, 
    isStraight: true,
    price: ["96.47", "0.01035"],
  }
  
  export const calculateExchange = async ({
    inAmount,
    outAmount,
  }: {
    inAmount: number | null
    outAmount: number | null
  }) => {
    console.warn("🧪 MOCK API: calculateExchange called")
  
    const price = MOCK_EXCHANGE_RESPONSE.price
    const isStraight = inAmount !== null
  
    const input = inAmount ?? outAmount ?? 0
    const output = isStraight
      ? Number((input / parseFloat(price[0])).toFixed(6)) // RUB → USDT
      : Number((input * parseFloat(price[0])).toFixed(0)) // USDT → RUB
  
    return {
      inAmount: isStraight ? input : output,
      outAmount: isStraight ? output : input,
      isStraight,
      price,
    }
  }
  