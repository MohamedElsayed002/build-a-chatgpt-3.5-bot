import { process } from "./env"
import { Configuration, OpenAIApi } from 'openai'
console.log('Mohammad Al-Sayed')




const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(configuration)

const chatbotConversation = document.getElementById('chatbot-conversation')
const clearButton = document.getElementById('clear-btn')

const instructionObj = [{
  role: 'system',
  content: 'you are a helpful assistant'
}]

clearButton.addEventListener('click', () => {
  chatbotConversation.innerHTML = '<div class="speech speech-ai">How can help you?</div>'
})

document.addEventListener('submit', (e) => {
  e.preventDefault()
  const userInput = document.getElementById('user-input')

  instructionObj.push({
    role: 'user',
    content: userInput.value
  })

  fetchReply()
  const newSpeechBubble = document.createElement('div')
  newSpeechBubble.classList.add('speech', 'speech-human')
  chatbotConversation.appendChild(newSpeechBubble)
  newSpeechBubble.textContent = userInput.value
  userInput.value = ''
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight

})



async function fetchReply() {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: instructionObj,
    presence_penalty: 0,
    frequency_penalty: 0.3
  })
  console.log(response)
  instructionObj.push(response.data.choices[0].message)
  renderTypeWriterText(response.data.choices[0].message.content)
}

function renderTypeWriterText(text) {
  const newSpeechBubble = document.createElement('div')
  newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
  chatbotConversation.appendChild(newSpeechBubble)
  let i = 0;
  const interval = setInterval(() => {
    newSpeechBubble.textContent += text.slice(i - 1, i)
    if (text.length === i) {
      clearInterval(interval)
      newSpeechBubble.classList.remove('blinking-cursor')
    }
    i++
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

  }, 100)
}