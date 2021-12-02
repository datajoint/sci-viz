import React from "react";
import "./Metadata.css";
interface MetadataProps {
  token: string;
  route: string;
  name: string;
  restrictionList: Array<string>;
}

interface MetadataState {
  data: any;
}

/**
 * Metadata component
 */
export default class Metadata extends React.Component<
  MetadataProps,
  MetadataState
> {
  constructor(props: MetadataProps) {
    super(props);
    this.state = {
      data: { recordHeader: [], records: [], totalCount: 0 },
    };
  }

  componentDidMount() {
    let apiUrl =
      `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route;
    if (this.props.restrictionList.length > 0) {
      apiUrl = apiUrl + "?";
      apiUrl = apiUrl + this.props.restrictionList.shift();
      while (this.props.restrictionList.length > 0) {
        apiUrl = apiUrl + "&" + this.props.restrictionList.shift();
      }
    }
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        this.setState({
          data: {
            recordHeader: result.recordHeader,
            records: result.records[0],
            totalCount: result.totalCount,
          },
        });
      });
  }

  render() {
    return (
      <tbody className="metadata">
        <th className="metadata-name">{this.props.name}</th>
        {this.state.data.records.map((record: any, index: number) => {
          return (
            <tr>
              <td>{this.state.data.recordHeader[index]}</td>
              <td>{record}</td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}
