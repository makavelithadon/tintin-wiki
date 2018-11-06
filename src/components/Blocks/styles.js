import styled from "styled-components";

export const StyledCommon = styled.div.attrs({
  style: ({ opacity }) => ({
    opacity,
    visibility: opacity > 0 ? "visible" : "hidden",
    zIndex: opacity > 0 ? 100 : 0
  })
})`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`;
