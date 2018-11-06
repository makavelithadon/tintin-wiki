import React, { memo } from "react";
import styled from "styled-components";
import { StyledCommon } from "./../styles";

const StyledDetails = styled(StyledCommon)`
  height: 100%;
  padding: 16px 24px;
  overflow: auto;
`;

function Details({ opacity, show, children }) {
  return (
    <StyledDetails opacity={opacity} show={show}>
      {children}
    </StyledDetails>
  );
}

export default memo(Details);
