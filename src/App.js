import './App.css';
import React from 'react';
import { auth, provider, db } from './firebase/firebase'
import randomize from 'randomatic'
let annoyance = false;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      display : "ouput",
      mobileCode : "",
      code: "",
      textContent: "",
      init: false,
      device: ""
    }
  }

  componentDidMount() {
    console.log('test')
    auth.onAuthStateChanged((auth) => {
      if (auth) {
        this.setState({display: "input"})
        if (!annoyance) {
          annoyance = true;
          this.setState({
            code: randomize('AAAAA')
          }, () => {
            db.ref('rooms/' + this.state.code).set({
              text: ""
            })
            db.ref('rooms/' + this.state.code).on('value', (s) => {
              this.setState({
                textContent: s.val().text
              })
            })

            db.ref('rooms/' + this.state.code).onDisconnect().remove()            
          })
        }
        
      } else {
        this.setState({display: "output"})
      }
    })
  }

  handleClick = () => {
    if (this.state.display === "output") {
      auth.signInWithPopup(provider).then(function(result) {
      }).catch((error) => {
        console.log("Error" + error.code)
      })
    }
  }

  handleChange = (e, type) => {
    if (type === "code") {
      this.setState({mobileCode: e.target.value})
    } else if(type === "content") {
      db.ref('rooms/' + this.state.code).set({
        text: e.target.value
      })
    }
  }

  joinRoom = () => {
      db.ref('rooms/' + this.state.mobileCode).once("value", snapshot => {
        if (snapshot.exists()) {
          this.setState({display: "input", code: this.state.mobileCode, device: "other"}, () => {
            db.ref('rooms/' + this.state.code).on('value', (s) => {
              this.setState({
                textContent: s.val().text
              })
            })
          })
        } else {
          alert('Room not found!')
        }
    })
  }

  signOut = () => {
    if (this.state.device === "other") {
      db.ref('rooms/' + this.state.code).off()
      this.setState({mobileCode: "", code: "", textContent: "", init: false, display: "output"})  
    } else {
      this.setState({
        display : "ouput",
        mobileCode : "",
        code: "",
        textContent: "",
        init: false,
        device: ""
      })
      auth.signOut()
      window.location.reload()
    }
  }

  render() {
    if (this.state.display === "input") {
      return (
        <div className="App">
          <div id="main">
            <div style={{marginBottom: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              <h1>PhoneLink</h1>
              <p>Send data between devices</p>
            </div>
            <textarea onChange={(e) => this.handleChange(e, "content")} value={this.state.textContent} id="text"></textarea>
            <div id="code-display">Code: {this.state.code}</div>
            <button id= "signout-button" onClick={() => this.signOut()} style={{position: "absolute", width: "100px", height: "40px"}} className="button">{this.state.device === "other" ? "Leave Room" : "Log Out"}</button>
          </div>
        </div>
      );
    } else if (this.state.display === "output") {
      return (
        <div className="App">
          <div id="main">
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              <h1>PhoneLink</h1>
              <p>Send data between devices</p>
              <button style={{marginTop: "15px", }} className="button" onClick={() => this.handleClick()}>Sign in</button>
            </div>
            <div style={{height: "1px", width: "70%", backgroundColor: "rgba(256, 256, 256, 0.5)", marginTop: "30px", marginBottom: "30px"}}></div>
            <p style={{marginBottom: "10px"}}>Join room:</p>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <input onChange={(e) => this.handleChange(e, "code")} value={this.state.mobileCode} id="mobile-code" placeholder="Enter code..."></input>
              <button onClick={() => this.joinRoom()} style={{marginLeft: "10px", width: "auto", paddingLeft: "15px", paddingRight: "15px"}} className="button">Enter</button>
            </div>
          </div>
          <a href="https://github.com/CharanSriram/PhoneLink_Alpha" id="info-section" style={{position: "relative", marginTop: "5px", maxWidth: "300px", color: "#394867"}}>This project was created by Charan Sriram</a>
        </div>
      );
    }
    return null
  }
}

export default App;
