import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: 10,
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    height: 480,
    justifyContent: 'flex-end',
    overflowY: 'hidden',
  },
  media: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflowY: 'hidden',
  },
  title: {
    lineHeight: 1,
  },
  link: {
    textDecoration:'none',
  },
};

const initPosts = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Breakfast',
    author: 'jill111',
    mainImage: {
      src: "../images/yeoman.png"
    },
    id: "1",
    source: "aaa",
    excerpt: "aaa"
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Tasty burger',
    author: 'pashminu',
    mainImage: {
      src: "../images/yeoman.png"
    },
    id: "2",
    source: "aaa",
    excerpt: "aaa"
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Camera',
    author: 'Danson67',
    mainImage: {
      src: "../images/yeoman.png"
    },
    id: "3",
    source: "aaa",
    excerpt: "aaa"
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Morning',
    author: 'fancycrave1',
    mainImage: {
      src: "../images/yeoman.png"
    },
    id: "4",
    source: "aaa",
    excerpt: "aaa"
  }
  ];


class PocketSquareGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: initPosts,
      nextPage: 0,
      size: 12,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  fetchData() {
    console.log('START FETCH FOR PAGE '+ this.state.nextPage);
    axios.get('http://188.166.174.189:28103/article/byUserId/58b1800dc9e77c0001d1d702/unread?page=' + this.state.nextPage + '&size=' + this.state.size)
      .then(res => {
        const posts = res.data;
        console.log(res);
        if (this.state.nextPage == 0) {
          this.setState({ posts: posts, size: this.state.size, nextPage: 1 });
        } else {
          this.setState({ posts: this.state.posts.concat(posts), size: this.state.size, nextPage: this.state.nextPage + 1 });
        }
      });
  }

  componentDidMount() {
    this.fetchData();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.fetchData();
      console.log('bottom reached');
    }
  }

  render() {
    const cols = 4;
    const rows = Math.floor(this.state.posts.length / cols);
    return (
      <div>
        {Array(rows).fill().map((_, i) => (
         <div style={styles.root}>
            <GridList style={styles.gridList} cellHeight='auto' padding={10} >
              {this.state.posts.slice(i*cols, (i+1)*cols).map((post) => (
                <PocketSquareCard post={post} key={post.id} />
              ))}
            </GridList>
          </div>
         ))}
      </div>
    );
  }
}

class PocketSquareCard extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <Card>
        <div style={styles.cardInner}>
          <CardMedia style={styles.media}>
            <img src={this.props.post.mainImage ? this.props.post.mainImage.src  : null} />
          </CardMedia>
          <a href={this.props.post.resolvedUrl} style={styles.link} target="_blank">
            <CardTitle title={this.props.post.title} subtitle={this.props.post.source} titleStyle={styles.title} />
          </a>
          <CardText>
            {this.props.post.excerpt}
          </CardText>
          <CardActions>
            <FlatButton label="@pocket" />
            <FlatButton label="mark as read" />
          </CardActions>
        </div>
      </Card>
    );
  }
};

const AppComponent = () => (
  <MuiThemeProvider>
    <PocketSquareGrid />
  </MuiThemeProvider>
);

AppComponent.defaultProps = {
};

export default AppComponent;
