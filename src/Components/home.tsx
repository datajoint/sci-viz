import React from 'react';
import { Container, Row, Col, setConfiguration } from 'react-grid-system';
import TableView from './Table/TableView';

// Component imports

interface HomeProps {
  jwtToken: string;
}

setConfiguration({ defaultScreenClass: 'md', gridColumns: 12 });

/**
 * Main view for DJGUI App
 */
export default class Home extends React.Component<HomeProps> {

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col md={4}>
              <div>
              <TableView token={this.props.jwtToken} route='/query1'/>
              </div>
            </Col>
            <Col md={4}>
              <div>
              <TableView token={this.props.jwtToken} route='/query1'/>
              </div>
            </Col>
            <Col md={4}>
              <div>
              <TableView token={this.props.jwtToken} route='/query5'/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}