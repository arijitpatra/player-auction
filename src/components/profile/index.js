import React, { Component } from "react";
import { allTeams } from "../../appConstants";
import "./index.scss";

class Profile extends Component {
  state = {
    currentId: 1,
    fullData: "",
    dataToDisplay: ""
  };

  componentDidMount() {
    fetch("./backend.json")
      .then(response => response.json())
      .then(data => {
        // filtering
        this.setState({ fullData: data, dataToDisplay: data[0] });
      })
      .catch(err => {
        console.log("Error Reading data " + err);
      });
  }

  onNext = () => {
    if (this.state.currentId < this.state.fullData.length - 1) {
      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentId + 1],
        currentId: this.state.currentId + 1
      });
    }
  };

  onPrevious = () => {
    if (this.state.currentId >= 1) {
      this.setState({
        dataToDisplay: this.state.fullData[this.state.currentId - 1],
        currentId: this.state.currentId - 1
      });
    }
  };

  onAdd = value => {
    const updatedValue = {
      ...this.state.dataToDisplay,
      CurrentPrice: this.state.dataToDisplay.CurrentPrice + value
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
    this.setState({ dataToDisplay: updatedValue });

    // const updatedJson = this.state.fullData;

    const updatedJson = this.state.fullData.map(item => {
      if (item.id === this.state.dataToDisplay.id) {
        return (item = updatedValue);
      } else {
        return item;
      }
    });

    const fileData = JSON.stringify(updatedJson);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "backend.json";
    link.href = url;
    link.click();
  };

  render() {
    const { dataToDisplay } = this.state;
    return (
      <section className="profile">
        <section className="action">
          <div>
            <div className="change-player">
              <span className="previous" onClick={() => this.onPrevious()}>
                Previous
              </span>
              <span className="next" onClick={() => this.onNext()}>
                Next
              </span>
            </div>
          </div>
        </section>
        <section className="card">
          <img src={dataToDisplay.photoPath} />
          <div>
            <div className="player-name">
              <div className="label">PLAYER</div>
              <div className="value value-name">{dataToDisplay.name}</div>
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
              100
            </div>
            <div className="increment-button" onClick={() => this.onAdd(200)}>
              200
            </div>
            <div className="increment-button" onClick={() => this.onAdd(300)}>
              300
            </div>
          </section>
        </section>

        <section className="pricing">
          <div className="pricing-blocks">
            <div className="label">Base Price</div>
            <div className="value">₹ {dataToDisplay.basePrice}</div>
          </div>
          <div className="pricing-blocks">
            <div className="label">Current Price</div>
            <div className="value">₹ {dataToDisplay.CurrentPrice}</div>
          </div>
        </section>
      </section>
    );
  }
}

export default Profile;
