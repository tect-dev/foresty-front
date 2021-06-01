import { LargeText, XXXLargeText } from "../components/Texts";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { DefaultButton } from "../components/Buttons";

export const FAQPage = () => {
  return (
    <div
      style={{
        maxWidth: "800px",

        padding: "24px",
        margin: "auto",
      }}
    >
      <XXXLargeText>Foresty FAQ</XXXLargeText>
      <br />
      <br />

      <MarkdownRenderer text={text} />
    </div>
  );
};

const text = `## What is a Foresty?

Mind map + Note taking = Foresty. You can use it for note taking, personal wiki, or etc.

## Is it free?

Temporally. We're in the middle of a beta test. Users who signed up for beta testing don't need to pay anything. It's free for them. Even after its official release, beta users don't need to pay.

## Can I backup my documents?

We support documents download in a markdown format(.md).

## I have some feedbacks for you!

We are open to any feedbacks. Please contact following email. Thx!
\`\`\`javascript
{
"e-mail": "contact@foresty.net"
}
\`\`\`

## How To Start?

Following Steps: 

1. Sign up or Login.

2. Click "My Note"
![스크린샷 2021-06-01 17.11.36.png](https://tectimage.s3.ap-northeast-2.amazonaws.com/5781622535489751.png)

3. Click "Create New Canvas"
![스크린샷 2021-06-01 17.16.04.png](https://tectimage.s3.ap-northeast-2.amazonaws.com/9281622535508148.png)

4. Double click on canvas creates a circle. It is document!
![create node.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/3401616753376695.gif)

5. Clicking a circle opens a document.
![open node.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/3521616758793306.gif)

6. Write your own document. 

7. Dragging Node to Node creates connection.
![connect nodes.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/5491616759237796.gif)

8. Click the Edit button in the upper right corner to:
* move the node
* delete the node
* delete the connection.

![edit tree.gif](https://tectimage.s3.ap-northeast-2.amazonaws.com/4471616760363764.gif)

9. That's it! You can use it by note taking tool, or graphic wiki, or etc.
`;
