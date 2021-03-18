import { SelectedNodeModal } from "../components/tree/SelectedNodeModal";
import {
  DoneIcon,
  EditIcon,
  TrashIcon,
  DefaultButton,
  EditButton,
} from "../components/Buttons";
import { LargeText } from "../components/Texts";
import { LargeTextInput } from "../components/Inputs";
import xCircle from "../assets/xCircle.svg";

import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import styled from "styled-components";
import {
  returnNodeList,
  returnLinkList,
  returnSelectedList,
} from "../lib/testCode";
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
} from "../redux/tree";
import Swal from "sweetalert2";
import { uid } from "uid";
import { authService } from "../lib/firebase";
import { useHistory } from "react-router-dom";

export const TreePage = React.memo(({ match }) => {
  const containerRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { treeID } = match.params;
  const { myID } = useSelector((state) => {
    return { myID: state.user.myID };
  });
  const { nodeList, linkList } = useSelector((state) => {
    return { nodeList: state.tree.nodeList, linkList: state.tree.linkList };
  });
  const { treeTitle } = useSelector((state) => {
    return { treeTitle: state.tree.treeTitle };
  });
  const { isEditingTree } = useSelector((state) => {
    return { isEditingTree: state.tree.isEditingTree };
  });

  React.useEffect(() => {
    if (headerRef.current && containerRef.current) {
      initMap(headerRef.current, containerRef.current);
    }
  }, []);
  React.useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        dispatch(readTree(myID, treeID));
      } else {
        Swal.fire("Login Required!");
        history.push("/login");
      }
    });
  }, [dispatch, myID, treeID]);
  React.useEffect(() => {
    if (headerRef && containerRef.current) {
      initGraph(headerRef.current, containerRef.current, nodeList, linkList);
    }
  }, [headerRef, containerRef, nodeList, linkList, isEditingTree]);

  const [localTreeTitle, setLocalTreeTitle] = React.useState(treeTitle);

  return (
    <>
      <TreeHeader ref={headerRef}>
        {isEditingTree ? (
          <LargeTextInput
            value={treeTitle}
            onChange={(e) => {
              dispatch(changeTreeTitle(e.target.value));
            }}
          />
        ) : (
          <LargeText>{treeTitle}</LargeText>
        )}

        <div>
          <EditButton id="treeEditButton">
            {isEditingTree ? <DoneIcon /> : <EditIcon />}
          </EditButton>

          <EditButton id="treeDelete">
            <TrashIcon />
          </EditButton>
        </div>
      </TreeHeader>
      <TreeMap ref={containerRef} />
    </>
  );
});

const TreeHeader = styled.div`
  border-radius: 3px;
  //border: 1px solid ${colorPalette.gray3};
  background-color: ${colorPalette.gray0};
  display: flex;
  //flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-left: 10vw;
  padding-right: 10vw;
  padding-bottom: 10px;
  padding-top: 10px;
  @media (max-width: 768px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }
`;

const TreeMap = styled.div`
  border-radius: 3px;
  border: 1px solid ${colorPalette.gray3};
  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
  z-index: 0;
  position: absolute;
  height: auto;
  width: 100%;
`;

const mapWidth = 1200;
const mapHeight = 700;
const linkWidth = "2.5px";
const linkColor = "#999999"; //colorPalette.gray3;
const nodeRadius = 20;

function initMap(headerRef, container) {
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

function initGraph(headerRef, container, originalNodeList, originalLinkList) {
  const width = mapWidth;
  const height = mapHeight;
  let nodeList = originalNodeList;
  let linkList = originalLinkList;

  const selectedColor = "#00bebe"; //colorPalette.green2;
  const selectedNodeStrokeWidth = "8px";

  const selectedNodeList = reduxStore.getState().tree.selectedNodeList;

  const labelSize = "16px"; //fontSize.medium
  const deleteButtonLength = 15;

  //let nodeList = reduxStore.getState().tree.nodeList; //returnNodeList();
  //let linkList = reduxStore.getState().tree.linkList; //reduxStore.getState().techtree.linkList;
  //let originalThumbnailURL = reduxStore.getState().techtree.techtreeData
  //  .thumbnail;
  //let tempThumbnailURL = reduxStore.getState().techtree.techtreeData.thumbnail;
  let tempPairingNodes = {
    startNodeID: null,
    startX: null,
    startY: null,
    endNodeID: null,
    id: null,
    endX: null,
    endY: null,
  };

  // tree edit 상태도 d3 로 처리하자.
  // docu edit 은 modal 의 로컬 스테이트로 처리하고.
  // node 를 클릭하면 실제 DOM을 생성하고 삭제하고 하는 식으로 하자.

  //const header = d3.select(headerRef);
  //header.append("text").text("hello");

  const svg = d3.select(container).select("svg");
  const linkGroup = svg.select(".links");
  const nodeGroup = svg.select(".nodes");
  const labelGroup = svg.select(".labels");

  const treeEditButton = d3.select("#treeEditButton").on("click", () => {
    if (reduxStore.getState().tree.isEditingTree) {
      // 썸네일도 첨부해야함.
      changeTreeInfo();
      reduxStore.dispatch(finishEditTree());
    } else {
      reduxStore.dispatch(editTree());
    }
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
          reduxStore.getState().tree.treeID,
          reduxStore.getState().tree.treeTitle,
          thumbnailURL
        )
      );
    }
  }

  const treeDeleteButton = d3.select("#treeDelete").on("click", () => {
    Swal.fire("삭제합니까?");
  });

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
          await reduxStore.dispatch(
            deleteLink(reduxStore.getState().tree.treeID, linkList, link)
          );
          initLink();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .on("touch", async (link) => {
        const deleteOK = window.confirm(`Delete Connection?`);
        if (deleteOK) {
          await reduxStore.dispatch(
            deleteLink(reduxStore.getState().tree.treeID, linkList, link)
          );
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
        return node.radius * (1 + relatedNumber / 10);
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
          document.getElementById("root").appendChild(d);

          const modalList = document.getElementsByClassName("nodeModal");
          const zIndexList = Array.from(modalList).map((ele) => {
            return ele.style.zIndex;
          });
          const max = Math.max(...zIndexList);

          ReactDOM.render(
            <SelectedNodeModal defaultZ={max + 1} node={node} />,
            document.getElementById(d.id)
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

              await reduxStore.dispatch(
                createLink(reduxStore.getState().tree.treeID, linkList)
              );
              await reduxStore.dispatch(
                createNode(reduxStore.getState().tree.treeID, nodeList)
              );
              changeTreeInfo();
            })
        )
        .attr("cx", (d) => {
          return d.x;
        })
        .transition()
        .duration(130)
        .ease(d3.easeLinear)
        .on("start", function repeat() {
          d3.active(this)
            .attr("cx", (d) => {
              return d.x - 1;
            })
            .transition()
            .duration(130)
            .ease(d3.easeLinear)
            .attr("cx", (d) => {
              return d.x + 1;
            })
            .transition()
            .duration(130)
            .ease(d3.easeLinear)
            .on("start", repeat);
        });
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

                    await reduxStore.dispatch(
                      createLink(reduxStore.getState().tree.treeID, linkList)
                    );
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
          reduxStore.dispatch(
            deleteNode(reduxStore.getState().tree.treeID, nodeList, linkList, d)
          );
          initNode();
          changeTreeInfo();
        } else {
          return;
        }
      })
      .on("touch", async (d) => {
        const deleteOK = window.confirm(`Delete ${d.name} Node?`);
        if (deleteOK) {
          reduxStore.dispatch(
            deleteNode(reduxStore.getState().tree.treeID, nodeList, d)
          );
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
      .text((d) => {
        return d.name;
      })
      .style("font-size", labelSize)
      .style("user-select", "none")
      .style("text-shadow", "1px 1px 1px #ffffff");
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
      await reduxStore.dispatch(
        createNode(reduxStore.getState().tree.treeID, nodeList)
      );
      changeTreeInfo();
      initNode();
    }
  });

  reduxStore.subscribe(initNode);
  initLink();
  initNode();
  initLabel();
}
