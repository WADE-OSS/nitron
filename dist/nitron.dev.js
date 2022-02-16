/*
 * Nitron.js v0.0.6 - dev (v1.0.0-alpha.1)
 *
 * (c) 2022 WADE Open Source Software and Nitron Team. and its affiliates.
 * Released under the MIT License.
 * https://github.com/WADE-OSS/nitron/blob/main/LICENSE
 */


// Error Event : #4
window.addEventListener("error",(err)=>{
  document.body.innerHTML = `
    <h1 style="color:red;">${err.error}</h1>
    <p>info : ${err.filename} | ${err.lineno}</p>
  `;
});

class NitronDOM {
  constructor() {};
  // Returns an element written in JS as HTML
  render(element, queryinsertion) {
    element = nitron.returnDOM(element);

    const xhr = new XMLHttpRequest();

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

    queryinsertion.innerHTML = element
  };
};

// Convert NitronDOM class to const : You can use nitronDOM without declaring variables or constants. 
const nitronDOM = new NitronDOM();

class Nitron {
  constructor() {};

  // Replace the Nitron syntax with HTML.
  returnDOM(HTML){

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

    if(HTML.match(/<>/g)){
      HTML.match(/<>/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`<div>`)
      });
      if(HTML.match(/<\/>/g)){
        HTML.match(/<\/>/g).forEach((doc)=>{
          HTML = HTML.replace(doc,`</div>`)
        });
      };
    };
    return HTML;
  };

  // Create a component : nitron.component('component name',{return:`element`})
  component(elementName, ComponentOptions){

    // Custom elements must contain - . If not present, the name dom- is added in front of the element name. 
    var Name = "";
    if(elementName.includes('-')){
      Name = elementName
    }else{
      Name = `dom-${elementName}`
    }

    // Creating custom elements 
    customElements.define(`${Name}`, class extends HTMLElement {
      connectedCallback() {
        if (ComponentOptions.template) { 
          ComponentOptions.template = nitron.returnDOM(ComponentOptions.template);

          // custom Attribute :  AttributeNames="" => {{AttributeNames}}
          if (this.getAttributeNames()) {
            const AttrNames = this.getAttributeNames();
            var optionsreturn = ComponentOptions.template;
            AttrNames.forEach(attr => {
              let val = this.getAttribute(attr);
              optionsreturn = optionsreturn.replace(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"), val);
            });
            ComponentOptions.template = optionsreturn;
          } else {
            ComponentOptions.template = ComponentOptions.template
          };

          // Fill in the created props if they are empty 
          if(ComponentOptions.props){
            Object.keys(ComponentOptions.props).forEach(x => {
              ComponentOptions.template = ComponentOptions.template.replace(new RegExp(`\{\{ ?${x} ?\}\}`,"g"), ComponentOptions.props[x]);
            });
          };
        }else if(ComponentOptions.el){
          let ClassName = "";
          if(ComponentOptions.class){
            
          }

          if(ComponentOptions.class){

          }

          if(ComponentOptions.props){
            ComponentOptions.props.forEach((x)=>{
              console.log(x)
            });
          }else{
            ComponentOptions.template = `<${ComponentOptions.el}>${this.innerHTML}</${ComponentOptions.el}>`;
          }
        };

        if(ComponentOptions.from){
          if(ComponentOptions.from == this.parentElement.localName){
            this.outerHTML = ComponentOptions.template;
          }
        }else{
          this.outerHTML = ComponentOptions.template;
        }
      };
    });
  };

  addClass(query, classnamelist){ 
    document.querySelector(query).classList = classnamelist
  };

  randomClassName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    const stringLength = 8
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
  };

  style(selector, style) {
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
};

function styles(style="") {
  const name = nitron.randomClassName()
  nitron.style(`.${name}`,style)
  if(style.style){
    nitron.style(`.${name}`,style.style)
  };
  if(style.type){
    Object.keys(style.type).forEach(x =>
      nitron.style(`.${name}:${x}`,style.type[x])
    )
  };
  if(style.media){
    var mediaquery = window.matchMedia(`screen and (${style.media.size})`);

    if (mediaquery.matches) {
      nitron.style(`.${name}`,style.media.style);
      if(style.media.type){
        Object.keys(style.media.type).forEach(x =>
          nitron.style(`.${name}:${x}`,style.media.type[x])
        )
      };
    }

    mediaquery.addListener((a) => {
      if(a.matches === true){
         nitron.style(`.${name}`,style.media.style)
        if(style.media.type){
          Object.keys(style.media.type).forEach(x =>
            nitron.style(`.${name}:${x}`,style.media.type[x])
          )
        }
      }else{
        if(style.style){
          nitron.style(`.${name}`,style.style)
          if(style.type){
            Object.keys(style.type).forEach(x =>
              nitron.style(`.${name}:${x}`,style.type[x])
            )
          };
        };
      }
    });
  };
  return name
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
      return temp;
    }
    else {
      if (!data[match.trim()]) return '{{' + match.trim() + '}}';
      return data[match.trim()];
    }
  });
  return template;
};
customElements.define('dom-template', class extends HTMLElement {
  connectedCallback() {
    let Template_data = this.getAttribute('data');
    Template_data = eval(Template_data);
    let HTML = '<span style="color: red;">unknown error</span>';

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
  };
});
