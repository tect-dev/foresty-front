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
import { colorPalette, boxShadow, hoverAction } from "../lib/style";
import { reduxStore } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { returnPreviousNodeList, returnNextNodeList } from "../lib/functions";
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
  updateTreePrivacy,
} from "../redux/tree";
import Swal from "sweetalert2";
import { uid } from "uid";
import { authService } from "../lib/firebase";
import { useHistory } from "react-router-dom";
import { togglePowerMode } from "../redux/user";

export const TreePage = React.memo(({ match }) => {
  const containerRef = React.useRef(null);

  const history = useHistory();
  const dispatch = useDispatch();
  const { treeID } = match.params;
  const { myID } = useSelector((state) => {
    return { myID: state.user.myID };
  });
  const { nodeList, linkList } = useSelector((state) => {
    return { nodeList: state.tree.nodeList, linkList: state.tree.linkList };
  });
  const { treeAuthorID } = useSelector((state) => {
    return { treeAuthorID: state.tree.treeAuthorID };
  });
  const { treeTitle } = useSelector((state) => {
    return { treeTitle: state.tree.treeTitle };
  });
  const { treePublic } = useSelector((state) => {
    return { treePublic: state.tree.treePublic };
  });
  const { isEditingTree, loading } = useSelector((state) => {
    return {
      isEditingTree: state.tree.isEditingTree,
      loading: state.tree.loading,
    };
  });
  const { powerMode } = useSelector((state) => {
    return {
      powerMode: state.user.powerMode,
    };
  });

  React.useEffect(() => {
    if (containerRef.current) {
      initMap(containerRef.current);
    }
    return () => {
      dispatch(cleanUp());
    };
  }, []);
  React.useEffect(() => {
    dispatch(readTree(myID, treeID, treeAuthorID));
    //  if (treeID) {
    //    authService.onAuthStateChanged((user) => {
    //      if (user) {
    //        dispatch(readTree(myID, treeID));
    //      } else {
    //        Swal.fire("Login Required!");
    //        history.push("/login");
    //      }
    //    });
    //  }
  }, [dispatch, myID, treeID]);
  React.useEffect(() => {
    if (containerRef.current) {
      initGraph(containerRef.current, nodeList, linkList);
    }
  }, [containerRef, nodeList, linkList, isEditingTree]);

  // FEATURE: Tree Data Download as a Markdown.md
  const [dataStr, setDataStr] = React.useState({});
  React.useEffect(() => {
    // ?????????????????? ??????????????? ????????? title,body ??? ???????????? ?????? ?????? ????????????.
    let fullText = "---\ntopic\n" + treeTitle + "\n---";
    nodeList.map((node) => {
      fullText = fullText + `\n\n---\ntitle\n${node.name}\n\n${node.body}\n---`;
    });
    setDataStr("data:text/json;charset=utf-8," + encodeURIComponent(fullText));
  }, [nodeList, linkList, treeTitle]);

  // FEATURE : search text in tree data
  const [searchValue, setSearchValue] = React.useState("");
  const [searchResultList, setSearchResultList] = React.useState([]);
  const searchInTree = React.useCallback(
    (e) => {
      setSearchResultList();
      if (e.code === "Enter" && searchValue !== "") {
        const searchedTextRegex = new RegExp(searchValue.toLowerCase());
        const tempResult1 = nodeList.map((ele) => {
          if (searchedTextRegex.test(ele.name.toLowerCase())) {
            const trimmed = { ...ele, body: `${ele.body.substr(0, 50)}...` };
            return trimmed;
          } else if (searchedTextRegex.test(ele.body.toLowerCase())) {
            const cutNumber = ele.body
              .toLowerCase()
              .search(searchValue.toLowerCase());

            const trimmed = {
              ...ele,
              body:
                "..." +
                ele.body.substring(cutNumber - 30, cutNumber) +
                ele.body.substring(cutNumber, cutNumber + 30) +
                "...",
            };
            return trimmed;
          } else {
            return null;
          }
        });

        const tempResult = tempResult1.filter((ele) => {
          return ele !== null;
        });

        setSearchResultList(tempResult);
      }
    },
    [searchValue, searchResultList]
  );

  return (
    <div style={{ padding: "2rem" }}>
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
            <EditButton id="treeEditButton">
              <EditIcon />
            </EditButton>
          ) : null}
          <EditButton id="treeSaveButton">
            <DoneIcon />
          </EditButton>
        </div>
      </TreeHeader>

      <TreeMap id="treeMap" ref={containerRef} />

      <TreeFooter>
        <SearchArea>
          <div style={{ display: "inline-flex" }}>
            <StyledSearchInput
              placeholder="Search In Tree..."
              value={searchValue}
              type="search"
              onKeyPress={(e) => {
                searchInTree(e);
              }}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>

          {searchValue === "" ? (
            ""
          ) : (
            <div>
              {searchResultList?.map((ele, idx) => {
                return (
                  <SearchNodeCard
                    key={idx}
                    onClick={() => {
                      const originalNode = nodeList.find((origin) => {
                        return ele.id === origin.id;
                      });
                      const previousNodeList = returnPreviousNodeList(
                        linkList,
                        nodeList,
                        nodeList.find((origin) => {
                          return ele.id === origin.id;
                        })
                      );
                      const nextNodeList = returnNextNodeList(
                        linkList,
                        nodeList,
                        nodeList.find((origin) => {
                          return ele.id === origin.id;
                        })
                      );

                      reduxStore.dispatch(selectNode(originalNode));
                      const d = document.createElement("div");
                      d.id = `${originalNode.id}`;
                      d.className = "nodeModalDOM";
                      document.getElementById("root").appendChild(d);

                      const modalList =
                        document.getElementsByClassName("nodeModal");
                      const zIndexList = Array.from(modalList).map(
                        (originalNode) => {
                          return originalNode.style.zIndex;
                        }
                      );
                      const max = Math.max(...zIndexList);

                      ReactDOM.render(
                        <SelectedNodeModal
                          defaultZ={max + 1}
                          node={originalNode}
                        />,
                        document.getElementById(d.id) //document.getElementById("treeMap")
                      );
                    }}
                  >
                    <div style={{ display: "flex", marginBottom: "10px" }}>
                      {" "}
                      <NodeColorSymbol
                        style={{ background: ele.fillColor }}
                      ></NodeColorSymbol>
                      <div>{ele.name}</div>
                    </div>
                    <div>{ele.body}</div>
                  </SearchNodeCard>
                );
              })}
            </div>
          )}
        </SearchArea>
        <>
          <a href={dataStr} download={`${treeTitle}.md`}>
            <DefaultButton>Download Tree Data as a markdown.md</DefaultButton>
          </a>
        </>
        {/* 
       power mode. position bug?
         <div>
          {powerMode ? (
            <DefaultButton
              onClick={() => {
                dispatch(togglePowerMode());
              }}
            >
              Now Editor Power Mode On
            </DefaultButton>
          ) : (
            <DefaultButton
              onClick={() => {
                dispatch(togglePowerMode());
              }}
            >
              Now Editor Power Mode Off
            </DefaultButton>
          )}
        </div>
       
       tree private feature. now error.
        <>
          {treeAuthorID === myID ? (
            <>
              {" "}
              {treePublic ? (
                <div>
                  This Tree Is Now{" "}
                  <DefaultButton
                    onClick={() => {
                      Swal.fire({
                        title: "Do you want to hide the tree?",
                        //text: "You won't be able to revert this!",
                        icon: "warning",
                        confirmButtonColor: "#3085d6", // "#3085d6",
                        confirmButtonText: "Yes, hide it!",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          dispatch(updateTreePrivacy(treeID, false));
                          Swal.fire(
                            "Done!",
                            "Now other cannot see this tree.",
                            "success"
                          );
                        }
                      });
                    }}
                  >
                    Published
                  </DefaultButton>
                </div>
              ) : (
                <div>
                  This Tree Is Now{" "}
                  <DefaultButton
                    onClick={() => {
                      Swal.fire({
                        title: "Do you want to publish the tree?",
                        //text: "You won't be able to revert this!",
                        icon: "warning",
                        confirmButtonColor: "#3085d6", // "#3085d6",

                        confirmButtonText: "Yes, publish it!",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          dispatch(updateTreePrivacy(treeID, true));
                          Swal.fire(
                            "Published!",
                            "Tree has been published.",
                            "success"
                          );
                        }
                      });
                    }}
                  >
                    Private
                  </DefaultButton>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </>
        */}
      </TreeFooter>
    </div>
  );
});

export const TreeHeader = styled.div`
  border-radius: 3px;
  //border: 1px solid ${colorPalette.gray3};
  //background-color: ${colorPalette.gray0};
  display: flex;
  //flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-left: 10vw;
  padding-right: 10vw;
  padding-bottom: 10px;
  padding-top: 10px;
  //width: 100%;
  @media (max-width: 768px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }
`;

export const TreeMap = styled.div`
  border-radius: 3px;
  border: 1px solid ${colorPalette.gray3};
  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
  z-index: 0;
  //position: relative;
  //position: fixed;
  position: static;
  // position: absolute;
  height: auto;
  width: 100%;
`;

export const TreeTitle = styled(LargeText)`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const TreeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px;
`;

export const SearchArea = styled.div`
  padding-bottom: 10px;
`;

export const StyledSearchInput = styled(LargeTextInput)``;

export const NodeColorSymbol = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: none;
  margin-left: 10px;
  margin-right: 10px;
`;

export const SearchNodeCard = styled.div`
  background: #ffffff;
  //display: flex;
  cursor: pointer;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid ${colorPalette.gray2};
  box-shadow: ${boxShadow.default};
  &:hover {
    ${hoverAction};
  }
`;

const mapWidth = 1200;
const mapHeight = 700;
const linkWidth = "2.5px";
const linkColor = "#999999"; //colorPalette.gray3;
const nodeRadius = 20;

export function initMap(container) {
  //var touchEvents = ["touchstart", "touchmove", "touchend"];
  //touchEvents.forEach(function (eventName) {
  //  document.body.addEventListener(eventName, function (e) {
  //    e.preventDefault();
  //  });
  //});
  const svg = d3
    .select(container)
    .append("svg")
    .attr("id", "treeContainer")
    .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`);

  // ????????? ??????????????? ???????????? ?????? ?????? ???????????????.
  svg
    .append("g")
    .append("line")
    .attr("class", "tempLine")
    .style("stroke", linkColor)
    .style("stroke-width", linkWidth)
    .attr("marker-end", "url(#temp-end-arrow)")
    .style("opacity", "0")
    .attr("display", "none");

  // ????????? ??????
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

  // tempLine?????? ?????? ????????? ??????
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
  svg.append("g").attr("class", "folders");
}

export function initGraph(container, originalNodeList, originalLinkList) {
  const width = mapWidth || 1200;
  const height = mapHeight || 700;
  let nodeList = originalNodeList;
  let linkList = originalLinkList;
  let folderList = [];

  const selectedColor = colorPalette.green2; // "#00bebe"; //colorPalette.green2;
  const selectedNodeStrokeWidth = "8px";

  const selectedNodeList = reduxStore.getState().tree.selectedNodeList;

  const treeID = reduxStore.getState().tree.treeID;
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
  const folderGroup = svg.select(".folders");
  const labelGroup = svg.select(".labels");

  const treeEditButton = d3.select("#treeEditButton").on("click", () => {
    reduxStore.dispatch(editTree());
  });
  const treeSaveButton = d3.select("#treeSaveButton").on("click", () => {
    // ???????????? ???????????????.
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
        updateTree(treeID, reduxStore.getState().tree.treeTitle, thumbnailURL)
      );
    }
  }

  // tree ??????, ??????, fork, save ?????? ?????? ????????? ?????????
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
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Connection has been deleted.", "success");
            reduxStore.dispatch(deleteLink(treeID, linkList, link));
            initLink();
            changeTreeInfo();
          }
        });
        //const deleteOK = window.confirm("Delete Connection?");
        //if (deleteOK) {
        //  await reduxStore.dispatch(deleteLink(treeID, linkList, link));
        //  initLink();
        //  changeTreeInfo();
        //} else {
        //  return;
        //}
      })
      .on("touch", async (link) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Connection has been deleted.", "success");
            reduxStore.dispatch(deleteLink(treeID, linkList, link));
            initLink();
            changeTreeInfo();
          }
        });
        //const deleteOK = window.confirm(`Delete Connection?`);
        //if (deleteOK) {
        //  await reduxStore.dispatch(deleteLink(treeID, linkList, link));
        //  initLink();
        //  changeTreeInfo();
        //} else {
        //  return;
        //}
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
      .style("z-index", (d) => {
        if (d.type === "folder") {
          return "-1";
        } else {
          return "1";
        }
      })
      .style("stroke", (node) => {
        if (node.type === "folder") {
          return colorPalette.gray3;
        }
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
        if (node.type === "folder") {
          nodeList.reverse();
          return;
        }
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
            .on("start", (node) => {
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

              await reduxStore.dispatch(createLink(treeID, linkList));
              await reduxStore.dispatch(createNode(treeID, nodeList));
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
              if (d.type === "folder") {
                return;
              }
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

                  // ????????? ????????? ???????????? ??????
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

                    await reduxStore.dispatch(createLink(treeID, linkList));
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

    // ?????? ????????? ?????? ?????????
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
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Node has been deleted.", "success");
            reduxStore.dispatch(deleteNode(treeID, nodeList, linkList, d));
            initNode();
            changeTreeInfo();
          }
        });
        //const deleteOK = window.confirm(`Delete ${d.name} Node?`);
        //if (deleteOK) {
        //  reduxStore.dispatch(deleteNode(treeID, nodeList, linkList, d));
        //  initNode();
        //  changeTreeInfo();
        //} else {
        //  return;
        //}
      })
      .on("touch", async (d) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Node has been deleted.", "success");
            reduxStore.dispatch(deleteNode(treeID, nodeList, linkList, d));
            initNode();
            changeTreeInfo();
          }
        });
        //const deleteOK = window.confirm(`Delete ${d.name} Node?`);
        //if (deleteOK) {
        //  reduxStore.dispatch(deleteNode(treeID, nodeList, d));
        //  initNode();
        //  changeTreeInfo();
        //} else {
        //  return;
        //}
      })
      .style("cursor", "pointer");
  }

  function initFolder() {
    const createdFolderGroup = folderGroup
      .selectAll("circle")
      .data(folderList)
      .join("circle")
      .attr("r", (folder) => {
        if (folder.folded) {
          return folder.foldedRadius;
        } else {
          return folder.radius;
        }
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
      .style("stroke", (folder) => {
        return colorPalette.gray3;
      })
      .on("click", (folder) => {
        folderList = folderList.filter((ele) => {
          return ele.id !== folder.id;
        });
        folderList.push({ ...folder, folded: !folder.folded });
        initFolder();
      })
      .style("cursor", "pointer");

    if (reduxStore.getState().tree.isEditingTree) {
      // drag node
      createdFolderGroup
        .call(
          d3
            .drag()
            .on("start", (node) => {
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

              await reduxStore.dispatch(createLink(treeID, linkList));
              await reduxStore.dispatch(createNode(treeID, nodeList));
              changeTreeInfo();
            })
        )
        .attr("cx", (d) => {
          return d.x;
        });
    } else {
      // connect nodes by link
      createdFolderGroup
        .call(
          d3
            .drag()
            .on("start", (d) => {
              if (d.type === "folder") {
                return;
              }
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

                  // ????????? ????????? ???????????? ??????
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

                    await reduxStore.dispatch(createLink(treeID, linkList));
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

    // ?????? ????????? ?????? ?????????
    folderGroup
      .selectAll("image")
      .data(folderList)
      .join("image")
      .attr("href", xCircle)
      .attr("width", deleteButtonLength)
      .attr("height", deleteButtonLength)
      .style("fill", (d) => d.fillColor)
      .attr("x", (d) => {
        return d.x - d.radius * 1.7;
      })
      .attr("y", (d) => {
        return d.y - d.radius * 1.7;
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
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Node has been deleted.", "success");
            reduxStore.dispatch(deleteNode(treeID, nodeList, linkList, d));
            initNode();
            changeTreeInfo();
          }
        });
      })
      .on("touch", async (d) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#999",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Deleted!", "Node has been deleted.", "success");
            reduxStore.dispatch(deleteNode(treeID, nodeList, linkList, d));
            initNode();
            changeTreeInfo();
          }
        });
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

  svg
    .on("dblclick", async (d) => {
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
          fillColor: "#51cf66",
          parentNodeID: [],
          childNodeID: [],
        };
        nodeList = [...nodeList, createdNode];
        await reduxStore.dispatch(createNode(treeID, nodeList));
        changeTreeInfo();
        initNode();
      }
    })
    .call(
      d3
        .drag()
        .container(function () {
          return this;
        })
        .subject(function () {
          var p = [d3.event.x, d3.event.y];
          return [p, p];
        })
        .on("start", dragstarted)
        .on("end", dragend)
    );
  var line = d3.line().curve(d3.curveBasis);
  function dragend() {
    const tempDrawing = document.getElementById("temp-drawing");

    const pathLength = tempDrawing.getTotalLength();
    if (!pathLength) {
      tempDrawing.remove();
      return;
    }
    const endPoint = tempDrawing.getPointAtLength(pathLength);
    // ?????????????????? ??????????????? ???????????? ???????????? ??? ???????????????.
    if (endPoint.x < 0 || endPoint.y < 0) {
      tempDrawing.remove();
      return;
    }

    const pathPoints = [];
    for (let i = 0; i < pathLength; i++) {
      pathPoints.push(tempDrawing.getPointAtLength(i));
    }

    const startPoint = tempDrawing.getPointAtLength(0);

    svg
      .append("line")
      .attr("x1", endPoint.x)
      .attr("y1", endPoint.y)
      .attr("x2", startPoint.x)
      .attr("y2", startPoint.y)
      .attr("id", "inter-line");
    const interpolation = document.getElementById("inter-line");
    const interLength = interpolation.getTotalLength();
    for (let i = 0; i < interLength; i++) {
      pathPoints.push(interpolation.getPointAtLength(i));
    }

    // ????????????????????? ??????????????????????????? ?????? ????????? ????????????
    const nodesInCircle = [];
    nodeList.map((node) => {
      const candidate1 = [];
      const candidate2 = [];
      for (let i = 0; i < pathPoints.length - 2; i++) {
        if (pathPoints[i].x < node.x && pathPoints[i + 1].x > node.x) {
          // ???????????? ??????
          candidate1.push(pathPoints[i]);
          candidate1.push(pathPoints[i + 1]);
        } else if (pathPoints[i].x > node.x && pathPoints[i + 1].x < node.x) {
          // ?????? ????????? ????????? ???, ????????? ??????.
          candidate2.push(pathPoints[i]);
          candidate2.push(pathPoints[i + 1]);
        } else {
        }
      }
      // ?????? ????????? ????????? ????????????
      if (candidate1.length > 1 && candidate2.length > 1) {
        if (candidate1[0].y > node.y && candidate2[0].y < node.y) {
          nodesInCircle.push(node);
        } else if (candidate1[0].y < node.y && candidate2[0].y > node.y) {
          nodesInCircle.push(node);
        } else {
        }
      }
    });

    const folderID = `node${uid(20)}`;
    nodesInCircle.map((incircle) => {
      nodeList = nodeList.filter((eachNode) => {
        return incircle.id !== eachNode.id;
      });
      const added = { ...incircle, parentNodeID: [folderID] };
      nodeList.push(added);
    });
    // ??? ??? ????????? ???????????????.
    tempDrawing.remove();
    interpolation.remove();

    // ???????????? ????????? ????????? ??????
    if (nodesInCircle.length < 1) {
      return;
    }
    //
    let sumX = 0;
    let sumY = 0;
    nodesInCircle.map((node) => {
      sumX = sumX + node.x;
      sumY = sumY + node.y;
    });

    const avgX = sumX / nodesInCircle.length;
    const avgY = sumY / nodesInCircle.length;

    // ??????????????? ?????? ??? ????????? ???????????? ????????? ????????????
    let bigRadius = 0;
    nodesInCircle.map((node) => {
      if (
        (node.x - avgX) * (node.x - avgX) + (node.y - avgY) * (node.y - avgY) >
        bigRadius
      ) {
        bigRadius =
          (node.x - avgX) * (node.x - avgX) + (node.y - avgY) * (node.y - avgY);
      }
    });
    bigRadius = Math.sqrt(bigRadius) + nodeRadius * 1.5;

    const createdFolder = {
      id: folderID,
      type: "folder",
      name: "",
      x: avgX,
      y: avgY,
      radius: bigRadius,
      foldedRadius: nodeRadius,
      folded: false,
      body: "",
      hashtags: [],
      fillColor: colorPalette.gray0, //"none", //colorPalette.gray0,//"#51cf66",
      parentNodeID: [],
      childNodeID: nodesInCircle,
    };
    folderList.push(createdFolder);
    ////await reduxStore.dispatch(createNode(treeID, nodeList));
    ////changeTreeInfo();

    // initFolder();

    //initNode();
  }
  function dragstarted() {
    var d = d3.event.subject,
      active = svg
        .append("path")
        .datum(d)
        .attr("id", "temp-drawing")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "3px")
        .style("stroke-linejoin", "round")
        .style("stroke-dasharray", "10,10"),
      x0 = d3.event.x,
      y0 = d3.event.y;

    d3.event.on("drag", function () {
      var x1 = d3.event.x,
        y1 = d3.event.y,
        dx = x1 - x0,
        dy = y1 - y0;

      if (dx * dx + dy * dy > 100) d.push([(x0 = x1), (y0 = y1)]);
      else d[d.length - 1] = [x1, y1];
      active.attr("d", line);
    });
  }

  reduxStore.subscribe(initNode);
  initLink();
  initNode();
  initLabel();
}
