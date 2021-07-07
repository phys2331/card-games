import logo from './logo.svg';
import './App.css';
import './matchingGame.css';
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"


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


      {/* TODO: Consider creating the grid using a for loop, not one by one. */}
      {/* So far the app should be rather responsive and adjust to diferent screen sizes. */}

        <Container className="gridContainer" fluid>

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

        </Container>

        </div>
        </body>


    </div>
  );
}

export default App;
