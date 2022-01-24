// use
const const_styles = styles({
  style:`style`,
  media:{
    size:'size / ex : max-width:600px',
    style:`media style`,
  }
})

// media styles - example
const info_styles = styles({
  style:`font-size: 32px;`,
  media:{
    size:'max-width:790px',
    style:`font-size: 15px;`,
  }
})

const element = `
    <div>
        <h1>Nitron.js</h1>
        <p class="${info_styles}">Build the web easily with Nitron.js. </p>
    </div>
`
