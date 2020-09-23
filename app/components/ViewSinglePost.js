import React, { useEffect, useState, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import Page from "./Page"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ProfilePosts from "./ProfilePosts"

function ViewSinglePost(props) {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const ourRequest = Axios.CancelToken.source()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("error in fetching post or the request was cancelled by user.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
  // display notfound if post not found
  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading) {
    return (
      <Page title="Loading..">
        <LoadingDotsIcon />
      </Page>
    )
  }
  const date = new Date(post.createdDate)
  const formatedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  async function DeleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete the post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if ((response.data = "Suceess")) {
          //1. display message
          appDispatch({ type: "flashMessages", value: "The post deleted." })
          //2.redirect to current users home page.
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log("somethingg went wrong..")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit the post" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <Link onClick={DeleteHandler} to={`/post/${post._id}/delete`} data-tip="Delete the Post" data-for="delete" className="delete-post-button text-danger" title="Delete">
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip className="custom-tooptip" id="delete" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formatedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedType={["heading", "strong", "emphasis", "paragraph", "text", "list", "listItem"]} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
