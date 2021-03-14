import React from "react";

export const Nav = React.memo(() => {
  return (
    <header>
      <ul>
        <li>첫번째 요소</li>
        <li>두번째 요소</li>
        <li>세번째 요소</li>
      </ul>
    </header>
  );
});
