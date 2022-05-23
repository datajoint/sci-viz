from pathlib import Path
import yaml
import os
import re

# Page String Components
page_header = """
import React, { Suspense } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import MenuBar from '../MenuBar/MenuBar'
import { Spin } from 'antd'
import './Page.css'

interface Page1Props {
  jwtToken: string;
}
interface Page1State {
  restrictionList: Array<string>
  store: RestrictionStore
}
// The key would be the channel the components are listening on and the array would be
// the record to restrict by
interface RestrictionStore {
  [key: string]: Array<string>
}
const ResponsiveGridLayout = WidthProvider(Responsive);
"""
export_header = """
  export default class Page1 extends React.Component<Page1Props, Page1State> {
      constructor(props: Page1Props) {
      super(props)
      this.state = {
        restrictionList: [],
        store: {},
      }
      this.updateRestrictionList = this.updateRestrictionList.bind(this)
      this.updateStore = this.updateStore.bind(this)
    }
    componentDidMount() {
      this.setState({
        restrictionList: new URLSearchParams(window.location.search)
          .toString()
          .split('&'),
      })
    }
    updateRestrictionList(queryParams: string): string {
      this.setState({
        restrictionList: new URLSearchParams(queryParams).toString().split('&'),
      })
      return queryParams
    }
    updateStore(key: string, record: Array<string>) {
      let myStore = this.state.store || { [key]: record }
      myStore[key] = record
      this.setState({ store: myStore })
    }
    render() {
      return (
        <div>
          <MenuBar />
          <div className='grid-container'>
            <ul className='grid-list'>"""
grid_header = """
              <li>
                <Suspense fallback={{<Spin size="default"/>}}>
                <ResponsiveGridLayout className="mygrid" rowHeight={{{row_height}}}
                  measureBeforeMount={{true}}
                  breakpoints={{{{lg: 1200, sm: 768}}}}
                  cols={{{{lg: {num_cols}, sm: 1}}}}
                  useCSSTransforms={{true}}>"""
table_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <TableView token={{this.props.jwtToken}} route='{route}' tableName='{component_name}' {link} {channel} updateRestrictionList={{this.updateRestrictionList}} updatePageStore={{this.updateStore}}/>
                  </div>"""
fullplotly_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <FullPlotly route='{route}' token={{this.props.jwtToken}} height={{{gridHeight}*{height}+({height}-1)*10}} restrictionList={{[...this.state.restrictionList]}} store={{Object.assign({{}}, this.state.store)}} {channelList}/>
                  </div>
"""
metadata_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <div className='metadataContainer'>
                      <Metadata token={{this.props.jwtToken}} route='{route}' name='{component_name}' restrictionList={{[...this.state.restrictionList]}} height={{{gridHeight}}}/>
                    </div>
                  </div>"""
image_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <Image token={{this.props.jwtToken}} route='{route}' restrictionList={{[...this.state.restrictionList]}} height={{{gridHeight}*{height}+({height}-1)*10}}/>
                  </div>
"""
mkdown_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <Markdown
                    content={{`{markdown}`}}
                    imageRoute={{{image_route}}}
                    height={{{gridHeight}*{height}+({height}-1)*10}}
                  />
                  </div>"""
slider_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <DjSlider
                    token={{this.props.jwtToken}}
                    route='{route}'
                    restrictionList={{[...this.state.restrictionList]}}
                    channel="{channel}"
                    updatePageStore={{this.updateStore}}
                    {channelList}
                    {store}
                  />
                  </div>"""
dropdown_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <Dropdown
                      height={{{gridHeight}*{height}+({height}-1)*10}}
                      payload={{{payload}}}
                      channel="{channel}"
                      updatePageStore={{this.updateStore}}
                    />
                  </div>"""
dropdown_query_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <DropdownQuery
                      height={{{gridHeight}*{height}+({height}-1)*10}}
                      channel="{channel}"
                      route='{route}'
                      token={{this.props.jwtToken}}
                      updatePageStore={{this.updateStore}}
                    />
                  </div>"""
radiobuttons_template = """
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                    <RadioButtons
                      height={{{gridHeight}*{height}+({height}-1)*10}}
                      payload={{{payload}}}
                      channel="{channel}"
                      updatePageStore={{this.updateStore}}
                    />
                  </div>"""
grid_footer = """
                </ResponsiveGridLayout>
                </Suspense>
              </li>"""
dynamic_grid = """
              <Suspense fallback={{<Spin size="default"/>}}>
              <li>
                <DynamicGrid route={{'{route}'}}
                             token={{this.props.jwtToken}}
                             columns={{{columns}}}
                             rowHeight={{{rowHeight}}}
                             componentList={{{componentList}}}
                             routeList={{{routeList}}}
                             queryParams={{[...this.state.restrictionList]}}
                             {channelList}
                             {store}/>
              </li>
              </Suspense>"""
export_footer = """
            </ul>
          </div>
        </div>
      )
    }
  }
"""

# Side Bar string components
MenuBar_header = """
export const MenuBarData = ["""
MenuBar_data = """
    {{
        title: '{page_name}',
        path: '{page_route}',
        cName: 'nav-text'
    }},"""

MenuBar_footer = """
]"""

# App.tsx string components
app_header = """
import React from 'react';
import './App.css';
import Login from './Components/Login/Login';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import NotFound from './Components/Errors/NotFound'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
"""


app_import_template = """
import {page_name} from './Components/Pages/{page_name}' """

app_export = """

window.onbeforeunload = () => '';

interface DJGUIAppProps {
}

interface DJGUIAppState {
  jwtToken: string; // Storage object for JWT token obtain after logging in successfully
  hostname: string; // Name of the database that the user is connected to
}

/**
 * React top level component for the GUI
 */
export default class App extends React.Component<DJGUIAppProps, DJGUIAppState> {
  constructor(props: DJGUIAppProps) {
    super(props);
    this.state = {
      jwtToken: '',
      hostname: ''
    };

    this.setJWTTokenAndHostName = this.setJWTTokenAndHostName.bind(this);
    this.getBasename = this.getBasename.bind(this)
  }

  /**
   * Setter function for jwt token and host name
   * @param jwt JWT token obtain after logging sucessfully from the backend
   * @param hostname Hostname of the database that is being connected to
   */
  setJWTTokenAndHostName(jwt: string, hostname: string) {
    this.setState({jwtToken: jwt, hostname: hostname});
  }
  getBasename(){
    if (window.location.href.split('/').length == 4){
      return ''
    }
    else {
      let arr = window.location.href.split('/').splice(3)
      arr.pop() // pop the empty string
      return ('/' + arr.join('/'))
    }
  }
"""

app_render_header = """
  render() {{
    return (
      <div>
        <Header text='{header_text}' imageRoute={{require('{header_image}')['default']}}/>
        <Router basename={{this.getBasename()}}>
          <div className='content'>
            <Switch>
              <Route exact path='/'>{{this.state.jwtToken !== '' ? <Redirect to='{first_page_route}'/> : <Redirect to='/login'/>}}</Route>
              <Route path='/login'>{{this.state.jwtToken !== '' ? <Redirect to='{first_page_route}'/> : <Login setJWTTokenAndHostName={{this.setJWTTokenAndHostName}} imageRoute={{{image_route}}}></Login>}}</Route>"""

app_render_header_nologin = """
  render() {{
    return (
      <div>
        <Header text='{header_text}' imageRoute={{require('{header_image}')['default']}}/>
        <Router basename={{this.getBasename()}}>
          <div className='content'>
            <Switch>
              <Route exact path='/'>{{<Redirect to='{first_page_route}'/>}}</Route>"""

app_render_route = """
              <Route path='{page_route}*'>{{this.state.jwtToken !== '' ? <{page_name} jwtToken={{this.state.jwtToken}}></{page_name}> : <Redirect to='/login'/>}}</Route>"""

app_render_route_nologin = """
              <Route path='{page_route}*'>{{<{page_name} jwtToken={{this.state.jwtToken}}></{page_name}>}}</Route>"""

app_render_footer = """
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </Router>
        <Footer/>
      </div>
    );
  }
}
"""

# spec_path = os.environ.get('API_SPEC_PATH')
spec_path = os.environ.get("DJSCIVIZ_SPEC_PATH")
side_bar_path = "src/Components/MenuBar/MenuBarData.tsx"
page_path = "src/Components/Pages/{page_name}.tsx"
app_path = "src/App.tsx"
with open(Path(spec_path), "r") as y, open(Path(side_bar_path), "w") as s, open(
    Path(app_path), "w"
) as app:
    values_yaml = yaml.load(y, Loader=yaml.FullLoader)
    pages = values_yaml["SciViz"]["pages"]
    s.write(MenuBar_header)
    # Crawl through the yaml file
    app.write(app_header)
    for page in pages.keys():
        app.write(app_import_template.format(page_name=page.replace(" ", "_")))
    used_app_render_header = (
        app_render_header
        if values_yaml["SciViz"]["auth"]
        else app_render_header_nologin
    )
    used_app_render = (
        app_render_route if values_yaml["SciViz"]["auth"] else app_render_route_nologin
    )
    app.write(
        app_export
        + (used_app_render_header).format(
            header_text=(
                "Powered by datajoint"
                if "header" not in values_yaml["SciViz"]
                else values_yaml["SciViz"]["header"]["text"]
            ),
            header_image=(
                "./logo.svg"
                if "header" not in values_yaml["SciViz"]
                else values_yaml["SciViz"]["header"]["image_route"]
            ),
            first_page_route=list(pages.values())[0]["route"],
            image_route=(
                'require("./logo.svg")["default"]'
                if "login" not in values_yaml["SciViz"]
                else f"require('{values_yaml['SciViz']['login']['image_route']}')['default']"
            ),
        )
    )
    for page_name, page in pages.items():
        with open(
            Path(page_path.format(page_name=page_name.replace(" ", "_"))), "w"
        ) as p:
            import_set = set()
            p.write(page_header + export_header)
            if "hidden" in page:
                if not page["hidden"]:
                    s.write(
                        MenuBar_data.format(
                            page_name=page_name, page_route=page["route"]
                        )
                    )
            else:
                s.write(
                    MenuBar_data.format(page_name=page_name, page_route=page["route"])
                )
            app.write(
                (used_app_render).format(
                    page_route=page["route"], page_name=page_name.replace(" ", "_")
                )
            )
            for grid in page["grids"].values():
                if grid["type"] == "dynamic":
                    component_list = []
                    route_list = []
                    for component_name, component in grid[
                        "component_templates"
                    ].items():
                        component_list.append(component["type"])
                        route_list.append(component["route"])
                    p.write(
                        dynamic_grid.format(
                            route=grid["route"],
                            columns=grid["columns"],
                            rowHeight=grid["row_height"],
                            componentList=component_list,
                            routeList=route_list,
                            channelList=(
                                f"channelList={{{grid['''channels''']}}}"
                                if "channels" in grid
                                else ""
                            ),
                            store=(
                                "store={Object.assign({}, this.state.store)}"
                                if "channels" in grid
                                else ""
                            ),
                        )
                    )
                    import_set.add(
                        "const DynamicGrid = React.lazy(() => import('../DynamicGrid'))"
                    )
                    continue
                p.write(
                    grid_header.format(
                        num_cols=grid["columns"], row_height=grid["row_height"]
                    )
                )
                for component_name, component in grid["components"].items():
                    if re.match(r"^markdown.*$", component["type"]):
                        p.write(
                            mkdown_template.format(
                                component_name=component_name,
                                markdown=component["text"].replace("`", "\`"),
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                gridHeight=grid["row_height"],
                                image_route=f"require('{component['image_route']}')['default']"
                                if "image_route" in component
                                else "''",
                            )
                        )
                        import_set.add(
                            "const Markdown = React.lazy(() => import('../Markdown'))"
                        )
                    elif re.match(r"^plot.*$", component["type"]):
                        p.write(
                            fullplotly_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                gridHeight=grid["row_height"],
                                height=component["height"],
                                width=component["width"],
                                route=component["route"],
                                channelList=(
                                    f"channelList={{{component['''channels''']}}}"
                                    if "channels" in component
                                    else ""
                                ),
                            )
                        )
                        import_set.add(
                            "const FullPlotly = React.lazy(() => import('../Plots/FullPlotly'))"
                        )
                    elif re.match(r"^metadata.*$", component["type"]):
                        p.write(
                            metadata_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                route=component["route"],
                                gridHeight=grid["row_height"],
                            )
                        )
                        import_set.add(
                            "const Metadata = React.lazy(() => import('../Table/Metadata'))"
                        )

                    elif re.match(r"^file:image.*$", component["type"]):
                        p.write(
                            image_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                route=component["route"],
                                gridHeight=grid["row_height"],
                            )
                        )
                        import_set.add(
                            "const Image = React.lazy(() => import('../Image'))"
                        )
                    elif re.match(r"^table.*$", component["type"]):
                        try:
                            link = f"link='{component['link']}'"
                        except KeyError:
                            link = ""
                        channel = (
                            f"channel='{component['channel']}'"
                            if "channel" in component
                            else ""
                        )
                        p.write(
                            table_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                route=component["route"],
                                link=link,
                                channel=channel,
                            )
                        )
                        import_set.add(
                            "const TableView = React.lazy(() => import('../Table/TableView'))"
                        )
                    elif re.match(r"^slider.*$", component["type"]):
                        p.write(
                            slider_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                route=component["route"],
                                channel=component["channel"],
                                channelList=(
                                    f"channelList={{{component['''channels''']}}}"
                                    if "channels" in component
                                    else ""
                                ),
                                store=(
                                    "store={Object.assign({}, this.state.store)}"
                                    if "channels" in component
                                    else ""
                                ),
                            )
                        )
                        import_set.add(
                            "const DjSlider = React.lazy(() => import('../Emitters/Slider'))"
                        )
                    elif re.match(r"^dropdown-static.*$", component["type"]):
                        p.write(
                            dropdown_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                channel=component["channel"],
                                payload=component["content"],
                                gridHeight=grid["row_height"],
                            )
                        )
                        import_set.add(
                            "const Dropdown = React.lazy(() => import('../Emitters/Dropdown'))"
                        )
                    elif re.match(r"^dropdown-query.*$", component["type"]):
                        p.write(
                            dropdown_query_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                channel=component["channel"],
                                route=component["route"],
                                gridHeight=grid["row_height"],
                            )
                        )
                        import_set.add(
                            "const DropdownQuery = React.lazy(() => import('../Emitters/DropdownQuery'))"
                        )
                    elif re.match(r"^radiobuttons.*$", component["type"]):
                        p.write(
                            radiobuttons_template.format(
                                component_name=component_name,
                                x=component["x"],
                                y=component["y"],
                                height=component["height"],
                                width=component["width"],
                                channel=component["channel"],
                                payload=component["content"],
                                gridHeight=grid["row_height"],
                            )
                        )
                        import_set.add(
                            "const RadioButtons = React.lazy(() => import('../Emitters/RadioButtons'))"
                        )
                p.write(grid_footer)
            p.write(export_footer)
            for string in import_set:
                p.write(string)
                p.write("\n")
    s.write(MenuBar_footer)
    app.write(app_render_footer)
print("using DJSCIVIZ_SPEC_PATH")
