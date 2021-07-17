//import logo from './logo.svg';
import './App.css';
import './matchingGame.css';
import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import yaml from "js-yaml"


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
    this.state = { cardContent: [], cardInfo: [], curGroup: -1, selected: 0};
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
        <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>
          <Card.Text>{card['text']}</Card.Text>
        </Card>);
      } else if ('img' in card) {
        cardList.push(
        <Card key={i} className={this.state.cardInfo[i].status} onClick={() => this.handleClick(i)}>
          <Card.Img src={card['img']} alt={card['alt-text']} />
        </Card>);
      } else {
        console.log('Unrecognized card format:', card);
      }

    }

    while (cardList.length) {
      chunks.push(cardList.splice(0, 5));


    }

    return chunks.map(chunk => (

      
      <Row className="row-flex row-flex justify-content-md-center"> {chunk.map(item => <Col xl={2} lg={2} md={2} sm={12} xs={12} className="gridProp" >{item}</Col>)}</Row> 
      

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
          {/* TODO: Consider creating the grid using a for loop, not one by one. */}
          {/* So far the app should be rather responsive and adjust to diferent screen sizes. */}

          {/*<Container className="gridContainer" fluid>
          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">1</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">2</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">3</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">4</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">5</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">6</Col>
          </Row>

          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">7</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">8</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">9</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">10</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">11</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">12</Col>
          </Row>

          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">13</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">14</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">15</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">16</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">17</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">18</Col>
          </Row>

          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">19</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">20</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">21</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">22</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">23</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">24</Col>
          </Row>

          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">25</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">26</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">27</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">28</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">29</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">30</Col>
          </Row>

          <Row className="row-flex">
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">31</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">32</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">33</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">34</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">35</Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2} className="gridProp">36</Col>
          </Row>

        </Container>*/}

        </div>
      </body>


    </div>
  );
}

export default App;
