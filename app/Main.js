import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
// My components

import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
import Chat from "./components/Chat"
Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
  const initialvalues = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        // break or return is okay
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessages":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
    }
  }
  /* state hold state objects
     dispatch is special function take objects and each object will be
     passed to the function (ourReducer) as action param.
    ourReducer used to change the state based on the action
  */
  const [state, dispatch] = useImmerReducer(ourReducer, initialvalues)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
      localStorage.setItem("complexappAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>

            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <CSSTransition timeout={300} in={state.isSearchOpen} className="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          {state.isChatOpen ? <Chat /> : ""}
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
// render the JSX at app

ReactDOM.render(<Main />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
