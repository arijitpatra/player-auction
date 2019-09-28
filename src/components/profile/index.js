import React, { Component } from "react";
import { allTeams, data } from "../../appConstants";
import "./index.scss";

class Profile extends Component {
  state = {
    currentId: 1,
    fullData: data,
    dataToDisplay: data[0]
  };

  onNext = () => {
    if (this.state.currentId < data.length - 1) {
      this.setState({
        dataToDisplay: data[this.state.currentId + 1],
        currentId: this.state.currentId + 1
      });
    }
  };

  onPrevious = () => {
    if (this.state.currentId >= 1) {
      this.setState({
        dataToDisplay: data[this.state.currentId - 1],
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

  render() {
    const { dataToDisplay } = this.state;
    return (
      <section className="profile">
        <section className="action">
          <div>
            <select>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
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
