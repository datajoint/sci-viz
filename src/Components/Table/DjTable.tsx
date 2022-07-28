import React from 'react'
import { Card, Descriptions, Table } from 'antd'
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

interface DjTableProps {
  token: string
  route: string
  name: string
  height: number
  restrictionList: Array<string>
}

interface DjTableState {
  data: djRecords
  dataAttributes: djAttributes
  numberOfTuples: number
  offset: number
  filter: Array<string>
}
//look at pharus/interface.py get_attributes() for payload
interface djAttributesArray {
  name: string
  type: string
  nullable: boolean
  default: string
  autoincriment: boolean
}
interface djAttributes {
  attributeHeaders: Array<string>
  attributes: {
    primary: Array<djAttributesArray>
    secondary: Array<djAttributesArray>
  }
  unique_values: Array<Array<number | null | bigint | boolean | string>>
}

interface djRecords {
  recordHeader: Array<string>
  records: Array<Array<number | null | bigint | boolean | string>>
  totalCount: number
}

/**
 * DjTable component
 */
export default class DjTable extends React.Component<
  DjTableProps,
  DjTableState
> {
  constructor(props: DjTableProps) {
    super(props)
    this.state = {
      data: { recordHeader: [], records: [[]], totalCount: 0 },
      dataAttributes: {
        attributeHeaders: [],
        attributes: { primary: [], secondary: [] },
        unique_values: [[]]
      },
      numberOfTuples: 5, //limit 
      offset: 1, //offset 
      filter: []
    }
    // this.parseTimestr = this.parseTimestr.bind(this)
    this.getRecords = this.getRecords.bind(this)
    this.getAttributes = this.getAttributes.bind(this)
    this.compileTable = this.compileTable.bind(this)
    this.updateFilter = this.updateFilter.bind(this)
  }

  handleChange(pagination: any, filters: Record<string, FilterValue | null>) {
    console.log(`typeof of pagination ${typeof pagination} + ${pagination}`)
    console.log(Object.getOwnPropertyNames(pagination))
    console.log(`typeof of filters ${typeof filters} + ${filters}`)
    console.log(`\n\n\n${JSON.stringify(filters)} string\n\n\n`)
    console.log(`\n\n\n${Object.getOwnPropertyNames(filters)} string\n\n\n`)
    let offset = pagination.current; 
    // let limit = pagination.pageSize

    // let filter = filters.

    this.setState({ offset: offset})
    // this.getRecords()
  }

  // setPageNumber(pageNumber: number) {
  //   if (pageNumber < 1 || pageNumber > this.state.maxPageNumber) {
  //     throw Error('Invalid pageNumber ' + pageNumber + ' requested')
  //   }

  //   this.setState({ currentPageNumber: pageNumber })
  // }

  // /**
  //  * Setter method for number of tuples per page
  //  * @param numberOfTuplesPerPage number of tuples per page to view
  //  */
  //  setNumberOfTuplesPerPage(numberOfTuplesPerPage: number) {
  //   if (numberOfTuplesPerPage < 0) {
  //     throw Error('Number of Tuples per page cannnot be less then 0')
  //   }
  //   this.setState({ numberOfTuplesPerPage: numberOfTuplesPerPage })
  // }


  getRecords(): Promise<djRecords> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    // if (this.props.restrictionList.length > 0) {
    //   apiUrl = apiUrl + '?'
    //   apiUrl = apiUrl + this.props.restrictionList.shift()
    //   while (this.props.restrictionList.length > 0) {
    //     apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
    //   }
    // }

    apiUrl = apiUrl + '?page=' + this.state.offset + '&limit=' + this.state.numberOfTuples;
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((result) => {
        return result.json()
      })
      .then((result) => {
        return result as Promise<djRecords>
      })
  }

  getAttributes(): Promise<djAttributes> {
    let apiUrlAttr =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
      this.props.route +
      '/attributes'
    return fetch(apiUrlAttr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((result) => {
        return result.json()
      })
      .then((result) => {
        return result as Promise<djAttributes>
      })
  }

  componentDidMount() {
    this.getRecords()
      .then((result) => {
        this.setState({ data: result })
      })
      .then(() => {
        return this.getAttributes()
      })
      .then((result) => {
        this.setState({ dataAttributes: result })
      })
  }

  componentDidUpdate(
    prevProps: DjTableProps,
    prevState: DjTableState
  ): void {
    if(prevState.offset !== this.state.offset){
      this.getRecords()
      .then((result) => {
        this.setState({ data: result })
      })
    }
  }

  updateFilter(value: string, record: string) {
    console.log(`${value} value, ${record} record`)
  }

  filterTable(value: string){
    console.log(`\n\n\nfilter that user has chosen ${value}\n\n\n`)
  }

  compileTable() {
    // could make an interface for these
    let columns: Array<{}> = []
    let data: Array<{}> = []

    let fullAttr = this.state.dataAttributes.attributes.primary.concat(
      this.state.dataAttributes.attributes.secondary
    )
    this.state.data.recordHeader.map((value: string, index: number) => {
      console.log(`filters ${this.state.dataAttributes.unique_values[index]}`)
      columns.push({title: value,
                    dataIndex: value, 
                    filters: this.state.dataAttributes.unique_values[index],
                    filterMultiple: false, 
                    }
    )})
    this.state.data.records.map(
      (value: (string | number | bigint | boolean | null)[], index: number) => {
        let tmp: {} = { key: index }
        value.map(
          (value: string | number | bigint | boolean | null, index: number) => {
            Object.assign(tmp, { [this.state.data.recordHeader[index]]: value })
          }
        )
        data.push(tmp)
      }
    )
    return (
      <Table
        columns={columns}
        dataSource={data}
        key={data.toString() + columns.toString()}
        onChange={this.handleChange.bind(this)}
        
        pagination={{
          total: this.state.data.totalCount,
          pageSize: this.state.numberOfTuples,
          current: this.state.offset,
        }}
      />
    )
  }
  // parseTimestr() {
  //   let fullAttr = this.state.dataAttributes.attributes.primary.concat(
  //     this.state.dataAttributes.attributes.secondary
  //   )
  //   for (let i in fullAttr) {
  //     if (fullAttr[i][1] === 'HH:MM:SS') {
  //       let newData = this.state.data
  //       newData.records[0][i] = TableAttribute.parseTimeString(
  //         newData.records[0][i]!.toString()
  //       )
  //       this.setState({ data: newData })
  //     } else if (
  //       fullAttr[i][1] === 'timestamp' ||
  //       fullAttr[i][1].includes('datetime')
  //     ) {
  //       let newData = this.state.data
  //       newData.records[0][i] = TableAttribute.parseDateTime(
  //         newData.records[0][i]!.toString()
  //       )
  //       this.setState({ data: newData })
  //     } else if (fullAttr[i][1] === 'date') {
  //       let newData = this.state.data
  //       newData.records[0][i] = TableAttribute.parseDate(
  //         newData.records[0][i]!.toString()
  //       )
  //       this.setState({ data: newData })
  //     }
  //   }
  // }
  render() {
    return (
      <Card
        style={{ width: '100%', height: this.props.height }}
        bodyStyle={{ height: '100%', overflowY: 'auto' }}
        hoverable={true}
      >
        {this.compileTable()}
      </Card>
    )
  }
}
