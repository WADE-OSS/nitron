/*
 * Nitron.js v0.0.5 - openbeta
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
  // Todo List
  // 1. Allow div to be used as <></> : Check - Available from version 0.0.5
  // 2. < If the next first letter is uppercase, add dom- between them to call the custom element component of 'dom-name'. : Check - Available from version 0.0.5
  // 3. Allows shortening to <custom-element/> when an element does not have an attribute : Check - Available from version 0.0.5

  render(HTML, queryinsertion) {
    if(HTML.match(/<[A-Z][a-z]*\/>/g)){
      HTML.match(/<[A-Z][a-z]*\/>/g).forEach((doc)=>{
        HTML = HTML.replace(doc,`<${doc.slice(1,doc.length-2)}></${doc.slice(1,doc.length-2)}>`)
      });
    }
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

    let AjaxEvent = document.getElementById("root");
    const xhr = new XMLHttpRequest();
    AjaxEvent.addEventListener("change", () => {

    })
    queryinsertion.innerHTML = HTML;
  };

  // XML Render Test
  renderXML(url,get) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                document.querySelector(get).innerHTML = xmlhttp.responseText;
            }
            else if (xmlhttp.status == 400) {
              alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  };
}

// Convert NitronDOM class to const : You can use nitronDOM without declaring variables or constants. 
const nitronDOM = new NitronDOM();



class Nitron {
  constructor() {};
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
        if (ComponentOptions.return) {
          
          if(ComponentOptions.return.match(/\{\{ ?innerHTML ?\}\}/g)){
            ComponentOptions.return.match(/\{\{ ?innerHTML ?\}\}/g).forEach((doc)=>{
              ComponentOptions.return = ComponentOptions.return.replace(doc,this.innerHTML)
            });
          };
          
          // custom Attribute : {{AttributeNames}} => AttributeNames=""
          if (this.getAttributeNames()) {
            const AttrNames = this.getAttributeNames();
            var optionsreturn = ComponentOptions.return;
            AttrNames.forEach(attr => {
              let val = this.getAttribute(attr);
              optionsreturn = optionsreturn.replace(new RegExp(`\{\{ ?${attr} ?\}\}`,"g"), val);
            });
            this.outerHTML = optionsreturn;
          } else {
            this.outerHTML = ComponentOptions.return
          };

        };

        // change Element
        if(ComponentOptions.change){
          if(ComponentOptions.change.class){
            var elClass = `class="${ComponentOptions.change.class}"`
            this.outerHTML = `<${ComponentOptions.change.el} ${elClass}>${this.innerHTML}</${ComponentOptions.change.el}>`
          }else{
            this.outerHTML = `<${ComponentOptions.change.el}>${this.innerHTML}</${ComponentOptions.change.el}>`
          }
        };

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
