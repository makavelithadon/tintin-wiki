import React, { PureComponent, createRef } from "react";
import { Spring, Transition, animated } from "react-spring";
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
        top: -99999,
        left: -99999
      };
    } else {
      let { left, top, right, height } = this.props.selectedRef.getBoundingClientRect();
      const offsetTop = 16;
      const menuWidth = 190;
      const menuHeight = 131;
      const requiredHeight = menuHeight + offsetTop + 10;
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

  next = index => {
    console.log("index", index, "this.props.characters[index]", this.props.characters[index]);
    if (!this.props.characters[index]) index = 0;
    this.props.goTo(index);
  };

  previous = index => {
    if (!this.props.characters[index]) {
      index = this.props.characters.length - 1;
    }
    this.props.goTo(index);
  };

  render() {
    const {
      characters,
      show,
      blocks,
      previousShowOverlay,
      selectedCharacter: selected,
      handleClickMenuItem,
      getDetailsBlockSizes,
      defaultSpringConfig,
      goTo
    } = this.props;
    const isFirstAppearance = !previousShowOverlay;
    const coords = this.setCoords();
    let selectedCharacterIndex = 0;
    if (selected) {
      selectedCharacterIndex = characters.findIndex(character => character.id === selected.id);
    }
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
          const customConfig = { ...defaultSpringConfig };
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
                  return {
                    duration: type === "leave" || !show ? 0.00001 : 225
                  };
                }}
                items={[blocks.items.find(item => item === blocks.current)]}
                keys={item => item}
                from={{ opacity: 0 }}
                enter={[{ opacity: Number(isFirstAppearance) }, { opacity: 1 }]}
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
                              <>
                                <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400, textAlign: "center" }}>
                                  {selected.displayName}
                                </h2>
                                <button onClick={() => this.previous(selectedCharacterIndex - 1)}>Previous</button>
                                <button onClick={() => this.next(selectedCharacterIndex + 1)}>Next</button>
                              </>
                            )}
                          </div>
                        </Details>
                      );
                    case "illustrations":
                      return props => (
                        <Details {...props} show={blocks.current === "illusrations"}>
                          <h2 style={{ marginTop: 0, fontSize: "1rem", fontWeight: 400, textAlign: "center" }}>
                            Illustrations
                          </h2>
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
