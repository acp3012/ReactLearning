import React, { useEffect } from "react"
import Page from "./Page"
import { Link } from "react-router-dom"
function NotFound() {
  return (
    <Page title="not found">
      <div className="text-center">
        <h2>Whoops, we can not find that Page.</h2>
        <p className="Lead text-muted">
          You can go to <Link to="/">Home</Link> page get the Post{" "}
        </p>
      </div>
    </Page>
  )
}

export default NotFound
