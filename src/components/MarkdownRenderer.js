import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import remark from "remark";
import remarkParse from "remark-parse";
import math from "remark-math";
import remark2rehype from "remark-rehype";
import katex from "rehype-katex";
import ryhype2string from "rehype-stringify";
import raw from "rehype-raw";
import breaks from "remark-breaks";
import slug from "remark-slug";
import { throttle } from "throttle-debounce";
import { htmlFilter } from "../lib/functions";
import { prismPlugin } from "../lib/prismPlugin";
import { prismThemes } from "../lib/prismThemes";
import { colorPalette, mediaSize } from "../lib/constants";

const MarkdownStyledBlock = styled.div`
  &.monokai {
    ${prismThemes["monokai"]}
  }
  &.dracula {
    ${prismThemes["dracula"]}
  }
  word-break: break-all;
  ol,
  ul {
    padding-inline-start: 35px;
  }
  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-indent: 0.5rem;
  }
  h1,
  h2,
  h3,
  h4 {
    line-height: 1.5;
    margin-top: 1.5rem;
    margin-bottom: 0.3rem;
  }
  a {
    color: ${colorPalette.teal7};
    text-decoration: none;
    &:hover {
      color: ${colorPalette.teal6};
      text-decoration: underline;
    }
  }
  pre {
    font-family: "Noto Sans KR", "Fira Mono", source-code-pro, Menlo, Monaco,
      Consolas, "Courier New", monospace;
    font-size: 0.875rem;
    padding: 1rem;
    margin: 1rem;

    border-radius: 4px;
    line-height: 1.7;
    overflow-x: auto;
    letter-spacing: 0.1px;
    ${mediaSize.small} {
      font-size: 0.75rem;
      padding: 0.75rem;
    }
  }
  code {
    background: ${colorPalette.gray1};
    font-family: "Noto Sans KR", "Fira Mono", source-code-pro, Menlo, Monaco,
      Consolas, "Courier New", monospace;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-left: 2px;
  }
  img {
    max-width: 90%;
    height: auto;
    display: block;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  iframe {
    width: 768px;
    height: 430px;
    max-width: 100%;
    background: black;
    display: block;
    margin: auto;
    border: none;
    border-radius: 4px;
    overflow: hidden;
  }
  .twitter-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: none;
    background: none;
    padding: none;
  }
  table {
    min-width: 40%;
    max-width: 100%;
    border: 1px solid ${colorPalette.gray7};
    border-collapse: collapse;
    font-size: 0.875rem;
    thead > tr > th {
      /* text-align: left; */
      border-bottom: 4px solid ${colorPalette.gray7};
    }
    th,
    td {
      word-break: break-word;
      padding: 0.5rem;
    }
    td + td,
    th + th {
      border-left: 1px solid ${colorPalette.gray7};
    }
    tr:nth-child(even) {
      background: ${colorPalette.gray1};
    }
    tr:nth-child(odd) {
      background: white;
    }
  }
  .katex-mathml {
    display: none;
  }
  .math {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .math-inline {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  blockquote {
    margin-top: 2rem;
    margin-bottom: 2rem;
    border-left: 4px solid ${colorPalette.cyan5};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: ${colorPalette.gray0};
    margin-left: 0;
    margin-right: 0;
    padding: 1rem;
    padding-left: 2rem;
    color: ${colorPalette.gray9};
    ul,
    ol,
    li {
    }
    *:first-child {
      margin-top: 5px;
    }
    *:last-child {
      margin-bottom: 5px;
    }
  }
`;

export const MarkdownRenderer = React.memo(({ text }) => {
  const [html, setHtml] = useState("");

  const codeBlockPattern = /(```[\s\S]*\n[\s\S]*?\n```)/g; // 이걸로 쓰면 통으로 잘라버리네.
  //const codeBlockPattern = /(```)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  const latexBlockPattern = /(\$\$[\s\S]*[\s\S]*?\$\$)/g;

  //const exceptionPattern = /(\$\$[\s\S]*[\s\S]*?\$\$)|(```[\s\S]*\n[\s\S]*?\n```)/g

  //const exceptionCodeBlockPattern = /^(```)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi
  //const exceptionLatexBlockPattern = /^($$)([ㄱ-ㅎ가-핳a-zA-Z0-9\n\s\"\'\!\?\_\-\@\%\^\&\*\(\)\=\+\;\:\/\,\.\<\>\|\[\{\]\}]+)\1/gi

  useEffect(() => {
    throttle(
      25,
      setHtml(
        htmlFilter(
          // unified()
          remark()
            .use(remarkParse)
            .use(breaks)
            .use(slug)
            .use(prismPlugin)
            //.use(remarkHTML)
            .use(remark2rehype, { allowDangerousHTML: true })
            .use(raw)
            .use(math)
            .use(katex)
            .use(ryhype2string)
            .processSync(
              text
              // 코드블럭 시작 이전에는 마크다운 렌더링이 안되는 버그있어서 주석처리함.
              //.split(codeBlockPattern) // 코드 블럭 뿐만 아니라 레이텍 블럭 기준으로도 자를수있게해야함.
              //.map((ele) => {
              //  if (codeBlockPattern.test(ele)) {
              //    return `\n${ele}\n`
              //  } else if (latexBlockPattern.test(ele)) {
              //    return `\n${ele}\n`
              //  } else {
              //    return ele
              //      .replaceAll(`\n`, '<br />')
              //      .replaceAll(`\`\`\``, '\n```\n')
              //  }
              //})
              //.join('')
            )
            .toString()
        )
      )
    );
  }, [text]);

  return (
    <MarkdownStyledBlock
      className={"dracula"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
