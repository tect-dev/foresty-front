import { DefaultButton } from "../components/Buttons";
import {
  XXXLargeText,
  XXLargeText,
  XLargeText,
  LargeText,
} from "../components/Texts";
import { StyledTagBlock } from "../components/TagBlock";

import { TreeHeader, TreeMap, TreeTitle } from "./Tree";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SelectedNodeModal } from "../components/tree/SelectedNodeModal";
import {
  DoneIcon,
  EditIcon,
  TrashIcon,
  EditButton,
} from "../components/Buttons";
import { LargeTextInput } from "../components/Inputs";
import xCircle from "../assets/xCircle.svg";
import ReactTooltip from "react-tooltip";

import ReactDOM from "react-dom";
import * as d3 from "d3";

import { colorPalette, boxShadow } from "../lib/style";
import { reduxStore } from "../index";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNode,
  closeNode,
  readTree,
  editTree,
  finishEditTree,
  updateTree,
  changeTreeTitle,
  createNode,
  deleteNode,
  createLink,
  deleteLink,
  cleanUp,
} from "../redux/tree";
import Swal from "sweetalert2";
import { uid } from "uid";
import { authService } from "../lib/firebase";
import { useHistory } from "react-router-dom";
import { demoTreeID } from "../lib/constants";

export const HomePage = () => {
  const loginCheck = localStorage.getItem("user");
  const { loginState, myID } = useSelector((state) => {
    return { loginState: state.user.loginState, myID: state.user.myID };
  });
  return (
    <MainWrapper className="Home" style={{}}>
      <BlockWrapper>
        <TwoComponentsWrapper>
          <div style={{ paddingBottom: "2rem" }}>
            <XXXLargeText>Cultivate Your Knowledge</XXXLargeText>
            <br />
            <br />

            <XLargeText>Click and Drag. Intuitive Note Taking</XLargeText>
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StyledTagBlock style={{ background: colorPalette.blue5 }}>
                Graph Based
              </StyledTagBlock>
              <StyledTagBlock style={{ background: colorPalette.yellow5 }}>
                Click and Drag
              </StyledTagBlock>
              <StyledTagBlock style={{ background: colorPalette.red7 }}>
                Multi Window
              </StyledTagBlock>
            </div>
            <br />
            <div>
              <DefaultButton>
                {!loginCheck ? (
                  <Link to="/login">Get Started</Link>
                ) : (
                  <Link to={`/forest/${myID}`}>Get Started</Link>
                )}
              </DefaultButton>
            </div>
          </div>
          <div style={{ width: "90%" }}>
            <VideoWrapper
              src="https://foresty-tutorial.s3.ap-northeast-2.amazonaws.com/home-vidoe.mp4"
              autoPlay={true}
              playsInline={true}
              muted={true}
              loop={true}
            ></VideoWrapper>
          </div>
        </TwoComponentsWrapper>
      </BlockWrapper>

      <BlockWrapper>
        <DemoTree />
      </BlockWrapper>
      <BlockWrapper>
        <XXLargeText>Today, we're moving to Beta.</XXLargeText>
        <br />
        <br />
        <XLargeText>
          Join the beta and get a forever access
          <br />
          (all of Foresty's services are available for a life)
        </XLargeText>
        <br />
        <br />
        {/*<LargeText> No credit card required</LargeText>*/}
        <div>
          <DefaultButton>
            {!loginCheck ? (
              <Link to="/login">Get Started</Link>
            ) : (
              <Link to={`/forest/${myID}`}>Get Started</Link>
            )}
          </DefaultButton>
        </div>
      </BlockWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TwoComponentsWrapper = styled.div`
  display: grid;
  justify-content: space-evenly;
  justify-items: center;
  grid-template-columns: 1fr 2fr;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BlockWrapper = styled.div`
  padding: 3rem;
  text-align: center;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const VideoWrapper = styled.video`
  width: 100%;
  border: 1px solid ${colorPalette.gray2};
  border-radius: 5px;
`;

const DemoTree = () => {
  const containerRef = React.useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const treeID = demoTreeID; //"918a8f01c7b603db2de0a051";
  const myID = "So1kSKj6UlUE3QBAXCvstos7Bu22";
  const { nodeList, linkList } = useSelector((state) => {
    return { nodeList: state.tree.nodeList, linkList: state.tree.linkList };
  });
  const { treeTitle } = useSelector((state) => {
    return { treeTitle: state.tree.treeTitle };
  });
  const { isEditingTree, loading } = useSelector((state) => {
    return {
      isEditingTree: state.tree.isEditingTree,
      loading: state.tree.loading,
    };
  });
  React.useEffect(() => {
    dispatch(readTree(myID, treeID));
  }, [dispatch, myID, treeID]);
  React.useEffect(() => {
    if (containerRef.current) {
      initMap(containerRef.current);
    }
    return () => {
      dispatch(cleanUp());
    };
  }, []);

  React.useEffect(() => {
    if (containerRef.current) {
      initGraph(containerRef.current, nodeList, linkList);
    }
  }, [containerRef, nodeList, linkList, isEditingTree]);

  return (
    <>
      <TreeHeader>
        {isEditingTree ? (
          <LargeTextInput
            value={treeTitle}
            onChange={(e) => {
              dispatch(changeTreeTitle(e.target.value));
            }}
            maxLength="100"
          />
        ) : (
          <TreeTitle>{treeTitle}</TreeTitle>
        )}

        <div style={{ display: "flex" }}>
          {!isEditingTree ? (
            <EditButton id="treeEditButton" data-tip="Edit Graph Status">
              <EditIcon />
              <ReactTooltip effect="solid" />
            </EditButton>
          ) : null}
          <EditButton id="treeSaveButton" data-tip="Save Changes">
            <DoneIcon />
            <ReactTooltip effect="solid" />
          </EditButton>
          <EditButton
            data-tip="Double click on canvas = Create a document <br><br/>Click on circle = Open the document<br><br/>Drag circle to circle = Create a connection<br><br/>In edit mode, drag a node = Change position of the node"
            data-multiline={true}
            data-event="click"
          >
            How To Use It?
          </EditButton>
          <ReactTooltip effect="solid" globalEventOff="click" />
        </div>
      </TreeHeader>

      <TreeMap id="treeMap" ref={containerRef} />
    </>
  );
};

const mapWidth = 1200;
const mapHeight = 700;
const linkWidth = "2.5px";
const linkColor = "#999999"; //colorPalette.gray3;
const nodeRadius = 20;

export function initMap(container) {
  const svg = d3
    .select(container)
    .append("svg")
    .attr("id", "treeContainer")
    .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`);

  // 마우스 드래그할때 나타나는 임시 라인 만들어두기.
  svg
    .append("g")
    .append("line")
    .attr("class", "tempLine")
    .style("stroke", linkColor)
    .style("stroke-width", linkWidth)
    .attr("marker-end", "url(#temp-end-arrow)")
    .style("opacity", "0")
    .attr("display", "none");

  // 화살표 마커
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", nodeRadius * 1.1)
    .attr("markerWidth", 6)
    .attr("markerHeight", nodeRadius * 1.5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", linkColor);

  // tempLine만을 위한 화살표 마커
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "temp-end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 9)
    .attr("markerWidth", 6)
    .attr("markerHeight", nodeRadius * 1.5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", linkColor);

  svg.append("g").attr("class", "links");
  svg.append("g").attr("class", "nodes");
  svg.append("g").attr("class", "labels");
}

export function initGraph(container, originalNodeList, originalLinkList) {
  const width = mapWidth || 1200;
  const height = mapHeight || 700;
  let nodeList = originalNodeList;
  let linkList = originalLinkList;

  const selectedColor = colorPalette.green2; //"#00bebe"; //colorPalette.green2;
  const selectedNodeStrokeWidth = "8px";

  const selectedNodeList = reduxStore.getState().tree.selectedNodeList;

  const labelSize = "16px"; //fontSize.medium
  const deleteButtonLength = 15;

  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    id: null,
    endX: null,
    endY: null,
  };

  const svg = d3.select(container).select("svg");
  const linkGroup = svg.select(".links");
  const nodeGroup = svg.select(".nodes");
  const labelGroup = svg.select(".labels");

  const treeEditButton = d3.select("#treeEditButton").on("click", () => {
    reduxStore.dispatch(editTree());
  });
  const treeSaveButton = d3.select("#treeSaveButton").on("click", () => {
    // 썸네일도 첨부해야함.
    changeTreeInfo();
    reduxStore.dispatch(finishEditTree());
  });

  function changeTreeInfo() {
    const svgDOM = document.getElementById("treeContainer"); //svg.node();
    if (svgDOM) {
      const source = new XMLSerializer().serializeToString(svgDOM);
      var decoded = unescape(encodeURIComponent(source));
      // Now we can use btoa to convert the svg to base64
      const base64 = btoa(decoded);
      const thumbnailURL = `data:image/svg+xml;base64,${base64}`;
      reduxStore.dispatch(
        updateTree(
          "homeDemo",
          reduxStore.getState().tree.treeTitle,
          thumbnailURL
        )
      );
    }
  }

  // tree 수정, 삭제, fork, save 버튼 전부 여기서 만들자
  function initLink() {
    const createdLinkGroup = linkGroup
      .selectAll("line")
      .data(linkList)
      .join("line")
      .attr("x1", (d) => d.startX)
      .attr("y1", (d) => d.startY)
      .attr("x2", (d) => d.endX)
      .attr("y2", (d) => d.endY)
      .attr("class", (d) => d.id)
      .style("stroke", linkColor)
      .style("stroke-width", linkWidth)
      .attr("marker-end", "url(#end-arrow)");

    linkGroup
      .selectAll("image")
      .data(linkList)
      .join("image")
      .attr("href", xCircle)
      .attr("width", deleteButtonLength)
      .attr("height", deleteButtonLength)
      .style("fill", "black")
      .attr("x", (link) => {
        return (link.startX + link.endX) / 2;
      })
      .attr("y", (link) => {
        return (link.startY + link.endY) / 2;
      })
      .attr("class", (d) => {
        return `delete${d.id}`;
      })
      .on("click", async (link) => {
        const deleteOK = window.confirm("Delete Connection?");
        if (deleteOK) {
          await reduxStore.dispatch(deleteLink("homeDemo", linkList, link));
          initLink();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .on("touch", async (link) => {
        const deleteOK = window.confirm(`Delete Connection?`);
        if (deleteOK) {
          await reduxStore.dispatch(deleteLink("homeDemo", linkList, link));
          initLink();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .attr("display", () => {
        if (reduxStore.getState().tree.isEditingTree) {
          return "inline";
        } else {
          return "none";
        }
      })
      .style("cursor", "pointer");
  }

  function initNode() {
    const createdNodeGroup = nodeGroup
      .selectAll("circle")
      .data(nodeList)
      .join("circle")
      .attr("r", (node) => {
        const relatedNumber = linkList.filter((ele) => {
          if (ele.startNodeID === node.id || ele.endNodeID === node.id) {
            return true;
          } else {
            return false;
          }
        }).length;
        return node.radius * (1 + relatedNumber / 20);
      })
      .style("fill", (d) => d.fillColor)
      .attr("cx", (d) => {
        return d.x;
      })
      .attr("cy", (d) => {
        return d.y;
      })
      .attr("class", (d) => {
        return d.id;
      })
      .style("stroke", (node) => {
        if (
          reduxStore.getState().tree.selectedNodeList.find((ele) => {
            return node.id === ele.id;
          })
        ) {
          return selectedColor;
        } else {
          return;
        }
      })
      .style("stroke-width", selectedNodeStrokeWidth)
      .on("click", (node) => {
        if (
          reduxStore.getState().tree.selectedNodeList.find((ele) => {
            return ele.id === node.id;
          })
        ) {
          reduxStore.dispatch(closeNode(node));
        } else {
          reduxStore.dispatch(selectNode(node));
          const d = document.createElement("div");
          d.id = `${node.id}`;
          d.className = "nodeModalDOM";
          document.getElementById("root").appendChild(d);

          const modalList = document.getElementsByClassName("nodeModal");
          const zIndexList = Array.from(modalList).map((ele) => {
            return ele.style.zIndex;
          });
          const max = Math.max(...zIndexList);

          ReactDOM.render(
            <SelectedNodeModal defaultZ={max + 1} node={node} />,
            document.getElementById(d.id) //document.getElementById("treeMap")
          );
        }
      })
      .style("cursor", "pointer");

    if (reduxStore.getState().tree.isEditingTree) {
      // drag node
      createdNodeGroup
        .call(
          d3
            .drag()
            .on("start", (d) => {
              d3.select(this).raise().classed("active", true);
            })
            .on("drag", (node) => {
              const newLinkList = linkList.map((link) => {
                if (link.startNodeID === node.id) {
                  return { ...link, startX: d3.event.x, startY: d3.event.y };
                } else if (link.endNodeID === node.id) {
                  return { ...link, endX: d3.event.x, endY: d3.event.y };
                } else {
                  return link;
                }
              });
              linkList = newLinkList;
              initLink();
              d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y);
              node.x = d3.event.x;
              node.y = d3.event.y;
              initNode();
              initLabel();
            })
            .on("end", async (node) => {
              d3.select(this).classed("active", false);
              node.x = d3.event.x;
              node.y = d3.event.y;

              await reduxStore.dispatch(createLink("homeDemo", linkList));
              await reduxStore.dispatch(createNode("homeDemo", nodeList));
              changeTreeInfo();
            })
        )
        .attr("cx", (d) => {
          return d.x;
        });
      //.transition()
      //.duration(130)
      //.ease(d3.easeLinear)
      //.on("start", function repeat() {
      //d3.active(this)
      //  .attr("cx", (d) => {
      //    return d.x - 1;
      //  })
      //  .transition()
      //  .duration(130)
      //  .ease(d3.easeLinear)
      //  .attr("cx", (d) => {
      //    return d.x + 1;
      //  })
      //  .transition()
      //  .duration(130)
      //  .ease(d3.easeLinear)
      //  .on("start", repeat);
      //});
    } else {
      // connect nodes by link
      createdNodeGroup
        .call(
          d3
            .drag()
            .on("start", (d) => {
              if (
                true // treeAuthor?.firebaseUid === reduxStore.getState().auth.userID
              ) {
                svg
                  .select("g")
                  .select(".tempLine")
                  .attr("x1", d.x)
                  .attr("y1", d.y);
                svg
                  .select("g")
                  .select(".tempLine")
                  .attr("x2", d3.event.x)
                  .attr("y2", d3.event.y);
                svg
                  .select("g")
                  .select(".tempLine")
                  .style("opacity", "1")
                  .attr("display", "inline");
                tempPairingNodes.startNodeID = d.id;
                tempPairingNodes.startX = d.x;
                tempPairingNodes.startY = d.y;
              }
            })
            .on("drag", (node) => {
              if (
                d3.select(".tempLine").attr("x1") > 1 &&
                d3.select(".tempLine").attr("y1") > 1 &&
                d3.select(".tempLine").style("opacity") != 0
              ) {
                svg
                  .select("g")
                  .select(".tempLine")
                  .attr("x2", d3.event.x)
                  .attr("y2", d3.event.y);
                initLink();
                initNode();
                initLabel();
              }
            })
            .on("end", async (startNode) => {
              const pointerX = d3.event.x;
              const pointerY = d3.event.y;
              nodeList.map(async (node) => {
                if (
                  (node.x - pointerX) * (node.x - pointerX) +
                    (node.y - pointerY) * (node.y - pointerY) <
                  nodeRadius * nodeRadius
                ) {
                  tempPairingNodes.endNodeID = node.id;
                  tempPairingNodes.endX = node.x;
                  tempPairingNodes.endY = node.y;

                  // 연결된 노드를 데이터에 반영
                  if (
                    tempPairingNodes.startNodeID !==
                      tempPairingNodes.endNodeID &&
                    tempPairingNodes.startX !== tempPairingNodes.endX &&
                    tempPairingNodes.startY !== tempPairingNodes.endY &&
                    !linkList.find(
                      (element) =>
                        element.startNodeID === tempPairingNodes.startNodeID &&
                        element.endNodeID === tempPairingNodes.endNodeID
                    ) &&
                    d3.select(".tempLine").attr("x1") > 1 &&
                    d3.select(".tempLine").attr("y1") > 1 &&
                    d3.select(".tempLine").style("opacity") != 0
                  ) {
                    tempPairingNodes.id = `link${uid(20)}`;
                    linkList.push({ ...tempPairingNodes });

                    await reduxStore.dispatch(createLink("homeDemo", linkList));
                    await initLink();
                    changeTreeInfo();
                    svg.select(".tempLine").style("opacity", "0");
                  }
                  svg
                    .select("g")
                    .select(".tempLine")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 0);
                  tempPairingNodes = {};
                }
              });
              svg.select("g").select(".tempLine").attr("x1", 0).attr("y1", 0);
              svg.select(".tempLine").style("opacity", "0");
            })
        )
        .style("stroke-width", 0)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .style("stroke-width", selectedNodeStrokeWidth);
    }

    // 노드 삭제용 버튼 만들기
    nodeGroup
      .selectAll("image")
      .data(nodeList)
      .join("image")
      .attr("href", xCircle)
      .attr("width", deleteButtonLength)
      .attr("height", deleteButtonLength)
      .style("fill", (d) => d.fillColor)
      .attr("x", (d) => {
        return d.x - nodeRadius * 1.7;
      })
      .attr("y", (d) => {
        return d.y - nodeRadius * 1.7;
      })
      .attr("class", (d) => {
        return d.id;
      })
      .attr("display", () => {
        if (reduxStore.getState().tree.isEditingTree) {
          return "inline";
        } else {
          return "none";
        }
      })
      .on("click", async (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`);
        if (deleteOK) {
          reduxStore.dispatch(deleteNode("homeDemo", nodeList, linkList, d));
          initNode();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .on("touch", async (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`);
        if (deleteOK) {
          reduxStore.dispatch(deleteNode("homeDemo", nodeList, d));
          initNode();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .style("cursor", "pointer");
  }
  function initLabel() {
    labelGroup.selectAll("*").remove();

    labelGroup
      .selectAll("text")
      .data(nodeList)
      .join("text")
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y + nodeRadius * 2;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("class", (d) => d.id)
      .style("font-size", labelSize)
      .style("user-select", "none")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none")
      .text((d) => {
        return d.name;
      });

    labelGroup.selectAll("text").each(function (d) {
      d.bbox = this.getBBox();
    });

    labelGroup
      .append("g")
      .selectAll("rect")
      .data(nodeList)
      .join("rect")
      .attr("x", (d) => d.x - d.bbox.width / 2)
      .attr("y", (d) => {
        return d.y + nodeRadius * 2 - d.bbox.height / 2;
      })
      .attr("width", (d) => d.bbox.width)
      .attr("height", (d) => d.bbox.height)
      .style("fill", "white")
      .style("opacity", "1");
    labelGroup.selectAll("text").remove();

    labelGroup
      .selectAll("text")
      .data(nodeList)
      .join("text")
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y + nodeRadius * 2;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("class", (d) => d.id)
      .style("font-size", labelSize)
      .style("user-select", "none")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none")
      .text((d) => {
        return d.name;
      });
  }

  svg.on("dblclick", async () => {
    if (true) {
      //treeAuthor?.firebaseUid === reduxStore.getState().auth.userID) {
      const offsetElement = document.getElementById("treeContainer");
      const clientRect = offsetElement.getBoundingClientRect();
      const ratioFactor = width / clientRect.width;
      const createdNode = {
        id: `node${uid(20)}`,
        name: "New Node",
        x: d3.event.offsetX * ratioFactor,
        y: d3.event.offsetY * ratioFactor,
        radius: nodeRadius,
        body: "New Document",
        hashtags: [],
        fillColor: "#69bc69",
        parentNodeID: [],
        childNodeID: [],
      };
      nodeList = [...nodeList, createdNode];
      await reduxStore.dispatch(createNode("homeDemo", nodeList));
      changeTreeInfo();
      initNode();
    }
  });

  reduxStore.subscribe(initNode);
  initLink();
  initNode();
  initLabel();
}
