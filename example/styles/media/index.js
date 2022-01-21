// use
const info_styles = media.styles({
    size:'width size',
    style:'basic',
    media:'Styles Responsive to Width'
})

// media styles - example
const info_styles = media.styles({
    size:'790px',
    style:'font-size: 20px;',
    media:'font-size: 15px;'
})

const element = `
    <div>
        <h1>Nitron.js</h1>
        <p class="${info_styles}">Build the web easily with Nitron.js. </p>
    </div>
`