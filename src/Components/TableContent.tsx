import React, {RefObject} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight, faChevronLeft, faStepBackward, faStepForward, faFilter, faPlusCircle, faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import Filter from './Filter/Filter'
import TableAttributesInfo from './DataStorageClasses/TableAttributesInfo';
import TableAttributeType from './enums/TableAttributeType'
import BasicLoadingIcon from './LoadingAnimation/BasicLoadingIcon';
import Restriction from './DataStorageClasses/Restriction'

import './TableContent.css'

enum TableActionType {
  FILTER
}

interface TableContentProps {
  token: string;
  selectedSchemaName: string;
  selectedTableName: string;
  contentData: Array<any>; // Array of tuples obtain from the fetch of a table. Type any used here as there are many possible types with all the available via fetching the actual tuples
  totalNumOfTuples: number;
  currentPageNumber: number;
  maxPageNumber: number;
  tuplePerPage: number;
  tableAttributesInfo?: TableAttributesInfo; // A TableAttributeInfo object that contains everything about both primary and secondary attributes of the table
  setPageNumber: (pageNumber: number) => void;
  setNumberOfTuplesPerPage: (numberOfTuplesPerPage: number) => void;
  fetchTableContent: () => void; // Callback function to tell the parent component to update the contentData
  setRestrictions: (restrictions: Array<Restriction>) => void;
}

interface TableContentState {
  currentSelectedTableActionMenu: TableActionType;
  hideTableActionMenu: boolean;
  showWarning: boolean; // text warning when duplicate selection is made for delete/update, most likely to be take out once disable checkbox feature is finished
  isDisabledCheckbox: boolean; // tells the UI to disable any other checkboxes once there is already a selection in delete/update mode
  dragStart: number; // part of table column resizer feature
  resizeIndex?: number; // part of table column resizer feature
  isWaiting: boolean; // tells the UI to display loading icon while insert/update/delete are in action
  newHeaderWidths: Array<number>; // list of table column header width after user resizes
  initialTableColWidths: Array<number>; // list of initial table column width on load
  headerRowReference: RefObject<HTMLTableRowElement>;
  tuplesReference: Array<RefObject<HTMLTableRowElement>>;
}

/**
 * Component to handle rendering of the tuples as well as Filter, Insert, Update, and Delete subcomponents
 * 
 */
export default class TableContent extends React.Component<TableContentProps, TableContentState> {  
  constructor(props: TableContentProps) {
    super(props);
    this.constructTupleReferenceArray = this.constructTupleReferenceArray.bind(this);

    this.state = {
      currentSelectedTableActionMenu: TableActionType.FILTER,
      hideTableActionMenu: true,
      showWarning: false,
      isDisabledCheckbox: false,
      newHeaderWidths: [],
      dragStart: 0,
      resizeIndex: undefined,
      isWaiting: false,
      initialTableColWidths: [],
      headerRowReference: React.createRef(),
      tuplesReference: this.constructTupleReferenceArray()
    }

    this.getCurrentTableActionMenuComponent = this.getCurrentTableActionMenuComponent.bind(this);
    this.goToFirstPage = this.goToFirstPage.bind(this);
    this.goToLastPage = this.goToLastPage.bind(this);
    this.goForwardAPage = this.goForwardAPage.bind(this);
    this.goBackwardAPage = this.goBackwardAPage.bind(this);
    this.handleNumberOfTuplesPerPageChange = this.handleNumberOfTuplesPerPageChange.bind(this);
  }

  /**
   * Reset the table action sub menu selection upon a new table selection
   * @param prevProps 
   * @param prevState 
   */
  componentDidUpdate(prevProps: TableContentProps, prevState: TableContentState) {
    // Check if the tuplePerPage change, if so update tupleReferenceArray
    if (prevProps.tuplePerPage !== this.props.tuplePerPage) {
      this.setState({tuplesReference: this.constructTupleReferenceArray()});
    }

    // Break if the the selectedTable did not change
    if (prevProps.selectedTableName === this.props.selectedTableName) {
      return;
    }

    // Reset TableActionview
    this.setState({currentSelectedTableActionMenu: TableActionType.FILTER, hideTableActionMenu: true});
  }

  /**
   * Helper function to construct the ReactRef arrays for the number of tuples shown per page
   * @returns an Array of RefObject for each of the entry in the table on the current page
   */
  constructTupleReferenceArray() {
    let tuplesReference: Array<RefObject<HTMLTableRowElement>> = [];
    for (let i = 0; i < this.props.tuplePerPage; i++) {
      tuplesReference.push(React.createRef());
    }

    return tuplesReference;
  }

  /**
   * Function to handle the hiding/showing of the sub menus including dealing with switching between the table actions sub menu
   * @param tableActionMenu The tableActionMenu that was clicked on
   */
  setCurrentTableActionMenu(tableActionMenu: TableActionType) {
    if (this.state.currentSelectedTableActionMenu === tableActionMenu) {
      // Toggle hiding and showing
      this.setState({hideTableActionMenu: !this.state.hideTableActionMenu});
    } 
    else {
      // Switch to the new tableActionMenu
      this.setState({hideTableActionMenu: false, currentSelectedTableActionMenu: tableActionMenu});
    }
  }

  /**
   * Call back function for goToFirstPage button
   */
  goToFirstPage() {
    this.props.setPageNumber(1);
  }

  /**
   * Call back function for goToLastPage button
   */
  goToLastPage() {
    this.props.setPageNumber(this.props.maxPageNumber);
  }

  /**
   * Call back function for goForwardAPage button
   */
  goForwardAPage() {
    if (this.props.currentPageNumber !== this.props.maxPageNumber) {
      this.props.setPageNumber(this.props.currentPageNumber + 1);
    }
  }

  /**
   * Call back function for goBackwardAPage button
   */
  goBackwardAPage() {
    if (this.props.currentPageNumber !== 1) {
      this.props.setPageNumber(this.props.currentPageNumber - 1);
    } 
  }

  /**
   * Switching return code based this.state.currentSelectedTableActionMenu. Mainly used in the render() function below
   */
  getCurrentTableActionMenuComponent() {
    return(
      <div className="actionMenuContainer">
        <div className={this.state.currentSelectedTableActionMenu === TableActionType.FILTER ? 'visable-action-menu-container' : 'hidden-action-menu-container'}>
          <Filter 
            tableAttributesInfo={this.props.tableAttributesInfo}
            setRestrictions={this.props.setRestrictions}
          />
        </div>
      </div>
    )
  }

  
  /**
   * Call back for when the user change the number of tupples to show per page
   * @param event Value should be the number in string format
   */
  handleNumberOfTuplesPerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.setNumberOfTuplesPerPage(parseInt(event.target.value));
  }

  /**
   * Function to get the list of primary attributes for rendering
   */
  getPrimaryKeys(): Array<string> {
    let primaryKeyList: Array<string> = [];

    if (this.props.tableAttributesInfo === undefined) {
      return primaryKeyList;
    }
    for (let primaryAttribute of this.props.tableAttributesInfo.primaryAttributes) {
      primaryKeyList.push(primaryAttribute.attributeName);
    }

    return primaryKeyList;
  }

  /**
   * Function to get the list of secondary attributes for rendering
   */
  getSecondaryKeys(): Array<string> {
    let secondaryKeyList: Array<string> = [];

    if (this.props.tableAttributesInfo === undefined) {
      return secondaryKeyList;
    }
    for (let secondaryAttribute of this.props.tableAttributesInfo.secondaryAttributes) {
      secondaryKeyList.push(secondaryAttribute.attributeName);
    }

    return secondaryKeyList;
  }

  /**
   * Check if the current table has blob attributes
   */
  checkIfTableHasNonNullableBlobs(): boolean {
    if (this.props.tableAttributesInfo === undefined) {
      return false;
    }
    
    for (let tableAttribute of this.props.tableAttributesInfo?.primaryAttributes) {
      if (tableAttribute.attributeType === TableAttributeType.BLOB) {
        return true;
      }
    }

    // Check secondary attributes
    for (let tableAttribute of this.props.tableAttributesInfo?.secondaryAttributes) {
      if (tableAttribute.attributeType === TableAttributeType.BLOB && tableAttribute.nullable) {
        return true;
      }
    }

    return false;
  }

  /**
   * Handle button rednering with disable feature for Insert Update or Delete based on the table type and return the buttons accordingly
   */
  getTableActionButtons() {
    return(
      <div className="content-controllers">
        <button onClick={() => this.setCurrentTableActionMenu(TableActionType.FILTER)} className={this.state.currentSelectedTableActionMenu === TableActionType.FILTER && !this.state.hideTableActionMenu ? 'selectedButton' : ''}><FontAwesomeIcon className="menuIcon filter" icon={faFilter} /><span>Filter</span></button>
      </div>
    )
  }

  /**
   * Function to set the new adjusted width (TODO: fix to make sure the fix is for each column using reference)
   * @param difference // the distance the user dragged the column divider handle
   */
  setNewHeaderWidths(difference: number) {
    if (this.state.newHeaderWidths.length > 0 && difference !== 0) {
      let newWidthsCopy = this.state.newHeaderWidths
      if (this.state.resizeIndex !== undefined) {
        newWidthsCopy[this.state.resizeIndex] = this.state.newHeaderWidths[this.state.resizeIndex] + difference
        this.setState({newHeaderWidths: newWidthsCopy});
      }
    }
    else {
      this.setState({newHeaderWidths: this.state.initialTableColWidths})
    }
  }

  /**
   * Listens for when cell border is selected and stores the index of the column and mouse start position
   * @param event
   * @param colIndex 
   */
  cellResizeMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, colIndex: number) {
    this.setState({dragStart: event.clientX, resizeIndex: colIndex})
  }

  /**
   * Updates the distance the user drags the table column divider
   * @param event 
   */
  cellResizeMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (this.state.dragStart) {
      // use the drag distance to calculate the new width
      let dragDistance = event.pageX - this.state.dragStart
      this.setNewHeaderWidths(dragDistance);

      // update the new start
      this.setState({dragStart: event.clientX})
    }
  }

  /**
   * Listens for when user is done resizing the column, resets drag position stats
   * @param event 
   */
  cellResizeMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // reset column drag stats
    this.setState({dragStart: 0, resizeIndex: undefined})
  }
  
  /**
   * Tells the element how to style width of the given table column index
   * @param colIndex 
   */
  getCellWidth(colIndex: number) {
    if (this.state.resizeIndex === colIndex && this.state.newHeaderWidths[colIndex]) {
      return {
        width: this.state.newHeaderWidths[colIndex] + 'px'
      }
    }
    else if (this.state.resizeIndex !== colIndex && this.state.newHeaderWidths[colIndex]) {
      return {
        width: this.state.newHeaderWidths[colIndex] + 'px'
      }
    } 
    else {
      return {
        width: this.state.initialTableColWidths[colIndex] // default
      }
    }
  }

  
  render() {
    return(
      <div className="table-content-viewer">
        <div className="content-view-header table-header">
          <h4 className="table-name">{this.props.selectedTableName}</h4>
          {this.getTableActionButtons()}
        </div>
        {this.state.hideTableActionMenu ? '' : <this.getCurrentTableActionMenuComponent/>}
        <div className="content-view-area">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="headerRow" onMouseMove={(event) => {this.cellResizeMouseMove(event)}} onMouseUp={(event) => {this.cellResizeMouseUp(event)}}　ref={this.state.headerRowReference}>
                  {this.getPrimaryKeys().map((attributeName, index) => {
                    return(
                      <th key={attributeName} className="headings">
                        <div className="headerContent primary">{attributeName}</div>
                      </th>
                    )
                  })}
                  {this.getSecondaryKeys().map((attributeName, index) => {
                    return(
                      <th key={attributeName} className="headings">
                        <div className="headerContent secondary" style={{color: 'inherit'}}>{attributeName}</div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
              {this.props.contentData.map((entry: any, tupleIndex: number) => {
                // creating reference for each body column to track the width
                return (
                  <tr key={entry} className="tableRow" onMouseMove={(event) => {this.cellResizeMouseMove(event)}} onMouseUp={(event) => {this.cellResizeMouseUp(event)}}　ref={this.state.tuplesReference[tupleIndex]}>
                    {entry.map((column: any, index: number) => {
                      return (
                        <td key={`${column}-${index}`} className="tableCell">{column} 
                        </td>)
                    })
                    }</tr>)
                })}
              </tbody>
            </table>
          </div>
            <div className="paginator">
              <p>Total Table Entries: {this.props.totalNumOfTuples}</p>
              <div className="number-of-rows-per-page-input">
                <p>Number of row per page</p>
                <input type='number' value={this.props.tuplePerPage} onChange={this.handleNumberOfTuplesPerPageChange}></input>
              </div>
              {Object.entries(this.props.contentData).length ?
                <div className="controls">
                  <FontAwesomeIcon className={true ? "backAll icon" : "backAll icon disabled"} icon={faStepBackward} onClick={() => this.goToFirstPage()} />
                  <FontAwesomeIcon className={true  ? "backOne icon" : "backOne icon disabled"} icon={faChevronLeft} onClick={() => this.goBackwardAPage()} />
                  Page: ({this.props.currentPageNumber + ' / ' + this.props.maxPageNumber})
                  <FontAwesomeIcon className={true  ? "forwardOne icon" : "forwardOne icon disabled"} icon={faChevronRight} onClick={() => this.goForwardAPage()} />
                  <FontAwesomeIcon className={true  ? "forwardAll icon" : "forwardAll icon disabled"} icon={faStepForward} onClick={() => this.goToLastPage()} />
                </div>
                : ''
              }
            </div>
        </div>
        {this.state.isWaiting ? (
          <div className="loadingBackdrop">
            <div className="loadingPopup">
              <BasicLoadingIcon size={80} />
            </div>
          </div>
        ) : ''}
      </div>
    )
  }
}