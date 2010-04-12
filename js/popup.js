function buildDate(bg) {
    var label = document.getElementById('date-label');
    label.textContent = chrome.i18n.getMessage('extDateLabel');
    var stamp = document.getElementById('date-stamp');
    stamp.textContent = new Date(Date.parse(bg.buildbot.date)).toLocaleString();    
}

function buildLinks(bg) {
    // builders
    var links = document.getElementById('links');
    var a = document.createElement('a');
    a.href = bg.baseUrl + '/builders';
    a.textContent = chrome.i18n.getMessage('extBuildersLabel');
    a.target = '_blank';
    links.appendChild(a);
    // waterfall
    var space = document.createTextNode(' | ');
    links.appendChild(space);
    a = document.createElement('a');
    a.href = bg.baseUrl + '/waterfall';
    a.textContent = chrome.i18n.getMessage('extWaterfallLabel');
    a.target = '_blank';
    links.appendChild(a);
    // console
    space = document.createTextNode(' | ');
    links.appendChild(space);
    a = document.createElement('a');
    a.href = bg.baseUrl + '/console';
    a.textContent = chrome.i18n.getMessage('extConsoleLabel');
    a.target = '_blank';
    links.appendChild(a);
}

function buildBuilders(bg) {
    // reset builders
    var lastBuild;
    var buildersNode = document.getElementById('builders');
    buildersNode.innerHTML = '';
    var model = bg.buildbot;
    // show builder status
    for(var key in model.builders) {
        var info = model.builders[key];
        try {
            lastBuild = model.lastBuild[key].builds['-1'];
        } catch(e) {
            lastBuild = null;
        }
        var div = document.createElement('div');
        div.className = 'builder';
        var name = document.createElement('a');
        name.className = 'builderName';
        name.href = bg.baseUrl + '/builders/'+key;
        name.target = '_blank';
        name.textContent = key;
        div.appendChild(name);
        div.appendChild(document.createElement('br'));
        if(lastBuild) {
            var status = document.createElement('a');
            status.className = 'builderStatus';
            status.href = bg.baseUrl + '/builders/'+key+'/builds/'+lastBuild.number;
            status.target = '_blank';
            status.textContent = lastBuild.text.join(' ');
            div.appendChild(status);
        }
        var className = info.state;
        if(lastBuild && lastBuild.text) {
            if(lastBuild.text[0] == 'warnings') {
                className += ' warnings';
            } else if(lastBuild.text[0] == 'failed') {
                className += ' failure';
            } else {
                className += ' success';
            }
            
        } 
        div.className = className;
        buildersNode.appendChild(div);
    }
}

window.onload = function() {
    var bg = chrome.extension.getBackgroundPage();
    document.body.className = bg.online ? 'online' : 'offline';
    if(bg.baseUrl) {
        buildLinks(bg);
        buildBuilders(bg);
        buildDate(bg);
    } else {
        var msg = document.getElementById('date');
        msg.innerHTML = chrome.i18n.getMessage('extEmptyLabel');
    }
};