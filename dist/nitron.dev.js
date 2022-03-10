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
  return template;
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

// Error Event : #4
var error = [];
const errorClassNameChars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
var errorClassName = "";
for (let i = 0; i < 8; i++) {
  const rnum = Math.floor(Math.random() * errorClassNameChars.length)
  errorClassName += errorClassNameChars.substring(rnum, rnum + 1)
};
const errorStyles = `
  display: block;
  position: fixed;
  z-index: 1;
  padding-left: 20px;
  padding-top: 35px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.82);
`;
nitron.styles(`.${errorClassName}`,errorStyles);
nitron.styles(`.${errorClassName} h1`,`color: red;`);
nitron.styles(`.${errorClassName} p`,`color: #ccc; margin: 0;`);

window.addEventListener("error",(err)=>{
  error.push(err)
  let errormsg = "";
  error.forEach( doc => {
    errormsg += `
      <h1>${doc.error}</h1>
      <p>info : ${doc.filename}</p>
      <p>line : ${doc.lineno}</p>
    `
  });
  if(document.querySelector(`.${errorClassName}`)){
    document.querySelector(`.${errorClassName}`).innerHTML = errormsg;
  }else{
    document.body.innerHTML += `
      <div class="${errorClassName}">
        ${errormsg}
      </div>
    `
  };
});