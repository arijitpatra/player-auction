import React, { Component } from "react";
import { allTeams } from "../../appConstants";
import "./index.scss";

class Profile extends Component {
  state = {
    currentId: 1,
    fullData: "",
    dataToDisplay: "",
    allData: "",
    isSold: false,
    isUnsoldSelected: true
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
    fetch("./backend.json")
      .then(response => response.json())
      .then(data => {
        const unsold = data.filter(item => {
          if (this.state.isUnsoldSelected) {
            if (item.isSold === false) {
              return item;
            }
          } else {
            if (item.isSold === true) {
              return item;
            }
          }
        });

        // for (let i = 0; i < unsold.length - 1; i++) {
        //   let j = i + Math.floor(Math.random() * (unsold.length - i));
        //   const temp = unsold[j];
        //   unsold[j] = unsold[i];
        //   unsold[i] = temp;
        // }

        this.setState({
          allData: data,
          fullData: unsold,
          dataToDisplay: unsold[0]
        });
      })
      .catch(err => {
        console.log("Error Reading data " + err);
      });
  };

  onNext = () => {
    if (this.state.currentId < this.state.fullData.length - 1) {
      // console.log(this.state.dataToDisplay.basePrice);
      // if (this.state.dataToDisplay.basePrice > 100) {
      //   const updatedValue = {
      //     ...this.state.dataToDisplay,
      //     basePrice: this.state.dataToDisplay.basePrice - 100,
      //     currentPrice: this.state.dataToDisplay.currentPrice - 100
      //   };
      //   this.setState({ dataToDisplay: updatedValue });

      //   const updatedJson = this.state.allData.map(item => {
      //     if (item.id === this.state.dataToDisplay.id) {
      //       return (item = updatedValue);
      //     } else {
      //       return item;
      //     }
      //   });

      //   setTimeout(() => {
      //     const fileData = JSON.stringify(updatedJson);
      //     const blob = new Blob([fileData], { type: "text/plain" });
      //     const url = URL.createObjectURL(blob);
      //     const link = document.createElement("a");
      //     link.download = "backend.json";
      //     link.href = url;
      //     link.click();
      //   }, 500);
      // }

      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentId + 1],
        currentId: this.state.currentId + 1,
        isSold: false
      });
    }
  };

  onPrevious = () => {
    if (this.state.currentId >= 1) {
      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentId - 1],
        currentId: this.state.currentId - 1,
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

  onTeamSelection = teamObject => {
    const updatedValue = {
      ...this.state.dataToDisplay,
      teamIcon: teamObject.imgSrc,
      teamSoldTo: teamObject.name,
      isSold: true
    };
    this.setState({ dataToDisplay: updatedValue, isSold: true });

    const updatedJson = this.state.allData.map(item => {
      if (item.id === this.state.dataToDisplay.id) {
        return (item = updatedValue);
      } else {
        return item;
      }
    });

    setTimeout(() => {
      const fileData = JSON.stringify(updatedJson);
      const blob = new Blob([fileData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "backend.json";
      link.href = url;
      link.click();
    }, 1500);
  };

  render() {
    const { dataToDisplay } = this.state;
    return (
      <section className="profile">
        <section className="action">
          <div>
            {/* <div className="team-icons-header-container">
              {allTeams.map(team => {
                return (
                  <div className="header-tags">
                    <img
                      key={team.id}
                      className="team-icons-header"
                      title={team.name}
                      src={team.imgSrc}
                      onClick={() => this.onTeamSelection(team)}
                    />
                    <span>₹ 10000</span>
                  </div>
                );
              })}
            </div> */}
            <div className="filter">
              <div
                className={
                  this.state.isUnsoldSelected === false && dataToDisplay.isSold
                    ? "active-filter sold"
                    : "sold"
                }
                onClick={() => this.setState({ isUnsoldSelected: false })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> SOLD
              </div>
              <div
                className={
                  this.state.isUnsoldSelected === true && !dataToDisplay.isSold
                    ? "active-filter unsold"
                    : "unsold"
                }
                onClick={() => this.setState({ isUnsoldSelected: true })}
              >
                <i className="fa fa-filter" aria-hidden="true"></i> UNSOLD
              </div>
            </div>
          </div>
        </section>
        <section className="card">
          <section className="pricing">
            {this.state.isUnsoldSelected === false ? (
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
            {this.state.isUnsoldSelected === false ? (
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
                {this.state.isSold === true ? (
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
              <div className="increment-button" onClick={() => this.onAdd(100)}>
                ₹ 100
              </div>
              <div className="increment-button" onClick={() => this.onAdd(200)}>
                ₹ 200
              </div>
              <div className="increment-button" onClick={() => this.onAdd(300)}>
                ₹ 300
              </div>
            </section>
          )}
        </section>
      </section>
    );
  }
}

export default Profile;
