import React, { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { toast } from 'react-toastify'


export function Home(){

  const history = useHistory();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomcode] = useState('')

  async function handleCreateRoom(){

    if(!user) {
     await signInWithGoogle()
    }

      history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === ''){
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if(!roomRef.exists()){
      toast.error('A sala não existe !')
      return
    }

    if(roomRef.val().endedAt) {
      toast.error('A sala foi encerrada !')
      return
    }

    history.push(`/rooms/${roomCode}`)

  }


  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="LetMeAsk" />
          <button  onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom} >
            <input
             type="text"
             placeholder="Digite o código da sala"
             onChange={event => setRoomcode(event.target.value)}
             value={roomCode}
            />
            <Button type="submit">
              Entrar na Sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}