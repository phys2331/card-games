//import logo from './logo.svg';
import './App.css';
import './matchingGame.css';
import React, { useEffect, useRef } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import yaml from "js-yaml"
import Modal from "react-modal"
import Button from "react-bootstrap/Button"
import "katex/dist/katex.min.css";
import renderMathInElement from 'katex/dist/contrib/auto-render';

// fontawesome imports
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to create element that autorenders equations in text
function CardText(props) {
  const ref = useRef(); // create reference for use of renderMathInElement

  // every load of element, render math
  useEffect(() => {
    if (ref.current) {
      renderMathInElement(ref.current);
    }
  });

  return (<span ref={ref}>{props.text}</span>);
}

// Function to create cardmodal element (we only need one of these modals, any more is excessive)
function CardModal(props) {
  let innercontent;
  if (!props.card) { // if undefined
    innercontent = <div className="col-xl-12 colModalText">Undef</div>;
  } else if ('text' in props.card) {
    innercontent = (<div className="col-xl-12 colModalText">
      <div className="textModal">
        <CardText text={props.card['text']} />
      </div>
    </div>);
  } else if ('img' in props.card) {
    innercontent = (<div className="col-xl-12 colModalImage">
      <img src={props.card['img']} alt={props.card['alt-text']} className=" imageModal" />
    </div>);
  } 

  return (
    <Modal isOpen={props.show} className="modalContainer" overlayClassName="Overlay" >
      <div className="Modal">
        <div className="outerModalDiv">
          <Row className="row-flex justify-content-md-center modalRow">
            {innercontent}
            <div className="col-xl-12">
              <Button 
                size="lg" 
                onClick={e => { props.closeFunc(); }} 
                variant="primary btn-block">
                  Close
              </Button>
            </div>
          </Row>
        </div>
      </div>
    </Modal>
  );
}

//Function to create the cards as well as the playing grid
class CardBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cardContent: [], cardInfo: [], curGroup: -3, selected: 0, groupsFound: 0 };
    this.closeModal = this.closeModal.bind(this); // bind function for passing to CardModal element
  }

  // load information from yaml data, create order and status for cards
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

  // load data from yaml, when done call to initialize cards
  componentDidMount() {
    fetch('test.yaml')
      .then(response => response.text())
      .then(data => this.initializeCards(data))
      .catch(e => console.error('Couldn\'t read yaml file. The error was:\n', e));
  }

  // set all selected cards to the new status
  changeSelectedCards(newCards, newStatus) {
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].status === "selected") {
        newCards[i].status = newStatus;
      }
    }
  }

  // deal with a click on a card
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

  // change card to display on the modal
  openModal(card) {
    this.setState({
      showModal: true,
      cardOut: card
    });
  };

  // close modal by changing card to -1
  closeModal() {
    this.setState({
      showModal: false
    });
  };

  // get the current instructions
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

    // Create all cards and put in list
    for (let i = 0; i < this.state.cardInfo.length; i++) {
      let cardNum = this.state.cardInfo[i];
      let card = this.state.cardContent[cardNum.group].cards[cardNum.num];

      let innercontent;
      if ('text' in card) { // This manages the cards if all they contain is text
        innercontent = <Card.Text><CardText text={card['text']} /></Card.Text>;
      } else if ('img' in card) { // This manages the cards if they contain an image
        innercontent = <Card.Img src={card['img']} alt={card['alt-text']} />
      } else {
        console.log('Unrecognized card format:', card);
        innercontent = <Card.Text>{'UNRECOGNIZED:' + card}</Card.Text>
      }
      cardList.push(
        <div key={i} className="cardRender">
          <Card className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>
            {innercontent}
          </Card>

          <div className="ellipseBox" onClick={() => { this.openModal(card); }}>
            <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'Black' }} size="2x" className="ellipseIcon" />
          </div>
        </div>
      );
    }

    // split list of cards into rows
    while (cardList.length) {
      chunks.push(cardList.splice(0, 5));
    }

    // display entire block of cards, with instructions, cards, and modal
    return (<div>
      <CardModal show={this.state.showModal} card={this.state.cardOut} closeFunc={this.closeModal} />
      <div className='instructions'>{this.getInstructions()}</div>

      {chunks.map(chunk => (
        <Row className="row-flex justify-content-md-center" key={'Row'+chunk[0].key}>
          {chunk.map(item => <Col xl={2} lg={2} md={2} sm={12} xs={12} className="gridProp" key={'Cell' + item.key}>{item}</Col>)}
        </Row>
      ))}
    </div>);
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
        <div className="mainDiv">
          <CardBlock></CardBlock>
        </div>
    </div>
  );
}

Modal.setAppElement(document.getElementById('root')); // screen readers
export default App;
