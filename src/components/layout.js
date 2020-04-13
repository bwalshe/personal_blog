import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { css } from "@emotion/core"

import linkedinLogo from "../../images/LI-In-Bug.png"
import gitLogo from "../../images/GitHub-Mark-32px.png"
import headerImage from "../../images/blogheader.png"

const HEADER_WIDTH = "1000px"
const HEADER_COLOR = "#ffffff7e"

const contactList =   <ul css={css`list-style-type: none; `}>
<li key="linkedin" css={css`float: right; margin-right: 10px`}>
    <a href="https://www.linkedin.com/in/brian-walshe-197a7aa8/">
        <img src={linkedinLogo}/>
    </a>
</li>
<li key="github" css={css`float: right; margin-right: 10px`}>
    <a href="https://github.com/bwalshe">
        <img src={gitLogo}/>
    </a>
</li>
</ul>

export default ({bigHeader, children}) => {
    const data = useStaticQuery(
        graphql`
          query {
            site {
              siteMetadata {
                title
                byline
              }
            }
          }
        `
      )
    const {title, byline} = data.site.siteMetadata
    const header = bigHeader ? 
        <BigHeader title={title} byline={byline}/> : <SmallHeader title={title}/>
    return (
        <div css={css`max-width: ${HEADER_WIDTH}; margin: auto;`}>
            {header}
            {children}
        </div>
    )
}

const SmallHeader = ({title}) => 
<div css={css` 
    margin: 3rem auto;
    height: 60px;
    background-image: url(${headerImage});
    padding: 10px`}>
  <div css={css`display: inline-block; width: 100%; padding: 5px`}>
    <Link to="/">
      <h1 css={css`margin-top: 0; float: left`}>{title}</h1>
    </Link>
    {contactList}
  </div>
  
</div>


const BigHeader =  ({title, byline}) => 
  <div css={css` 
      margin: 3rem auto;
      height: 312px;
      background-image: url(${headerImage})`}>
    <div css={css`
        width: 400px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 100px;
        margin-top: 50px;
        margin-bottom: auto;
        background-color: ${HEADER_COLOR}; 
        padding: 20px;
        `}>
    <h1>{title}</h1>
    <p>
      {byline}
    </p>
    {contactList}
    </div>
  </div>

