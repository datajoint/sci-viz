from pathlib import Path
import yaml
import os

# Page String Components
page_header = '''
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TableView from '../Table/TableView';
import ReactMarkdown from 'react-markdown';
import SideBar from '../SideBar/SideBar';
import './Page.css'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {solarizedlight} from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Page1Props {
  jwtToken: string;
}
const ResponsiveGridLayout = WidthProvider(Responsive);
'''
export_header = '''
  export default class Page1 extends React.Component<Page1Props> {
    render() {
      return (
        <div>
          <div className='grid-container'>
            <SideBar />
            <ul className='grid-list'>'''
grid_header = '''
              <li>
                <ResponsiveGridLayout className="mygrid" rowHeight={{{row_height}}}
                  measureBeforeMount={{false}}
                  breakpoints={{{{lg: 1200, sm: 768}}}}
                  cols={{{{lg: {num_cols}, sm: 1}}}}
                  useCSSTransforms={{true}}>'''
table_template = '''
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <TableView token={{this.props.jwtToken}} route='{route}' tableName='{component_name}'/>
                  </div>'''
mkdown_template = '''
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <div className='markdownContainer'>
                    <ReactMarkdown className='markdown' remarkPlugins={{[remarkGfm]}}
                    children={{`{markdown}`}}
                    components={{{{
                        code({{node, inline, className, children, ...props}}) {{
                            const match = /language-(\\w+)/.exec(className || '')
                            return !inline && match ? (
                            <SyntaxHighlighter
                                children={{String(children).replace(/\\n$/, '')}}
                                style={{solarizedlight}}
                                language={{match[1]}}
                                PreTag="div"
                            />
                            ) : (
                            <code style={{{{background: 'rgb(222,222,222)', color: 'red'}}}} className={{className}} {{...props}}>
                                {{children}}
                            </code>
                            )
                        }}
                        }}}}
                    />
                  </div>
                  </div>'''

grid_footer = '''
                </ResponsiveGridLayout>
              </li>'''
export_footer = '''
            </ul>
          </div>
        </div>
      )
    }
  }
'''

# Side Bar string components
sidebar_header = '''
export const SideBarData = ['''
sidebar_data = '''
    {{
        title: '{page_name}',
        path: '{page_route}',
        cName: 'nav-text'
    }},'''

sidebar_footer = '''
]'''

# App.tsx string components
app_header = '''
import React from 'react';
import './App.css';
import Login from './Components/Login/Login';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import NotFound from './Components/Errors/NotFound'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
'''


app_import_template = '''
import {page_name} from './Components/Pages/{page_name}' '''

app_export = '''

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
  }

  /**
   * Setter function for jwt token and host name
   * @param jwt JWT token obtain after logging sucessfully from the backend
   * @param hostname Hostname of the database that is being connected to
   */
  setJWTTokenAndHostName(jwt: string, hostname: string) {
    this.setState({jwtToken: jwt, hostname: hostname});
  }
'''

app_render_header = '''
  render() {{
    return (
      <div>
        <Header></Header>
        <Router>
          <div className='content'>
            <Switch>
              <Route exact path='/'>{{this.state.jwtToken !== '' ? <Redirect to='{first_page_route}'/> : <Redirect to='/login'/>}}</Route>
              <Route path='/login'>{{this.state.jwtToken !== '' ? <Redirect to='{first_page_route}'/> : <Login setJWTTokenAndHostName={{this.setJWTTokenAndHostName}}></Login>}}</Route>'''

app_render_route = '''
              <Route path='{page_route}'>{{this.state.jwtToken !== '' ? <{page_name} jwtToken={{this.state.jwtToken}}></{page_name}> : <Redirect to='/login'/>}}</Route>'''

app_render_footer = '''
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </Router>
        <Footer></Footer>
      </div>
    );
  }
}
'''

# spec_path = os.environ.get('API_SPEC_PATH')
spec_path = os.environ.get('FRONTEND_SPEC_PATH')
side_bar_path = 'src/Components/SideBar/SideBarData.tsx'
page_path = 'src/Components/Pages/{page_name}.tsx'
app_path = 'src/App.tsx'
with open(Path(spec_path), 'r') as y, \
     open(Path(side_bar_path), 'w') as s, \
     open(Path(app_path), 'w') as app:
    values_yaml = yaml.load(y, Loader=yaml.FullLoader)
    pages = values_yaml['SciViz']['pages']
    s.write(sidebar_header)
    # Crawl through the yaml file
    app.write(app_header)
    for page in pages.keys():
        app.write(app_import_template.format(page_name=page))
    app.write(app_export + app_render_header.format(first_page_route=list(pages.values())[0]['route']))
    for page_name, page in pages.items():
        with open(Path(page_path.format(page_name=page_name)), 'w') as p:
            p.write(page_header + export_header)
            s.write(sidebar_data.format(page_name=page_name, page_route=page['route']))
            app.write(app_render_route.format(page_route=page['route'], page_name=page_name))
            for grid in page['grids'].values():
                p.write(grid_header.format(num_cols=grid['columns'],
                                           row_height=grid['row_height']))
                for component_name, component in grid['components'].items():
                    if component['type'] == 'markdown':
                        p.write(mkdown_template.format(component_name=component_name,
                                                       markdown=component['text'].replace('`', '\`'),
                                                       x=component['x'],
                                                       y=component['y'],
                                                       height=component['height'],
                                                       width=component['width']))
                        continue
                    p.write(table_template.format(component_name=component_name,
                                                  x=component['x'],
                                                  y=component['y'],
                                                  height=component['height'],
                                                  width=component['width'],
                                                  route=component['route']))
                p.write(grid_footer)
            p.write(export_footer)
    s.write(sidebar_footer)
    app.write(app_render_footer)
print('using FRONTEND_SPEC_PATH')
