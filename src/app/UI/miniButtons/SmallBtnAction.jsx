import React from "react";

import "./smallBtns.css";

const SmallBtnAction = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

export default SmallBtnAction;
