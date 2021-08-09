//import logo from './logo.svg';
import './App.css';
import './matchingGame.css';
import React, { useState } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import yaml from "js-yaml"
import Modal from "react-modal"
import Button from "react-bootstrap/Button"

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
    this.state = { cardContent: [], cardInfo: [], curGroup: -3, selected: 0, groupsFound: 0 };

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
    if (this.state.curGroup < 0) { // if first card in group selected
      newCardInfo[i].status = 'selected';
      newGroup = this.state.cardInfo[i].group;
      newCntSelected = 1;
    } else {
      if (this.state.curGroup !== this.state.cardInfo[i].group) { // wrong card
        this.changeSelectedCards(newCardInfo, "unselected");
        newGroup = -2;
        newCntSelected = 0;
      } else { // right card
        newCardInfo[i].status = 'selected';
        newCntSelected = this.state.selected + 1;
        if (newCntSelected === this.state.cardContent[this.state.curGroup].cards.length) {
          this.changeSelectedCards(newCardInfo, "matched");
          newCardInfo.sort((a, b) => b.status.localeCompare(a.status))
          let newGroupsFound = this.state.groupsFound + 1;
          this.setState({ groupsFound: newGroupsFound });
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

  getInstructions() {
    if (this.state.curGroup === -3) { // case for the very first instruction
      return `The goal of this game is to match the cards with related concepts. 
      You can do this by clicking sequentially on all the cards that belong together. 
      In this set of cards, there are ${this.state.cardContent.length} 
      groups of cards. To start, select any card.`;
    }
    if (this.state.curGroup === -2) { // case for when wrong card is selected
      return "Incorrect. This card is not related to the ones previously selected. Select a card.";
    }
    if (this.state.curGroup === -1) { // case for when a group is matched
      let groupsLeft = this.state.cardContent.length - this.state.groupsFound;
      if (groupsLeft === 0) {
        return "Well done! You've matched all of the cards."
      }
      return `Correct! There are ${groupsLeft} unmatched groups left. Select any unselected card.`;
    }
    let groupCardCount = this.state.cardContent[this.state.curGroup].cards.length;
    return `Selected ${this.state.selected} out of the ${groupCardCount} cards in this group.`;
  }

  render() {
    const cardList = [];
    const chunks = [];
    for (let i = 0; i < this.state.cardInfo.length; i++) {
      let cardGroup = this.state.cardInfo[i].group, cardNum = this.state.cardInfo[i].num;
      let card = this.state.cardContent[cardGroup].cards[cardNum];

      //This manages the cards if all they contain is text
      if ('text' in card) {
        cardList.push(

          <div className="cardRender">
            <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>

              <Card.Text>{card['text']}</Card.Text>


            </Card>

            <div className="ellipseBox" onClick={() => { this.showModalText(card['text']); }}>
              <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'Black' }} size="2x" className="ellipseIcon" />
            </div>


            <div>

              <Modal isOpen={this.state.showText} className="modalContainer" overlayClassName="Overlay" >

                <div className="Modal">

                  <div className="outerModalDiv ">


                    <Row className="row-flex  justify-content-md-center modalRow  ">


                      <div class="col-xl-12 colModalText" >
                        <div className=" textModal">
                          {this.state.cardOut}
                        </div>
                      </div>

                      <div class="col-xl-12  " >
                        <Button size="lg" onClick={e => { this.closeModal(); }} variant="primary btn-block">Close</Button>{' '}
                      </div>


                    </Row>

                  </div>

                </div>

              </Modal>

            </div>

          </div>


        );
      }
      //This manages the cards if they contain an image
      else if ('img' in card) {
        cardList.push(

          <div className="cardRender">
            <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>
              <Card.Img src={card['img']} alt={card['alt-text']} />
            </Card>

            <div className="ellipseBox" onClick={() => { this.showModalImage(card['img']); }}>
              <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'Black' }} size="2x" className="ellipseIcon" />
            </div>


            <div>

              <Modal isOpen={this.state.showImage} className="modalContainer" overlayClassName="Overlay" >

                <div className="Modal">

                  <div className="outerModalDiv ">


                    <Row className="row-flex  justify-content-md-center modalRow  ">


                      <div class="col-xl-12 colModalImage" >
                        <img src={this.state.cardOut} alt={card['alt-text']} className=" imageModal" />
                      </div>

                      <div class="col-xl-12  " >
                        <Button size="lg" onClick={e => { this.closeModal(); }} variant="primary btn-block">Close</Button>{' '}
                      </div>


                    </Row>

                  </div>

                </div>

              </Modal>

            </div>

          </div>
        );
      } else {
        console.log('Unrecognized card format:', card);
      }

    }

    while (cardList.length) {
      chunks.push(cardList.splice(0, 5));
    }

    return <div>

      <div className='instructions'>{this.getInstructions()}</div>

      
        {chunks.map(chunk => (
          <div className="mainReturnDiv">
          <Row className="row-flex justify-content-md-center">
            {chunk.map(item => <Col xl={2} lg={2} md={2} sm={12} xs={12} className="gridProp" >{item}</Col>)}
          </Row>
          </div>
        ))}

      

    </div>;
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
        <div className="mainDiv">

          <Row className="row-flex">
            <CardBlock></CardBlock>
          </Row>

        </div>

      </body>


    </div>
  );
}

export default App;
