import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer, useImmerReducer } from "use-immer"
import Axios from "axios"
import { Link } from "react-router-dom"

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: "",
    requestCount: 0,
    show: "none",
    result: [],
  })

  useEffect(() => {
    document.addEventListener("keyup", actionKeypress)
    return () => {
      document.removeEventListener("keyup", actionKeypress)
    }
  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading"
      })

      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++
        })
      }, 750)
      //clean up
      return () => {
        clearTimeout(delay)
      }
    } else {
      setState((draft) => {
        draft.show = "none"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    if (state.requestCount) {
      if (state.searchTerm.trim()) {
        async function fetchSearchResult() {
          try {
            const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
            //console.log(response.data)
            setState((draft) => {
              draft.result = response.data
              draft.show = "results"
            })
            console.log(state.result)
          } catch (e) {
            console.log("Something wrong or the request was cancelled.")
          }
        }
        // call the function
        fetchSearchResult()
      }
    }
    return () => ourRequest.cancel()
  }, [state.requestCount])

  function handleSearch(e) {
    const value = e.target.value
    setState((draft) => {
      draft.searchTerm = value
    })
  }

  function actionKeypress(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleSearch} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.result.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong>( {state.result.length} {state.result.length > 1 ? "items" : "item"})
                </div>
                {state.result.map((post) => {
                  const date = new Date(post.createdDate)
                  const formatedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                  return (
                    <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
                      <span className="text-muted small">
                        {" "}
                        by {post.author.username} on {formatedDate}{" "}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
            {!Boolean(state.result.length) && <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find any result for that search </p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
