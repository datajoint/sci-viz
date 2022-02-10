import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import FullPlotly from './Plots/FullPlotly'
import Metadata from './Table/Metadata'

interface DynamicGridProps {
  route: string
  token: string
  columns: number
  rowHeight: number
  componentList: Array<string>
  routeList: Array<string>
}

interface DynamicGridState {
  data: djRecords
}

interface djRecords {
  recordHeader: Array<string>
  records: Array<Array<number | null | bigint | boolean | string>>
  totalCount: number
}

const ResponsiveGridLayout = WidthProvider(Responsive)

/**
 * DynamicGrid component
 */
export default class DynamicGrid extends React.Component<
  DynamicGridProps,
  DynamicGridState
> {
  constructor(props: DynamicGridProps) {
    super(props)
    this.state = {
      data: { recordHeader: [], records: [[]], totalCount: 0 },
    }
  }

  componentDidMount() {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    fetch(apiUrl, {
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
        this.setState({
          data: {
            recordHeader: result.recordHeader,
            records: result.records,
            totalCount: result.totalCount,
          },
        })
      })
  }

  render() {
    return (
      <ResponsiveGridLayout
        className="mygrid"
        rowHeight={this.props.rowHeight}
        measureBeforeMount={false}
        breakpoints={{ lg: 1200, sm: 768 }}
        cols={{ lg: this.props.columns, sm: 1 }}
        useCSSTransforms={true}
      >
        {this.state.data.records.map(
          (
            record: Array<number | null | bigint | boolean | string>,
            index: number
          ) => {
            let restrictionList: Array<string>
            restrictionList = []
            for (const i in this.state.data.recordHeader) {
              restrictionList.push(
                this.state.data.recordHeader[i].toString() +
                  '=' +
                  record[i]!.toString()
              )
            }
            // if restrictionList is empty that means that the data is empty/unfetched
            // which means that we should not render anything
            if (restrictionList.length == 0) {
              return <div></div>
            }
            return (
              <div
                key={index}
                data-grid={{
                  x: index % this.props.columns,
                  y: Math.floor(index / this.props.columns),
                  w: 1,
                  h: 1,
                  static: true,
                }}
              >
                <div className="plotContainer">
                  {this.props.componentList.map(
                    (componentType: string, compListIndex: number) => {
                      let restrictionListCopy = [...restrictionList]
                      if (componentType.match(/^plot.*$/)) {
                        return (
                          <FullPlotly
                            route={this.props.routeList[compListIndex]}
                            token={this.props.token}
                            restrictionList={restrictionListCopy}
                            height="fitcontent"
                          />
                        )
                      }
                      if (componentType.match(/^metadata.*$/)) {
                        return (
                          <Metadata
                            name="Metadata"
                            route={this.props.routeList[compListIndex]}
                            token={this.props.token}
                            restrictionList={restrictionListCopy}
                          />
                        )
                      }
                    }
                  )}
                </div>
              </div>
            )
          }
        )}
      </ResponsiveGridLayout>
    )
  }
}
