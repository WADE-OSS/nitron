/*
 * Nitron.js v0.0.9 - bundle (v1.0.0-alpha.1)
 *
 * (c) 2022 WADE Open Source Software and Nitron Team. and its affiliates.
 * Released under the MIT License.
 * https://github.com/WADE-OSS/nitron/blob/main/LICENSE
 */

class NitronDOM {
    constructor() {};
    // Returns an element written in JS as HTML
    render(element, queryinsertion) {
      element = nitron.returnDOM(element);
      
      queryinsertion.addEventListener("change", (event) => {
        if(event.target.getAttribute('value-in')){
            eval(`${event.target.getAttribute('value-in')} = "${event.target.value}"`)
        };

      });

      queryinsertion.addEventListener("input", (event) => {
        if(event.target.getAttribute('value-in')){
            eval(`${event.target.getAttribute('value-in')} = "${event.target.value}"`)
        };
      });

      queryinsertion.innerHTML = element;
    };
};

// Convert NitronDOM class to const : You can use nitronDOM without declaring variables or constants. 
const nitronDOM = new NitronDOM();

class Nitron {
constructor() {};

// Replace the Nitron syntax with HTML.
returnDOM(HTML){
  
  if(HTML.match(/<Router ?.* ?\/>/g)){
    HTML.match(/<Router ?.* ?\/>/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`<dom-router ${doc.slice(7,doc.length-2)}></dom-router>`);
    });
  };

  if(HTML.match(/<[A-Z].* ?\/>/g)){
    HTML.match(/<[A-Z].* ?\/>/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`<${doc.slice(1,doc.length-2)}></${doc.match(/[A-Z][a-z]*/g)}>`);
    });
  };

  if(HTML.match(/<[A-Z]/g)){
    HTML.match(/<[A-Z]/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`<dom-${doc[1]}`)
    });
    if(HTML.match(/\<\/[A-Z]/g)){
        HTML.match(/\<\/[A-Z]/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`</dom-${doc[2]}`)
      });
    };
  };

  if(HTML.match(/<.*styles\=\".*\".*\>/g)){
    HTML.match(/<.*styles\=\".*\".*\>/g).forEach((doc)=>{

      let stylesAttr = String(doc.match(/styles=\".* ?; ?\"/g));

      const routerLinkClassNameChars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
      var stylesAttributeClassName = "";
      for (let i = 0; i < 8; i++) {
        const rnum = Math.floor(Math.random() * routerLinkClassNameChars.length)
        stylesAttributeClassName += routerLinkClassNameChars.substring(rnum, rnum + 1)
      };
      nitron.styles(`.${stylesAttributeClassName}`,stylesAttr.slice(8,stylesAttr.length-1));
      if(doc.match(/ ?class=\".*\" /g)){
        let classAttr = String(doc.match(/ ?class=\".*\" /g));
        let docel = doc.replace(doc,doc.replace(stylesAttr,""));
        HTML = HTML.replace(doc,docel.replace(/ ?class=\".*\" /g,` class="${classAttr.slice(8,classAttr.length-2)} ${stylesAttributeClassName}"`));
      }else{
        HTML = HTML.replace(doc,doc.replace(stylesAttr,`class="${stylesAttributeClassName}"`));
      };
    });
  };
  HTML = HTML.replace(/\s+</g,"<")
  HTML = HTML.replace(/>\s+</g,"><")
  return HTML;
};

// Create a component
component(elementName, ComponentOptions){
    let componentName = "";
    if(elementName.includes('-')){
    componentName = elementName
    }else{
    componentName = `dom-${elementName}`
    };
    customElements.define(componentName, class extends HTMLElement {
    connectedCallback() {
        let componentTemplate = nitron.returnDOM(ComponentOptions.template);
        if(this.getAttributeNames()) {
        const AttrNames = this.getAttributeNames();
        AttrNames.forEach(attr => {
            let val = this.getAttribute(attr);
            componentTemplate = componentTemplate.replace(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"),val);
        });
        };

        if(ComponentOptions.props){
        Object.keys(ComponentOptions.props).forEach(x => {
            componentTemplate = componentTemplate.replace(new RegExp(`\{\{ ?${x} ?\}\}`,"g"), ComponentOptions.props[x]);
        });
        };
        this.outerHTML = componentTemplate;
    };
    });
};
//  Element creation, Style creation API (#10) - Style creation
styles(selector, style){
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length == 0) return;
    var styleSheet,mediaType;
    if (document.styleSheets.length > 0) {
    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
        if (document.styleSheets[i].disabled)
        continue;
        var media = document.styleSheets[i].media;
        mediaType = typeof media;

        if (mediaType === 'string') {
        if (media === '' || (media.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
        }
        }
        else if (mediaType=='object') {
        if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
        }
        }
        if (typeof styleSheet !== 'undefined')
        break;
    }
    }
    if (typeof styleSheet === 'undefined') {
    var styleSheetElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
        continue;
        }
        styleSheet = document.styleSheets[i];
    }
    mediaType = typeof styleSheet.media;
    }
    if (mediaType === 'string') {
    for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
        if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
        }
    }
    styleSheet.addRule(selector,style);
    }
    else if (mediaType === 'object') {
    var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
    for (var i = 0; i < styleSheetLength; i++) {
        if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
        }
    }
    styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
    }
};
//  Element creation, Style creation API (#10) - Element creation
createElement(element, props,innerHTML=""){
    if(props == null || undefined){
    return `<${element}>${innerHTML}</${element}>`
    }else{
    let Attribute = "";
    Object.keys(props).forEach((element) => {
        Attribute += `${element}="${props[element]}"`
    });
    return `<${element} ${Attribute}>${innerHTML}</${element}>`
    };
};
};

const nitron = new Nitron();

// Template
/*
var data = {title:"Nitron.js"}
<Template data="data">
    <h1>{{title}}</h1>
</Template>
*/

var PublicClassData = {};

var placeholders = function (template, data) {'use strict';
  template = typeof (template) === 'function' ? template() : template;
  if (['string', 'number'].indexOf(typeof template) === -1) throw 'NitronDOM : please provide a valid template!';
  if (!data) return template;
  template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
    match = match.slice(2, -2);
    var sub = match.split('.');
    if (sub.length > 1) {
      var temp = data;
    
      sub.forEach(function (item) {
          var item = item.trim();
          if (!temp[item]) {
          temp = '{{' + match.trim() + '}}';
          return;
          }
          temp = temp[item];
      });
      return eval(`data.${match.trim()}`);
    }else {
      if(match.match(/\[.*\]/g)){
        return eval(`data.${match.trim()}`);
      };
      if (!data[match.trim()]){
        return '{{' + match.trim() + '}}'
      }else{
        return data[match.trim()];
      };
    };
  });
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  let className = "";
  for (let i = 0; i < 8; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      className += chars.substring(rnum, rnum + 1)
  };
  PublicClassData[className] = template;
  return nitron.createElement('div',{class:className},template);
};


customElements.define('dom-template', class extends HTMLElement {
  DOM(){

    let Template_data = this.getAttribute('data');
    Template_data = eval(Template_data);
    let HTML = '';

    if(this.getAttribute('data')){
    if(Array.isArray(Template_data)){
        Template_data.forEach(element => {
        HTML += placeholders(this.innerHTML,element);
        });
    }else{
        HTML = placeholders(this.innerHTML,Template_data);
    };
    }else{
    HTML = this.innerHTML;
    };
    this.outerHTML = HTML;
  }

  connectedCallback() {
      this.DOM();
  };
});


class NitronStyles {
  constructor() {};

  // Styles Component
  component(elementName, ComponentOptions){
    let componentName = "";
    if(elementName.includes('-')){
      componentName = elementName
    }else{
      componentName = `dom-${elementName}`
    };

    // There is a fatal bug where you cannot use the same component multiple times (#5) : resolved
    customElements.define(componentName, class extends HTMLElement {
      connectedCallback() {
        if(ComponentOptions.el){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
        let className = `${elementName.replace('-',"_")}__`;
        let componentStyles = ComponentOptions.style;
        let props = {};
        for (let i = 0; i < 8; i++) {
            const rnum = Math.floor(Math.random() * chars.length)
            className += chars.substring(rnum, rnum + 1)
        };
        Object.assign(props,{class:className});
        if(this.getAttributeNames()) {  
          const AttrNames = this.getAttributeNames();
          AttrNames.forEach(attr => {
            if(componentStyles.match(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"))){
                let val = this.getAttribute(attr);
                componentStyles = componentStyles.replace(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"),val);
            }else{
                if(props[attr]){
                props[attr] += ` ${this.getAttribute(attr)}`;
                }else{
                props[attr] = `${this.getAttribute(attr)}`;
                };
            };
          });
        };
        if(ComponentOptions.event){
          Object.keys(ComponentOptions.event).forEach(x => {
            nitron.styles(`.${className}:${x}`,ComponentOptions.event[x]);
          });
        };
        if(ComponentOptions.media){
          Object.keys(ComponentOptions.media).forEach(x => {
            let mediaquery = window.matchMedia(`(${x})`);
            if (mediaquery.matches) {
              nitron.styles(`.${className}`,ComponentOptions.media[x]);
            }else{
              nitron.styles(`.${className}`,componentStyles);
            };
            mediaquery.addListener((a) => {
              if(a.matches === true){
                nitron.styles(`.${className}`,ComponentOptions.media[x]);
              }else{
                nitron.styles(`.${className}`,componentStyles);
              };
            });
          });
        }else{
          nitron.styles(`.${className}`,componentStyles);
        };
        if(ComponentOptions.props){
            Object.keys(ComponentOptions.props).forEach(x => {
            componentStyles = componentStyles.replace(new RegExp(`\{\{ ?${x} ?\}\}`,"g"), ComponentOptions.props[x]);
            });
        };
        this.outerHTML = nitron.createElement(ComponentOptions.el,props,this.innerHTML);
        };
      };
    });
  };
};

const styles = new NitronStyles();

window.addEventListener('load',() => {
    const routes = {};
    const routerRenderClassNameChars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var routerRenderClassName = "";
    for (let i = 0; i < 8; i++) {
      const rnum = Math.floor(Math.random() * routerRenderClassNameChars.length)
      routerRenderClassName += routerRenderClassNameChars.substring(rnum, rnum + 1)
    };
  
    customElements.define('dom-router', class extends HTMLElement {
      connectedCallback() {
        if(this.getAttribute('path')){
          routes[this.getAttribute('path')] = `${this.getAttribute('el')}`;
        };
  
        if(document.querySelector(`.${routerRenderClassName}`)){
          this.outerHTML = "";
        }else{
          this.outerHTML = `<div class="${routerRenderClassName}"></div>`;
        };
      };
  });
  
  const routerLinkClassNameChars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var routerLinkClassName = "";
  for (let i = 0; i < 8; i++) {
    const rnum = Math.floor(Math.random() * routerLinkClassNameChars.length)
    routerLinkClassName += routerLinkClassNameChars.substring(rnum, rnum + 1)
  };
length
  customElements.define('dom-link', class extends HTMLElement {
    connectedCallback() {
      let props = {};
      Object.assign(props,{class:routerLinkClassName});
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
    };
  });

  const render = path => {
    document.querySelector(`.${routerRenderClassName}`).innerHTML = routes[path] || routes["/404"];
    document.querySelectorAll(`.${routerLinkClassName}[href^="/"]`).forEach(el => 
      el.addEventListener("click", evt => {
        evt.preventDefault();
        const {pathname: path} = new URL(evt.target.href);
        window.history.pushState({path}, path, path);
        render(path);
      })
    );
  };

  render(window.location.pathname);
  window.addEventListener("popstate", e =>
    render(new URL(window.location.href).pathname)
  );

});
