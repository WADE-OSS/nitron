nitron.component('my-component', {
    return: `
    <div>
        Hello, world!
    </div>
`})

const element = '<my-component></my-component>';

const root = document.getElementById('root');
nitronDOM.render(element,root)