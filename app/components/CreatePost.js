import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { withRouter } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Page from "./Page"

function CreatePost(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  async function handlleSubmit(e) {
    e.preventDefault()

    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token })

      appDispatch({ type: "flashMessages", value: "Congrats!, You created your post." })
      // rediret to /post/{id}
      props.history.push(`/post/${response.data}`)
    } catch (e) {
      console.log("Create new Post failed.")
    }
  }

  return (
    <Page title="create new post">
      <form onSubmit={handlleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(CreatePost)
