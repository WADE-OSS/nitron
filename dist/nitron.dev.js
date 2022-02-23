nitron.styles('body','margin: 0;');
nitron.styles('img','width: 100%;');

// <img src="https://www.agoda.com/wp-content/uploads/2019/01/Things-to-do-in-Tokyo-Tokyo-Tower.jpg">

nitron.component('contents',{
  template:`
    <Card>
      <Box p="16px">
        <Text size="20px" weight="700">Japan, Tokyo</Text>
        <Text size="14px" mt="15px" mb="10px">The Japanese landscape is rugged, with more than four-fifths of the land surface consisting of mountains.</Text>
        <Button href="#">more...</Button>
      </Box>
    </Card>
  `
});

nitron.component('ccc',{
  template:`
    <Card>
      <Box p="16px">
        <Text size="20px" weight="700">Japan,1</Text>
        <Text size="14px" mt="15px" mb="10px">The Japanese landscape is rugged, with more than four-fifths of the land surface consisting of mountains.</Text>
        <Button href="#">more...</Button>
      </Box>
    </Card>
  `
});

const App = `
  <Box mx="20%" my="100px">
    <Link to="/">Home</Link>
    <Link to="/test">Test</Link>
    <Router path="/" el="<Contents />" />
    <Router path="/test" el="<Ccc />" />
  </Box>
`

nitronDOM.render(App,document.getElementById('root'));

customElements.define('dom-link', class extends HTMLElement {
  connectedCallback() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    let className = "";
    let props = {};  
    if(this.getAttribute('to')){
      for (let i = 0; i < 8; i++) {
        const rnum = Math.floor(Math.random() * chars.length)
        className += chars.substring(rnum, rnum + 1)
      };
      Object.assign(props,{class:className});
    };
    if(this.getAttributeNames()) {  
      const AttrNames = this.getAttributeNames();
      AttrNames.forEach(attr => { 
        if(attr == "to"){
          Object.assign(props,{href:this.getAttribute(attr)});
        }else{
          if(props[attr]){
            props[attr] += ` ${this.getAttribute(attr)}`;
          }else{
            props[attr] = `${this.getAttribute(attr)}`;
          };
        }
      });
    };
    this.outerHTML = nitron.createElement('a',props,this.innerHTML);
    document.querySelectorAll(`.${className}[href^="/"]`).forEach(el => 
      el.addEventListener("click", evt => {
        evt.preventDefault();
        const {pathname: path} = new URL(evt.target.href);
        window.history.pushState({path}, path, path);
      })
    );
  };
});

customElements.define('dom-router', class extends HTMLElement {
  connectedCallback() {
    if(window.location.pathname == this.getAttribute('path')){
      this.outerHTML = this.getAttribute('el');
    }else{
      this.outerHTML = "";
    }
  };
});

// const routes = {
//   "/": `<h1>Home</h1>${nav}<p>Welcome home!</p>`,
//   "/about": `<h1>About</h1>${nav}<p>This is a tiny SPA</p>`,
// };

// const NitronRouterRender = path => {
//   document.querySelector("#root")
//     .innerHTML = routes[path] || `<h1>404</h1>${nav}`
//   ;
// };

// window.addEventListener("popstate", e =>
//   render(new URL(window.location.href).pathname)
// );
// render(window.location.pathname);
