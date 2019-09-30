import React, { Component } from "react";
import { allTeams } from "../../appConstants";
import fire from "../../fire";
import "./index.scss";

class Profile extends Component {
  constructor() {
    super();
    this.db = fire.firestore();
  }

  state = {
    currentIndex: 0,
    fullData: "",
    dataToDisplay: "",
    allData: "",
    isSold: false,
    isUnsoldSelected: true,
    isViewTeamsEnabled: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isUnsoldSelected !== this.state.isUnsoldSelected) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.db
      .collection("players")
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        const filteredData = data.filter(item => {
          if (this.state.isUnsoldSelected) {
            if (item.isSold === false && item.isPassed === false) {
              return item;
            }
          } else {
            if (item.isSold === true) {
              return item;
            }
          }
        });

        for (let i = 0; i < filteredData.length - 1; i++) {
          let j = i + Math.floor(Math.random() * (filteredData.length - i));
          const temp = filteredData[j];
          filteredData[j] = filteredData[i];
          filteredData[i] = temp;
        }

        this.setState({
          allData: data,
          fullData: filteredData,
          dataToDisplay: filteredData[0]
        });
      });
  };

  onNext = () => {
    if (this.state.currentIndex < this.state.fullData.length) {
      if (this.state.isUnsoldSelected === true) {
        const updatedValue = {
          ...this.state.dataToDisplay,
          isPassed: true
        };

        const self = this;
        this.db
          .collection("players")
          .doc(this.state.dataToDisplay.id.toString())
          .set(updatedValue, { merge: true })
          .then(function(docRef) {
            self.fetchData();
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }

      this.fetchData();
    }
  };

  onPrevious = () => {
    if (this.state.currentIndex > 0) {
      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentIndex - 1],
        currentIndex: this.state.currentIndex - 1,
        isSold: false
      });
    }
  };

  onAdd = value => {
    const updatedValue = {
      ...this.state.dataToDisplay,
      currentPrice: this.state.dataToDisplay.currentPrice + value
    };
    this.setState({ dataToDisplay: updatedValue });
  };

  onSubtract = value => {
    const subtractedValue = this.state.dataToDisplay.currentPrice - value;
    if (subtractedValue >= this.state.dataToDisplay.basePrice) {
      const updatedValue = {
        ...this.state.dataToDisplay,
        currentPrice: subtractedValue
      };
      this.setState({ dataToDisplay: updatedValue });
    }
  };

  onTeamSelection = teamObject => {
    const updatedValue = {
      ...this.state.dataToDisplay,
      teamIcon: teamObject.imgSrc,
      teamSoldTo: teamObject.name,
      isSold: true,
      isPassed: true
    };

    const self = this;
    this.db
      .collection("players")
      .doc(this.state.dataToDisplay.id.toString())
      .set(updatedValue, { merge: true })
      .then(function(docRef) {
        self.fetchData();
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

    // const x = [{ "id": 1, "photoPath": "https://images.unsplash.com/photo-1569596082827-c5e8990496cb?ixlib=rb-1.2.1&ix'id'=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80", "name": "Sachin", "flat": "Y-004", "type": "All Rounder", "lastYear": true, "isSold": true, "isPassed": true, "basePrice": 100, "currentPrice": 100, "teamSoldTo": "Eight", "teamIcon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1wwNFjsmptYthTZl19NLdql9XpOlmCHCsvgePJChue3OGeR_sRg" }, { "id": 2, "photoPath": "https://images.unsplash.com/photo-1569609782629-8e323d62582e?ixlib=rb-1.2.1&ix'id'=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=387&q=80", "name": "Avishek", "flat": "L-604", "type": "All Rounder", "lastYear": true, "isSold": true, "isPassed": true, "basePrice": 200, "currentPrice": 200, "teamSoldTo": "Five", "teamIcon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyGwkqbnJ3Y6aEu7PhCj7U6xcgutOIre7gBqNO5BrXz1Cmj1UMgw" }, { "id": 3, "photoPath": "https://images.unsplash.com/photo-1569606978636-9e7967d06a21?ixlib=rb-1.2.1&ix'id'=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80", "name": "Mayank", "flat": "L-902", "type": "Batsman", "lastYear": true, "isSold": false, "isPassed": false, "basePrice": 100, "currentPrice": 100, "teamSoldTo": "", "teamIcon": "" }, { "id": 4, "photoPath": "https://images.unsplash.com/photo-1569601841754-63b6366198ce?ixlib=rb-1.2.1&ix'id'=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80", "name": "Shubham", "flat": "L-303", "type": "All Rounder", "lastYear": true, "isSold": false, "isPassed": false, "basePrice": 400, "currentPrice": 400, "teamSoldTo": "", "teamIcon": "" }, { "id": 5, "photoPath": "https://images.unsplash.com/photo-1569604402759-c8e0c98766f9?ixlib=rb-1.2.1&ix'id'=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80", "name": "Gaurang", "flat": "J-602", "type": "Bowler", "lastYear": true, "isSold": false, "isPassed": false, "basePrice": 300, "currentPrice": 300, "teamSoldTo": "", "teamIcon": "" }];

    // x.forEach(i => {
    // this.db
    // .collection("players").doc(i.id.toString())
    // .set(
    // i, { merge: true }
    // )
    // .then(function (docRef) {
    // console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function (error) {
    // console.error("Error adding document: ", error);
    // });
    // })
  };

  passedToUnsold = () => {
    if (this.state.allData) {
      const dataLength = this.state.allData.filter(
        i => i.isSold === false && i.isPassed === true
      ).length;

      if (dataLength > 0) {
        this.state.allData.forEach(i => {
          if (i.isSold === false && i.isPassed === true) {
            const updatedValue = {
              ...i,
              isPassed: false
            };

            this.db
              .collection("players")
              .doc(i.id.toString())
              .set(updatedValue, { merge: true })
              .then(function(docRef) {})
              .catch(function(error) {
                console.error("Error adding document: ", error);
              });
          }
        });
        this.fetchData();
      }
    }
  };

  viewTeams = () => {
    this.setState({ isViewTeamsEnabled: !this.state.isViewTeamsEnabled });
  };

  createTeamDetails = () => {
    let arr = [];
    this.db
      .collection("players")
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        arr = allTeams.map(team => {
          return (
            <section>
              <div>
                {team.imgSrc} {team.name}
              </div>
            </section>
          );
        });
      });
    console.log(arr);
    return arr;
  };

  render() {
    const {
      dataToDisplay,
      isUnsoldSelected,
      allData,
      isViewTeamsEnabled,
      isSold
    } = this.state;
    const teamsDetails = this.createTeamDetails();
    return (
      <section className="profile">
        <section className="action">
          <div>
            <div className="filter">
              <div
                className={
                  isUnsoldSelected === false &&
                  dataToDisplay &&
                  dataToDisplay.isSold
                    ? "active-filter sold"
                    : "sold"
                }
                onClick={() => this.setState({ isUnsoldSelected: false })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> SOLD{" "}
                {allData
                  ? `(${
                      allData.filter(
                        i => i.isSold === true && i.isPassed === true
                      ).length
                    })`
                  : ""}
              </div>
              <div
                className={
                  isUnsoldSelected === true &&
                  dataToDisplay &&
                  !dataToDisplay.isSold
                    ? "active-filter unsold"
                    : "unsold"
                }
                onClick={() => this.setState({ isUnsoldSelected: true })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> UNSOLD{" "}
                {allData
                  ? `(${
                      allData.filter(
                        i => i.isSold === false && i.isPassed === false
                      ).length
                    })`
                  : ""}
              </div>
              <div className="move" onClick={() => this.passedToUnsold()}>
                <i className="fa fa-bolt" aria-hidden="true"></i> Move parked
                players to unsold{" "}
                {allData
                  ? `(${
                      allData.filter(
                        i => i.isSold === false && i.isPassed === true
                      ).length
                    })`
                  : ""}
              </div>
            </div>
          </div>
        </section>
        {dataToDisplay ? (
          <section className="card">
            <section className="pricing">
              {isUnsoldSelected === false ? (
                <div className="pricing-blocks pricing-blocks-centered">
                  <div className="label">Final Price</div>
                  <div className="value">
                    <span className="rupee-icon">₹</span>
                    {dataToDisplay.currentPrice}
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div className="pricing-blocks">
                    <div className="label">Base Price</div>
                    <div className="value">
                      <span className="rupee-icon">₹</span>
                      {dataToDisplay.basePrice}
                    </div>
                  </div>
                  <div className="pricing-blocks">
                    <div className="label">Current Price</div>
                    <div className="value">
                      <span className="rupee-icon">₹</span>
                      {dataToDisplay.currentPrice}
                    </div>
                  </div>
                </React.Fragment>
              )}
            </section>
            <div className="change-player">
              {isUnsoldSelected === false ? (
                <div
                  className="previous"
                  onClick={() => this.onPrevious()}
                  title="Previous"
                >
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </div>
              ) : (
                ""
              )}
              <div className="next" onClick={() => this.onNext()} title="Next">
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>
            <img src={dataToDisplay.photoPath} />
            <div>
              <div className="player-name">
                <div className="label">PLAYER</div>
                <div className="value value-name">
                  {dataToDisplay.name}
                  {isSold === true ? (
                    <img
                      className="sold"
                      src={
                        "https://freepngimg.com/thumb/sold_out/1-2-sold-out-png-picture-thumb.png"
                      }
                    ></img>
                  ) : (
                    ""
                  )}
                  {dataToDisplay.isSold === true ? (
                    <span>
                      <img
                        className="sold"
                        src={
                          "https://freepngimg.com/thumb/sold_out/1-2-sold-out-png-picture-thumb.png"
                        }
                      ></img>
                      <img
                        className="sold-team"
                        src={dataToDisplay.teamIcon}
                      ></img>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="other-info">
                  <div className="info-blocks">
                    <div className="label">FLAT</div>
                    <div className="value">{dataToDisplay.flat}</div>
                  </div>

                  <div className="info-blocks">
                    <div className="label">TYPE</div>
                    <div className="value">{dataToDisplay.type}</div>
                  </div>

                  <div className="info-blocks">
                    <div className="label">LAST YEAR HISTORY</div>
                    <div className="value">
                      {dataToDisplay.lastYear ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {dataToDisplay.isSold ? (
              ""
            ) : (
              <section className="teams">
                {allTeams.map(team => {
                  return (
                    <img
                      key={team.id}
                      className="team-icons"
                      title={team.name}
                      src={team.imgSrc}
                      onClick={() => this.onTeamSelection(team)}
                    />
                  );
                })}
                <div
                  className="increment-button view-team"
                  onClick={() => this.viewTeams()}
                >
                  <i className="fa fa-eye" aria-hidden="true"></i> View teams
                </div>
                <div className="minus-container">
                  <div
                    className="increment-button"
                    onClick={() => this.onAdd(100)}
                  >
                    ₹ 100
                  </div>
                  <i
                    className="fa fa-minus-circle minus"
                    aria-hidden="true"
                    onClick={() => this.onSubtract(100)}
                  ></i>
                </div>
                <div className="minus-container">
                  <div
                    className="increment-button"
                    onClick={() => this.onAdd(200)}
                  >
                    ₹ 200
                  </div>
                  <i
                    className="fa fa-minus-circle minus"
                    aria-hidden="true"
                    onClick={() => this.onSubtract(200)}
                  ></i>
                </div>
              </section>
            )}
          </section>
        ) : (
          <section className="no-data transition">
            <i className="fa fa-check-circle scale" aria-hidden="true"></i> You
            are all done, nothing here!
            <p>Navigate to appropriate filter for data</p>
          </section>
        )}

        {isViewTeamsEnabled ? (
          <div
            className="modal-like"
            title="Click anywhere to close"
            onClick={() => this.viewTeams()}
          >
            {allTeams.map(team => {
              return (
                <section key={team.name} title={team.name}>
                  <div>
                    <img src={team.imgSrc}></img>
                    <div>
                      <div>{team.name}</div>
                      <div className="balance">₹ 8000 remaining </div>
                    </div>
                  </div>
                  <p>
                    <p>1. Arijit Patra</p>
                    <p>2. Arijit Patra</p>
                    <p>3. Arijit Patra</p>
                    <p>4. Arijit Patra</p>
                    <p>5. Arijit Patra</p>
                    <p>6. Arijit Patra</p>
                    <p>7. Arijit Patra</p>
                    <p>8. Arijit Patra</p>
                  </p>
                </section>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <section className="credit">
          designed and developed by <span>Arijit Patra</span>
        </section>
      </section>
    );
  }
}

export default Profile;
