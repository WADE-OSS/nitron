var data = {
    msg:"Hello, world!"
};

var template = function () {
    return `
        <div>
            {{ msg }}
        </div>
    `
};

nitronDOM.render(
    placeholders(template,data),
    document.getElementById('root')
);