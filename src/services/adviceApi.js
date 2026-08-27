import axios from 'axios'

export async function fetchRandomAdvice() {
  const { data } = await axios.get('https://api.adviceslip.com/advice')
  return data.slip.advice
}
