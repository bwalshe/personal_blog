import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { rhythm } from "../utils/typography"
import { css } from "@emotion/core"
import Img from "gatsby-image"



const PostSummary = ({title, date, img, summary}) => {
    return (<li 
        css={css`
        width: 100%;
        display: inline-block;
        padding: 20px 20px 0px 0px;
        background-color: #ffffff;
        `}>
        <h3 css={css`margin-bottom: ${rhythm(1 / 4)};`}>
            {title}
            <span css={css`color: #bbb;`}> - {date}</span>
        </h3>
        <div >
            <Img css={css`float: right;`} fixed={img}/>
            <p>{summary}</p>
        </div>
    </li>)
}
export default () => {
    const data = useStaticQuery(query)
    console.log(data)
    const {totalCount, edges} = data.allMarkdownRemark

    return (
        <div css={css`
            max-width: 800px;
            margin: auto;
            padding: 10px`}>
            <h4>{totalCount} Posts</h4>
            <ul css={css`list-style-type: none; padding 0; margin 0;`}>
            {edges.map(({node}, index) => {
                return <Link to={node.fields.slug}> 
                    <PostSummary
                        key={index}
                        title={node.frontmatter.title} 
                        img={node.frontmatter.featuredImage.childImageSharp.fixed} 
                        date={node.frontmatter.date} 
                        summary={node.excerpt}/>
                </Link>
            })}
            </ul>
        </div>
    )
}

const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            featuredImage {
                childImageSharp {
                    fixed(width: 250, height: 150) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
          }
          fields {
              slug
          }
          excerpt(pruneLength: 500)
        }
      }
    }
  }
  `