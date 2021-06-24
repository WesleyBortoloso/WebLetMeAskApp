import { useEffect } from 'react'
import { FormEvent, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'
import { useHistory } from 'react-router-dom'



type RoomParams = {
  id: string
}

export function AdminRoom() {

  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('')
  const roomId = params.id
  const history = useHistory()
  const { questions,title } = useRoom(roomId)
  const { user } = useAuth()

  async function  handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if(newQuestion.trim() === ''){
      return
    }

    if (!user) {
      throw toast.error('Você deve estar logado para fazer isso !')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
    toast('Mensagem Enviada com Sucesso')
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string ){
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta ?')){
       await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk" />
          <div>
            <RoomCode code ={roomId}/>
            <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

       <div id="question-list">
        {questions.map(question => {
          return(
            <Question
             key={question.id}
             content={question.content}
             author={question.author}
            >
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover Pergunta " />
              </button>
            </Question>
          )
        })}
       </div>
      </main>
    </div>
  )
}