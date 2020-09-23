import React, { useRef, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { useImmer, useImmerReducer } from "use-immer"
import io from "socket.io-client"

const socket = io("http:/localhost/8080")

function Chat() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const chatField = useRef(null)
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  })

  useEffect(() => {
    if (state.isChatOpen) {
      chatField.current.focus()
    }
  }, [appState.isChatOpen])

  function handleChatInput(e) {
    const value = e.target.value
    setState((draft) => {
      draft.fieldValue = value
    })
  }

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message)
      })
    })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    // send message to server
    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })
    setState((draft) => {
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
      draft.fieldValue = ""
    })
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper  shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log">
        {state.chatMessages.map((msgobj, index) => {
          if (msgobj.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{msgobj.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={msgobj.avatar} />
              </div>
            )
          }
          return (
            <div className="chat-other">
              <a href="#">
                <img className="avatar-tiny" src={msgobj.avatar} />
              </a>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <a href="#">
                    <strong> {msgobj.username}: </strong>
                  </a>
                  {msgobj.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.fieldValue} onChange={handleChatInput} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat
