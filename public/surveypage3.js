setInterval(() => {
    if(document.getElementsByClassName("3checkboxes")){
        limitCheckBoxes()
        if(document.getElementById('action').value == "on"){
          document.getElementById('action').disabled = true
          document.getElementById('action').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('comedy').value == "on"){
          document.getElementById('comedy').disabled = true
          document.getElementById('comedy').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('drama').value == "on"){
          document.getElementById('drama').disabled = true
          document.getElementById('drama').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('adventure').value == "on"){
          document.getElementById('adventure').disabled = true
          document.getElementById('adventure').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('thriller').value == "on"){
          document.getElementById('thriller').disabled = true
          document.getElementById('thriller').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('crime').value == "on"){
          document.getElementById('crime').disabled = true
          document.getElementById('crime').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('romance').value == "on"){
          document.getElementById('romance').disabled = true
          document.getElementById('romance').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('scienceFiction').value == "on"){
          document.getElementById('scienceFiction').disabled = true
          document.getElementById('scienceFiction').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('fantasy').value == "on"){
          document.getElementById('fantasy').disabled = true
          document.getElementById('fantasy').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('family').value == "on"){
          document.getElementById('family').disabled = true
          document.getElementById('family').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('mystery').value == "on"){
          document.getElementById('mystery').disabled = true
          document.getElementById('mystery').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('biography').value == "on"){
          document.getElementById('biography').disabled = true
          document.getElementById('biography').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('history').value == "on"){
          document.getElementById('history').disabled = true
          document.getElementById('history').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('animation').value == "on"){
          document.getElementById('animation').disabled = true
          document.getElementById('animation').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('music').value == "on"){
          document.getElementById('music').disabled = true
          document.getElementById('music').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('sport').value == "on"){
          document.getElementById('sport').disabled = true
          document.getElementById('sport').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('superhero').value == "on"){
          document.getElementById('superhero').disabled = true
          document.getElementById('superhero').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('western').value == "on"){
          document.getElementById('western').disabled = true
          document.getElementById('western').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('war').value == "on"){
          document.getElementById('war').disabled = true
          document.getElementById('war').parentNode.parentNode.className = "disabledTable"
        }
        if(document.getElementById('horror').value == "on"){
          document.getElementById('horror').disabled = true
          document.getElementById('horror').parentNode.parentNode.className = "disabledTable"
        }
    }
  }, 500);