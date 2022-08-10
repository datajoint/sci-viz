import React from 'react'
import { Card, Descriptions, Table } from 'antd'
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Link, Redirect, useHistory } from 'react-router-dom'

interface DjTableProps {
  token: string
  route: string
  name: string
  height: number
  restrictionList: Array<string>
  link?: string
}

interface DjTableState {
  data: djRecords
  dataAttributes: djAttributes
  numberOfTuples: number
  offset: number
  filter: Array<string>
  sorter: Array<string>
  keys: Array<string> | undefined
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
      filter: [],
      sorter: [],
      keys: undefined
    }
    // this.parseTimestr = this.parseTimestr.bind(this)
    this.getRecords = this.getRecords.bind(this)
    this.getAttributes = this.getAttributes.bind(this)
    this.compileTable = this.compileTable.bind(this)
    this.updateFilter = this.updateFilter.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  

  handleChange(pagination: any, filters: Record<string, FilterValue | null>, sorter: any) {
    // console.log(`typeof of pagination ${typeof pagination} + ${pagination}`)
    // console.log(Object.getOwnPropertyNames(pagination))
    // console.log(`typeof of filters ${typeof filters} + ${filters}`)
    // console.log(`\n\n\n${JSON.stringify(filters)} string\n\n\n`)
    // console.log(`typeof of sorter ${typeof sorter} + ${sorter}`)
    // console.log(JSON.stringify(sorter))
    // let filter = JSON.stringify(filters)

    // for (const entry in filters) {
    //   console.log(`this is the entry for filter ${entry}`);
    // }

    let filter = []

    let isFilterNull = true

    for(const key in filters){
        // console.log(`key: ${key} : value:${filters[key]}`)
        if(filters[key] !== null){
          filter.push(`&${key}=${filters[key]}`)
          isFilterNull = false
        }
    }

    let str = "&order="

    let sorterArr = []

    let isSorterNull = true

    // for(const key in sorter){
    //   console.log(`\n\n\nin sorter key: ${key} : value: ${sorter[key]}\n\n\n`)
    //   if(sorter[key] !== null && key === "field"){
    //     // str.concat(sorter[key])
    //     sorterArr.push(`${sorter[key]}`)
    //     isSorterNull = false
    //     // isNull = false
    //   }else if(sorter[key] !== null && key === "order"){
    //     // str.concat(' ', sorter[key])
    //     sorterArr.push(`${sorter[key]}`)
    //     isSorterNull = false
    //   }
    // }

    if(sorter["order"] !== null && sorter["field"] !== null){
      isSorterNull = false
      let sort = ""
      if(sorter["order"] == "ascend"){
        sort = "ASC"
      }else if (sorter["order"] == "descend") {
        sort = "DESC"
      }
      sorterArr.push(`${sorter["field"]} ${sort}`)
    }

    // console.log(`\n\n\n\n${str}\n\n\n\n`)

    // console.log(`filter array: ${filter}`)

    // console.log(`\n\n\n${JSON.stringify(filters)} string\n\n\n`)
    // console.log(`\n\n\n${Object.getOwnPropertyNames(filters)} string\n\n\n`)
    let offset = pagination.current; 
    // let limit = pagination.pageSize

    // let filter = filters.

    if(isFilterNull){
      this.setState({ offset: offset})
    }else{
      this.setState({ offset: offset, filter: filter})
    }

    if(isSorterNull){
      this.setState({ offset: offset})
    }else{
      this.setState({ offset: offset, sorter: sorterArr})
    }
    // this.getRecords()
  }

  getRecords(): Promise<djRecords> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route

    if(!this.state.sorter.join(",").includes('ASC') && !this.state.sorter.join(",").includes('DESC')){
      // console.log(`\n\n in if getRecords() ${this.state.sorter.join(",")}\n\n`)
      // console.log(`\n\n in if getRecords() ${this.state.sorter.join(",").includes('ASC')}\n\n`)
      // console.log(`\n\n in if getRecords() ${this.state.sorter.join(",").includes('DESC')}\n\n`)
      apiUrl = apiUrl + '?page=' + this.state.offset + '&limit=' + this.state.numberOfTuples;
    } else {
      // console.log(`\n\n in else getRecords() ${this.state.sorter.join(",").length}\n\n`)
      apiUrl = apiUrl + '?page=' + this.state.offset + '&limit=' + this.state.numberOfTuples + '&order=' + this.state.sorter.join(",");
    }

    if(this.state.filter.length !== 0){
      for (const key of this.state.filter){
        // console.log(`key: ${key} `)
        apiUrl = apiUrl + key
      }
    }
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
    if(prevState.offset !== this.state.offset || this.state.filter !== prevState.filter || this.state.sorter !== prevState.sorter){
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

  redirect() {
    let a_id = ""
    let b_id = ""
    let link = ""
    if(this.state.keys !== undefined){
      this.state.keys.forEach(function (val, i, array) {
        // let split = val.split('=')
        console.log(`\nval=${val}\n`)
        // if(split[0] == "a_id"){
        //   a_id = val
        // }else if(split[0] == "b_id"){
        //   b_id = val
        // }
        // if(i !== array.length - 1){
          link = link + "&" + val
        // }else {
          // link = link + val
        // }
      })
      console.log(`a_id=${a_id}\nb_id=${b_id}`)
      return (
        <Redirect to={{pathname:`/hiddenpage?${link}`}} />
      )
    } else {
      return (
        <div>test</div>
      )
    }
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
                    sorter: {
                      // compare: (a: any, b: any) => a.value - b.value
                      }
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
        onRow={(record: any, rowIndex: number | undefined) => { 
          // console.log(`record within onRow: ${JSON.stringify(record)}\n rowIndex: ${rowIndex}\n`)
          for (const property in record){
            // console.log(`${property}: ${record[property]}`);
          }
          return { 
            // onClick: (e) => 
            onClick: event => {
              event.stopPropagation();
              let keysArr: string[] = []
              // console.log("\nonRow onClick\n", event.target, record, rowIndex);
              this.state.dataAttributes.attributes.primary.map( (value: any, index: number) => {
                // array[0]
                console.log(`\n\ntest console${value[0]} = ${record[value[0]]}\n\n`)
                keysArr.push(`${value[0]}=${record[value[0]]}`)
              }
              )
              // keysArr.push(`a_id=${record.a_id}`)
              // keysArr.push(`b_id=${record.b_id}`)
              this.setState({keys: keysArr})
              console.log(`\n${this.state.keys}`)
              // window.history.pushState(data, '', `/hiddenpage/hiddenpage/?a_id=${record['a_id']}&b_id=${record['b_id']}`)
              // <Redirect to={{pathname:"/hiddenpage"}} />
              // this.state.history.push(`/hiddenpage/?a_id=${record['a_id']}&b_id=${record['b_id']}`)
              // window.location.href = `/hiddenpage/?a_id=${record['a_id']}&b_id=${record['b_id']}`;
            }
              // {window.history.pushState(data, '', `/hiddenpage/?a_id=${record['a_id']}`)}
          };
        }}
        pagination={{
          total: this.state.data.totalCount,
          pageSize: this.state.numberOfTuples,
          current: this.state.offset,
        }}
      />
    )
  }
 
  render() {
    return (
      <Card
        style={{ width: '100%', height: this.props.height }}
        bodyStyle={{ height: '100%', overflowY: 'auto' }}
        hoverable={true}
      >
        {this.redirect()}
        {this.compileTable()}
      </Card>
    )
  }
}
