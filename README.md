# [nitron](https://nitronjs.org)
JavaScript framework for constructing user interfaces

**Why should you use it?**

- **Scalability** : It has wide extensibility, such as distributing components created by me or importing other components.
- **Usability** : If you've learned HTML, CSS, or JavaScript, it's easy to get started.
- **Component based** : You can put the written code in a component (capsule) and abbreviate it like `<Component />` or add props to manipulate the component. 


## Examples
`index.html`
```html
<!DOCTYPE html>
<html>
<head>
    <title>Nitron App</title>
</head>
<body>
    <div id="root"></div>
    <script src="./src/nitron.js"></script>
    <script src="./App.js"></script>
</body>
</html>
```

`App.js`
```js
nitron.component('component',{
  template:`
    <p>hello, World!</p>
  `
});

const App = `
  <Component />
`;

nitronDOM.render(App,document.getElementById('root'));
```

### License
- `Nitron.js` : [MIT License](https://github.com/WADE-OSS/nitron/blob/main/LICENSE)
- `Nitorn Styles Tools` : [MIT License](https://github.com/WADE-OSS/nitron-styles-Tools/blob/main/LICENSE)
- `Nitorn Router` : [MIT License](https://github.com/WADE-OSS/nitron-router/blob/main/LICENSE)

Libraries and frameworks not supported by the Nitron team will be notified separately by the library and framework team. 
