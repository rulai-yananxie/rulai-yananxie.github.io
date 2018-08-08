function getChatWidgetCode (webRoot, orgId, botId, options, customScript) {
  if (!options) {
    options = 'null'
  } else {
    options = JSON.stringify(options)
  }
  if (!customScript || customScript === undefined) {
    customScript = 'w'
  }

  var script = '<script src="' + webRoot + customScript + '.js"></script>' +
    '<script type="text/javascript">_widget("' + webRoot + '", "' + orgId + '", "' + botId +
    '", "0px", "0px", "32454c", "289dd2", ' + options + ')</script>'
  console.log('add_web_widget ' + script)
  return script
}

function addChatWidget (webRoot, orgId, botId, options, customScript) {
  if (customScript === undefined) {
    customScript = null
  }

  var storageKey = 'widgetCustomScript_' + orgId

  if (localStorage && localStorage[storageKey]) {
    customScript = localStorage[storageKey]
  }

  // eslint-disable-next-line
  if (typeof (_Rulai_widget) === 'undefined') {
    var script = getChatWidgetCode(webRoot, orgId, botId, options, customScript)
    var scriptParts = script.split('</script>')
    var script1 = scriptParts[0] + '</script>'
    var script2 = scriptParts[1] + '</script>'
    $('body').append(script1)
    setTimeout(function () {
      $('body').append(script2)
    }, 500)
  } else {
    $('#iframe_window').remove()
    $('#widget').remove()
    $('#iframe_banner').remove()
    $('#widget_banner').remove()
    /* important, must deep clean before re-init */

    if (window._rulai_widget) {
      Object.keys(window._rulai_widget).forEach(function (key) { delete window._rulai_widget[key] })
      window._rulai_widget = undefined
    //   delete window._rulai_widget
    }

    // if (window._widget) {
    //   Object.keys(window._widget).forEach(function (key) { delete window._widget[key] })
    //   window._widget = undefined
    // //   delete window._widget
    // }

    if (window._widgetload) {
      Object.keys(window._widgetLoad).forEach(function (key) { delete window._widgetLoad[key] })
      window._widgetLoad = undefined
    //   delete window._widgetLoad
    }

    var scriptAppend = getChatWidgetCode(webRoot, orgId, botId, options, customScript)
    $('body').append(scriptAppend)
  }
}

function showChatWindow () {
  if (window._rulai_widget) {
    window._rulai_widget.restartSession = true
    sessionStorage.removeItem('_rulai_widget_session_id')
    window._rulai_widget.showIframe()
  } else {
    setTimeout(function() {
      showChatWindow()
    }, 300)
  }
}

function loadChatWidgetWithoutShowingIt (botId, orgId, variables) {
  var variableList = []
  for (var name in variables) {
    if (typeof variables[name] === 'object') {
      variableList.push({name: name, value: JSON.stringify(variables[name])})
    } else {
      variableList.push({name: name, value: variables[name]})
    }
  }
  addChatWidget(
    'https://console.rul.ai/',
    botId,
    orgId,
    {
      isOngoingSession: false,
      console: false,
      slot: {
        variables: variableList}})
}

function loadChatWidget (botId, orgId, variables) {
  loadChatWidgetWithoutShowingIt(botId, orgId, variables)
  showChatWindow()
}