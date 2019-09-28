import React, { Component } from "react";
import "./index.scss";

class Header extends Component {
  render() {
    return (
      <section className="header">
        <img src={"https://brandmark.io/logo-rank/random/pepsi.png"} />
        <span>MPL Auction</span>
      </section>
    );
  }
}

export default Header;
