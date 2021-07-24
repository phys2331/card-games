//import logo from './logo.svg';
import './App.css';
import './matchingGame.css';
import React, { useState } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import yaml from "js-yaml"
import Modal from "react-modal"

// fontawesome imports
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}





//Function to create the cards as well as the playing grid
class CardBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cardContent: [], cardInfo: [], curGroup: -1, selected: 0 };

  }




  initializeCards(data) {
    this.setState({ cardContent: yaml.loadAll(data) });
    const cardOrder = [];
    for (let i = 0; i < this.state.cardContent.length; i++) {
      for (let j = 0; j < this.state.cardContent[i].cards.length; j++) {
        cardOrder.push({ 'group': i, 'num': j, 'status': "unselected" });
      }
    }
    shuffleArray(cardOrder);
    this.setState({ cardInfo: cardOrder });
  }

  componentDidMount() {
    fetch('test.yaml')
      .then(response => response.text())
      .then(data => this.initializeCards(data))
      .catch(e => console.error('Couldn\'t read yaml file. The error was:\n', e));
  }

  changeSelectedCards(newCards, newStatus) { // set all selected cards to the new status
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].status === "selected") {
        newCards[i].status = newStatus;
      }
    }
  }

  handleClick(i) {
    if (this.state.cardInfo[i].status !== 'unselected') { // already selected or matched
      return;
    }
    var newGroup = this.state.curGroup, newCntSelected = this.state.selected;
    var newCardInfo = this.state.cardInfo.slice();
    if (this.state.curGroup === -1) { // if first card in group selected
      newCardInfo[i].status = 'selected';
      newGroup = this.state.cardInfo[i].group;
      newCntSelected = 1;
    } else {
      if (this.state.curGroup !== this.state.cardInfo[i].group) { // wrong card
        this.changeSelectedCards(newCardInfo, "unselected");
        newGroup = -1;
        newCntSelected = 0;
      } else { // right card
        newCardInfo[i].status = 'selected';
        newCntSelected = this.state.selected + 1;
        if (newCntSelected === this.state.cardContent[this.state.curGroup].cards.length) {
          this.changeSelectedCards(newCardInfo, "matched");
          newGroup = -1;
          newCntSelected = 0;
        }
      }
    }
    this.setState({ curGroup: newGroup, selected: newCntSelected, cardInfo: newCardInfo, });
  }


  state = {
    show: false,
  };

  showModalText(card) {
    console.log(card)
    console.log("IT WAS CLICKED")
    this.setState({
      showText: true,
      cardOut: card
    });
  };

  showModalImage(card) {
    console.log(card)
    console.log("IT WAS CLICKED")
    this.setState({
      showImage: true,
      cardOut: card
    });
  };


  closeModal() {
    console.log("IT WAS CLICKED")
    this.setState({
      showImage: false,
      showText: false
    });
  };

  createRowsAndColumns() {

  }

  render() {
    const cardList = [];
    const chunks = [];
    for (let i = 0; i < this.state.cardInfo.length; i++) {
      let cardGroup = this.state.cardInfo[i].group, cardNum = this.state.cardInfo[i].num;
      let card = this.state.cardContent[cardGroup].cards[cardNum];
      if ('text' in card) {
        cardList.push(

          <div className="cardRender">
            <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>

              <Card.Text>{card['text']}</Card.Text>
              

            </Card>

            <div className="ellipseBox" onClick = {() => {this.showModalText(card['text']);}}>
              <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'Black' }} size="2x" className="ellipseIcon" />
            </div>
            
            <Modal isOpen={this.state.showText} className="Modal" overlayClassName="Overlay" >
              <div>
              <p>
                {this.state.cardOut}
              </p>
              <button onClick = {e => {this.closeModal();}}> Close </button>
              </div>
            </Modal>

          </div>


        );
      } else if ('img' in card) {
        cardList.push(

          <div className="cardRender">
            <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>
              <Card.Img src={card['img']} alt={card['alt-text']} />
            </Card>

            <div className="ellipseBox" onClick = {() => {this.showModalImage(card['img']);}}>
              <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'Black' }} size="2x" className="ellipseIcon" />
            </div>

            <Modal isOpen={this.state.showImage}>
              <div>
              <p>
              <Card.Img src={this.state.cardOut} alt={card['alt-text']} />
              </p>
              <button onClick = {e => {this.closeModal();}}> Close </button>
              </div>
            </Modal>

          </div>
        );
      } else {
        console.log('Unrecognized card format:', card);
      }

    }

    while (cardList.length) {
      chunks.push(cardList.splice(0, 5));


    }

    return chunks.map(chunk => (

      <div>
        <Row className="row-flex row-flex justify-content-md-center"> {chunk.map(item => <Col xl={2} lg={2} md={2} sm={12} xs={12} className="gridProp" >{item}</Col>)}</Row>
      </div>


    ));
  }
}


function App() {
  return (
    <div className="App">
      <header className="topHeader">
        <div className="title">
          Matching Card Game (Work In Progess)
        </div>






      </header>
      <body>
        <div>

          <Row className="row-flex">
            <CardBlock></CardBlock>
          </Row>

        </div>
      </body>


    </div>
  );
}

export default App;
