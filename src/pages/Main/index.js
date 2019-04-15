import React, { Component } from "react";
import logo from "../../assets/logo_container.svg";
import "./styles.css";
import api from "../../services/api";

export default class Main extends Component {
  state = {
    newBox: ""
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await api.post("boxes", {
      title: this.state.newBox
    });

    this.props.history.push(`/box/${response.data._id}`);
  };

  handleInputChange = e => {
    this.setState({ newBox: e.target.value });
  };

  render() {
    return (
      <div id="main-container">
        <img id="logo-main" src={logo} />
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="Nome da caixinha"
            value={this.state.newBox}
            onChange={this.handleInputChange}
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    );
  }
}
