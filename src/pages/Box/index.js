import React, { Component } from "react";
import api from "../../services/api";
import "./styles.css";
import logo from "../../assets/logo_side.svg";
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFules();
    const boxId = this.props.match.params.id;
    const response = await api.get(`boxes/${boxId}`);
    this.setState({ box: response.data });
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData();
      const boxId = this.props.match.params.id;

      data.append('file', file);
      api.post(`boxes/${boxId}/files`, data);
    });
  }

  subscribeToNewFules = () => {
    const boxId = this.props.match.params.id;
    const io = socket('https://alex-box-backend.herokuapp.com');
    io.emit('connectRoom', boxId);

    io.on('file', data => {
      this.setState({
        box:
        {
          ...this.state.box,
          files: [data, ...this.state.box.files]
        }
      })
    });
  }

  render() {
    return (
      <div id="box-container">

        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>
        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste aqui seu arquivo ou clique para escolher</p>
            </div>
          )}
        </Dropzone>
        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="gray" />
                  <strong>{file.title}</strong>
                </a>
                <span>há {" "}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt
                  })}{" "} atrás</span>
              </li>
            ))}
        </ul>

      </div>
    );
  }
}
