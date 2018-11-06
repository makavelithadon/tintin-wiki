import React, { PureComponent, createRef } from "react";
import { Spring, Transition, animated, config } from "react-spring";
import styled from "styled-components";
import Menu from "./Menu";
import Details from "./Details";

const StyledBlock = styled(animated.div).attrs({
  style: ({ opacity, width, height, top, pointerEvents, left }) => {
    return {
      opacity: opacity.interpolate(o => o),
      visibility: opacity.interpolate(o => (o > 0 ? "visible" : "hidden")),
      top,
      left,
      pointerEvents,
      width,
      height
    };
  }
})`
  position: fixed;
  z-index: 10;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 48px rgba(0, 0, 0, 0.125);
  overflow: hidden;
`;

export default class Blocks extends PureComponent {
  node = createRef();

  setCoords = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let coords;
    if (!this.props.selectedRef) {
      coords = {
        top: viewportWidth / 2,
        left: viewportHeight / 2
      };
    } else {
      let { left, top, right, height } = this.props.selectedRef.getBoundingClientRect();
      const offsetTop = 16;
      const menuWidth = 190;
      const menuHeight = 131;
      const requiredHeight = menuHeight + offsetTop;
      const hasAvailableWidth = viewportWidth - (left + menuWidth) >= 0;
      const hasAvailableHeight = viewportHeight - (top + height + requiredHeight) >= 0;
      const overflowedWidth = !hasAvailableWidth ? left + menuWidth - viewportWidth : 0;
      const decalageTop = height + offsetTop;
      coords = {
        left: hasAvailableWidth ? left : left - overflowedWidth - (viewportWidth - right),
        top: top + (hasAvailableHeight ? decalageTop : -requiredHeight)
      };
    }
    return coords;
  };

  render() {
    const {
      show,
      blocks,
      previousShowOverlay,
      selectedCharacter: selected,
      handleClickMenuItem,
      getDetailsBlockSizes
    } = this.props;
    const isFirstAppearance = !previousShowOverlay;
    const coords = this.setCoords();
    return (
      <Spring
        from={{
          opacity: 0,
          width: 0,
          height: 0,
          top: 50
        }}
        to={{
          opacity: Number(show),
          width: blocks.current === "menu" ? 190 : getDetailsBlockSizes().width,
          height: blocks.current === "menu" ? (show ? 131 : 0) : show ? getDetailsBlockSizes().height : 0,
          left: blocks.current === "menu" ? coords.left : getDetailsBlockSizes().left,
          top: blocks.current === "menu" ? coords.top : getDetailsBlockSizes().top
        }}
        config={key => {
          const customConfig = { ...config.default };
          if ((/width|top|left/.test(key) && isFirstAppearance) || !show) {
            customConfig.duration = 0.00001;
          }
          return customConfig;
        }}
        native
      >
        {({ opacity, top, left, width, height }) => {
          return (
            <StyledBlock
              pointerEvents={show ? "auto" : "none"}
              opacity={opacity}
              left={left}
              top={top}
              width={width}
              height={height}
              ref={this.node}
              state={blocks.current}
            >
              <Transition
                config={(_, type) => {
                  const duration = type === "leave" || !show ? 0.00001 : 225;
                  return {
                    duration
                  };
                }}
                items={[blocks.items.find(item => item === blocks.current)]}
                keys={item => item}
                from={{ opacity: 0 }}
                enter={[{ opacity: isFirstAppearance ? 1 : 0 }, { opacity: 1 }]}
                leave={{ opacity: 0 }}
              >
                {() => {
                  switch (blocks.current) {
                    case "menu":
                      return props => (
                        <Menu {...props} show={blocks.current === "menu"} onClickItem={handleClickMenuItem} />
                      );
                    case "profile":
                      return props => (
                        <Details {...props} show={blocks.current === "profile"}>
                          <div style={{ overflow: "auto" }}>
                            {selected && (
                              <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>
                                {selected.displayName}
                              </h2>
                            )}
                          </div>
                        </Details>
                      );
                    case "illustrations":
                      return props => (
                        <Details {...props} show={blocks.current === "illusrations"}>
                          <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400 }}>Illustrations</h2>
                          <div style={{ overflow: "auto" }}>42 images :</div>
                        </Details>
                      );
                    default:
                      return null;
                  }
                }}
              </Transition>
            </StyledBlock>
          );
        }}
      </Spring>
    );
  }
}
